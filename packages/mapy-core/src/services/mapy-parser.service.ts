import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";

@Injectable()
export class MapyParserService {

    async parse(url: string): Promise<any> {
        const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
    
        try {
          const page = await browser.newPage();

          await page.setJavaScriptEnabled(true);
    
          // Nastavenie user-agenta, aby sme vyzerali ako skutočný prehliadač
          await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          );
    
          // Navštív stránku a počkaj na načítanie
          await page.goto(url, { waitUntil: "networkidle2" });
    
          // Počkaj na konkrétny selektor (ak vieme, že h1 sa načítava dynamicky)
        //   await page.waitForSelector("h1", { timeout: 10000 }).catch(() => {
        //     console.log("h1 sa nenašiel do 10 sekúnd, pokračujem ďalej...");
        //   });
    
          // Debug: Vypíš celý HTML stránky do konzoly
          const html = await page.content();
          console.log("HTML stránky:", html);
    
          // Parsovanie dát
          const parsedData = await page.evaluate(() => {
            const titleElement = document.querySelector("h1");
            console.log("titleElement v evaluate:", titleElement); // Debug v prehliadači
            return titleElement ? titleElement.innerText : null;
          });
    
          console.log("Parsed data:", parsedData);
          return parsedData;
        } catch (error) {
          console.error("Chyba pri parsovaní:", error);
          throw error;
        } finally {
          await browser.close();
        }
      }


  async parse0(url: string): Promise<any> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: "networkidle2" });

      const parsedData = await page.evaluate(() => {
        const titleElement = document.querySelector("h1");
        return titleElement;
        // const descriptionElement = document.querySelector("p");
        // return {
        //   title: titleElement ? titleElement.innerText : "Nenájdené",
        //   description: descriptionElement
        //     ? descriptionElement.innerText
        //     : "Nenájdené",
        // };
      });

      return parsedData;
    } catch (error) {
      throw error;
    } finally {
      await browser.close();
    }
  }
}
