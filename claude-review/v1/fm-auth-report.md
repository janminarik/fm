# Code Review: fm-auth

## 1. Architektúra a Štruktúra
- Silné stránky:
  - Balík je dobre štruktúrovaný s jasne definovanými súbormi pre konfiguráciu, dekorátory, DTOs, guard, stratégie, služby atď.
  - Modularita je dobrá - použitie NestJS modulu s jasne definovaným API a závislosťami.
  - Využitie `forRootAsync` vzoru pre konfigurovateľnosť modulu.
  - Separácia logiky do špecifických služieb (access token, refresh token, renew token).
  - Správne využitie injectovateľných tokenov pre dependency injection.
  
- Odporúčania na zlepšenie:
  - V súbore `jwt-access.guard.ts` je celá implementácia `handleRequest` zakomentovaná. Kód by mal byť buď aktívny alebo odstránený, nezanechávať zakomentovaný nefunkčný kód.
  - Názvy niektorých súborov sú nekonzistentné, napríklad: `auth-cookie.servise.ts` má preklep (`servise` namiesto `service`).
  - Chýba centrálny export na úrovni modulu, ktorý by jasne definoval verejné API balíka.

## 2. Kvalita kódu
- Silné stránky:
  - Dobrá typová bezpečnosť s použitím TypeScript interface a type.
  - Znovupoužiteľnosť kódu pomocou malých, cielených služieb.
  - Triedy implementujú interfacy, čo zlepšuje ich zameniteľnosť a testovateľnosť.
  - Využíva dependency injection pattern.
  
- Odporúčania na zlepšenie:
  - V `access-token.service.ts` je násobenie `this.expirationTime * 10000` bez jasného vysvetlenia, prečo je potrebné násobenie 10000.
  - Nedostatočné používanie konštant pre magic numbers a reťazce.
  - Trieda `AccessTokenService` obsahuje dvojnásobné priradenie rovnakej hodnoty: `this.issuer = this.config.issuer` je redundantné.
  - Niektoré DTOs nemajú validáciu.

## 3. Bezpečnosť
- Silné stránky:
  - Implementácia JWT tokenu s refresh tokenom pre zlepšenie bezpečnosti.
  - Verifikácia platnosti tokenu v stratégiách s kontrolou existencie užívateľa.
  - Použitie vlastných JWT payloadov s typmi pre lepšiu kontrolu.
  - Použitie `jti` (JWT ID) pre možnosť revokácie tokenov.
  
- Odporúčania na zlepšenie:
  - V metóde `validate` v `jwt-access.strategy.ts` chýba kontrola, či užívateľ nie je deaktivovaný alebo zmazaný.
  - Nie je implementovaná blacklist pre revokované tokeny.
  - Chýba rotácia refresh tokenov pri každom požiadavku (dobrá prax pre zabránenie zneužitia odcudzených refresh tokenov).
  - Chýba kontrola IP adries alebo fingerprint zariadenia pre zvýšenú bezpečnosť.

## 4. Výkon
- Silné stránky:
  - Jednoduchá a efektívna implementácia generovania a validácie tokenov.
  - Minimálna réžia pri spracovaní tokenov.
  
- Odporúčania na zlepšenie:
  - Chýba cachovanie pre opakované overenia užívateľov.
  - Mohli by byť pridané rate-limiting mechanizmy na úrovni služieb pre prevenciu brute-force útokov.

## 5. Testovacie pokrytie
- Silné stránky:
  - Existencia špecifikačného testu pre `access-token.service.spec.ts`.
  
- Odporúčania na zlepšenie:
  - Väčšina služieb a stratégií nemá testy.
  - Chýbajú integračné testy pre overenie spolupráce medzi službami.
  - Chýbajú testy pre scenáre zlyhania alebo neplatných tokenov.

## 6. Dokumentácia
- Silné stránky:
  - Kód je relatívne čitateľný a self-documenting.
  
- Odporúčania na zlepšenie:
  - Chýbajú JSDoc komentáre pre väčšinu tried a metód.
  - Niektoré TODO komentáre v kóde (`//TODO: loc a custom HTTP STATUS ?`), ktoré by mali byť vyriešené alebo konvertované na issues v systéme sledovania úloh.
  - Chýba README súbor s opisom funkcionalít a použitia balíka.

## 7. Celkové hodnotenie
- Zhrnutie hlavných zistení
  - Balík fm-auth implementuje dobre navrhnutú JWT autentifikáciu s podporou refresh tokenov.
  - Zdá sa byť dobre integrovaný s NestJS framework a využíva množstvo jeho funkcií.
  - Má dobrú základnú štruktúru, ale niektoré implementačné detaily by mohli byť vylepšené.
  - Bezpečnostné aspekty sú riešené dobre, ale chýbajú niektoré pokročilé funkcie.

- Prioritizované odporúčania
  1. Odstrániť alebo implementovať zakomentovaný kód v `jwt-access.guard.ts`.
  2. Pridať systematické testovanie pre všetky komponenty.
  3. Zlepšiť dokumentáciu, najmä pre verejné API.
  4. Implementovať stratégiu pre revokáciu tokenov (blacklist).
  5. Zabezpečiť kontrolu stavu užívateľa (aktívny/deaktivovaný) pri validácii tokenov.
