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

  it("MapyScraperService", async () => {
    const sharedFolderUrl = "https://mapy.com/s/dodalupufa";
    const routeDetailBaseUrl = "https://mapy.com/en/turisticka?planovani-trasy";

    const browserOptions: BrowserOptions = { headless: true };
    const pageOptions: PageOptions = {
      navigationTimeout: 30000,
      timeout: 10000,
      debug: true,
    };

    const executor = new ActionSequenceExecutor(browserOptions, pageOptions);
    const scraper = new MapyScraperService(executor);

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
