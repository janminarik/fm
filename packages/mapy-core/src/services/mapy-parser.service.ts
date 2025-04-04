// mapy-parser.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { firstValueFrom } from 'rxjs';
import { Folder, Route } from "../entities";

@Injectable()
export class MapyParserService {
  constructor(private httpService: HttpService) {}

  async parseFolder(url: string): Promise<Folder> {
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const html = response.data;
      return this.parseFolderFromHtml(html);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Neznáma chyba';
      throw new HttpException('Chyba pri načítaní folderu: ' + errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private parseFolderFromHtml(html: string): Folder {
    // Použitie cheerio pre parsovanie HTML (podobné jQuery)
    const $ = cheerio.load(html);
    
    // Získanie názvu folderu
    const folderTitle = $('.ui-heroheader__title').text().trim() || "";
    
    const folder = new Folder(folderTitle);
    
    // Hľadanie všetkých položiek trás
    $('.items.sortable .item.public').each((i, element) => {
      const titleAttr = $(element).attr('title') || "";
      const route = this.parseRouteFromTitle(titleAttr);
      folder.addRoute(route);
    });
    
    return folder;
  }

  private parseRouteFromTitle(title: string): Route {
    // Rozdelenie title atribútu podľa nového riadka
    const lines = title.split('\n').map(line => line.trim());
    const name = lines[0] || "";
    
    // Ak má položka len jeden riadok alebo druhý riadok neobsahuje "Route", je to marker alebo dedina
    if (lines.length < 2 || !(lines[1] || "").includes('Route')) {
      // Vratíme len názov bez vzdialenosti a trvania
      return new Route(name);
    }
    
    // Parsovanie informácií o trase z druhého riadku
    const routeInfo = lines[1] || "";
    
    // Extrakcia vzdialenosti (km)
    const distanceMatch = routeInfo.match(/(\d+(?:\.\d+)?)\s*km/);
    const distance = distanceMatch && distanceMatch[1] ? parseFloat(distanceMatch[1]) : undefined;
    
    // Extrakcia času (hodiny)
    const durationMatch1 = routeInfo.match(/(\d+):(\d+)\s*h/);
    const durationMatch2 = routeInfo.match(/(\d+)(?:\.\d+)?\s*h/);
    const durationMatch = durationMatch1 || durationMatch2;
    
    let duration: number | undefined = undefined;
    
    if (durationMatch) {
      if (durationMatch[2]) {
        // Formát HH:MM
        const hours = parseInt(durationMatch[1] || "0", 10);
        const minutes = parseInt(durationMatch[2] || "0", 10);
        duration = hours + (minutes / 60);
      } else if (durationMatch[1]) {
        // Formát HH.MM alebo len HH
        duration = parseFloat(durationMatch[1]);
      }
    }
    
    return new Route(name, distance, duration);
  }

  // Pomocná metóda pre formátovanie času (hodiny:minúty)
  formatDuration(hours?: number): string {
    if (hours === undefined) return "N/A";
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    return `${wholeHours}:${minutes.toString().padStart(2, '0')} h`;
  }
}