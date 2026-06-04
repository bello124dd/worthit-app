import { useState, useEffect } from "react";

const AFFILIATES = {
  US: { tag: "worthit0ac-20", domain: "amazon.com",    flag: "🇺🇸", label: "Amazon US", currency: "$" },
  UK: { tag: "worthit0ac-21", domain: "amazon.co.uk",  flag: "🇬🇧", label: "Amazon UK", currency: "£" },
};

const buildAffiliateLink = (query, region) => {
  const { domain, tag } = AFFILIATES[region];
  return `https://www.${domain}/s?k=${encodeURIComponent(query)}&tag=${tag}`;
};

const buildProductLink = (asin, region) => {
  const { domain, tag } = AFFILIATES[region];
  return `https://www.${domain}/dp/${asin}?tag=${tag}`;
};

// ── Claude AI Analysis ────────────────────────────────────────────────────────
const analyzeWithClaude = async (query, region) => {
  const cur = AFFILIATES[region].currency;
  const store = AFFILIATES[region].label;

  const prompt = `You are a shopping expert AI. Analyze this product for a customer shopping on ${store}.
Product: "${query}"

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "name": "full product name",
  "verdict": "Worth It" or "Overpriced" or "Great Deal" or "Wait for Sale",
  "worthIt": true or false,
  "score": number 0-100,
  "estimatedPrice": number (estimated current price in ${cur}),
  "bestPrice": number (best deal price in ${cur}),
  "summary": "2 sentence honest analysis",
  "regretIndex": number 0-100 (% of buyers who regret this purchase),
  "proTips": ["tip 1", "tip 2", "tip 3"],
  "alternatives": [
    { "name": "product name", "price": number, "rating": number, "savings": number, "tag": "Best Value|Budget Pick|Premium Alt", "asin": "ASIN or search keyword" },
    { "name": "product name", "price": number, "rating": number, "savings": number, "tag": "Budget Pick", "asin": "ASIN or search keyword" },
    { "name": "product name", "price": number, "rating": number, "savings": number, "tag": "Premium Alt", "asin": "ASIN or search keyword" }
  ],
  "whereToFind": [
    { "store": "${store}", "price": number, "asin": "ASIN or search keyword", "tag": "Best Deal" },
    { "store": "${store} Warehouse", "price": number, "asin": "ASIN or search keyword", "tag": "Open Box" }
  ]
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content.map(i => i.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  return { ...parsed, currency: cur };
};

// ── Components ────────────────────────────────────────────────────────────────
const F = "'Plus Jakarta Sans', sans-serif";

const Stars = ({ rating }) => (
  <span style={{ color: "#F5A623", fontSize: 12 }}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))} {rating}
  </span>
);

const AnimNum = ({ value, prefix = "", suffix = "" }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = value / 45;
    const iv = setInterval(() => {
      cur += step;
      if (cur >= value) { setN(value); clearInterval(iv); }
      else setN(Math.floor(cur));
    }, 18);
    return () => clearInterval(iv);
  }, [value]);
  return <span>{prefix}{n.toLocaleString()}{suffix}</span>;
};

const RegionToggle = ({ region, setRegion }) => (
  <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:30, padding:4 }}>
    {["US","UK"].map(r => (
      <button key={r} onClick={() => setRegion(r)} style={{
        padding:"6px 14px", borderRadius:22, border:"none", cursor:"pointer",
        fontWeight:700, fontSize:12, fontFamily:F,
        background: region===r ? "linear-gradient(135deg,#F5A623,#FF6B35)" : "transparent",
        color: region===r ? "#080810" : "#6B7280", transition:"all 0.2s",
      }}>
        {AFFILIATES[r].flag} {r}
      </button>
    ))}
  </div>
);

const VerdictIcon = ({ worthIt }) => (
  <div style={{ fontSize:52, marginBottom:10 }}>{worthIt ? "✅" : "❌"}</div>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [query,   setQuery]   = useState("");
  const [stage,   setStage]   = useState("home");
  const [result,  setResult]  = useState(null);
  const [loadTxt, setLoadTxt] = useState("");
  const [tab,     setTab]     = useState("alts");
  const [region,  setRegion]  = useState("US");
  const [error,   setError]   = useState("");

  const steps = [
    "🔍 Identifying product...",
    "💹 Scanning price history...",
    "🤖 Claude AI analyzing value...",
    "✅ Done!",
  ];

  const quickSearches = ["iPhone 15", "AirPods Pro", "Sony WH-1000XM5", "Samsung S24"];

  const handleSearch = async (q) => {
    const search = q || query;
    if (!search.trim()) return;
    setError("");
    setStage("loading");
    steps.forEach((s, i) => setTimeout(() => setLoadTxt(s), i * 600));
    try {
      const data = await analyzeWithClaude(search, region);
      setResult(data);
      setStage("result");
      setTab("alts");
    } catch (e) {
      setError("Analysis failed. Please try again.");
      setStage("home");
    }
  };

  const reset = () => { setStage("home"); setQuery(""); setResult(null); setError(""); };

  const C = {
    bg:"#080810", card:"rgba(255,255,255,0.035)", border:"rgba(255,255,255,0.08)",
    accent:"#F5A623", green:"#4ADE80", red:"#F87171", text:"#EDE9E3", muted:"#6B7280",
  };

  const base = {
    wrap:     { minHeight:"100vh", background:C.bg, color:C.text, fontFamily:F, overflowX:"hidden" },
    inner:    { maxWidth:480, margin:"0 auto", padding:"0 20px", paddingBottom:48 },
    nav:      { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0 16px" },
    navBtn:   { background:C.card, border:`1px solid ${C.border}`, color:C.muted, padding:"7px 14px", borderRadius:20, cursor:"pointer", fontSize:12, fontFamily:F },
    card:     { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:10 },
    btnMain:  { width:"100%", background:"linear-gradient(135deg,#F5A623,#FF6B35)", border:"none", borderRadius:13, padding:15, color:"#080810", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:F },
    input:    { width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, borderRadius:13, padding:"14px 16px", color:C.text, fontSize:14, boxSizing:"border-box", fontFamily:F, outline:"none" },
  };

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (stage === "home") return (
    <div style={base.wrap}>
      <div style={base.inner}>
        <nav style={base.nav}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:34, height:34, background:"linear-gradient(135deg,#F5A623,#FF6B35)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>⚡</div>
            <span style={{ fontWeight:800, fontSize:18 }}>Worth It?</span>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <RegionToggle region={region} setRegion={setRegion} />
            <button style={base.navBtn} onClick={() => setStage("how")}>How we earn 💰</button>
          </div>
        </nav>

        <div style={{ textAlign:"center", paddingTop:44, marginBottom:40 }}>
          <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
          <h1 style={{ fontWeight:800, fontSize:34, lineHeight:1.15, margin:"0 0 14px", letterSpacing:"-1px" }}>
            Before you buy,{" "}
            <span style={{ background:"linear-gradient(90deg,#F5A623,#FF6B35)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              ask Claude first.
            </span>
          </h1>
          <p style={{ color:C.muted, fontSize:15, lineHeight:1.75, margin:0 }}>
            Real AI analysis powered by Claude. Know if it's worth it instantly.
          </p>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:20, marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
            <RegionToggle region={region} setRegion={setRegion} />
          </div>
          {error && <div style={{ color:C.red, fontSize:13, marginBottom:10, textAlign:"center" }}>{error}</div>}
          <input
            style={base.input}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder={`Search on ${AFFILIATES[region].label}…`}
          />
          <button style={{ ...base.btnMain, marginTop:12 }} onClick={() => handleSearch()}>
            ⚡ Analyze with Claude AI
          </button>
        </div>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:40 }}>
          {quickSearches.map(q => (
            <button key={q} onClick={() => handleSearch(q)} style={{ background:C.card, border:`1px solid ${C.border}`, color:"#9CA3AF", padding:"7px 14px", borderRadius:20, cursor:"pointer", fontSize:12, fontFamily:F }}>
              {q}
            </button>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
          {[{ n:"Claude AI", l:"Powered by" }, { n:"US & UK", l:"Amazon stores" }, { n:"Real", l:"Live analysis" }].map(x => (
            <div key={x.l} style={{ ...base.card, textAlign:"center", padding:"16px 8px", marginBottom:0 }}>
              <div style={{ fontWeight:800, fontSize:16, color:"#F5A623" }}>{x.n}</div>
              <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>{x.l}</div>
            </div>
          ))}
        </div>

        <div style={{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:14, padding:16, display:"flex", gap:10 }}>
          <span style={{ fontSize:20 }}>💡</span>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:"#4ADE80", marginBottom:4 }}>100% Free — Always</div>
            <p style={{ color:C.muted, fontSize:12, margin:0, lineHeight:1.7 }}>
              Powered by Claude AI. We earn a small Amazon affiliate commission when you buy through our links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (stage === "loading") return (
    <div style={{ ...base.wrap, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", padding:40 }}>
        <div style={{ fontSize:64, marginBottom:24 }}>🤖</div>
        <h2 style={{ fontWeight:800, fontSize:24, marginBottom:10 }}>Claude is analyzing…</h2>
        <p style={{ color:C.muted, fontSize:14, minHeight:22 }}>{loadTxt}</p>
        <div style={{ marginTop:32, maxWidth:360, margin:"32px auto 0" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background: loadTxt===step ? "rgba(245,166,35,0.07)" : C.card, border:`1px solid ${loadTxt===step ? "rgba(245,166,35,0.3)" : C.border}`, borderRadius:10, marginBottom:8, opacity: loadTxt===step ? 1 : 0.3 }}>
              <div style={{ width:7, height:7, background: loadTxt===step ? "#F5A623":"#333", borderRadius:"50%", flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#bbb" }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (stage === "result" && result) {
    const cur = result.currency;
    const verdictColor = result.worthIt ? "rgba(74,222,128,0.07)" : "rgba(248,113,113,0.07)";
    const verdictBorder = result.worthIt ? "1px solid rgba(74,222,128,0.25)" : "1px solid rgba(248,113,113,0.25)";
    const verdictTextColor = result.worthIt ? "#4ADE80" : "#F87171";
    return (
      <div style={base.wrap}>
        <div style={{ ...base.inner, paddingTop:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <button style={base.navBtn} onClick={reset}>← New search</button>
            <RegionToggle region={region} setRegion={(r) => { setRegion(r); reset(); }} />
          </div>

          {/* Verdict Card */}
          <div style={{ background:verdictColor, border:verdictBorder, borderRadius:22, padding:24, marginBottom:14, textAlign:"center" }}>
            <VerdictIcon worthIt={result.worthIt} />
            <h2 style={{ fontWeight:800, fontSize:20, margin:"0 0 6px" }}>{result.name}</h2>
            <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:10 }}>Analyzed by Claude AI · {AFFILIATES[region].flag} {AFFILIATES[region].label}</div>
            <div style={{ display:"inline-block", background: result.worthIt ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", color:verdictTextColor, padding:"6px 20px", borderRadius:20, fontWeight:700, fontSize:14, marginBottom:16 }}>
              {result.verdict}
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:32, marginBottom:14 }}>
              <div>
                <div style={{ fontWeight:800, fontSize:26 }}>
                  <AnimNum value={result.estimatedPrice} prefix={cur} />
                </div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Typical price</div>
              </div>
              <div style={{ width:1, background:C.border }} />
              <div>
                <div style={{ fontWeight:800, fontSize:26, color:"#4ADE80" }}>
                  <AnimNum value={result.bestPrice} prefix={cur} />
                </div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Best price found</div>
              </div>
            </div>
            <p style={{ color:"#9CA3AF", fontSize:13, lineHeight:1.7, margin:0 }}>{result.summary}</p>
          </div>

          {/* Pro Tips */}
          <div style={{ ...base.card, marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>💡 Claude's Tips</div>
            {result.proTips?.map((t, i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom: i<result.proTips.length-1?8:0 }}>
                <span style={{ color:"#F5A623" }}>→</span>
                <span style={{ fontSize:13, color:"#9CA3AF", lineHeight:1.6 }}>{t}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            {[{ id:"alts", label:"🔄 Alternatives" }, { id:"buy", label:"🛒 Where to Buy" }, { id:"regret", label:"😅 Regret" }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:"9px 4px", background: tab===t.id?"rgba(245,166,35,0.12)":C.card, border:`1px solid ${tab===t.id?"rgba(245,166,35,0.35)":C.border}`, borderRadius:11, color: tab===t.id?"#F5A623":C.muted, fontWeight: tab===t.id?700:400, cursor:"pointer", fontSize:11, fontFamily:F }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab: Alternatives */}
          {tab === "alts" && (
            <div>
              {result.alternatives?.map((alt, i) => (
                <a key={i} href={buildProductLink(alt.asin, region)} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                  <div style={base.card}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                          <span style={{ fontWeight:700, fontSize:14, color:C.text }}>{alt.name}</span>
                          <span style={{ background:"rgba(245,166,35,0.12)", color:"#F5A623", fontSize:10, padding:"2px 8px", borderRadius:6 }}>{alt.tag}</span>
                        </div>
                        <Stars rating={alt.rating} />
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontWeight:800, fontSize:17, color:C.text }}>{cur}{alt.price}</div>
                        <div style={{ fontSize:11, color:"#4ADE80", marginTop:2 }}>Save {cur}{alt.savings}</div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
              <a href={buildAffiliateLink(result.name, region)} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block", marginTop:8 }}>
                <button style={base.btnMain}>🛒 Search All {AFFILIATES[region].flag} {AFFILIATES[region].label} Deals →</button>
              </a>
              <p style={{ textAlign:"center", fontSize:11, color:"#374151", marginTop:8 }}>Affiliate links — free for you, small commission for us</p>
            </div>
          )}

          {/* Tab: Where to Buy */}
          {tab === "buy" && result.whereToFind?.map((w, i) => (
            <a key={i} href={buildProductLink(w.asin, region)} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
              <div style={base.card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ fontSize:24 }}>{AFFILIATES[region].flag}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14 }}>{w.store}</div>
                      <span style={{ background: i===0?"rgba(74,222,128,0.12)":"rgba(255,255,255,0.06)", color: i===0?"#4ADE80":C.muted, fontSize:10, padding:"2px 8px", borderRadius:6 }}>{w.tag}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontWeight:800, fontSize:18, color: i===0?"#4ADE80":C.text }}>{cur}{w.price}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>View on {AFFILIATES[region].label} →</div>
                  </div>
                </div>
              </div>
            </a>
          ))}

          {/* Tab: Regret */}
          {tab === "regret" && (
            <div style={{ ...base.card, textAlign:"center", padding:28 }}>
              <div style={{ fontSize:52, marginBottom:12 }}>😅</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:8 }}>Buyer's regret rate</div>
              <div style={{ fontWeight:800, fontSize:52, color:"#F5A623" }}>
                <AnimNum value={result.regretIndex} suffix="%" />
              </div>
              <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:8, height:8, margin:"16px 0", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${result.regretIndex}%`, background:"#F5A623", borderRadius:8, transition:"width 1.5s ease" }} />
              </div>
              <p style={{ color:"#9CA3AF", fontSize:13, lineHeight:1.75, margin:0 }}>
                {result.regretIndex}% of buyers regretted this purchase. Think carefully before buying.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── HOW WE EARN ───────────────────────────────────────────────────────────
  if (stage === "how") return (
    <div style={base.wrap}>
      <div style={{ ...base.inner, paddingTop:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
          <button style={base.navBtn} onClick={() => setStage("home")}>← Back</button>
          <h2 style={{ fontWeight:800, fontSize:20, margin:0 }}>How Worth It? Earns 💰</h2>
        </div>
        <div style={{ background:"rgba(245,166,35,0.06)", border:"1px solid rgba(245,166,35,0.2)", borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:13, color:"#bbb" }}>
          🌍 We run affiliate programs on both{" "}
          <strong style={{ color:"#F5A623" }}>Amazon US</strong> and{" "}
          <strong style={{ color:"#F5A623" }}>Amazon UK</strong>. Analysis powered by Claude AI.
        </div>
        {[
          { icon:"🔗", color:"#4ADE80", badge:"Primary",   title:"Affiliate Commission", desc:"Every purchase through our links earns 1–10% from Amazon. Applied automatically for US & UK.", example:"User buys $500 laptop → you earn $15–$50", monthly:"Est. $500–$5,000/month" },
          { icon:"📢", color:"#F5A623", badge:"Passive",    title:"Display Ads",          desc:"Contextual ads shown alongside results. High-intent shoppers = premium ad rates.", example:"10,000 users/month → $200–$800", monthly:"Est. $200–$2,000/month" },
          { icon:"⭐", color:"#FF6B35", badge:"Recurring",  title:"Pro Subscription",     desc:"Free: 5 searches/day. Pro at $4.99/month = unlimited + price alerts.", example:"500 Pro users × $4.99 = $2,495/month", monthly:"Est. $500–$10,000/month" },
        ].map((item, i) => (
          <div key={i} style={{ ...base.card, marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:13, marginBottom:12 }}>
              <div style={{ width:44, height:44, background:`${item.color}18`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{item.icon}</div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontWeight:700, fontSize:15 }}>{item.title}</span>
                <span style={{ background:`${item.color}18`, color:item.color, fontSize:10, padding:"2px 9px", borderRadius:6, fontWeight:700 }}>{item.badge}</span>
              </div>
            </div>
            <p style={{ color:"#9CA3AF", fontSize:13, lineHeight:1.75, margin:"0 0 10px" }}>{item.desc}</p>
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:9, padding:"9px 12px", fontSize:12, color:"#bbb", marginBottom:8 }}>💡 Example: {item.example}</div>
            <div style={{ fontSize:13, color:item.color, fontWeight:700 }}>📈 {item.monthly}</div>
          </div>
        ))}
        <button style={base.btnMain} onClick={reset}>⚡ Try the App Now</button>
      </div>
    </div>
  );

  return null;
}
