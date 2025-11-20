# Generate Alt Text

Ett Node.js-verktyg som automatiskt genererar svenska alt-texter för bilder med hjälp av OpenAI:s GPT-4o.

## Funktioner

- Bearbetar alla bilder i `images`-mappen
- Genererar koncisa, beskrivande alt-texter på svenska (max 125 tecken)
- Sparar resultaten i `alt_texts.json`
- Stöder PNG, JPG, JPEG och GIF

## Installation

1. Klona projektet
2. Installera beroenden:
```bash
npm install
```

3. Döp om `.env.example` till `.env` och lägg till din OpenAI API-nyckel:
```
OPENAI_API_KEY=din-api-nyckel-här
```

## Användning

1. Lägg dina bilder i mappen `images/`
2. Kör skriptet:
```bash
npm start
```

eller i utvecklingsläge:
```bash
npm run dev
```

3. Resultaten sparas i `alt_texts.json`

## Output

Filen `alt_texts.json` innehåller en lista med objekt:
```json
[
  {
    "filename": "bild.jpg",
    "altText": "Beskrivning av bilden"
  }
]
```

## Krav

- Node.js
- OpenAI API-nyckel

## Beroenden

- express - Webbserver
- openai - OpenAI API-klient
- multer - Filuppladdning
- sharp - Bildbehandling
- dotenv - Miljövariabler

## Av
Mattias Dahlgren, 2025, mattias.dahlgren@miun.se
