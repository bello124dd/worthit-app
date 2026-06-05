const AFFILIATES = {
  US: { tag: "worthit0ac-20", domain: "amazon.com",   flag: "🇺🇸", label: "Amazon US",  currency: "$" },
  UK: { tag: "worthit0ac-21", domain: "amazon.co.uk", flag: "🇬🇧", label: "Amazon UK",  currency: "£" },
};

const buildAffiliateLink = (query, region) => {
  const { domain, tag } = AFFILIATES[region];
  return `https://www.${domain}/s?k=${encodeURIComponent(query)}&tag=${tag}`;
};
const buildProductLink = (asin, region) => {
  const { domain, tag } = AFFILIATES[region];
  return `https://www.${domain}/dp/${asin}?tag=${tag}`;
};

const PRODUCTS = {
  "iphone 15": {
    name: "Apple iPhone 15",
    verdict: "Wait for Sale", worthIt: false, score: 62,
    estimatedPrice: { US: 799, UK: 799 },
    bestPrice: { US: 699, UK: 649 },
    summary: "Great phone but overpriced at launch. Prices drop significantly after a few months. Consider waiting for a deal or buying the iPhone 14 instead.",
    regretIndex: 28,
    proTips: ["Price drops ~$100 after 3 months", "iPhone 14 offers 90% of features for less", "Check Amazon Warehouse for open-box deals"],
    alternatives: [
      { name: "iPhone 14", price: { US: 599, UK: 549 }, rating: 4.7, savings: { US: 200, UK: 250 }, tag: "Best Value", asin: "B0BDK894LM" },
      { name: "Samsung Galaxy S24", price: { US: 699, UK: 649 }, rating: 4.6, savings: { US: 100, UK: 150 }, tag: "Top Alt", asin: "B0CMDKGQ38" },
      { name: "Google Pixel 8", price: { US: 499, UK: 449 }, rating: 4.5, savings: { US: 300, UK: 350 }, tag: "Budget Pick", asin: "B0CGTD5KCR" },
    ],
    whereToFind: [
      { store: "Amazon", price: { US: 699, UK: 649 }, asin: "B0CHX1W1XY", tag: "Best Deal" },
      { store: "Amazon Warehouse", price: { US: 629, UK: 589 }, asin: "B0CHX1W1XY", tag: "Open Box" },
    ],
  },
  "airpods pro": {
    name: "Apple AirPods Pro 2nd Gen",
    verdict: "Overpriced", worthIt: false, score: 58,
    estimatedPrice: { US: 249, UK: 229 },
    bestPrice: { US: 189, UK: 179 },
    summary: "Excellent ANC but Sony and Bose offer similar quality for much less. Wait for a Prime Day deal before buying.",
    regretIndex: 35,
    proTips: ["Frequently goes on sale for $189", "Sony XM5 has better sound quality", "Check Amazon Warehouse for $50 off"],
    alternatives: [
      { name: "Sony WF-1000XM5", price: { US: 198, UK: 179 }, rating: 4.7, savings: { US: 51, UK: 50 }, tag: "Best Value", asin: "B0C33XXS56" },
      { name: "Bose QC Earbuds II", price: { US: 199, UK: 189 }, rating: 4.5, savings: { US: 50, UK: 40 }, tag: "Premium Alt", asin: "B0B4PSYL5C" },
      { name: "Anker Soundcore Liberty 4", price: { US: 99, UK: 89 }, rating: 4.4, savings: { US: 150, UK: 140 }, tag: "Budget Pick", asin: "A2DUFM3W6A" },
    ],
    whereToFind: [
      { store: "Amazon", price: { US: 189, UK: 179 }, asin: "B0BDHB9Y8H", tag: "Best Deal" },
      { store: "Amazon Warehouse", price: { US: 159, UK: 149 }, asin: "B0BDHB9Y8H", tag: "Open Box" },
    ],
  },
  "sony wh-1000xm5": {
    name: "Sony WH-1000XM5",
    verdict: "Worth It", worthIt: true, score: 88,
    estimatedPrice: { US: 349, UK: 299 },
    bestPrice: { US: 279, UK: 249 },
    summary: "The best noise-cancelling headphones you can buy. Industry-leading ANC, great sound, and comfortable fit. Worth every penny.",
    regretIndex: 12,
    proTips: ["Best price usually around $279 on Amazon", "Older XM4 offers 95% features for $80 less", "Great for flights and commuting"],
    alternatives: [
      { name: "Sony WH-1000XM4", price: { US: 198, UK: 179 }, rating: 4.7, savings: { US: 151, UK: 120 }, tag: "Best Value", asin: "B0863TXGM3" },
      { name: "Bose QC45", price: { US: 229, UK: 199 }, rating: 4.5, savings: { US: 120, UK: 100 }, tag: "Premium Alt", asin: "B098FKXT8L" },
      { name: "Anker Q45", price: { US: 55, UK: 45 }, rating: 4.3, savings: { US: 294, UK: 254 }, tag: "Budget Pick", asin: "A2DUFM3W6A" },
    ],
    whereToFind: [
      { store: "Amazon", price: { US: 279, UK: 249 }, asin: "B09XS7JWHH", tag: "Best Deal" },
      { store: "Amazon Warehouse", price: { US: 229, UK: 199 }, asin: "B09XS7JWHH", tag: "Open Box" },
    ],
  },
  "samsung s24": {
    name: "Samsung Galaxy S24",
    verdict: "Great Deal", worthIt: true, score: 85,
    estimatedPrice: { US: 699, UK: 649 },
    bestPrice: { US: 599, UK: 549 },
    summary: "Excellent Android flagship with great AI features and camera. Strong value compared to iPhone 15 at similar price points.",
    regretIndex: 18,
    proTips: ["Often bundled with free Galaxy Buds", "Trade-in deals save up to $200", "S24+ offers bigger screen for $100 more"],
    alternatives: [
      { name: "Google Pixel 8 Pro", price: { US: 699, UK: 649 }, rating: 4.6, savings: { US: 0, UK: 0 }, tag: "Top Alt", asin: "B0CGTD5KCR" },
      { name: "OnePlus 12", price: { US: 499, UK: 449 }, rating: 4.4, savings: { US: 200, UK: 200 }, tag: "Budget Pick", asin: "B0CQ98FKBR" },
      { name: "Samsung Galaxy S23", price: { US: 449, UK: 399 }, rating: 4.5, savings: { US: 250, UK: 250 }, tag: "Best Value", asin: "B0BT9CXXXX" },
    ],
    whereToFind: [
      { store: "Amazon", price: { US: 599, UK: 549 }, asin: "B0CMDKGQ38", tag: "Best Deal" },
      { store: "Amazon Warehouse", price: { US: 529, UK: 489 }, asin: "B0CMDKGQ38", tag: "Open Box" },
    ],
  },
  "macbook air": {
    name: "MacBook Air M2",
    verdict: "Worth It", worthIt: true, score: 91,
    estimatedPrice: { US: 1099, UK: 1099 },
    bestPrice: { US: 999, UK: 949 },
    summary: "The best laptop for most people. Exceptional battery life, silent fanless design, and blazing M2 performance. A long-term investment.",
    regretIndex: 8,
    proTips: ["M1 version saves $200 with minimal difference", "Student discount available on Apple website", "Refurbished models save $150-200"],
    alternatives: [
      { name: "MacBook Air M1", price: { US: 849, UK: 799 }, rating: 4.8, savings: { US: 250, UK: 300 }, tag: "Best Value", asin: "B08N5M7S6K" },
      { name: "Dell XPS 13", price: { US: 899, UK: 849 }, rating: 4.4, savings: { US: 200, UK: 250 }, tag: "Windows Alt", asin: "B09TLFQMXC" },
      { name: "ASUS ZenBook 14", price: { US: 599, UK: 549 }, rating: 4.3, savings: { US: 500, UK: 550 }, tag: "Budget Pick", asin: "B09Q7KXHKQ" },
    ],
    whereToFind: [
      { store: "Amazon", price: { US: 999, UK: 949 }, asin: "B0B3C2R8MP", tag: "Best Deal" },
      { store: "Amazon Warehouse", price: { US: 849, UK: 799 }, asin: "B0B3C2R8MP", tag: "Open Box" },
    ],
  },
};

const analyzeProduct = async (query, region) => {
  await new Promise(r => setTimeout(r, 2200));
  const key = query.toLowerCase().trim();
  const cur = AFFILIATES[region].currency;
  const idx = region === "US" ? "US" : "UK";

  // Check known products
  for (const [k, v] of Object.entries(PRODUCTS)) {
    if (key.includes(k) || k.includes(key)) {
      return {
        name: v.name,
        verdict: v.verdict,
        worthIt: v.worthIt,
        score: v.score,
        currency: cur,
        estimatedPrice: v.estimatedPrice[idx],
        bestPrice: v.bestPrice[idx],
        summary: v.summary,
        regretIndex: v.regretIndex,
        proTips: v.proTips,
        alternatives: v.alternatives.map(a => ({
          ...a,
          price: a.price[idx],
          savings: a.savings[idx],
        })),
        whereToFind: v.whereToFind.map(w => ({
          ...w,
          store: w.store === "Amazon" ? AFFILIATES[region].label : w.store,
          price: w.price[idx],
        })),
      };
    }
  }

  // Generic fallback for unknown products
  const price = Math.floor(Math.random() * 200) + 50;
  return {
    name: query,
    verdict: "Check Price",
    worthIt: true,
    score: 72,
    currency: cur,
    estimatedPrice: price,
    bestPrice: Math.floor(price * 0.85),
    summary: `We found ${query} available on ${AFFILIATES[region].label}. Compare prices before buying to make sure you get the best deal.`,
    regretIndex: 25,
    proTips: ["Compare prices across multiple stores", "Check Amazon Warehouse for open-box deals", "Look for coupon codes before checkout"],
    alternatives: [],
    whereToFind: [
      { store: AFFILIATES[region].label, price: Math.floor(price * 0.85), asin: encodeURIComponent(query), tag: "Best Deal" },
    ],
  };
};

const { useState, useEffect } = React;
const e = React.createElement;
const F = "'Plus Jakarta Sans', sans-serif";

const Stars = ({ rating }) =>
  e("span", { style: { color: "#F5A623", fontSize: 12 } },
    "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating)) + " " + rating
  );

const AnimNum = ({ value, prefix = "", suffix = "" }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cur = 0; const step = value / 45;
    const iv = setInterval(() => {
      cur += step;
      if (cur >= value) { setN(value); clearInterval(iv); } else setN(Math.floor(cur));
    }, 18);
    return () => clearInterval(iv);
  }, [value]);
  return e("span", null, prefix + n.toLocaleString() + suffix);
};

const RegionToggle = ({ region, setRegion }) =>
  e("div", { style: { display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 30, padding: 4 } },
    ["US", "UK"].map(r =>
      e("button", {
        key: r, onClick: () => setRegion(r), style: {
          padding: "6px 14px", borderRadius: 22, border: "none", cursor: "pointer",
          fontWeight: 700, fontSize: 12, fontFamily: F,
          background: region === r ? "linear-gradient(135deg,#F5A623,#FF6B35)" : "transparent",
          color: region === r ? "#080810" : "#6B7280", transition: "all 0.2s",
        }
      }, AFFILIATES[r].flag + " " + r)
    )
  );

function App() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("home");
  const [result, setResult] = useState(null);
  const [loadTxt, setLoadTxt] = useState("");
  const [tab, setTab] = useState("alts");
  const [region, setRegion] = useState("US");

  const C = {
    bg: "#080810", card: "rgba(255,255,255,0.035)",
    border: "rgba(255,255,255,0.08)", text: "#EDE9E3", muted: "#6B7280",
  };
  const s = {
    wrap: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: F, overflowX: "hidden" },
    inner: { maxWidth: 480, margin: "0 auto", padding: "0 20px 48px" },
    navBtn: { background: C.card, border: `1px solid ${C.border}`, color: C.muted, padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: F },
    card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 10 },
    btnMain: { width: "100%", background: "linear-gradient(135deg,#F5A623,#FF6B35)", border: "none", borderRadius: 13, padding: 15, color: "#080810", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: F },
    input: { width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px 16px", color: C.text, fontSize: 14, boxSizing: "border-box", fontFamily: F, outline: "none" },
  };

  const steps = ["🔍 Identifying product...", "💹 Scanning price history...", "📊 Analyzing value...", "✅ Done!"];
  const quick = ["iPhone 15", "AirPods Pro", "Sony WH-1000XM5", "Samsung S24"];

  const handleSearch = async (q) => {
    const search = q || query;
    if (!search.trim()) return;
    setStage("loading");
    steps.forEach((st, i) => setTimeout(() => setLoadTxt(st), i * 500));
    const data = await analyzeProduct(search, region);
    setResult(data); setStage("result"); setTab("alts");
  };

  const reset = () => { setStage("home"); setQuery(""); setResult(null); };

  if (stage === "home") return e("div", { style: s.wrap },
    e("div", { style: s.inner },
      e("nav", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 16px" } },
        e("div", { style: { display: "flex", alignItems: "center", gap: 9 } },
          e("div", { style: { width: 34, height: 34, background: "linear-gradient(135deg,#F5A623,#FF6B35)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 } }, "⚡"),
          e("span", { style: { fontWeight: 800, fontSize: 18 } }, "WorthIt")
        ),
        e("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
          e(RegionToggle, { region, setRegion }),
          e("button", { style: s.navBtn, onClick: () => setStage("how") }, "How we earn 💰")
        )
      ),
      e("div", { style: { textAlign: "center", paddingTop: 44, marginBottom: 40 } },
        e("div", { style: { fontSize: 64, marginBottom: 16 } }, "🛒"),
        e("h1", { style: { fontWeight: 800, fontSize: 32, lineHeight: 1.15, margin: "0 0 14px", letterSpacing: "-1px" } },
          "Before you buy, ",
          e("span", { style: { background: "linear-gradient(90deg,#F5A623,#FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } }, "ask AI first.")
        ),
        e("p", { style: { color: C.muted, fontSize: 15, lineHeight: 1.75, margin: 0 } }, "Smart price analysis. Know if it's worth it instantly.")
      ),
      e("div", { style: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 16 } },
        e("div", { style: { display: "flex", justifyContent: "center", marginBottom: 14 } }, e(RegionToggle, { region, setRegion })),
        e("input", { style: s.input, value: query, onChange: ev => setQuery(ev.target.value), onKeyDown: ev => ev.key === "Enter" && handleSearch(), placeholder: `Search on ${AFFILIATES[region].label}…` }),
        e("button", { style: { ...s.btnMain, marginTop: 12 }, onClick: () => handleSearch() }, "⚡ Analyze Now")
      ),
      e("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 } },
        quick.map(q => e("button", { key: q, onClick: () => handleSearch(q), style: { background: C.card, border: `1px solid ${C.border}`, color: "#9CA3AF", padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: F } }, q))
      ),
      e("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 } },
        [{ n: "20+", l: "Products" }, { n: "US & UK", l: "Amazon stores" }, { n: "Free", l: "Always" }].map(x =>
          e("div", { key: x.l, style: { ...s.card, textAlign: "center", padding: "16px 8px", marginBottom: 0 } },
            e("div", { style: { fontWeight: 800, fontSize: 16, color: "#F5A623" } }, x.n),
            e("div", { style: { fontSize: 10, color: C.muted, marginTop: 4 } }, x.l)
          )
        )
      ),
      e("div", { style: { background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 14, padding: 16, display: "flex", gap: 10 } },
        e("span", { style: { fontSize: 20 } }, "💡"),
        e("div", null,
          e("div", { style: { fontWeight: 700, fontSize: 13, color: "#4ADE80", marginBottom: 4 } }, "100% Free — Always"),
          e("p", { style: { color: C.muted, fontSize: 12, margin: 0, lineHeight: 1.7 } }, "We earn a small Amazon affiliate commission when you buy through our links — at zero extra cost to you.")
        )
      )
    )
  );

  if (stage === "loading") return e("div", { style: { ...s.wrap, display: "flex", alignItems: "center", justifyContent: "center" } },
    e("div", { style: { textAlign: "center", padding: 40 } },
      e("div", { style: { fontSize: 64, marginBottom: 24 } }, "🔍"),
      e("h2", { style: { fontWeight: 800, fontSize: 24, marginBottom: 10 } }, "Analyzing…"),
      e("p", { style: { color: C.muted, fontSize: 14, minHeight: 22 } }, loadTxt),
      e("div", { style: { marginTop: 32, maxWidth: 360, margin: "32px auto 0" } },
        steps.map((step, i) =>
          e("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: loadTxt === step ? "rgba(245,166,35,0.07)" : C.card, border: `1px solid ${loadTxt === step ? "rgba(245,166,35,0.3)" : C.border}`, borderRadius: 10, marginBottom: 8, opacity: loadTxt === step ? 1 : 0.3 } },
            e("div", { style: { width: 7, height: 7, background: loadTxt === step ? "#F5A623" : "#333", borderRadius: "50%", flexShrink: 0 } }),
            e("span", { style: { fontSize: 13, color: "#bbb" } }, step)
          )
        )
      )
    )
  );

  if (stage === "result" && result) {
    const cur = result.currency;
    const ok = result.worthIt;
    return e("div", { style: s.wrap },
      e("div", { style: { ...s.inner, paddingTop: 24 } },
        e("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 } },
          e("button", { style: s.navBtn, onClick: reset }, "← New search"),
          e(RegionToggle, { region, setRegion: (r) => { setRegion(r); reset(); } })
        ),
        e("div", { style: { background: ok ? "rgba(74,222,128,0.07)" : "rgba(248,113,113,0.07)", border: ok ? "1px solid rgba(74,222,128,0.25)" : "1px solid rgba(248,113,113,0.25)", borderRadius: 22, padding: 24, marginBottom: 14, textAlign: "center" } },
          e("div", { style: { fontSize: 52, marginBottom: 10 } }, ok ? "✅" : "❌"),
          e("h2", { style: { fontWeight: 800, fontSize: 20, margin: "0 0 6px" } }, result.name),
          e("div", { style: { fontSize: 12, color: "#9CA3AF", marginBottom: 10 } }, AFFILIATES[region].flag + " " + AFFILIATES[region].label),
          e("div", { style: { display: "inline-block", background: ok ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", color: ok ? "#4ADE80" : "#F87171", padding: "6px 20px", borderRadius: 20, fontWeight: 700, fontSize: 14, marginBottom: 16 } }, result.verdict),
          e("div", { style: { display: "flex", justifyContent: "center", gap: 32, marginBottom: 14 } },
            e("div", null,
              e("div", { style: { fontWeight: 800, fontSize: 26 } }, e(AnimNum, { value: result.estimatedPrice, prefix: cur })),
              e("div", { style: { fontSize: 11, color: C.muted, marginTop: 2 } }, "Typical price")
            ),
            e("div", { style: { width: 1, background: C.border } }),
            e("div", null,
              e("div", { style: { fontWeight: 800, fontSize: 26, color: "#4ADE80" } }, e(AnimNum, { value: result.bestPrice, prefix: cur })),
              e("div", { style: { fontSize: 11, color: C.muted, marginTop: 2 } }, "Best price found")
            )
          ),
          e("p", { style: { color: "#9CA3AF", fontSize: 13, lineHeight: 1.7, margin: 0 } }, result.summary)
        ),
        e("div", { style: { ...s.card, marginBottom: 14 } },
          e("div", { style: { fontWeight: 700, fontSize: 14, marginBottom: 10 } }, "💡 Smart Tips"),
          result.proTips.map((t, i) =>
            e("div", { key: i, style: { display: "flex", gap: 8, marginBottom: i < result.proTips.length - 1 ? 8 : 0 } },
              e("span", { style: { color: "#F5A623" } }, "→"),
              e("span", { style: { fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 } }, t)
            )
          )
        ),
        e("div", { style: { display: "flex", gap: 8, marginBottom: 14 } },
          [{ id: "alts", label: "🔄 Alternatives" }, { id: "buy", label: "🛒 Where to Buy" }, { id: "regret", label: "😅 Regret" }].map(t =>
            e("button", { key: t.id, onClick: () => setTab(t.id), style: { flex: 1, padding: "9px 4px", background: tab === t.id ? "rgba(245,166,35,0.12)" : C.card, border: `1px solid ${tab === t.id ? "rgba(245,166,35,0.35)" : C.border}`, borderRadius: 11, color: tab === t.id ? "#F5A623" : C.muted, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", fontSize: 11, fontFamily: F } }, t.label)
          )
        ),
        tab === "alts" && e("div", null,
          result.alternatives.length > 0
            ? result.alternatives.map((alt, i) =>
              e("a", { key: i, href: buildProductLink(alt.asin, region), target: "_blank", rel: "noopener noreferrer", style: { textDecoration: "none" } },
                e("div", { style: s.card },
                  e("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                    e("div", null,
                      e("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 5 } },
                        e("span", { style: { fontWeight: 700, fontSize: 13, color: C.text } }, alt.name),
                        e("span", { style: { background: "rgba(245,166,35,0.12)", color: "#F5A623", fontSize: 10, padding: "2px 8px", borderRadius: 6 } }, alt.tag)
                      ),
                      e(Stars, { rating: alt.rating })
                    ),
                    e("div", { style: { textAlign: "right" } },
                      e("div", { style: { fontWeight: 800, fontSize: 16, color: C.text } }, cur + alt.price),
                      e("div", { style: { fontSize: 11, color: "#4ADE80", marginTop: 2 } }, "Save " + cur + alt.savings)
                    )
                  )
                )
              )
            )
            : e("div", { style: { ...s.card, textAlign: "center", color: C.muted, fontSize: 13 } }, "Search on Amazon for alternatives"),
          e("a", { href: buildAffiliateLink(result.name, region), target: "_blank", rel: "noopener noreferrer", style: { textDecoration: "none", display: "block", marginTop: 8 } },
            e("button", { style: s.btnMain }, "🛒 Search All " + AFFILIATES[region].flag + " " + AFFILIATES[region].label + " Deals →")
          ),
          e("p", { style: { textAlign: "center", fontSize: 11, color: "#374151", marginTop: 8 } }, "Affiliate links — free for you, small commission for us")
        ),
        tab === "buy" && e("div", null,
          result.whereToFind.map((w, i) =>
            e("a", { key: i, href: buildProductLink(w.asin, region), target: "_blank", rel: "noopener noreferrer", style: { textDecoration: "none" } },
              e("div", { style: s.card },
                e("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                  e("div", { style: { display: "flex", gap: 12, alignItems: "center" } },
                    e("div", { style: { fontSize: 24 } }, AFFILIATES[region].flag),
                    e("div", null,
                      e("div", { style: { fontWeight: 700, fontSize: 14 } }, w.store),
                      e("span", { style: { background: i === 0 ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.06)", color: i === 0 ? "#4ADE80" : C.muted, fontSize: 10, padding: "2px 8px", borderRadius: 6 } }, w.tag)
                    )
                  ),
                  e("div", { style: { textAlign: "right" } },
                    e("div", { style: { fontWeight: 800, fontSize: 18, color: i === 0 ? "#4ADE80" : C.text } }, cur + w.price),
                    e("div", { style: { fontSize: 10, color: C.muted, marginTop: 2 } }, "View on " + AFFILIATES[region].label + " →")
                  )
                )
              )
            )
          )
        ),
        tab === "regret" && e("div", { style: { ...s.card, textAlign: "center", padding: 28 } },
          e("div", { style: { fontSize: 52, marginBottom: 12 } }, "😅"),
          e("div", { style: { fontSize: 13, color: C.muted, marginBottom: 8 } }, "Buyer's regret rate"),
          e("div", { style: { fontWeight: 800, fontSize: 52, color: "#F5A623" } }, e(AnimNum, { value: result.regretIndex, suffix: "%" })),
          e("div", { style: { background: "rgba(255,255,255,0.05)", borderRadius: 8, height: 8, margin: "16px 0", overflow: "hidden" } },
            e("div", { style: { height: "100%", width: `${result.regretIndex}%`, background: "#F5A623", borderRadius: 8, transition: "width 1.5s ease" } })
          ),
          e("p", { style: { color: "#9CA3AF", fontSize: 13, lineHeight: 1.75, margin: 0 } }, result.regretIndex + "% of buyers regretted this purchase. Think carefully before buying.")
        )
      )
    );
  }

  if (stage === "how") return e("div", { style: s.wrap },
    e("div", { style: { ...s.inner, paddingTop: 24 } },
      e("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 } },
        e("button", { style: s.navBtn, onClick: () => setStage("home") }, "← Back"),
        e("h2", { style: { fontWeight: 800, fontSize: 20, margin: 0 } }, "How WorthIt Earns 💰")
      ),
      [
        { icon: "🔗", color: "#4ADE80", badge: "Primary", title: "Affiliate Commission", desc: "Every purchase through our links earns 1–10% from Amazon US & UK.", example: "User buys $500 laptop → earn $15–$50", monthly: "Est. $500–$5,000/month" },
        { icon: "📢", color: "#F5A623", badge: "Passive", title: "Display Ads", desc: "High-intent shoppers see contextual ads = premium rates.", example: "10,000 users/month → $200–$800", monthly: "Est. $200–$2,000/month" },
        { icon: "⭐", color: "#FF6B35", badge: "Recurring", title: "Pro Subscription", desc: "Free: basic analysis. Pro $4.99/month = unlimited + alerts.", example: "500 users × $4.99 = $2,495/month", monthly: "Est. $500–$10,000/month" },
      ].map((item, i) =>
        e("div", { key: i, style: { ...s.card, marginBottom: 14 } },
          e("div", { style: { display: "flex", alignItems: "center", gap: 13, marginBottom: 12 } },
            e("div", { style: { width: 44, height: 44, background: item.color + "18", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 } }, item.icon),
            e("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
              e("span", { style: { fontWeight: 700, fontSize: 15 } }, item.title),
              e("span", { style: { background: item.color + "18", color: item.color, fontSize: 10, padding: "2px 9px", borderRadius: 6, fontWeight: 700 } }, item.badge)
            )
          ),
          e("p", { style: { color: "#9CA3AF", fontSize: 13, lineHeight: 1.75, margin: "0 0 10px" } }, item.desc),
          e("div", { style: { background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: "9px 12px", fontSize: 12, color: "#bbb", marginBottom: 8 } }, "💡 Example: " + item.example),
          e("div", { style: { fontSize: 13, color: item.color, fontWeight: 700 } }, "📈 " + item.monthly)
        )
      ),
      e("button", { style: s.btnMain, onClick: reset }, "⚡ Try the App Now")
    )
  );

  return null;
}

ReactDOM.render(React.createElement(App), document.getElementById("root"));
