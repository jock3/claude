# Track3r — Roadmap till den perfekta appen

> Från visuellt skal → daglig vana. Faserna är ordnade efter värde/friktion-kvot:
> det som tar bort mest användarfriktion per nedlagd timme kommer först.
>
> **Legend:** Effort `S` = timmar · `M` = en dag · `L` = flera dagar · `XL` = vecka+
> Status: `[ ]` ej påbörjad · `[~]` pågår · `[x]` klar

---

## Fas 0 — Fundament & beslut (gör först, blockerar resten)

Strategiska beslut som styr allt annat. Inget byggande förrän dessa är tagna.

- [ ] **Bestäm produktidentitet** — experiment i "AI Labb" eller fristående produkt? Avgör domän, säkerhetskrav och marknadsföring. `S`
- [ ] **Definiera målanvändaren** — låsa positioneringen till "repetitiv ätare + fast träningsschema som vill ha clean export & insikter". Allt nedan optimeras för den nischen. `S`
- [ ] **GDPR-ställningstagande** — hälsodata är särskild kategori (art. 9). Dokumentera nuvarande modell och risknivå. Om appen ska växa: plan för riktig RLS per rad + samtycke. `S`
- [ ] **Mobil-först-beslut** — bekräfta att Track3r byggs mobile-first (till skillnad från övriga sajten). Styr all UI nedan. `S`

---

## Fas 1 — Ta bort inmatningsfriktionen (högst ROI)

Detta är skillnaden mellan en app folk slutar använda efter 3 dagar och en de behåller.

- [ ] **Onboarding-flöde** — första gången: kort guide "Sätt dina mål för att komma igång", förifyll rimliga default-värden. `M`
- [ ] **Open Food Facts-sök** — integrera öppna API:t (gratis, ~3M produkter, svenska livsmedel). Sökfält i måltidsloggen som autofyller makros. `L`
- [ ] **Streckkodsskanning** — `BarcodeDetector` API via webbkameran → slå upp i Open Food Facts. Fallback för iOS Safari (saknar BarcodeDetector). `L`
- [ ] **Sparade måltider / favoriter** — ny kolumn/tabell `track3r_favorites`. "Lägg till senaste" och "mina måltider" så återkommande mat loggas med ett klick. `M`
- [ ] **Senast använda livsmedel** — auto-lista de N senaste loggade posterna för snabb återanvändning. `S`

---

## Fas 2 — Insiktslager (gör data till värde, ingen AI krävs)

Allt detta är ren aggregering av data som redan finns i Supabase.

- [ ] **Veckosammanfattning i text** — "Du åt 340 kcal över mål 4 av 7 dagar." Beräknas från `track3r_days`. `M`
- [ ] **Trendinsikter** — snittprotein vs mål, viktstrend (riktning + hastighet), längsta streak. `M`
- [ ] **"Förra veckan vs denna vecka"-vy** — jämförelsekort överst i historiken. `M`
- [ ] **Siffror i kalendern** — visa faktiska värden (kcal, steg) vid hover/tap, inte bara prickar. `S`
- [ ] **Dagssammanfattning utan att byta datum** — tap på en dag → popover med dagens totaler. `S`

---

## Fas 3 — PWA & retention (gör den till en daglig vana)

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

---

## Fas 5 — Automatisk datainsamling (ta bort manuell inmatning av mätvärden)

- [ ] **Steg-synk, iOS** — guide för Siri Shortcut som pushar dagliga steg till ett endpoint. `M`
- [ ] **Steg-synk, Android** — Google Fit-integration eller Health Connect. `L`
- [ ] **Beslut: behåll eller ta bort manuell stegmätning** — om ingen synk byggs, ta bort funktionen hellre än att låta den vara tom. `S`

---

## Fas 6 — AI-funktioner (matchar "AI Labb"-identiteten + differentierar)

- [ ] **Naturlig-språksinmatning** — "Jag åt en tallrik pasta" → Claude estimerar makros → förifyller måltid. Löser inmatningsfriktion + är en unik feature. `L`
- [ ] **Målvalidering** — "Baserat på vikt & aktivitet, är ditt kalorimål rimligt?" `M`
- [ ] **AI-genererad veckorapport** — naturligt språk ovanpå insiktslagret från Fas 2. `M`

---

## Fas 7 — Export & portabilitet (gör styrkan till en säljpunkt)

- [ ] **JSON-export** — strukturerat format andra appar kan läsa in. `S`
- [ ] **Apple Health / Google Fit-export** — kompatibelt format. `L`
- [ ] **Lyft fram export i UI** — gör dataportabilitet till en synlig feature, inte gömd i en modal. `S`

---

## Fas 8 — Säkerhet & hårdning (innan eventuell tillväxt)

- [ ] **Riktig RLS per rad** — ersätt permissiva policies med profile-scoped åtkomst. `M`
- [ ] **Samtyckes-/integritetstext** — för hälsodata under GDPR. `S`
- [ ] **Audit av anon-nyckel-exponering** — bedöm risk, överväg edge functions för känsliga operationer. `M`

---

## Snabb prioriteringsöversikt

| Om du bara har... | Gör detta |
|---|---|
| **En helg** | Onboarding + Open Food Facts-sök (Fas 1) |
| **En vecka** | Fas 1 komplett + insiktstext (Fas 2) |
| **En månad** | Fas 1–3: matsök, insikter, PWA — appen blir en daglig vana |
| **Ett kvartal** | Lägg till AI-inmatning (Fas 6) och träningsbeslut (Fas 4) → genuint differentierad produkt |

**Den enda regeln:** bygg inte bredd innan Fas 1 är klar. Matsök > allt annat.
