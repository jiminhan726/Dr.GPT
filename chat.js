export default async function handler(req, res) {
  const { userMessage } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are MedGPT, a helpful medical assistant. Ask clarifying questions and avoid giving official diagnoses." },
        { role: "user", content: userMessage }
      ],
    }),
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices[0].message.content });
}
