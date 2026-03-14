import express from 'express';


export default function createTextRouter({ genai, model }) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { prompt } = req.body;

    try {
      const response = await genai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
      });

      res.status(200).json({ generatedText: response.text });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  });

  return router;
}
