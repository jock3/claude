# MÄRKE — brand brief

> Självständigt dokument. Alla tokens och specifikationer är inbakade här.
> Inga externa filer behövs. Claude Code bygger allt från detta.

---

## 1. Brand i en mening

Avskalad hudvård för män som vill ha en rutin, inte ett mirakel. Få produkter,
inga löften, fokus på material och vana. **Mindre, men bättre.**

---

## 2. Målgrupp

Män 28–45 som vill sköta huden men skräms bort av antingen den rosa
"beauty"-koden eller den skrikiga "MEN'S FUEL FORMULA"-machokoden. Vill ha
något vuxet, diskret och självsäkert — apotek möter designstudio.

---

## 3. Personlighet

Stram · taktil · lågmäld · vuxen · dyr-med-minimala-medel

---

## 4. Röst & tonfall

Kort, faktiskt, utan adjektivinflation. Säg vad produkten gör, inte vad du borde
känna. Torrt och självsäkert. Aldrig peppig.

**Gör:** "Tvätt. Tar bort dagen. Inget mer."
**Undvik:** "Revolutionera din hudvårdsrutin!"
**Tagline:** *Mindre, men bättre.*

---

## 5. Färgsystem

```css
:root {
  /* Kärna */
  --ben:    #ECE6DA;   /* primär bakgrund / papper */
  --kol:    #191714;   /* text / ink */
  --lera:   #9E4E3D;   /* SIGNATUR – terrakotta. Accent, aldrig brödtext */

  /* Neutraler */
  --sand:   #D8CDBC;   /* sekundär yta */
  --taupe:  #8C8174;   /* dämpad text, etikett-microcopy */
  --linje:  #C9BEAD;   /* hårfina avgränsare */

  /* Produktkodning */
  --p-tvatt:  #7C857A; /* Tvätt  – salvia  */
  --p-fukt:   #C7A98A; /* Fukt   – sand    */
  --p-serum:  #9E4E3D; /* Serum  – lera (signatur) */
  --p-balm:   #44505A; /* Balm   – skiffer */

  /* Typografi */
  --font-display: "Fraunces", Georgia, serif;
  --font-body:    "Archivo", system-ui, sans-serif;

  --tracking-label:   0.20em;
  --tracking-eyebrow: 0.18em;

  --t-display: clamp(2.75rem, 6vw, 4.5rem);
  --t-h2:      clamp(1.75rem, 3.5vw, 2.5rem);
  --t-h3:      1.375rem;
  --t-body:    1.0625rem;
  --t-label:   0.7rem;

  --leading-body:  1.65;
  --leading-tight: 1.1;

  /* Layout */
  --space-2: 1rem;
  --space-3: 2rem;
  --space-4: 4rem;
  --space-5: 8rem;
  --radius:  2px;
  --maxw:    1100px;
}
```

**a11y:** `--lera` mot `--ben` är nära kontrastgränsen — brödtext ska alltid vara
`--kol`. Lera används till accenter, stor display och knappar.

---

## 6. Typografi

Fonter via Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Archivo:wght@400;500;600&display=swap" rel="stylesheet">
```

- **Display / rubriker:** Fraunces, vikt 500–600, tracking -0.01em
- **Brödtext / UI:** Archivo, vikt 400–500
- **Etiketter / eyebrows:** Archivo VERSALER, tracking 0.18–0.20em, vikt 600

---

## 7. Logotyp & märke

**Ordmärke:** "märke" i Fraunces 500, gemener, tracking -0.01em.

**Märket:** En monoline sigill-ikon — ett cirkulärt sigillring med ett stiliserat M
inuti. M:et formas av två vertikala streck och en V-spets som pekar nedåt.
Monoline, ingen fyllning, samma linjevikt genomgående. Tänk vaxsigill /
tillverkarstämpel — lämpat för deboss/foil. Ska fungera i enfärgat.
Implementeras som inline SVG i HTML med `currentColor` så det tinar i
valfri brandfärg.

**Lockup:** märke till vänster om ordmärket, eller märke centrerat ovanför.
**Frizon:** minst sigillets diameter runt om.

---

## 8. Produktsystem

Fyra produkter, korta svenska substantiv. Differentieras av en tyst accentton
per produkt — inte av olika design.

| Produkt | Funktion | Volym | Accentfärg |
|---|---|---|---|
| Tvätt | Rengöring | 100 ML | `#7C857A` (salvia) |
| Fukt | Fuktkräm | 75 ML | `#C7A98A` (sand) |
| Serum | Koncentrat | 30 ML | `#9E4E3D` (lera — hjälteprodukt) |
| Balm | Efter rakning | 75 ML | `#44505A` (skiffer) |

**Etikett-anatomi (uppifrån):** sigillmärke · produktnamn i Fraunces stort ·
tunn accentregel · funktion i Archivo VERSALER tiny · accentprick + volym nere.

---

## 9. VAD CLAUDE CODE SKA BYGGA

En **digital brand-manual / showcase-sida** (one-pager) som visar hela systemet.

**Stack:** Ren statisk sida, vanilla HTML + CSS. Ingen build-step. Deploybar
till GitHub Pages. Fraunces + Archivo via Google Fonts `<link>`. Ljust tema.
Mobilanpassad med clamp-skala. En koreograferad page-load med staggrade reveals.
Återhållsamt med rörelse — elegansen ligger i precision.

**Sektioner i ordning:**

1. **Hero** — märke + "märke" ordmärke stort i Fraunces + *Mindre, men bättre.*
   Generös frizon, domineras av tomrum.
2. **Idén** — positioneringen i ett stycke.
3. **Färg** — swatch-rutor: namn, hex, roll. Lera lyft som hjältefärg.
4. **Typografi** — specimen: Fraunces-rubrik + Archivo-brödtext + etikett-stil.
5. **Logotyp & märke** — sigillet stort som inline SVG, lockup-varianter, frizon-demo.
6. **Röst** — gör/undvik som två kolumner.
7. **Produktlinjen** — fyra flata stiliserade mockups (CSS/HTML, inte fotoreal)
   med etikett-anatomi och varje produkts accentton applicerad.
8. **Förpackning** — en illustrativ tub + kartong i CSS, präglat märke antytt
   med subtil skugga.
9. **Footer** — ordmärket + "Konceptarbete".

**Tekniska krav:**
- CSS-tokens i `:root` (se sektion 5 ovan).
- Märket kodas som inline SVG direkt i HTML med `currentColor`.
- Filstruktur: `index.html` + `styles.css` i roten. Inga externa assets.
- Mjuka hover-states, staggrade load-animationer, annars ingen rörelse.

---

## 10. Klistra in detta i Claude Code

```
Bygg en statisk one-page brand-manual för hudvårdsmärket "Märke" enligt
detta brief. Inga externa filer — allt byggs från specen.

Krav:
- Vanilla HTML + CSS, ingen build-step, deploybar till GitHub Pages.
- Fraunces + Archivo via Google Fonts (länk i sektion 6).
- CSS-tokens från sektion 5 i :root i styles.css.
- Ljust tema: --ben bakgrund, --kol text, --lera som signaturaccent.
- Märket kodas som inline SVG (monoline M i sigillring, currentColor).
- Stram, editorial, generöst med tomrum. En page-load med staggrade
  reveals. Inga onödiga effekter.
- Bygg sektionerna i ordningen i sektion 9.
- Produkt-mockups = flata CSS/HTML-illustrationer med etikett-anatomin
  och respektive accentton.
- Mobilanpassad. Filerna index.html + styles.css i roten.

Börja med index.html + styles.css. Visa resultatet, sen itererar vi.
```
