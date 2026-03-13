import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

import createRouter from './routes/index.js';


const app = express();
const upload = multer();

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(express.json());

const routes = createRouter({ genai, model: GEMINI_MODEL });
app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`
    Server is running on: 
    Serverhealth\t\t: http://localhost:${PORT}/api/health
    Generate text\t\t: http://localhost:${PORT}/api/text/generate-text
    Generate from image\t\t: http://localhost:${PORT}/api/image/generate-from-image
    Generate from document\t: http://localhost:${PORT}/api/document/generate-from-document
    Generate from audio\t\t: http://localhost:${PORT}/api/audio/generate-from-audio
    `);
});


