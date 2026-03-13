import express from 'express';
import multer from 'multer';

const upload = multer();


export default function createAudioRouter({ genai, model }) {
  const router = express.Router();

  router.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    const { prompt } = req.body;

    const base64Audio = req.file.buffer.toString('base64');
    if (!base64Audio) {
      return res.status(400).json({ message: 'audio file is empty' });
    }

    try {
      const response = await genai.models.generateContent({
        model,
        contents: [{ parts: [
            { text: prompt ?? 'Transcribe the audio.' },
            { inlineData: { data: base64Audio, mimeType: req.file.mimetype } }
        ] }],
      });

      res.status(200).json({ generatedText: response.text });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  });

  return router;
}
