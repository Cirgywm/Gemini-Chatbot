import express from 'express';

export default function createChatRouter({ genai, model }) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { conversation } = req.body || {};

    // check if there is a conversation and if it's an array
    if (!conversation || !Array.isArray(conversation)) {
      return res.status(400).json({
        message:
          'Missing conversation. Make sure you send JSON with Content-Type: application/json and a body like { conversation: [...] }',
      });
    }

    for (const msg of conversation) {
        // check if each message is an object
        if (!Array.isArray(msg) && typeof msg !== 'object') {
            return res.status(400).json({ message: 'Each message must be an object.' });
        }

        const { role, text } = msg;

        // check if role and text are strings
        if (typeof role !== 'string' || typeof text !== 'string') {
            return res.status(400).json({ message: 'Each message must have a valid role and text.' });
        }

        // check if role is either 'user' or 'assistant'
        if (!['user', 'assistant'].includes(role)) {
            return res.status(400).json({ message: 'Role must be either "user" or "assistant".' });
        }
    }

    const contents = conversation.map(({ role, text }) => ({
        role,
        parts: [{ text }],
    }));

    try {
        const response = await genai.models.generateContent({
        model,
        contents,
        generationConfig: {
          temperature: 0.2,
          systemInstruction: 'Jawab dengan Bahasa Indonesia.',
        },
      });

      res.status(200).json({ generatedText: response.text });
    } catch (e) {
      console.error('Error generating chat response:', e);
      res.status(500).json({ message: e.message });
    }
  });

  return router;
}
