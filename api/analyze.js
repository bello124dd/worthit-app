export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query, region, store, currency } = req.body;

    const searchUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.amazon.com/s?k=${encodeURIComponent(query)}`)}`;
    const amazonResponse = await fetch(searchUrl);
    const amazonData = await amazonResponse.json();
    const htmlContent = amazonData.contents;

    const prompt = `You are a shopping assistant. I will provide you with a raw search text from Amazon for the product "${query}". 
    Extract the real product names, current prices, and ratings found in the text. 
    Then, build a real analysis based on this data.
    
    Respond ONLY with a valid JSON object, no markdown, no code blocks:
    {
      "name": "Extract the most relevant full product name found",
      "verdict": "Worth It",
      "worthIt": true,
      "estimatedPrice": 120,
      "bestPrice": 99,
      "summary": "This summary must mention the real prices found on Amazon just now.",
      "regretIndex": 15,
      "proTips": ["Check delivery times", "Look for coupon checkboxes on the page"],
      "alternatives": [
        { "name": "Real alternative product 1 name found", "price": 85, "rating": 4.5, "savings": 15, "tag": "Best Value", "asin": "B07ZPKN856" },
        { "name": "Real alternative product 2 name found", "price": 60, "rating": 4.1, "savings": 40, "tag": "Budget Pick", "asin": "B08N5LNXC6" }
      ],
      "whereToFind": [
        { "store": "Amazon", "price": 99, "asin": "B09G9F5C18", "tag": "Live Price" },
        { "store": "Amazon Warehouse", "price": 89, "asin": "B09G9F5C18", "tag": "Open Box" }
      ]
    }

    Here is the Amazon raw source content:
    ${htmlContent.substring(0, 15000)}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text.trim();
    const parsed = JSON.parse(text);

    return res.status(200).json({ ...parsed, currency });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
