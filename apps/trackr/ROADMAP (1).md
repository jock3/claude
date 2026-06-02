# Track3r — Roadmap till den perfekta appen

> **Granskat av produktägare — rev. 2.** Originalstrukturen var bra och behölls i stort. Tre substantiella ändringar: (1) **säkerheten flyttades från "sen" till en grind** — den är inte en tillväxtfråga, den blockerar Fas 3 och alla verkliga andra-användare (se rutan nedan); (2) **AI-matinmatning upp, Open Food Facts ner** — din definierade målanvändare är en repetitiv hemmakock, och den halvan av matfriktionen löser AI, inte streckkoder; (3) **nytt fix-pass (Fas 0.5)** för buggar som redan finns och tränar fel beteende. Full ändringslogg längst ner.

> Från visuellt skal → daglig vana. Faserna är ordnade efter värde/friktion-kvot:
> det som tar bort mest användarfriktion per nedlagd timme kommer först.
>
> **Legend:** Effort `S` = timmar · `M` = en dag · `L` = flera dagar · `XL` = vecka+
> Status: `[ ]` ej påbörjad · `[~]` pågår · `[x]` klar

---

### SÄKERHETSGRIND — läs innan du följer faserna

Nuvarande läge: PIN-inloggningen kontrolleras bara i webbläsaren och lagras i klartext, och Supabase-policyn är `using(true) with check(true)` med den publika anon-nyckeln liggande i JS-bundlen. Det betyder att databasen i praktiken är **både läs- och skrivbar för vem som helst på internet** — alltså inte bara noll integritet, utan vem som helst som öppnar källkoden kan radera *allas* data.

- **För dig ensam i utveckling:** spelar ingen roll. Bygg på.
- **Men du får inte passera den här grinden utan att fixa det:**
  - innan en enda verklig person utöver dig loggar verklig kroppsdata, **eller**
  - innan Fas 3 (PWA / install / push) — hela den fasen går ut på att få *fler* att logga *mer* känslig data oftare.

Att bygga Fas 1–3 först och säkra sen är som att lägga en månad på att få folk att hälla sin känsligaste data i en hink — och *sedan* kontrollera om hinken läcker. Minsta grind = riktig auth (Supabase Auth) + RLS scopad till `auth.uid()`. Detaljer i Fas 8.

---

## Fas 0 — Fundament & beslut (gör först, blockerar resten)

Strategiska beslut som styr allt annat. Inget byggande förrän dessa är tagna.

- [ ] **Bestäm produktidentitet** — experiment i "AI Labb" eller fristående produkt? Avgör domän, säkerhetskrav och marknadsföring. `S`
- [ ] **Definiera målanvändaren** — låsa positioneringen till "repetitiv ätare + fast träningsschema som vill ha clean export & insikter". Allt nedan optimeras för den nischen. `S`
- [ ] **En eller flera användare?** — hubben är *redan byggd* för flera (kontoskapande, "byt användare", users-objekt). Två vägar, inga mellanlägen: erkänn det och säkra på riktigt (utlöser grinden), **eller** gör appen medvetet enanvändar-Gustav-only och ta bort multi-user-skalet så du inte har en fasad som låtsas skydda något den inte skyddar. `S`
- [ ] **GDPR-ställningstagande** — hälsodata är särskild kategori (art. 9). Dokumentera nuvarande modell och risknivå. Om appen ska växa: plan för riktig RLS per rad + samtycke. `S`
- [ ] **Mobil-först-beslut** — bekräfta att Track3r byggs mobile-first (till skillnad från övriga sajten). Styr all UI nedan. `S`

---

## Fas 0.5 — Korrigeringar (det som redan finns men beter sig fel)

> Billiga fixar på befintlig kod. Allt är `S`. Gör dessa före du bygger nytt ovanpå en skev grund — och de träffar datakvaliteten rakt, som din målanvändare bryr sig om.

- [ ] **Fixa streak-logiken** — idag räknas en dag som "i mål" bara om totalen är >0 och ≤ mål×1,05. Resultat: en *ologgad* dag bryter streaken, och en *ärligt loggad* dag över mål bryter den. Du belönar under-loggning och bestraffar ärlighet. Räkna istället streak på *handlingen att logga / följa planen*, inte på en enda kapad siffra. `S`
- [ ] **Makro-sanity-check (4/4/9)** — stämmer protein×4 + kolh×4 + fett×9 ungefär med inmatade kcal? Mjuk varning vid orimliga värden (t.ex. 100 kcal + 80 g protein, vilket är fysiskt omöjligt). Fångar feltryck → renare data att analysera senare. `S`
- [ ] **Tidszonssäkra datumnycklar** — `keyOf` använder lokal enhetstid; loggar du i en tidszon och kollar i en annan kan poster hamna på fel dag. Lås till en konsekvent zon. `S`

---

## Fas 1 — Ta bort inmatningsfriktionen (högst ROI)

> **Omordnad.** De billiga återanvändnings-vinsterna ligger nu **först** — de löser ~70 % av en repetitiv ätares dagliga loggning på några timmar. Tunga integrationer (Open Food Facts, streckkod) ligger sist. Detta följer roadmappens egen värde/friktion-regel bättre än originalordningen, där `L`-items låg före `S`-items.

- [ ] **Kopiera gårdagen** — en knapp som klonar gårdagens måltider till idag. Billigaste högvärdesfunktionen som finns; en repetitiv ätare äter nästan samma sak dag till dag. `S`
- [ ] **Senast använda livsmedel** — auto-lista de N senaste loggade posterna för ett-klicks-återanvändning. `S`
- [ ] **Sparade måltider / favoriter** — ny tabell `track3r_favorites`. "Mina måltider" + "lägg till senaste" så återkommande mat loggas med ett klick. `M`
- [ ] **Onboarding-flöde** — första gången: kort guide som förifyller rimliga mål. Gör defaulterna meningsfulla med en TDEE-uppskattning (Mifflin-St Jeor) från längd/vikt/aktivitet istället för godtyckliga 2400/160/240/70. `M`
- [ ] **Open Food Facts-sök** *(flyttad hit, lägre prio — se not nedan)* — öppna API:t (gratis, 3M+ produkter). Bäst för förpackad / märkesvara; svag på hemlagat. `L`
- [ ] **Streckkodsskanning** *(följer Open Food Facts)* — `BarcodeDetector` via webbkameran → uppslag i Open Food Facts. Fallback för iOS Safari (saknar API:t — t.ex. ZXing eller Quagga). Värt mest om du äter mycket förpackat. `L`

> **Not om matinmatning (viktig prioriteringsfråga):** Open Food Facts + streckkod löser *förpackad* mat. AI-naturligt-språk (Fas 6) löser *hemlagad / restaurang / vag* mat — "kycklinggryta med ris". Din definierade målanvändare är en repetitiv hemmakock, så den större halvan är hemlagat. **Min rekommendation: dra upp AI-inmatningen före OFF/streckkod** (se Fas 6). Tiebreaker om du tvekar: äter du (eller användaren) mest förpackat → OFF först; mest hemlagat → AI först.

---

## Fas 2 — Insiktslager (gör data till värde, ingen AI krävs)

Allt detta är ren aggregering av data som redan finns i Supabase.

- [ ] **Trendvikt (utjämnad, EMA)** *(ny — hög prio inom fasen)* — dagsvikt svänger ±1–2 kg på vatten och salt. Visa ett exponentiellt glidande medel som huvudsiffra/kurva så att vikt-sparklinen och "−0,3 / 7d"-deltat blir trovärdiga istället för brus. Liten matte, stor skillnad på den enskilt mest motiverande siffran i appen. `S`–`M`
- [ ] **Veckosammanfattning i text** — "Du åt 340 kcal över mål 4 av 7 dagar." Beräknas från `track3r_days`. `M`
- [ ] **Trendinsikter** — snittprotein vs mål, viktstrend (riktning + hastighet, ovanpå EMA), längsta streak (efter fix i Fas 0.5). `M`
- [ ] **"Förra veckan vs denna vecka"-vy** — jämförelsekort överst i historiken. `M`
- [ ] **Siffror i kalendern** — visa faktiska värden (kcal, steg) vid hover/tap, inte bara prickar. `S`
- [ ] **Dagssammanfattning utan att byta datum** — tap på en dag → popover med dagens totaler. `S`

---

## Fas 3 — PWA & retention (gör den till en daglig vana)

> **Passera säkerhetsgrinden först** (se rutan högst upp). Denna fas ökar både mängden känslig data och antalet användare — det är exakt fel läge att fortfarande ha en öppen databas.

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

> **Min lutning: Väg B.** Målanvändaren har ett *fast* schema — inte en progressiv-överbelastnings-optimerare (det är en Strong/Hevy-användare, en annan produkt). Lägg energin på nutrition där friktionen faktiskt sitter. Välj Väg A bara om detaljerad styrkeprogression är ett uttalat personligt mål för dig.

---

## Fas 5 — Automatisk datainsamling (ta bort manuell inmatning av mätvärden)

- [ ] **Steg-synk, iOS** — guide för Siri Shortcut som pushar dagliga steg till ett endpoint. `M`
- [ ] **Steg-synk, Android** — **Health Connect** (Google Fit-API:erna fasas ut — bygg inte mot dem). `L`
- [ ] **Beslut: behåll eller ta bort manuell stegmätning** — om ingen synk byggs, ta bort funktionen hellre än att låta den vara tom. `S`

---

## Fas 6 — AI-funktioner (matchar "AI Labb"-identiteten + differentierar)

> **Omprioriterad.** Naturlig-språks-inmatningen är inte en "till sist"-feature — det är din enda riktiga differentiator och den löser hemlagat-halvan av matfriktionen. **Överväg att bygga den i Fas 1-tidsfönstret, före OFF/streckkod** (se noten i Fas 1). Reliabilitetsinvändningen (svårt att gissa portionsstorlek) är mildrad av att användaren alltid bekräftar/justerar de förifyllda värdena — det är en estimator, inte ett orakel, och en grov förifyllning slår att skriva fyra siffror från noll.

- [ ] **Naturlig-språksinmatning** — "Jag åt en tallrik pasta" → Claude estimerar kcal/P/C/F → förifyller måltidsmodalen (redigerbart). Löser inmatningsfriktion + är en unik feature. `L`
- [ ] **Målvalidering** — engångskoll "är ditt kalorimål rimligt givet vikt & aktivitet?". *(Notera: detta är en engångskoll. Verkligt adaptiva mål som löpande justeras efter vikttrenden — MacroFactors hela pitch — är ett större produktbeslut. Lägg in som eget spår om du vill dit.)* `M`
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

- [ ] **Riktig auth** *(ny — saknades i originalet)* — ersätt PIN-teatern med Supabase Auth (magic link / e-post). RLS per rad *kräver* detta; utan riktig identitet finns inget `auth.uid()` att scopa mot. `M`
- [ ] **Riktig RLS per rad** — ersätt de permissiva `using(true)`-policyerna med profil-/uid-scopad åtkomst. Stänger både läs-hålet (integritet) och skriv-hålet (vem som helst kan radera all data). `M`

**Senare hårdning:**

- [ ] **Samtyckes-/integritetstext** — för hälsodata under GDPR (art. 9). `S`
- [ ] **Audit av anon-nyckel-exponering** — bedöm risk, överväg edge functions för känsliga operationer. `M`

---

## Snabb prioriteringsöversikt (uppdaterad)

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

## Ändringslogg (rev. 1 → rev. 2)

- **Säkerhet flyttad från Fas 8-"sen" till en grind** före Fas 3 och före någon annan verklig användare. Lade till **riktig auth** som eget item (saknades helt — RLS utan auth är bara en halv fix). Förtydligade att hålet är både läs *och* skriv (vem som helst kan radera all data, inte bara läsa den).
- **Ny Fas 0.5** med buggfixar på befintlig kod: streak-logiken (tränar under-loggning), makro-sanity-check (4/4/9), tidszonssäkra datumnycklar.
- **Fas 1 omordnad** — kopiera-gårdagen + senast-använda + favoriter (billiga, `S`/`M`) först; Open Food Facts + streckkod (`L`) sist. Lade till "kopiera gårdagen" som saknades. Onboarding fick TDEE-förslag.
- **AI-matinmatning uppgraderad i prioritet** (Fas 6) med rekommendation att bygga före OFF/streckkod, eftersom målanvändaren är hemmakock. Lade till reliabilitets-mitigeringen (användaren bekräftar förifyllningen).
- **EMA-trendvikt** tillagd i Fas 2 (fixar att rå dagsvikt är brus, inte signal).
- **Fas 0** fick ett en-eller-flera-användare-beslut (hubben är redan byggd multi-user, vilket originalet inte erkände).
- **Fas 4** fick en uttalad lutning mot Väg B (målanvändaren har fast schema).
- **Fas 5/6** smärre korrigeringar: Health Connect framför döende Google Fit-API:er; målvalidering förtydligad som engångskoll vs verkligt adaptiva mål.
- **Prioriteringstabellen** omskriven för att matcha ovan.
