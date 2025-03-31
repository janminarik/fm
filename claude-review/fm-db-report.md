# Code Review: fm-db

## 1. Architektúra a Štruktúra
- Silné stránky:
  - Balík je dobre štruktúrovaný, s jasným rozdelením na moduly, služby, repozitáre a utility.
  - Využíva Repozitárový vzor na abstrahovanie prístupu k databáze.
  - `PrismaBaseRepository` poskytuje zdieľané CRUD operácie, čo uľahčuje implementáciu konkrétnych repozitárov.
  - Jasné oddelenie zdroja dát (Prisma) od biznis logiky.
  - Organizácia kódu sleduje princípy čistej architektúry s doménovými entitami a repozitármi.
  
- Odporúčania na zlepšenie:
  - Repozitáre by mohli byť ďalej kategorizované do doménových oblastí (napr. `users`, `adspace`).
  - V súbore `prisma-base.repository.ts` sa vyskytujú typové chyby (`Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '...'`), ktoré by mali byť opravené vytvorením typovo bezpečného delegáta.
  - Chýba explicitné rozdelenie na read a write operácie, čo by mohlo zlepšiť škálovateľnosť a podporu CQRS v budúcnosti.

## 2. Kvalita kódu
- Silné stránky:
  - Dobre definované a konzistentné rozhrania pre repozitáre.
  - Používanie abstraktných rozhraní pre lepšiu testovateľnosť.
  - Implementácia paginácie a filtrovania v `listPagination` metóde.
  - Správne používanie dependency injection a inversion of control pomocou NestJS.
  
- Odporúčania na zlepšenie:
  - Niekoľko ESLint varovaní v `prisma-base.repository.ts` o "Unsafe call" a "Unsafe return", ktoré by mali byť opravené.
  - V repozitároch ako `prisma-app-token.repository.ts` je priamy prístup k `this.txHost.tx[this.entityName]` namiesto použitia bezpečnejšieho prístupu cez `this.client`.
  - Nedostatočné ošetrenie chýb pri databázových operáciách.
  - Metóda `createMany` v `PrismaBaseRepository` nemá konzistentné správanie s návratovým typom, ktorý by mal byť `TEntity[]`, ale Prisma vracia `BatchPayload`.

## 3. Bezpečnosť
- Silné stránky:
  - Používanie Prisma ORM znižuje riziko SQL injection.
  - Typová kontrola na úrovni ORM.
  - Implementácia soft delete pre užívateľov (`deletedAt` pole).
  
- Odporúčania na zlepšenie:
  - Chýba systematické logovanie zmien v databáze (audit trail).
  - Chýba implementácia row-level security.
  - Nie je jasné, ako sa pristupuje k citlivým údajom (napr. heslo) - potreba zabezpečiť, že tieto nie sú neúmyselne vrátené v dotazoch.

## 4. Výkon
- Silné stránky:
  - Implementácia paginácie pre efektívne načítavanie zoznamov.
  - Možnosť zahrnúť related entities pomocou `include` parametra.
  - Možnosť filtrovania pomocou `where` podmienok.
  
- Odporúčania na zlepšenie:
  - Chýba implementácia cachovania dát.
  - V metóde `listPagination` sú dva separátne dotazy (`findMany` a `count`), ktoré by mohli byť optimalizované v určitých scenároch.
  - Nie je riešená optimalizácia N+1 problému pri načítavaní related entities.

## 5. Testovacie pokrytie
- Silné stránky:
  - Projekt obsahuje adresár `seed` pre inicializačné dáta do databázy, čo naznačuje nejakú prípravu pre testovacie dáta.
  
- Odporúčania na zlepšenie:
  - Chýbajú jednotkové testy pre repozitáre.
  - Chýbajú integračné testy s testovacou databázou.
  - Neboli viditeľné mock implementácie repozitárov pre testovanie vyšších vrstiev.
  - Chýba stratégia pre čistenie test databázy medzi testami.

## 6. Dokumentácia
- Silné stránky:
  - Zdrojový kód je relatívne dobre organizovaný a môže slúžiť ako self-documentation.
  - Rozhrania a typy poskytujú určitú úroveň dokumentácie štruktúry.
  
- Odporúčania na zlepšenie:
  - Chýbajú JSDoc komentáre pre metódy a triedy.
  - Chýba README s popisom architektúry, vzormi a príkladmi použitia.
  - Chýba dokumentácia Prisma schémy a jej vzťah k doménovým entitám.
  - Chýba vysvetlenie transakcií a ich správneho použitia.

## 7. Celkové hodnotenie
- Zhrnutie hlavných zistení
  - Balík fm-db poskytuje dobre štruktúrovanú abstrakciu nad Prisma ORM.
  - Využíva návrhový vzor Repository na oddelenie biznis logiky od prístupu k databáze.
  - Implementácia je celkovo dobrá, ale existujú problémy s typovou bezpečnosťou, ktoré by mali byť riešené.
  - Chýba dôraz na testovanie a dokumentáciu.

- Prioritizované odporúčania
  1. Opraviť typové chyby v `prisma-base.repository.ts` a `prisma-app-token.repository.ts` implementáciou typovo bezpečného delegáta.
  2. Pridať jednotkové a integračné testy pre repozitáre.
  3. Zlepšiť ošetrenie chýb pri databázových operáciách.
  4. Zabezpečiť konzistenciu návratových hodnôt, najmä pre `createMany` metódu.
  5. Pridať dokumentáciu, najmä pre správne použitie transakcií.
