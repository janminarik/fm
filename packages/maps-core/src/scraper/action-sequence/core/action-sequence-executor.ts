import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer";

import {
  ClickIfExistsParams,
  ClickParams,
  GotoParams,
  ScreenshotParams,
  SelectParams,
  SetViewportParams,
  TypeParams,
  WaitForSelectorParams,
} from "./params";
import { ILogger } from "../../../logger/logger";
import { ActionResult, Action, ActionType } from "../core/actions";

export interface BrowserOptions extends PuppeteerLaunchOptions {}

export interface PageOptions {
  navigationTimeout: number;
  timeout: number;
  debug: boolean;
}

export class ActionSequenceExecutor {
  private pageDefaultNavigationTimeout = 30000;
  private pageDefaultTimeout = 30000;
  private browser: Browser | null = null;
  private page: Page | undefined;

  constructor(
    private readonly browserOptions: BrowserOptions,
    private readonly pageOptions: PageOptions,
    private readonly logger: ILogger,
  ) {}

  private async initBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch(this.browserOptions);
    }

    return this.browser;
  }

  private async initPage(): Promise<Page | undefined> {
    await this.initBrowser();

    if (!this.page) {
      this.page = await this.browser?.newPage();

      this.page?.setDefaultNavigationTimeout(
        this.pageOptions.navigationTimeout || this.pageDefaultNavigationTimeout,
      );

      this.page?.setDefaultTimeout(
        this.pageOptions.timeout || this.pageDefaultTimeout,
      );
      if (this.pageOptions.debug) {
        this.page?.on("request", (request) => {
          this.logger.debug("request page", { url: request.url() });
        });
      }

      this.page?.on("error", (error) => {
        this.logger.error("error", error);
      });
    }

    return this.page;
  }

  private async executeAction<T extends ActionType>(
    action: Action<T>,
  ): Promise<ActionResult<T> | undefined> {
    if (!this.page) throw new Error("Page not initiliazed");

    const startTime = Date.now();
    let attempts = 0;
    const maxAttempts = action.retries || 1;

    this.logger.debug("actionStart", { action, timestamp: startTime });

    while (attempts < maxAttempts) {
      attempts++;
      try {
        let result: any;

        switch (action.type) {
          case "goto": {
            const params = action.params as GotoParams;
            result = await this.page.goto(params.url, {
              waitUntil: params.waitUntil || "networkidle2",
              timeout: params.timeout || 30000,
            });
            break;
          }

          case "waitForSelector": {
            const params = action.params as WaitForSelectorParams;
            result = await this.page.waitForSelector(params.selector, {
              visible: params.visible !== false,
              timeout: params.timeout || 5000,
            });
            break;
          }

          case "click": {
            const params = action.params as ClickParams;
            result = await this.page.click(params.selector, {
              delay: params.delay || 0,
              button: params.button || "left",
            });
            break;
          }

          case "screenshot": {
            const params = action.params as ScreenshotParams;
            result = await this.page.screenshot({
              path: params.path,
              fullPage: params.fullPage || false,
              type: params.type || "png",
              quality: params.type === "jpeg" ? params.quality : undefined,
              omitBackground: params.omitBackground,
            });
            break;
          }

          case "type": {
            const params = action.params as TypeParams;
            result = await this.page.type(params.selector, params.text, {
              delay: params.delay || 0,
            });
            break;
          }

          case "select": {
            const params = action.params as SelectParams;
            result = await this.page.select(params.selector, ...params.values);
            break;
          }
          case "getContent": {
            result = await this.page.content();
            break;
          }
          case "clickIfExists": {
            const params = action.params as ClickIfExistsParams;
            const element = await this.page.$(params.selector);
            if (element) {
              await element.click({ delay: params.delay || 0 });
              result = true;
            } else {
              result = false;
            }
            break;
          }
          case "setViewport": {
            const params = action.params as SetViewportParams;
            await this.page.setViewport({
              width: params.width,
              height: params.height,
              deviceScaleFactor: params.deviceScaleFactor || 1,
              isMobile: params.isMobile || false,
              hasTouch: params.hasTouch || false,
              isLandscape: params.isLandscape || false,
            });
            break;
          }

          default: {
            throw new Error(`Not supported action type: ${action.type}`);
          }
        }

        const endTime = Date.now();
        const duration = endTime - startTime;

        const actionResult: ActionResult<T> = {
          success: true,
          action,
          data: result,
        };

        this.logger.debug("actionComplete", {
          action,
          duration,
          attempts,
          result: actionResult,
        });

        return actionResult;
      } catch (error) {
        // Ak je to posledný pokus alebo akcia je označená ako nepovinná
        if (attempts >= maxAttempts || action.optional) {
          const endTime = Date.now();
          const duration = endTime - startTime;

          const actionResult: ActionResult<T> = {
            success: false,
            action,
            error: error as Error,
          };

          this.logger.error("actionError", {
            action,
            error,
            duration,
            attempts,
            result: actionResult,
            final: true,
          });

          // Ak je akcia označená ako nepovinná, vrátime úspech aj pri chybe
          if (action.optional) {
            return { success: true, action, data: null };
          }

          return actionResult;
        }

        // Inak informujeme o chybe a skúsime znova
        this.logger.error("actionError", {
          action,
          error,
          attempts,
          willRetry: true,
        });

        // Čakáme pred ďalším pokusom
        const delay = action.retryDelay || 1000;
        setTimeout(() => {
          this.logger.debug("Waiting ", { delay: delay });
        }, delay);
      }

      return {
        success: false,
        action,
        error: new Error("Unknown error in action execution"),
      };
    }
  }

  async executeSequence(
    actions: Action[],
    options: { stopOnError?: boolean } = {},
  ): Promise<ActionResult[]> {
    await this.initPage();

    const results: ActionResult[] = [];
    const sequenceStartTime = Date.now();

    this.logger.info("sequenceStart", {
      actionsCount: actions.length,
      timestamp: sequenceStartTime,
    });

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];

      this.logger.info("actionProgress", {
        current: i + 1,
        total: actions.length,
        action,
      });

      if (!action) {
        throw new Error("Action is undefined");
      }
      const result = await this.executeAction(action);

      if (result) {
        results.push(result);

        // Ak nastala chyba a je nastavená možnosť stopOnError, zastavíme vykonávanie
        if (!result.success && options.stopOnError) {
          break;
        }
      } else {
        throw new Error("Result is undefined");
      }
    }

    const sequenceEndTime = Date.now();
    const sequenceDuration = sequenceEndTime - sequenceStartTime;

    this.logger.info("sequenceComplete", {
      results,
      duration: sequenceDuration,
      success: results.every((r) => r.success),
    });

    return results;
  }
}
