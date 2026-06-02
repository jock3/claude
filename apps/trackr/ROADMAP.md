# Track3r — Roadmap till den perfekta appen

> **Konsoliderad (rev. 3).** Sammanslagning av två tidigare roadmaps: en strukturell rev. 1 och en kritisk produktägar-rev. 2. Rev. 2 var en strikt förbättring av rev. 1 (behöll strukturen, lade till säkerhetsgrind, buggfix-pass, omordnad Fas 1 och uppgraderad AI-prio). Denna rev. 3 antar rev. 2 som bas och **förankrar Fas 0.5-buggarna i verifierade radnummer i `App.jsx`** så de är direkt körbara, samt korrigerar en auth-nyans (PIN:en sitter i hubben, inte i trackr). Full ändringslogg längst ner.

> Från visuellt skal → daglig vana. Faserna är ordnade efter värde/friktion-kvot:
> det som tar bort mest användarfriktion per nedlagd timme kommer först.
>
> **Legend:** Effort `S` = timmar · `M` = en dag · `L` = flera dagar · `XL` = vecka+
> Status: `[ ]` ej påbörjad · `[~]` pågår · `[x]` klar

---

### SÄKERHETSGRIND — läs innan du följer faserna

> **Status 2026-06-02 — MEDVETET UPPSKJUTEN.** Beslut: fortsätt bygga Fas 1 medan det bara är Gustav som loggar; ta grinden (riktig auth + RLS) **precis innan appen delas med en verklig användare eller Fas 3 påbörjas**. Grinden är inte struken — den är schemalagd till sista möjliga säkra ögonblick. Inget av det vi byggt hittills (OFF-sök, streckkod) ändrar risken; den lever helt i databaspolicyerna nedan.

Nuvarande läge (verifierat): Supabase-policyn är `using(true) with check(true)` (se `schema.sql`) med den publika anon-nyckeln liggande i JS-bundlen, och hubbens inloggning kontrolleras bara i webbläsaren (namn i localStorage, inget `auth.uid()`, inget lösenord). Det betyder att databasen i praktiken är **både läs- och skrivbar för vem som helst på internet** — inte bara noll integritet, utan vem som helst som öppnar källkoden kan radera *allas* data. **Gäller även `profiles` som delas med todo + kampanj — grinden är ett cross-app-jobb, inte bara trackr.**

- **För dig ensam i utveckling:** spelar ingen roll. Bygg på.
- **Men du får inte passera den här grinden utan att fixa det:**
  - innan en enda verklig person utöver dig loggar verklig kroppsdata, **eller**
  - innan Fas 3 (PWA / install / push) — hela den fasen går ut på att få *fler* att logga *mer* känslig data oftare.

Att bygga Fas 1–3 först och säkra sen är som att lägga en månad på att få folk att hälla sin känsligaste data i en hink — och *sedan* kontrollera om hinken läcker. Minsta grind = riktig auth (Supabase Auth) + RLS scopad till `auth.uid()`. Detaljer i Fas 8.

---

## Fas 0 — Fundament & beslut (gör först, blockerar resten) ✅ BESLUTAT 2026-06-02

Strategiska beslut som styr allt annat. **Besluten är tagna — se nedan.**

- [x] **Produktidentitet → Produkt för fler.** Andra verkliga personer ska kunna logga sin kroppsdata. Konsekvens: **säkerhetsgrinden (riktig auth + RLS) är nu obligatorisk** före Fas 3 / delning — inte valfri.
- [x] **Målanvändare → Bred nutritionsspårare.** Konkurrerar mer direkt med MyFitnessPal. Konsekvens: **Open Food Facts-sök + streckkod flyttar UPP** till kärna i Fas 1 (inte längre "lägre prio, sist"). En stor, sökbar matdatabas är ett måste för den här positioneringen, inte ett tillval.
- [x] **En eller flera användare → Flera.** Multi-user-skalet behålls och ska säkras på riktigt (utlöser grinden ovan). Ingen enanvändar-genväg.
- [x] **GDPR → måste hanteras** (följer av "produkt för fler"). Hälsodata = särskild kategori (art. 9). Kräver samtyckestext + riktig RLS per rad innan delning. Spårat i Fas 8.
- [x] **Mobil-först → Ja.** Track3r byggs mobile-first (bottom-nav, touch-ytor, PWA), till skillnad från sajtens övriga desktop-appar.

---

## Fas 0.5 — Korrigeringar (det som redan finns men beter sig fel)

> Billiga fixar på befintlig kod, alla `S`, alla med verifierad plats i `App.jsx`. Gör dessa före du bygger nytt ovanpå en skev grund — och de träffar datakvaliteten rakt, som din målanvändare bryr sig om. **Klart 2026-06-02.**

- [x] **Fixa streak-logiken** (`calcStreak` + ny `dayLogged`-helper) — streaken räknar nu *consecutive loggade dagar* (≥1 måltid), inte om totalen kapats under mål×1,05. En ärligt loggad överskottsdag bryter inte längre streaken, och en ologgad *idag* nollställer inte en pågående serie (räknas från igår). Belönar vanan att logga, inte att under-logga.
- [x] **Makro-sanity-check (4/4/9)** — `MealModal` visar nu en mjuk, icke-blockerande amber-varning när protein·4 + kolh·4 + fett·9 avviker från inmatade kcal med mer än `max(50, kcal·20%)`. Fångar feltryck (t.ex. 100 kcal + 80 g protein) utan att tjata på normala värden (tolererar avrundning/fiber/alkohol).
- [x] **Tidszonssäkra datumnycklar** — verifierat att `keyOf`/`parseKey` är internt konsekventa (lokal tid, ingen UTC-round-trip) och att Supabase `date`-kolumnen returnerar `"YYYY-MM-DD"` som används rått som nyckel. Ingen akut bugg — men la till defensiv `String(r.date).slice(0,10)` i `rowsToDays` som försäkring ifall ett tids-/zon-suffix någonsin smyger in.

---

## Fas 1 — Ta bort inmatningsfriktionen (högst ROI)

> **Omprioriterad efter Fas 0-beslutet (bred nutritionsspårare).** En sökbar matdatabas är nu *kärnan* i Fas 1, inte ett sent tillägg — utan den kan appen inte konkurrera i den valda positioneringen. De billiga återanvändnings-vinsterna byggs parallellt eftersom de är `S` och löser den repetitiva delen av loggningen nästan gratis.

- [x] **Open Food Facts-sök** — sökfält i `MealModal` (debounce 380 ms + abort) som autofyller kcal/P/K/F per 100 g; vald produkt visar ett "Mängd (g)"-fält som skalar makrona. Klient i `off.js`. *(Ej live-testad från sandbox — egress-allowlist; behöver browser-smoke-test.)*
- [x] **Streckkodsskanning** — "Skanna streckkod"-knapp → kamera + `BarcodeDetector` (EAN-13/8, UPC-A/E, Code-128) → uppslag via `getProductByBarcode` i OFF → samma autofyll. Använder `barcode-detector`-ponyfillen (zxing-wasm) så det funkar på iOS Safari också, lazy-laddad (egen chunk ~15 KB gzip + 939 KB wasm vid första skan). *(Kräver HTTPS + riktig enhet för test.)*
- [ ] **Kopiera gårdagen** — en knapp som klonar gårdagens måltider till idag. Billigaste högvärdesfunktionen som finns. `S`
- [ ] **Senast använda livsmedel** — auto-lista de N senaste loggade posterna för ett-klicks-återanvändning. `S`
- [ ] **Sparade måltider / favoriter** — ny tabell `track3r_favorites`. "Mina måltider" + "lägg till senaste" så återkommande mat loggas med ett klick. `M`
- [ ] **Onboarding-flöde** — första gången: kort guide som förifyller rimliga mål. Gör defaulterna meningsfulla med en TDEE-uppskattning (Mifflin-St Jeor) från längd/vikt/aktivitet istället för godtyckliga 2400/160/240/70 (`DEFAULT_GOALS` rad 226). `M`

> **Not om matinmatning:** Open Food Facts + streckkod löser *förpackad* mat. AI-naturligt-språk (Fas 6) löser *hemlagad / restaurang / vag* mat. Med positioneringen "bred nutritionsspårare" behövs **båda** — OFF/streckkod är basen (förväntas av varje MyFitnessPal-jämförelse), AI-NL är differentieraren ovanpå. OFF byggs först eftersom det är bordsinsats; AI-NL (Fas 6) blir nästa stora lyft.

---

## Fas 2 — Insiktslager (gör data till värde, ingen AI krävs)

Allt detta är ren aggregering av data som redan finns i Supabase.

- [ ] **Trendvikt (utjämnad, EMA)** *(hög prio inom fasen)* — dagsvikt svänger ±1–2 kg på vatten och salt. Visa ett exponentiellt glidande medel som huvudsiffra/kurva så att vikt-sparklinen och "−0,3 / 7d"-deltat blir trovärdiga istället för brus. Liten matte, stor skillnad på den enskilt mest motiverande siffran i appen. `S`–`M`
- [ ] **Veckosammanfattning i text** — "Du åt 340 kcal över mål 4 av 7 dagar." Beräknas från `track3r_days`. `M`
- [ ] **Trendinsikter** — snittprotein vs mål, viktstrend (riktning + hastighet, ovanpå EMA), längsta streak (efter fix i Fas 0.5). `M`
- [ ] **"Förra veckan vs denna vecka"-vy** — jämförelsekort överst i historiken. `M`
- [ ] **Siffror i kalendern** — visa faktiska värden (kcal, steg) vid hover/tap, inte bara prickar. `S`
- [ ] **Dagssammanfattning utan att byta datum** — tap på en dag → popover med dagens totaler. `S`

---

## Fas 3 — PWA & retention (gör den till en daglig vana)

> **Passera säkerhetsgrinden först** (se rutan högst upp). Denna fas ökar både mängden känslig data och antalet användare — exakt fel läge att fortfarande ha en öppen databas.

- [ ] **Web App Manifest** — installerbar, app-ikon, splash, standalone-läge. `S`
- [ ] **Service Worker** — offline-stöd för pågående dag, cachning av skal. `M`
- [ ] **Touch-optimering** — större träffytor, bottom-nav på mobil, swipe mellan dagar. `M`
- [ ] **Web Push-notiser** — "Har du loggat lunchen?" / kvällspåminnelse. Kräver opt-in + VAPID-nycklar. `L`

---

## Fas 4 — Träning: seriös eller smal (välj EN väg)

Halvdan träningsspårning är värre än ingen. Bestäm i Fas 0-andan.

- [ ] **VÄG A — Riktig träningslogg:** övningsdatabas, set/reps/vikt, progressiv överbelastning ("+5 kg sedan förra veckan"). `XL`
- [ ] **VÄG B — Förenkla:** reducera till "tränade X min / typ" och lägg all energi på nutrition. `S`
- [ ] *(Beslut loggas här när det är taget — bygg inte båda.)*

> **Lutning: Väg B.** Målanvändaren har ett *fast* schema — inte en progressiv-överbelastnings-optimerare (det är en Strong/Hevy-användare, en annan produkt). Lägg energin på nutrition där friktionen faktiskt sitter. Välj Väg A bara om detaljerad styrkeprogression är ett uttalat personligt mål för dig.

---

## Fas 5 — Automatisk datainsamling (ta bort manuell inmatning av mätvärden)

- [ ] **Steg-synk, iOS** — guide för Siri Shortcut som pushar dagliga steg till ett endpoint. `M`
- [ ] **Steg-synk, Android** — **Health Connect** (Google Fit-API:erna fasas ut — bygg inte mot dem). `L`
- [ ] **Beslut: behåll eller ta bort manuell stegmätning** — om ingen synk byggs, ta bort funktionen hellre än att låta den vara tom. `S`

---

## Fas 6 — AI-funktioner (matchar "AI Labb"-identiteten + differentierar)

> **Differentieraren ovanpå basen.** Med positioneringen "bred nutritionsspårare" byggs OFF/streckkod (Fas 1) *först* som bordsinsats — sedan blir naturlig-språks-inmatningen det som skiljer Track3r från MyFitnessPal. Den löser hemlagat-/restaurang-halvan som streckkoder inte når. Reliabilitetsinvändningen (svårt att gissa portionsstorlek) är mildrad av att användaren alltid bekräftar/justerar de förifyllda värdena — det är en estimator, inte ett orakel, och en grov förifyllning slår att skriva fyra siffror från noll.

- [ ] **Naturlig-språksinmatning** — "Jag åt en tallrik pasta" → Claude estimerar kcal/P/C/F → förifyller måltidsmodalen (redigerbart). Löser inmatningsfriktion + är en unik feature. `L`
- [ ] **Målvalidering** — engångskoll "är ditt kalorimål rimligt givet vikt & aktivitet?". *(Verkligt adaptiva mål som löpande justeras efter vikttrenden — MacroFactors hela pitch — är ett större produktbeslut. Lägg in som eget spår om du vill dit.)* `M`
- [ ] **AI-genererad veckorapport** — naturligt språk ovanpå insiktslagret från Fas 2. `M`

---

## Fas 7 — Export & portabilitet (gör styrkan till en säljpunkt)

- [ ] **JSON-export** — strukturerat format andra appar kan läsa in. `S`
- [ ] **Apple Health / Google Fit-export** — kompatibelt format. `L`
- [ ] **Lyft fram export i UI** — gör dataportabilitet till en synlig feature, inte gömd i en modal. `S`

---

## Fas 8 — Säkerhet & hårdning

> **Uppdelad.** Minsta grinden måste göras enligt rutan högst upp (före delning / Fas 3). Resten är hårdning som tål att vänta.

**Minsta grind (icke förhandlingsbar före delning / Fas 3):**

- [ ] **Riktig auth** — ersätt hub-PIN-teatern med Supabase Auth (magic link / e-post). RLS per rad *kräver* detta; utan riktig identitet finns inget `auth.uid()` att scopa mot. `M`
- [ ] **Riktig RLS per rad** — ersätt de permissiva `using(true)`-policyerna (`schema.sql`) med profil-/uid-scopad åtkomst. Stänger både läs-hålet (integritet) och skriv-hålet (vem som helst kan radera all data). `M`

**Senare hårdning:**

- [ ] **Samtyckes-/integritetstext** — för hälsodata under GDPR (art. 9). `S`
- [ ] **Audit av anon-nyckel-exponering** — bedöm risk, överväg edge functions för känsliga operationer. `M`

---

## Snabb prioriteringsöversikt

| Om du bara har... | Gör detta |
|---|---|
| **En helg** | Fas 0.5 (streak / sanity / tidszon) + kopiera-gårdagen + senast-använda + onboarding — döda den akuta friktionen och de tysta buggarna |
| **En vecka** | Ovan + insiktslager (Fas 2) inkl. EMA-trendvikt + veckosammanfattning |
| **En månad** | + AI-NL-inmatning (Fas 6, differentieraren) + PWA-skal — men **säkerhetsgrinden FÖRE** du delar eller pushar |
| **Ett kvartal** | + Open Food Facts / streckkod, träningsbeslut (Väg B), full hårdning, automatisk steg-synk |

**Reglerna:**

1. Bygg inte bredd innan den dagliga loggningen är gnidningsfri för den repetitiva ätaren. Återanvändning (kopiera / favoriter) > matsök > allt annat.
2. Samla inte in mer känslig data (Fas 3) innan säkerhetsgrinden är passerad.

---

## Ändringslogg

**rev. 3 → rev. 4 (2026-06-02 — Fas 0 beslutad + Fas 0.5 byggd)**
- **Fas 0-besluten tagna:** produkt för fler · bred nutritionsspårare · flera användare · GDPR måste hanteras · mobile-first. Säkerhetsgrinden därmed bekräftad som obligatorisk.
- **Fas 1 omprioriterad** efter "bred nutritionsspårare": Open Food Facts-sök + streckkod flyttade UPP till kärna (var "sist, lägre prio"). Fas 6-noten justerad — OFF är nu bordsinsats först, AI-NL differentieraren ovanpå (tidigare rekommenderades AI före OFF, vilket gällde nischen "hemmakock").
- **Fas 0.5 implementerad i `App.jsx`:** streak-logik (ny `dayLogged`, räknar loggade dagar), makro-sanity-varning i `MealModal` (Atwater 4/4/9), defensiv datumnyckel-normalisering i `rowsToDays`. Build verifierad. Tidszons-"buggen" visade sig vara teoretisk — koden var redan konsekvent — så det blev en försäkring, inte en akut fix.

**rev. 2 → rev. 3 (konsolidering)**
- Slog ihop de två parallella roadmap-filerna till en kanonisk fil. Rev. 2 antagen som bas (strikt förbättring av rev. 1).
- **Fas 0.5 förankrad i verifierade radnummer** i `App.jsx`: `calcStreak` (202) / `kcalInGoal` (196), `keyOf` (158), `DEFAULT_GOALS` (226). Alla tre buggar bekräftade mot faktisk kod.
- **Auth-nyans korrigerad:** PIN-inloggningen sitter i *hubben*, inte i trackr (som bara läser `ailabb_active_user` och redirectar). Säkerhetsslutsatsen oförändrad — anon-nyckel + `using(true)` = världen kan läsa/radera.

**rev. 1 → rev. 2**
- Säkerhet flyttad från Fas 8-"sen" till en grind före Fas 3 och före någon annan verklig användare. Lade till riktig auth som eget item (RLS utan auth är bara en halv fix).
- Ny Fas 0.5 med buggfixar: streak-logik, makro-sanity-check (4/4/9), tidszonssäkra datumnycklar.
- Fas 1 omordnad — kopiera-gårdagen + senast-använda + favoriter (`S`/`M`) först; Open Food Facts + streckkod (`L`) sist. Onboarding fick TDEE-förslag.
- AI-matinmatning uppgraderad i prioritet (Fas 6), rekommenderad före OFF/streckkod (målanvändaren är hemmakock).
- EMA-trendvikt tillagd i Fas 2.
- Fas 0 fick ett en-eller-flera-användare-beslut.
- Fas 4 fick uttalad lutning mot Väg B.
- Health Connect framför döende Google Fit-API:er; målvalidering förtydligad som engångskoll.
