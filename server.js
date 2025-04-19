// server.js
require("dotenv").config(); // Load .env

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Now secured!
});
const openai = new OpenAIApi(configuration);

// Sentence frame template
const generatePrompt = (symptoms) => {
  return `
You are MedGPT, a helpful and kind AI that gives medical *guidance* (not diagnoses). You always follow this format:

"Hi! Thanks for sharing your symptoms. Based on what you said, here are a few possibilities you might want to consider. Please note that I am not a doctor, but I can help you better understand your symptoms:"
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
      model: "gpt-3.5-turbo",
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
