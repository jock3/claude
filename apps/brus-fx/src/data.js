// BRUS — mockdata + kontrastmotor.
// Tärningen optimerar för avstånd, inte likhet.

export const SPAR = [
  { id: 't1',  titel: 'VAGUE CHALEUR',            artist: 'ORCHESTRE KARUKERA',        ar: 1984, genre: 'ZOUK',             ursprung: 'GUADELOUPE', langdSek: 245, kuratorId: 'k3', kommentar: 'Inspelad i en hotellobby i Pointe-à-Pitre. Hör du glasen? De är med i mixen.' },
  { id: 't2',  titel: 'AUTOBAHNKIND',             artist: 'KLUSTER WEST',              ar: 1974, genre: 'KRAUTROCK',        ursprung: 'TYSKLAND',   langdSek: 512, kuratorId: 'k1', kommentar: 'Åtta minuter rakt fram. Ingen refräng. Det är poängen.' },
  { id: 't3',  titel: 'SISTA DANSEN I HAPARANDA', artist: 'LASSE LINDKVISTS ORKESTER', ar: 1976, genre: 'DANSBAND',         ursprung: 'SVERIGE',    langdSek: 198, kuratorId: 'k1', kommentar: 'Ironi? Nej. Det här är ärligare än din spellista.' },
  { id: 't4',  titel: 'GHOST CLAP 160',           artist: 'DJ MARROW',                 ar: 2013, genre: 'FOOTWORK',         ursprung: 'USA',        langdSek: 187, kuratorId: 'k2', kommentar: '160 BPM från Chicago. Dansa eller flytta på dig.' },
  { id: 't5',  titel: 'UMZANSI PRESSURE',         artist: 'DLAMINI X',                 ar: 2018, genre: 'GQOM',             ursprung: 'SYDAFRIKA',  langdSek: 224, kuratorId: 'k2', kommentar: 'Durban-bas som låter som en hiss som faller. Med flit.' },
  { id: 't6',  titel: 'ETENRAKU-FRAGMENT',        artist: 'HOVENSEMBLEN NARA',         ar: 1962, genre: 'GAGAKU',           ursprung: 'JAPAN',      langdSek: 421, kuratorId: 'k4', kommentar: 'Tusen år gammal hovmusik. Din "old school" är från 2009.' },
  { id: 't7',  titel: 'DRY COUNTY MOAN',          artist: 'REVEREND OAKLEY',           ar: 1932, genre: 'DELTA BLUES',      ursprung: 'USA',        langdSek: 174, kuratorId: 'k1', kommentar: 'En mikrofon, en veranda, 1932. Mer lo-fi än din lo-fi.' },
  { id: 't8',  titel: 'CUMBIA DEL RÍO NEGRO',     artist: 'LOS HERMANOS PÁRAMO',       ar: 1968, genre: 'CUMBIA',           ursprung: 'COLOMBIA',   langdSek: 213, kuratorId: 'k3', kommentar: 'Dragspelet är ostämt. De visste. De spelade ändå.' },
  { id: 't9',  titel: 'FROSTMARK',                artist: 'AVGRUNDSTRON',              ar: 1994, genre: 'BLACK METAL',      ursprung: 'NORGE',      langdSek: 367, kuratorId: 'k1', kommentar: 'Inspelad i en lada i Telemark. Produktionen ÄR budskapet.' },
  { id: 't10', titel: 'ECHO CHAMBER POLICY',      artist: 'KING FATHOM',               ar: 1977, genre: 'DUB',              ursprung: 'JAMAICA',    langdSek: 296, kuratorId: 'k2', kommentar: 'Mixerbordet är instrumentet. Allt annat är råmaterial.' },
  { id: 't11', titel: 'ACCRA MIDNIGHT TAXI',      artist: 'OSEI & THE EVENING STARS',  ar: 1971, genre: 'HIGHLIFE',         ursprung: 'GHANA',      langdSek: 254, kuratorId: 'k3', kommentar: 'Gitarrerna ler. Du kommer också göra det. Motvilligt.' },
  { id: 't12', titel: 'NEON AUTOSTRADA',          artist: 'VALENTINA VOLT',            ar: 1983, genre: 'ITALO DISCO',      ursprung: 'ITALIEN',    langdSek: 312, kuratorId: 'k2', kommentar: 'Syntarna kostade mer än bilen på omslaget. Rätt prioriterat.' },
  { id: 't13', titel: 'CHIGEE WIND',              artist: 'ALTAN KHÜÜ',                ar: 1996, genre: 'STRUPSÅNG',        ursprung: 'MONGOLIET',  langdSek: 268, kuratorId: 'k4', kommentar: 'En människa. Två toner samtidigt. Din autotune skäms.' },
  { id: 't14', titel: 'GONG SARI AGUNG',          artist: 'GAMELANENSEMBLEN UBUD NORD',ar: 1958, genre: 'GAMELAN',          ursprung: 'INDONESIEN', langdSek: 389, kuratorId: 'k4', kommentar: 'Det här är inte ostämt. Du lyssnar med fel öron.' },
  { id: 't15', titel: 'UTBROTT NR 9',             artist: 'GUNNEL AXELSSON KVARTETT',  ar: 1969, genre: 'FREE JAZZ',        ursprung: 'SVERIGE',    langdSek: 433, kuratorId: 'k1', kommentar: 'Saxofonen grälar med trummorna i sju minuter. Ingen vinner. Alla vinner.' },
  { id: 't16', titel: 'KÄLLARVALVENS KRÖNIKA',    artist: 'GRIFTESKUGGA',              ar: 2021, genre: 'DUNGEON SYNTH',    ursprung: 'FINLAND',    langdSek: 344, kuratorId: 'k1', kommentar: 'Gjord i en studentkorridor i Uleåborg. Låter som 1387.' },
  { id: 't17', titel: 'FAVELA VOLTAGEM',          artist: 'MC PIRANHA',                ar: 2019, genre: 'BAILE FUNK',       ursprung: 'BRASILIEN',  langdSek: 158, kuratorId: 'k2', kommentar: 'Basen är distad för att högtalarna var det. Funktion före form.' },
  { id: 't18', titel: 'LA DERNIÈRE CIGARETTE',    artist: 'MARGUERITE NOIR',           ar: 1959, genre: 'CHANSON',          ursprung: 'FRANKRIKE',  langdSek: 201, kuratorId: 'k3', kommentar: 'Hon röker, hon sörjer, hon vinner. Tre minuter teater.' },
  { id: 't19', titel: 'ÉTUDE POUR PORTES',        artist: 'ATELIER 12',                ar: 1952, genre: 'MUSIQUE CONCRÈTE', ursprung: 'FRANKRIKE',  langdSek: 287, kuratorId: 'k4', kommentar: 'Dörrar, bandspelare, sax. Sampling fanns före din laptop.' },
  { id: 't20', titel: 'GLITTERKRASCH',            artist: 'SOCKERCHOCK99',             ar: 2024, genre: 'HYPERPOP',         ursprung: 'SVERIGE',    langdSek: 142, kuratorId: 'k2', kommentar: 'Som att äta hela godispåsen och kvittot. 2 minuter 22 sekunder.' },
  { id: 't21', titel: 'SOWETO SLOWDOWN',          artist: 'BRA VUSI',                  ar: 1997, genre: 'KWAITO',           ursprung: 'SYDAFRIKA',  langdSek: 276, kuratorId: 'k3', kommentar: 'House på halv hastighet, självförtroende på dubbel.' },
  { id: 't22', titel: 'BOZKIR YANIYOR',           artist: 'DERVİŞ EKSPRES',            ar: 1972, genre: 'ANATOLISK PSYCH',  ursprung: 'TURKIET',    langdSek: 263, kuratorId: 'k3', kommentar: 'Elgitarr möter saz. Elgitarren förlorar. Med stil.' },
  { id: 't23', titel: 'STILLHET 4: MASKINRUM',    artist: 'ANNA HAV',                  ar: 2016, genre: 'DRONE',            ursprung: 'SVERIGE',    langdSek: 587, kuratorId: 'k4', kommentar: 'Tio minuter av ett ackord som långsamt ändrar sig. Eller är det du som ändras?' },
  { id: 't24', titel: 'SAYONARA PIER',            artist: 'FUYUMI KAZE',               ar: 1981, genre: 'ENKA',             ursprung: 'JAPAN',      langdSek: 252, kuratorId: 'k4', kommentar: 'Japansk hjärtesorg i tre verser. Du förstår inte orden. Du förstår allt.' },
];

export const KURATORER = [
  {
    id: 'k1', namn: 'MAJVOR EK', plats: 'KIRUNA',
    manifest: 'Allt bra ljud är inspelat för nära mikrofonen.',
    stacks: [
      { namn: 'KÄLLARBAND',      sparIds: ['t2', 't9', 't16'] },
      { namn: 'SVETT & TRÄGOLV', sparIds: ['t3', 't7', 't15'] },
    ],
  },
  {
    id: 'k2', namn: 'DIDIER N’GOMA', plats: 'PARIS',
    manifest: 'Jag litar inte på refränger.',
    stacks: [
      { namn: 'BASEN BESTÄMMER', sparIds: ['t5', 't10', 't17'] },
      { namn: '160 PLUS',        sparIds: ['t4', 't20'] },
      { namn: 'NEON',            sparIds: ['t12'] },
    ],
  },
  {
    id: 'k3', namn: 'ROSA QUINTERO', plats: 'BOGOTÁ',
    manifest: 'Rytm är ett språk. Ni viskar.',
    stacks: [
      { namn: 'TRÄBLÅS & TÅRAR', sparIds: ['t18', 't8'] },
      { namn: 'GULDÅLDRAR',      sparIds: ['t1', 't11', 't21', 't22'] },
    ],
  },
  {
    id: 'k4', namn: 'HARUKI SATO', plats: 'OSAKA',
    manifest: 'Tystnaden mellan tonerna är också min.',
    stacks: [
      { namn: 'LÅNGSAMT FALL',   sparIds: ['t23', 't14', 't6'] },
      { namn: 'RÖSTER UTAN ORD', sparIds: ['t13', 't19', 't24'] },
    ],
  },
];

export const NUMMER = [
  {
    nr: 24, vecka: 23,
    tema: 'KROPPEN FÖRST. ÅSIKTER SEN.',
    ledare:
      'Sju spår som inte frågar vad du tycker. De frågar om du kan stå still. ' +
      'Det kan du inte. Ett dansgolv är ett dansgolv, oavsett om det ligger i ' +
      'Durban, Pointe-à-Pitre eller Folkets hus i Sveg. Veckans nummer går från ' +
      '1968 till 2019 utan att be om ursäkt för något av åren.',
    sparIds: ['t5', 't1', 't17', 't4', 't12', 't21', 't3'],
    last: false,
  },
  {
    nr: 23, vecka: 22,
    tema: 'INGEN REFRÄNG.',
    ledare:
      'Refrängen är ett löfte om att inget nytt ska hända. Det här numret ' +
      'bryter löftet. Sex spår utan krokar. Bara riktningar.',
    sparIds: ['t2', 't15', 't23', 't10', 't19', 't14'],
    last: true,
  },
];

// ---------- hjälpare ----------

export const sparMedId = (id) => SPAR.find((s) => s.id === id);
export const kuratorMedId = (id) => KURATORER.find((k) => k.id === id);

export const dekad = (ar) => Math.floor(ar / 10) * 10;
export const dekadLabel = (ar) => `${dekad(ar)}-TAL`;

export const tid = (sek) => {
  const s = Math.max(0, Math.floor(sek));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export const profilFranSpar = (spar) => ({
  genre: spar.genre,
  dekad: dekad(spar.ar),
  ursprung: spar.ursprung,
  label: `${spar.genre} / ${dekadLabel(spar.ar)} / ${spar.ursprung}`,
});

// ---------- kontrastmotor ----------
// Poäng 0–100: genre olik = 40, ursprung olikt = 30,
// decennier emellan = 6 per decennium (max 30).

export function kontrastPoang(fran, spar) {
  const genre = !fran.genre || fran.genre !== spar.genre ? 40 : 0;
  const ursprung = !fran.ursprung || fran.ursprung !== spar.ursprung ? 30 : 0;
  const decennium =
    fran.dekad == null
      ? 30
      : Math.min(Math.abs(dekad(spar.ar) - fran.dekad) / 10, 5) * 6;
  return {
    poang: Math.round(genre + ursprung + decennium),
    delar: { genre, decennium: Math.round(decennium), ursprung },
  };
}

// Viktad slump mot störst avstånd. poang^3 gör att tärningen
// nästan alltid landar långt bort — men inte alltid. Det är en tärning.
export function kastTarning(franSpar) {
  const kandidater = SPAR.filter((s) => !franSpar || s.id !== franSpar.id);
  if (!franSpar) {
    const spar = kandidater[Math.floor(Math.random() * kandidater.length)];
    return { spar, kontrast: { poang: 100, delar: null, fran: null } };
  }
  const fran = profilFranSpar(franSpar);
  const vagda = kandidater.map((s) => {
    const k = kontrastPoang(fran, s);
    return { s, k, vikt: Math.pow(k.poang, 3) + 1 };
  });
  const total = vagda.reduce((sum, v) => sum + v.vikt, 0);
  let r = Math.random() * total;
  let vald = vagda[vagda.length - 1];
  for (const v of vagda) {
    r -= v.vikt;
    if (r <= 0) { vald = v; break; }
  }
  return { spar: vald.s, kontrast: { ...vald.k, fran } };
}

// ---------- BYT SPÅR: tolka fritext till en profil ----------

const GENRE_ALIAS = [
  'INDIE-POP', 'INDIEPOP', 'INDIE', 'SYNTHPOP', 'HYPERPOP', 'K-POP', 'KPOP', 'POP',
  'HIP-HOP', 'HIPHOP', 'RAP', 'TRAP', 'R&B', 'RNB', 'SOUL', 'FUNK',
  'HÅRDROCK', 'POSTPUNK', 'POST-PUNK', 'PUNK', 'ROCK', 'METAL',
  'TECHNO', 'HOUSE', 'EDM', 'DISCO', 'AMBIENT', 'LO-FI', 'LOFI',
  'SCHLAGER', 'VISA', 'FOLK', 'COUNTRY', 'REGGAE', 'JAZZ', 'BLUES',
  'KLASSISKT', 'OPERA', 'SINGER-SONGWRITER',
];

const URSPRUNG_ALIAS = {
  SVERIGE: ['SVERIGE', 'SVENSK', 'STOCKHOLM', 'GÖTEBORG', 'MALMÖ'],
  USA: ['USA', 'AMERIKA', 'AMERIKANSK'],
  STORBRITANNIEN: ['STORBRITANNIEN', 'ENGLAND', 'BRITTISK', 'LONDON', 'UK'],
  JAPAN: ['JAPAN', 'JAPANSK', 'TOKYO'],
  TYSKLAND: ['TYSKLAND', 'TYSK', 'BERLIN'],
  FRANKRIKE: ['FRANKRIKE', 'FRANSK', 'PARIS'],
  NORGE: ['NORGE', 'NORSK', 'OSLO'],
  SYDKOREA: ['SYDKOREA', 'KOREA', 'KOREANSK', 'SEOUL'],
};

export function profilFranText(text) {
  const T = ` ${text.toUpperCase().trim()} `;

  let genre = null;
  const kandidatGenrer = [
    ...SPAR.map((s) => s.genre),
    ...GENRE_ALIAS,
  ].sort((a, b) => b.length - a.length);
  for (const g of kandidatGenrer) {
    if (T.includes(g)) { genre = g; break; }
  }

  let dekadVarde = null;
  const ar4 = T.match(/(19|20)\d{2}/);
  if (ar4) {
    dekadVarde = dekad(parseInt(ar4[0], 10));
  } else {
    const tal2 = T.match(/(\d{2})\s?-?\s?TAL/);
    if (tal2) {
      const n = parseInt(tal2[1], 10);
      dekadVarde = n <= 20 ? 2000 + n : 1900 + n;
    }
  }

  let ursprung = null;
  const alleUrsprung = {
    ...URSPRUNG_ALIAS,
    ...Object.fromEntries(SPAR.map((s) => [s.ursprung, [s.ursprung]])),
  };
  ytter: for (const [namn, alias] of Object.entries(alleUrsprung)) {
    for (const a of alias) {
      if (T.includes(a)) { ursprung = namn; break ytter; }
    }
  }

  // Inget igenkänt men något skrivet: första biten blir "genren".
  if (!genre && dekadVarde == null && !ursprung && text.trim()) {
    genre = text.trim().split(',')[0].toUpperCase().slice(0, 24);
  }

  const delar = [
    genre,
    dekadVarde != null ? `${dekadVarde}-TAL` : null,
    ursprung,
  ].filter(Boolean);

  return {
    genre, dekad: dekadVarde, ursprung,
    tom: delar.length === 0,
    label: delar.length ? delar.join(' / ') : 'OKÄNT / OKÄNT / OKÄNT',
  };
}

// Motsatt riktning: högsta kontrast mot profilen, slumpat bland toppskiktet.
export function bytSpar(profil) {
  const poangsatta = SPAR
    .map((s) => ({ s, k: kontrastPoang(profil, s) }))
    .sort((a, b) => b.k.poang - a.k.poang);
  const topp = poangsatta.slice(0, 4);
  const vald = topp[Math.floor(Math.random() * topp.length)];
  return { spar: vald.s, kontrast: { ...vald.k, fran: profil } };
}
