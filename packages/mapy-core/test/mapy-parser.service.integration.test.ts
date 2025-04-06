import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/axios";
import {
  ActionSequenceExecutor,
  BrowserOptions,
  MapyScraperService,
  PageOptions,
} from "../src/scraper";
import {
  jest,
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import * as fs from "fs/promises";

jest.setTimeout(300000);

/**
 * Integračný test pre MapyParserService
 *
 * Tento test využíva reálne URL z Mapy.com a overuje správne parsovanie údajov.
 * Vyžaduje pripojenie na internet pre prístup k Mapy.com a nainštalovaný Puppeteer.
 */
describe("MapyParserService (integration)", () => {
  // let service: MapyParserService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       HttpModule.register({
  //         timeout: 10000, // 10 sekúnd timeout pre HTTP požiadavky
  //         maxRedirects: 5,
  //       }),
  //     ],
  //     providers: [MapyParserService],
  //   }).compile();

  //   service = module.get<MapyParserService>(MapyParserService);
  // });

  it("should be defined", () => {
    // expect(service).toBeDefined();
  });

  // Hlavný integračný test s reálnym URL
  // it("should parse real Mapy.com folder URL using Puppeteer", async () => {
  //   // Použitie skutočnej URL z Mapy.com
  //   const url = "https://mapy.com/s/dodalupufa";

  //   // Volanie služby na parsovanie URL s Puppeteer
  //   const data = await service.parse(url);
  //   expect(data).toBeDefined();

  //   await fs.writeFile("folder.json", JSON.stringify(data));
  // });

  it("MapyScraperService", async () => {
    const url = "https://mapy.com/s/dodalupufa";

    const browserOptions: BrowserOptions = { headless: true };
    const pageOptions: PageOptions = {
      navigationTimeout: 30000,
      timeout: 10000,
      debug: true,
    };

    const executor = new ActionSequenceExecutor(browserOptions, pageOptions);
    const scraper = new MapyScraperService(executor);

    const result = await scraper.getFolder(url);

    expect(executor).toBeDefined();
    expect(scraper).toBeDefined();
  });

  //https://mapy.com/en/turisticka?planovani-trasy&dim=66acc55616423f1e7d13ec1e
  //
  //
  //
  // &x=[x-suradnica]&y=[y-suradnica]&z=[zoom-level]
});
