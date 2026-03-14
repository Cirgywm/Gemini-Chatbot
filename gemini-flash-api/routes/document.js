import express from 'express';
import multer from 'multer';


const upload = multer();

export default function createDocumentRouter({ genai, model }) {
  const router = express.Router();

  router.post('/', upload.single('document'), async (req, res) => {
    const { prompt } = req.body;

    const base64Document = req.file.buffer.toString('base64');
    if (!base64Document) {
      return res.status(400).json({ message: 'document file is empty' });
    }

    try {
      const response = await genai.models.generateContent({
        model,
        contents: [{ parts: [
            { text: prompt ?? 'Make a summary of the document.' },
            { inlineData: { data: base64Document, mimeType: req.file.mimetype } }
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
