import {
  ActionSequenceExecutor,
  BrowserOptions,
  MapsScraperService,
  PageOptions,
} from "../src/scraper";
import { jest, describe, expect, it } from "@jest/globals";
import * as fs from "fs/promises";

import { createTestLogger } from "./utils/test-logger";
import { beforeAll } from "@jest/globals";
import { ILogger } from "../src/logger";

jest.setTimeout(300000);

describe("MapyParserService (integration)", () => {
  let testLogger: ILogger;
  beforeAll(() => {
    testLogger = createTestLogger();
  });

  it("MapyScraperService", async () => {
    const sharedFolderUrl = "https://mapy.com/s/dodalupufa";
    const routeDetailBaseUrl = "https://mapy.com/en/turisticka?planovani-trasy";

    const browserOptions: BrowserOptions = { headless: true };
    const pageOptions: PageOptions = {
      navigationTimeout: 30000,
      timeout: 10000,
      debug: true,
    };

    const executor = new ActionSequenceExecutor(
      browserOptions,
      pageOptions,
      testLogger,
    );
    const scraper = new MapsScraperService(executor, testLogger);

    const folder = await scraper.getFolder(
      sharedFolderUrl,
      true,
      routeDetailBaseUrl,
    );

    await fs.writeFile(`${folder.name}.json`, JSON.stringify(folder));

    expect(executor).toBeDefined();
    expect(scraper).toBeDefined();
    expect(folder).toBeDefined();
  });
});
