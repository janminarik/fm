# Code Review: fm-shared

## 1. Architektúra a Štruktúra
- Silné stránky:
  - Balík je dobre organizovaný s logickým rozdelením na moduly, služby, mapovače a utility.
  - Implementácia základných služieb ako kryptografické hašovanie, ktoré môžu byť zdieľané naprieč aplikáciou.
  - Použitie TypeScript pre typovú bezpečnosť.
  - Jasné oddelenie zodpovedností pre každý komponent.
  
- Odporúčania na zlepšenie:
  - Obsahuje relatívne málo zdieľaných komponentov - balík by mohol byť rozšírený o ďalšie užitočné utility a služby.
  - Zakomentovaná funkcia `mapEnum` v `enum.utils.ts` naznačuje nedokončenú funkcionalitu.
  - Niektoré moduly obsahujú len jednu alebo dve služby, čo môže naznačovať, že by mohli byť ďalej organizované.
  - Chýba jasná dokumentácia o účele a použití jednotlivých komponentov.

## 2. Kvalita kódu
- Silné stránky:
  - Implementácia je jednoduchá a zrozumiteľná.
  - Správne použitie rozhraní pre služby (napr. `IHashService`).
  - Dobrá implementácia Base Mapper s generickými typmi.
  - Správne použitie dependency injection.
  
- Odporúčania na zlepšenie:
  - V `hash.service.ts` je TODO komentár o nahradení bcryptjs za Argon2, čo by malo byť implementované.
  - Funkcia `mapEnumValue` by mohla mať lepšie ošetrenie chýb pri neexistujúcich hodnotách.
  - Chýbajú unit testy pre utility a služby.
  - Metóda `compare` v `hash.service.ts` je asynchrónna, ale nepotrebuje byť keďže `bcryptjs.compare` už vracia Promise.

## 3. Bezpečnosť
- Silné stránky:
  - Použitie bcryptjs pre hashing hesiel, čo je bezpečnejšie než základné hashing funkcie.
  - Implementácia salt generácie pre dodatočnú bezpečnosť.
  
- Odporúčania na zlepšenie:
  - Ako je uvedené v TODO, bcryptjs by mal byť nahradený za bezpečnejší Argon2.
  - Dĺžka soli (10) by mohla byť konfigurovateľná cez environment premenné.
  - Chýba bezpečnostná dokumentácia a best practices pre použitie týchto služieb.
  - Nie je jasná stratégia pre aktualizáciu bezpečnostných algoritomov v budúcnosti.

## 4. Výkon
- Silné stránky:
  - Služby sú jednoduché a efektívne.
  - Base Mapper poskytuje efektívny spôsob pre transformáciu objektov.
  
- Odporúčania na zlepšenie:
  - `HashService` môže byť pomalší kvôli synchronnej implementácii bcryptjs. Argon2 by mohol byť rýchlejší a bezpečnejší.
  - Metóda `toList` v `BaseMapper` môže byť neefektívna pre veľké kolekcie, keďže vytvára nové pole a každý prvok konvertuje individuálne.
  - Nie je jasné, ako by sa riešilo mapovanie veľkého množstva objektov alebo hlbokej hierarchie.

## 5. Testovacie pokrytie
- Silné stránky:
  - N/A - neboli nájdené žiadne testy.
  
- Odporúčania na zlepšenie:
  - Chýbajú unit testy pre všetky komponenty.
  - Kritické služby ako `HashService` by mali mať testy pre všetky scénáre, vrátane chybových stavov.
  - Utility funkcie by mali byť dôkladne testované vrátane hraničných prípadov.
  - Mapovací functions by mali byť testované s rôznymi typmi a scenármi.

## 6. Dokumentácia
- Silné stránky:
  - Kód je relatívne jednoduchý a samovysvetľujúci.
  - Rozhrania definujú očakávané správanie služieb.
  
- Odporúčania na zlepšenie:
  - Chýbajú JSDoc komentáre pre triedy, metódy a funkcie.
  - Zakomentovaný kód (`mapEnum` funkcia) by mal byť buď dokončený alebo odstránený.
  - Chýba README s popisom balíka a jeho účelu.
  - Chýbajú príklady použitia komponentov.

## 7. Celkové hodnotenie
- Zhrnutie hlavných zistení
  - Balík fm-shared poskytuje základné zdieľané komponenty pre aplikáciu, ako sú kryptografické služby a utility pre mapovanie.
  - Implementácia je jednoduchá a priamočiara, ale obsahuje relatívne málo komponentov.
  - Hlavnými nedostatkami sú absencia testov, dokumentácie a nedokončená funkcionalita (TODO komentáre).

- Prioritizované odporúčania
  1. Dokončiť TODO položky, najmä nahradenie bcryptjs za Argon2.
  2. Pridať unit testy pre všetky komponenty.
  3. Pridať JSDoc komentáre a ďalšiu dokumentáciu.
  4. Rozšíriť balík o ďalšie užitočné zdieľané komponenty (napr. validácia, logovanie, error handling).
  5. Pridať konfigurovateľnosť cez environment premenné alebo konfiguračné objekty.
