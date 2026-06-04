// api/analyze.js
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { query, region, store, currency } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
    const scraperUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(searchUrl)}`;
    
    const fetchRes = await fetch(scraperUrl);
    const fetchJson = await fetchRes.json();
    const htmlContent = fetchJson.contents || "No context";

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: `You are a shopping assistant for ${store}. Respond ONLY with raw JSON.` },
          { role: "user", content: `Analyze "${query}". Context: ${htmlContent.substring(0, 1000)}. Use ${currency}. Return JSON: {name, worthIt, verdict, estimatedPrice, bestPrice, currency, summary, proTips, regretIndex, alternatives, whereToFind}` }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    const data = await groqResponse.json();
    return res.status(200).json(JSON.parse(data.choices[0].message.content));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
