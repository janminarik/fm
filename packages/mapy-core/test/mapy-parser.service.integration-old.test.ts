// mapy-parser.service.integration.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { MapyParserServiceOld } from '../src/services';
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
 * Vyžaduje pripojenie na internet pre prístup k Mapy.com a nainštalovaný Puppeteer.
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
  it('should parse real Mapy.com folder URL using Puppeteer', async () => {
    // Použitie skutočnej URL z Mapy.com
    const url = 'https://mapy.com/s/dodalupufa';
    
    // Volanie služby na parsovanie URL s Puppeteer
    const folder = await service.parseFolder(url);
    
    // Základné overenia
    expect(folder).toBeDefined();
    expect(folder).toBeInstanceOf(Folder);
    expect(folder.name).toBeDefined();
    expect(folder.routes).toBeInstanceOf(Array);
    expect(folder.routes.length).toBeGreaterThan(0);
    
    // Overenie, že máme nejaké trasy
    console.log(`Found ${folder.routes.length} routes in folder '${folder.name}'`);
    
    // Overenie, že trasy obsahujú očakávané údaje
    let routesWithDistance = 0;
    let routesWithDuration = 0;
    
    for (const route of folder.routes) {
      expect(route).toBeInstanceOf(Route);
      expect(route.name).toBeDefined();
      expect(route.name.length).toBeGreaterThan(0);
      
      if (route.distance !== undefined) {
        routesWithDistance++;
        expect(typeof route.distance).toBe('number');
        expect(route.distance).toBeGreaterThan(0);
      }
      
      if (route.duration !== undefined) {
        routesWithDuration++;
        expect(typeof route.duration).toBe('number');
        expect(route.duration).toBeGreaterThan(0);
      }
    }
    
    // Mali by sme mať väčšinu trás s vzdialenosťou a časom
    console.log(`Routes with distance: ${routesWithDistance}/${folder.routes.length}`);
    console.log(`Routes with duration: ${routesWithDuration}/${folder.routes.length}`);
    
    // Kontrola štatistík folderu
    expect(folder.totalDistance).toBeGreaterThan(0);
    expect(folder.totalDuration).toBeGreaterThan(0);
    
    // Vypíšeme súhrn pre rýchlu kontrolu
    console.log(`Folder name: ${folder.name}`);
    console.log(`Total routes: ${folder.routes.length}`);
    console.log(`Total distance: ${folder.totalDistance.toFixed(1)} km`);
    console.log(`Total duration: ${folder.totalDuration.toFixed(2)} h`);
    
    // Vypíšeme prvých 5 trás pre kontrolu
    console.log('\nSample routes:');
    folder.routes.slice(0, 5).forEach((route, index) => {
      const distanceStr = route.distance ? `${route.distance.toFixed(1)} km` : 'N/A';
      const durationStr = route.duration ? service.formatDuration(route.duration) : 'N/A';
      console.log(`${index + 1}. ${route.name} - ${distanceStr}, ${durationStr}`);
    });
  }, 60000); // Predĺžený timeout pre test na 60 sekúnd kvôli použitiu Puppeteer
});
