export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ message: 'Missing user message.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are MedGPT, an AI medical assistant. You help users understand what their symptoms might indicate. You never give a final diagnosis or medical advice — just helpful suggestions to guide users in speaking with a doctor.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ message: 'No response from OpenAI.' });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('MedGPT Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
