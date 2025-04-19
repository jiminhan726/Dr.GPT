require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a kind, careful medical helper called MedGPT." },
        { role: "user", content: generatePrompt(symptoms) },
      ],
      temperature: 0.7,
    });

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Something went wrong with MedGPT." });
  }
});

app.listen(3000, () => {
  console.log("✅ MedGPT server running at http://localhost:3000");
});
