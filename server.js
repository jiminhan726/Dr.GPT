// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Insert your API key here (keep this safe in .env in production)
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Sentence frame template
const generatePrompt = (symptoms) => {
  return `
You are MedGPT, a helpful and kind AI that gives medical *guidance* (not diagnoses). You always follow this format:

"Hi there! Thanks for sharing your symptoms. Based on what you said, here are a few possibilities you might want to consider. Please note that I am not a doctor, but I can help you better understand your symptoms:"
- Possibility 1: ...
- Possibility 2: ...

"It's important to monitor your symptoms and reach out to a healthcare professional. Would you like some tips on what to do next?"

Here are the symptoms: ${symptoms}
Respond using the exact sentence frame and be empathetic, gentle, and clear.
`;
};

app.post("/ask", async (req, res) => {
  const { symptoms } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // or "gpt-4" if you have access
      messages: [
        {
          role: "system",
          content: "You are a kind, careful medical helper called MedGPT.",
        },
        {
          role: "user",
          content: generatePrompt(symptoms),
        },
      ],
      temperature: 0.7,
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error with OpenAI API");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
