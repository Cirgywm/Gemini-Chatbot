import express from 'express';

// import routes
import createTextRouter from './text.js';
import createDocumentRouter from './document.js';
import createImageRouter from './image.js';
import createAudioRouter from './audio.js';
import createChatRouter from './chat.js';


export default function createRouter({ genai, model }) {
  const router = express.Router();

  // health check
  router.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running' });
  });

  // mount individual routers, injecting shared dependencies
  router.use('/text', createTextRouter({ genai, model }));
  router.use('/document', createDocumentRouter({ genai, model }));
  router.use('/image', createImageRouter({ genai, model }));
  router.use('/audio', createAudioRouter({ genai, model }));
  router.use('/chat', createChatRouter({ genai, model }));

  return router;
}
