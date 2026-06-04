export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, region, store, currency } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  const prompt = `You are a shopping analyst. Analyze this product for ${store} (${currency}).
Product: "${query}"

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "name": "full product name",
  "worthIt": true or false,
  "verdict": "short verdict (max 6 words)",
  "summary": "2-3 sentence analysis",
  "estimatedPrice": 123,
  "bestPrice": 99,
  "currency": "${currency}",
  "regretIndex": 25,
  "proTips": ["tip 1", "tip 2", "tip 3"],
  "alternatives": [
    {"name": "Alternative 1", "asin": "B08N5WRWNW", "price": 89, "rating": 4.5, "savings": 34, "tag": "Best Value"},
    {"name": "Alternative 2", "asin": "B09G9FPHY6", "price": 79, "rating": 4.3, "savings": 44, "tag": "Budget Pick"}
  ],
  "whereToFind": [
    {"store": "${store}", "asin": "B08N5WRWNW", "price": 99, "tag": "Best Price"},
    {"store": "${store} Warehouse", "asin": "B08N5WRWNW", "price": 89, "tag": "Open Box"}
  ]
}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
        })
      }
    );

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // تنظيف الرد من markdown إن وُجد
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(500).json({ error: "Analysis failed" });
  }
}
