import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

import createRouter from './routes/index.js';


const app = express();
const upload = multer();

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const routes = createRouter({ genai, model: GEMINI_MODEL });
app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`
    Server is running on: 
    Serverhealth\t\t: http://localhost:${PORT}/api/health
    Generate text\t\t: http://localhost:${PORT}/api/text
    Generate from image\t\t: http://localhost:${PORT}/api/image
    Generate from document\t: http://localhost:${PORT}/api/document
    Generate from audio\t\t: http://localhost:${PORT}/api/audio
    Chat\t\t\t: http://localhost:${PORT}/api/chat
    `);
});


