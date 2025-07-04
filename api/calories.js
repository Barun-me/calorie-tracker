// api/calories.js
import { json } from 'micro';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Only POST allowed' }));
  }

  let body;
  try {
    body = await json(req);
  } catch {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Invalid JSON body' }));
  }

  const { imageUrl } = body;
  if (!imageUrl) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Missing imageUrl' }));
  }

  try {
    // Note: using global `fetch` here
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Give calories of each item in this image in JSON format only.'
              },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
        response_format: { type: 'json_object' }
      })
    });

    const text = await groqRes.text();
    if (!groqRes.ok) {
      throw new Error(`Groq ${groqRes.status}: ${text}`);
    }

    res.setHeader('Content-Type', 'application/json');
    return res.end(text);

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: err.message }));
  }
}
