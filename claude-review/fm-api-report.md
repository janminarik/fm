# Code Review: fm-api

## 1. Architektúra a Štruktúra
- Silné stránky:
  - Aplikácia dobre využíva NestJS architektúru s modulmi, službami a kontrolérmi.
  - Jasná separation of concerns s adresármi pre každú doménovú oblasť (auth, user, adspace).
  - Dobre štruktúrované DTO a entity objekty.
  - Použitie verziovania API (v1) v kontroléroch.
  - Oddelenie dokumentácie do špecifických doc súborov.
  - Jasné rozdelenie na controller vrstvu a aplikačné služby.
  
- Odporúčania na zlepšenie:
  - Mierne nekonzistentná adresárová štruktúra medzi rôznymi modulmi (napr. `docs` vs `doc`, `dtos` vs `dto`).
  - V niektorých kontroléroch chýba explicitná validácia vstupu.
  - Niektoré komentáre v kóde naznačujú nedokončenú implementáciu (napr. TO-DO komentáre v auth kontroléri).
  - Chýba jasná dokumentácia o workflow aplikácie ako celku.

## 2. Kvalita kódu
- Silné stránky:
  - Používanie TypeScript s dobre definovanými typmi.
  - Implementácia Dependency Injection podľa best practices v NestJS.
  - Používanie dekorátorov pre zlepšenie čitateľnosti kódu.
  - Dobre štruktúrované a pomenované DTO objekty.
  - Validácia vstupu pomocou class-validator.
  - Používanie interceptorov pre cross-cutting concerns.
  
- Odporúčania na zlepšenie:
  - V niektorých kontroléroch chýba jednotný prístup k ošetreniu chýb.
  - Niektoré zakomentované časti kódu by mali byť buď dokončené alebo odstránené.
  - Môže byť vhodnejšie definovať a používať vlastné výnimky namiesto štandardných NestJS výnimiek.
  - Používanie interface vs type nie je konzistentné v celej aplikácii.

## 3. Bezpečnosť
- Silné stránky:
  - Použitie JWT autentifikácie s refresh tokenom.
  - Implementácia guards pre ochranu endpointov.
  - Využitie throttling pre limitovanie požiadaviek (rate limiting) v auth kontroléri.
  - Použitie HTTP-only cookies pre ukladanie tokenov.
  - Validácia vstupných dát pomocou DTO objektov a class-validator.
  
- Odporúčania na zlepšenie:
  - Niektoré tokeny sú stále prechádzané v tele odpovede, mohlo by byť bezpečnejšie používať len HTTP-only cookies.
  - Chýba definovanie a presadenie bezpečnostných hlavičiek (CORS, Content-Security-Policy, atď.).
  - Nebola viditeľná implementácia rate-limitingu na úrovni celej aplikácie.
  - Chýba ochrana proti common API security issues ako parameter pollution.

## 4. Výkon
- Silné stránky:
  - Použitie NestJS poskytuje dobrý základ pre výkonné API.
  - Implementácia paginácie pre endpointy, ktoré vracajú zoznamy.
  - Využitie databázových indexov (predpokladané z Prisma modelu).
  
- Odporúčania na zlepšenie:
  - Niektoré API endpointy by mohli byť optimalizované z hľadiska počtu dotazov na databázu.
  - Nebola viditeľná implementácia cachovania odpovedí.
  - Chýba explicitná kontrola veľkosti tiel požiadaviek.
  - Niektoré operácie by mohli byť presmerované na fronty pre asynchrónne spracovanie.

## 5. Testovacie pokrytie
- Silné stránky:
  - Existencia niektorých testov (napr. `auth.controller.spec.ts`).
  - Použitie dedicated test utilities.
  
- Odporúčania na zlepšenie:
  - Testy existujú len pre niektoré časti aplikácie, mnoho kontrolérov a služieb nemá žiadne testy.
  - Chýbajú integračné testy pre overenie spolupráce medzi komponentmi.
  - Chýbajú end-to-end testy pre API endpointy.
  - Chýbajú performance testy.

## 6. Dokumentácia
- Silné stránky:
  - Použitie NestJS Swagger pre automatické generovanie API dokumentácie.
  - Oddelenie dokumentácie do špecifických doc súborov (napr. `auth.doc.ts`).
  - Dobre pomenované a štruktúrované DTO objekty, ktoré slúžia ako implicitná dokumentácia.
  
- Odporúčania na zlepšenie:
  - Chýbajú komentáre pre niektoré komplexnejšie metódy.
  - Niektoré dekorátory pre Swagger dokumentáciu by mohli obsahovať viac detailov.
  - Chýba vysokoúrovňový prehlad architekútry a workflow aplikácie.
  - Niektoré TO-DO komentáre naznačujú nedokončenú implementáciu alebo dokumentáciu.

## 7. Celkové hodnotenie
- Zhrnutie hlavných zistení
  - Aplikácia fm-api je dobre štruktúrovaná NestJS aplikácia, ktorá sleduje moderné best practices pre vývoj REST API.
  - Využíva modely, kontroléry, služby a doménovo-riadený design pre jasnú separation of concerns.
  - Implementácia autentifikácie a autorizácie je robustná, ale niektoré bezpečnostné aspekty by mohli byť ďalej posilnené.
  - Hlavným nedostatkom je malé pokrytie testami a miestami nekonzistentná adresárová štruktúra a štýl kódovania.

- Prioritizované odporúčania
  1. Zvýšiť pokrytie testami, najmä pre kritické časti ako autentifikácia a operácie s užívateľmi.
  2. Dokončiť implementáciu nedokončených častí označených TO-DO komentármi.
  3. Zjednotiť adresárovú štruktúru a pomenovacie konvencie medzi rôznymi modulmi.
  4. Implementovať cachovanie pre často používané endpointy.
  5. Vylepšiť API dokumentáciu s komplexnejšími príkladmi a vysvetleniami.
