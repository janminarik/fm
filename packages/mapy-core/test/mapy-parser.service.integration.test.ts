// mapy-parser.service.integration.test.ts
import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/axios";
import { MapyParserService, MapyParserServiceOld } from "../src/services";
import { Route, Folder } from "../src/entities";
import {
  jest,
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";

jest.setTimeout(30000);

/**
 * Integračný test pre MapyParserService
 *
 * Tento test využíva reálne URL z Mapy.com a overuje správne parsovanie údajov.
 * Vyžaduje pripojenie na internet pre prístup k Mapy.com a nainštalovaný Puppeteer.
 */
describe("MapyParserService (integration)", () => {
  let service: MapyParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          timeout: 10000, // 10 sekúnd timeout pre HTTP požiadavky
          maxRedirects: 5,
        }),
      ],
      providers: [MapyParserService],
    }).compile();

    service = module.get<MapyParserService>(MapyParserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // Hlavný integračný test s reálnym URL
  it("should parse real Mapy.com folder URL using Puppeteer", async () => {
    // Použitie skutočnej URL z Mapy.com
    const url = "https://mapy.com/s/dodalupufa";

    // Volanie služby na parsovanie URL s Puppeteer
    const data = await service.parse(url);

    expect(data).toBeDefined();
  });
});
