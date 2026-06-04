exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const { query, region, store, currency } = JSON.parse(event.body);

    const prompt = `You are a shopping expert AI. Analyze this product for a customer shopping on ${store}.
Product: "${query}"
Respond ONLY with valid JSON, no markdown, no extra text:
{
  "name": "full product name",
  "verdict": "Worth It" or "Overpriced" or "Great Deal" or "Wait for Sale",
  "worthIt": true or false,
  "estimatedPrice": number,
  "bestPrice": number,
  "summary": "2 sentence honest analysis",
  "regretIndex": number 0-100,
  "proTips": ["tip 1", "tip 2", "tip 3"],
  "alternatives": [
    { "name": "product name", "price": number, "rating": number, "savings": number, "tag": "Best Value", "asin": "keyword" },
    { "name": "product name", "price": number, "rating": number, "savings": number, "tag": "Budget Pick", "asin": "keyword" },
    { "name": "product name", "price": number, "rating": number, "savings": number, "tag": "Premium Alt", "asin": "keyword" }
  ],
  "whereToFind": [
    { "store": "${store}", "price": number, "asin": "keyword", "tag": "Best Deal" },
    { "store": "${store} Warehouse", "price": number, "asin": "keyword", "tag": "Open Box" }
  ]
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content.map(i => i.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ...parsed, currency }),
  };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
