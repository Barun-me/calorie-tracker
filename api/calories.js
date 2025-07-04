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
                text:   "Give calories of each item in this image in this below JSON format only\n {items:[{item_name:name of item, total_calories:in gm, total_protien:in gm , toal_carbs: in gm ,toal_fats:in gm},...]}"
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
      // inspect error body
      if (text.includes('context deadline exceeded')) {
        res.statusCode = 504; // upstream timeout
        return res.end(JSON.stringify({ error: 'Model request timed out. Please try again or use a smaller image.' }));
      }
      throw new Error(`Groq ${groqRes.status}: ${text}`);
    }

    res.setHeader('Content-Type', 'application/json');
    return res.end(text);

  } catch (err) {
    console.error(err);
    res.statusCode = err.message.includes('timed out') ? 504 : 500;
    return res.end(JSON.stringify({ error: err.message }));
  }
}
