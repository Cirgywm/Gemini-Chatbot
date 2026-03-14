import express from 'express';
import multer from 'multer';


const upload = multer();

export default function createImageRouter({ genai, model }) {
  const router = express.Router();

  router.post('/', upload.single('image'), async (req, res) => {
    const { prompt } = req.body;

    const base64Image = req.file.buffer.toString('base64');
    if (!base64Image) {
      return res.status(400).json({ message: 'image file is empty' });
    }

    try {
      const response = await genai.models.generateContent({
        model,
        contents: [{ parts: [
            { text: prompt },
            { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
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
