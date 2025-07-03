// api/calories.js
import fetch from 'node-fetch'
import { json }    from 'micro'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  let body
  try {
    body = await json(req)       // ← parses the incoming JSON
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const { imageUrl } = body
  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing imageUrl' })
  }

  try {
    const { imageUrl } = await req.json();

    // 1) Call Groq API with your secret key from env
    const payload = {
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Give calories of each item in this image in this below JSON format only\n {items:[{item_name:name of item, total_calories:in gm, total_protien:in gm , toal_carbs: in gm ,toal_fats:in gm},...]}' },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: { type: 'json_object' }
    };

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const text = await groqRes.text();
    if (!groqRes.ok) {
      throw new Error(`Groq error ${groqRes.status}: ${text}`);
    }

    // Forward the exact JSON response
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
