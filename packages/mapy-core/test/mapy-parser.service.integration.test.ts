// mapy-parser.service.integration.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { MapyParserService } from '../src/services/mapy-parser.service';
import { Route, Folder } from '../src/entities';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";

/**
 * Integračný test pre MapyParserService
 * 
 * Tento test využíva reálne URL z Mapy.com a overuje správne parsovanie údajov.
 * Vyžaduje pripojenie na internet pre prístup k Mapy.com.
 */
describe('MapyParserService (integration)', () => {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Hlavný integračný test s reálnym URL
  it('should parse real Mapy.com folder URL', async () => {
    // Použitie skutočnej URL z Mapy.com
    const url = 'https://mapy.com/s/dodalupufa';
    
    // Volanie služby na parsovanie URL
    const folder = await service.parseFolder(url);
    
    // Základné overenia
    expect(folder).toBeDefined();
    expect(folder).toBeInstanceOf(Folder);
    expect(folder.name).toBeDefined();
    expect(folder.routes).toBeInstanceOf(Array);
    expect(folder.routes.length).toBeGreaterThan(0);
    
    // Overenie, že máme nejaké trasy
    for (const route of folder.routes) {
      expect(route).toBeInstanceOf(Route);
      expect(route.name).toBeDefined();
      // Pre trasy očakávame vzdialenosť a trvanie
      if (route.distance) {
        expect(typeof route.distance).toBe('number');
        expect(route.distance).toBeGreaterThan(0);
      }
      if (route.duration) {
        expect(typeof route.duration).toBe('number');
        expect(route.duration).toBeGreaterThan(0);
      }
    }
    
    // Vypíšeme súhrn pre rýchlu kontrolu
    console.log(`Folder name: ${folder.name}`);
    console.log(`Total routes: ${folder.routes.length}`);
    console.log(`Total distance: ${folder.totalDistance.toFixed(1)} km`);
    console.log(`Total duration: ${folder.totalDuration.toFixed(2)} h`);
    
    // Vypíšeme prvé 3 trasy pre kontrolu
    console.log('\nSample routes:');
    folder.routes.slice(0, 3).forEach((route, index) => {
      console.log(`${index + 1}. ${route.name} - ${route.distance || 'N/A'} km, ${service.formatDuration(route.duration)}`);
    });
  }, 30000); // Predĺžený timeout pre test na 30 sekúnd
});
