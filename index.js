const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Konfigurera OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Läs in samtliga bildfiler i "images"-mappen
const imagesDir = path.join(__dirname, 'images');
let imageFiles = fs.readdirSync(imagesDir).filter(file => {
    return ['.png', '.jpg', '.jpeg', '.gif'].includes(path.extname(file).toLowerCase());
});

processImages();

// Generera alt-texter för bilderna och logga resultaten
async function processImages() {
    console.log("Processing images for alt text generation...");
    const altTexts = await generateAltTexts(imageFiles);
    console.log("\n\n\nGenerated Alt Texts:");
    console.log(altTexts);

    // Skriv till en JSON-fil
    const outputPath = path.join(__dirname, 'alt_texts.json');
    fs.writeFileSync(outputPath, JSON.stringify(altTexts, null, 2));
    console.log(`Alt texts written to ${outputPath}`);

    // Avsluta servern efter bearbetning
    process.exit(0);
}

// Skicka bildfilerna till OpenAI för att generera alt-text
async function generateAltTexts(imageArr) {
    console.log("Generating alt texts for images..." + imageArr.join(", "));

    // Skapa alla promises samtidigt
    const promises = imageArr.map(async (file) => {
        const filePath = path.join(imagesDir, file);
        const fileData = fs.readFileSync(filePath);
        const base64Image = fileData.toString('base64');

        const ext = path.extname(file).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Gör en detaljerad analys över vad bilden föreställer och ge en tydlig beskrivning.
                                - Beskrivningen skall vara på svenska.
                                - Beskriv tydligt vad bilden föreställer, hur många och vilka personer som är med, deras klädsel, bakgrund, miljö och eventuella känslor som förmedlas.
                                - Gör en bedömning i kvalitet av bilden och nämn eventuella brister som suddighet, dålig belysning eller andra faktorer som påverkar bildens tydlighet.
                                - I slutet av texten ge bilden ett betyg från 1-10 baserat på dess kvalitet och tydlighet.`
                            },
                            {
                                type: "image_url",
                                image_url: { url: `data:${mimeType};base64,${base64Image}` }
                            }
                        ]
                    }
                ],
                max_tokens: 500
            });

            const altText = response.choices[0].message.content;
            console.log(`Generated alt text for ${file}: ${altText}`);

            return {
                filename: file,
                description: altText
            };
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
            return {
                filename: file,
                description: null,
                error: error.message
            };
        }
    });

    // Vänta på att alla är klara
    const altTexts = await Promise.all(promises);
    return altTexts;
}