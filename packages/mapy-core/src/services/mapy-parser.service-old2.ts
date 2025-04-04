// import puppeteer from 'puppeteer'; // Import základného puppeteer
// import puppeteerExtra from 'puppeteer-extra'; // Import puppeteer-extra
// import StealthPlugin from 'puppeteer-extra-plugin-stealth'; // Import stealth pluginu
// import { load } from 'cheerio';

// // Pridanie stealth pluginu
// puppeteerExtra.use(StealthPlugin());

// export class MapParserServiceOld2 {
//   async parse(url: string): Promise<any> {
//     let browser: puppeteer.Browser | null = null;
//     try {
//       // Spustenie prehliadača pomocou puppeteer-extra
//       browser = await puppeteerExtra.launch({
//         headless: true,
//         args: [
//           '--no-sandbox',
//           '--disable-setuid-sandbox',
//           '--disable-web-security',
//           '--disable-features=IsolateOrigins,site-per-process',
//           '--window-size=1920,1080',
//           '--disable-infobars',
//           '--disable-dev-shm-usage',
//           '--disable-blink-features=AutomationControlled',
//         ],
//         defaultViewport: {
//           width: 1920,
//           height: 1080,
//         },
//       });

//       // Vytvorenie novej stránky
//       const page = await browser.newPage();

//       // Nastavenie realistického User-Agent
//       await page.setUserAgent(
//         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
//       );

//       // Povolenie JavaScriptu
//       await page.setJavaScriptEnabled(true);

//       // Pridanie dodatočných HTTP hlavičiek pre simuláciu reálneho prehliadača
//       await page.setExtraHTTPHeaders({
//         'Accept-Language': 'sk-SK,sk;q=0.9,en-US;q=0.8,en;q=0.7',
//         'Sec-Fetch-Dest': 'document',
//         'Sec-Fetch-Mode': 'navigate',
//         'Sec-Fetch-Site': 'none',
//         'Sec-Fetch-User': '?1',
//         'Upgrade-Insecure-Requests': '1',
//       });

//       // Navigácia na stránku s rozšírenými možnosťami
//       await page.goto(url, {
//         waitUntil: 'networkidle0',
//         timeout: 60000,
//       });

//       // Simulácia ľudského správania: pohyby myšou
//       await page.mouse.move(100, 100);
//       await page.waitForTimeout(1000); // Počkanie 1 sekundu
//       await page.mouse.move(200, 200);

//       // Počkanie na načítanie mapy
//       try {
//         await page.waitForSelector('#block-map', { timeout: 10000 });
//       } catch (waitError) {
//         console.warn('Nepodarilo sa načítať selector #block-map');
//       }

//       // Extrahovanie HTML obsahu
//       const pageContent = await page.content();

//       // Použitie Cheerio na parsovanie HTML
//       const $ = load(pageContent);

//       // Extrakcia relevantných informácií
//       const mapData = {
//         title: $('title').text() || 'Žiadny nadpis',
//         mapElement: $('#block-map').html() || 'Žiadny mapový element',
//         ribbonControl: $('#ribbon-control').html() || 'Žiadny ribbon control',
//         fullHtml: pageContent,
//       };

//       return mapData;
//     } catch (error) {
//       console.error('Chyba pri parsovaní URL:', error);
//       throw error;
//       // throw new Error(`Nepodarilo sa spracovať URL: ${url}. Chyba: ${error.message}`);
//     } finally {
//       // Zatvorenie prehliadača
//       if (browser) {
//         await browser.close();
//       }
//     }
//   }
// }
