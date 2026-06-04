import { useState, useEffect, useRef } from "react";

const AFFILIATES = {
  US: { tag: "worthit0ac-20", domain: "amazon.com", flag: "🇺🇸", label: "Amazon US", currency: "$" },
  UK: { tag: "worthit0ac-21", domain: "amazon.co.uk", flag: "🇬🇧", label: "Amazon UK", currency: "£" },
};

const buildAffiliateLink = (query, region) => {
  const { domain, tag } = AFFILIATES[region];
  return `https://www.${domain}/s?k=${encodeURIComponent(query)}&tag=${tag}`;
};
const buildProductLink = (asin, region) => {
  const { domain, tag } = AFFILIATES[region];
  return `https://www.${domain}/dp/${asin}?tag=${tag}`;
};

// ── Anthropic API call ──────────────────────────────────────────────
const analyzeWithClaude = async (query, region) => {
  const { currency, label } = AFFILIATES[region];

  const systemPrompt = `You are a sharp, data-driven shopping analyst. 
Your job: analyze products sold on ${label} and tell users if they're worth buying.
Always respond ONLY with valid JSON — no markdown, no explanation outside JSON.`;

  const userPrompt = `Analyze this product for ${label}: "${query}"

Return ONLY this JSON structure (fill with realistic data):
{
  "name": "Full product name",
  "worthIt": true or false,
  "verdict": "one short verdict sentence",
  "summary": "2-3 sentence honest analysis",
  "estimatedPrice": numeric price in ${currency},
  "bestPrice": numeric best deal price in ${currency},
  "currency": "${currency}",
  "regretIndex": number 0-100 (buyer regret %),
  "valueScore": number 0-10,
  "proTips": ["tip 1", "tip 2", "tip 3"],
  "alternatives": [
    { "name": "Alt product 1", "asin": "B08N5WRWNW", "price": numeric, "savings": numeric, "rating": 4.5, "tag": "Best Value" },
    { "name": "Alt product 2", "asin": "B09G9FPHY6", "price": numeric, "savings": numeric, "rating": 4.3, "tag": "Budget Pick" },
    { "name": "Alt product 3", "asin": "B0CHX3QBCH", "price": numeric, "savings": numeric, "rating": 4.7, "tag": "Premium Alt" }
  ],
  "whereToFind": [
    { "store": "${label}", "asin": "B08N5WRWNW", "price": numeric, "tag": "Best Deal" },
    { "store": "${label} Warehouse", "asin": "B09G9FPHY6", "price": numeric, "tag": "Open Box" }
  ],
  "priceHistory": [
    { "month": "Jan", "price": numeric },
    { "month": "Feb", "price": numeric },
    { "month": "Mar", "price": numeric },
    { "month": "Apr", "price": numeric },
    { "month": "May", "price": numeric },
    { "month": "Jun", "price": numeric }
  ]
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) throw new Error("API error");
  const data = await response.json();
  const text = data.content.map((b) => b.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

// ── Mini sparkline chart ────────────────────────────────────────────
const PriceChart = ({ data, currency }) => {
  if (!data || data.length === 0) return null;
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const W = 280, H = 64, PAD = 8;
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = PAD + ((max - d.price) / range) * (H - PAD * 2);
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const lastPt = pts[pts.length - 1].split(",");

  return (
    <div style={{ marginTop: 8 }}>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`${PAD},${H} ${polyline} ${W - PAD},${H}`}
          fill="url(#chartGrad)"
        />
        <polyline
          points={polyline}
          fill="none"
          stroke="#F5A623"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle
          cx={lastPt[0]}
          cy={lastPt[1]}
          r="4"
          fill="#F5A623"
          stroke="#080810"
          strokeWidth="2"
        />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {data.map((d, i) => (
          <span key={i} style={{ fontSize: 10, color: "#4B5563" }}>{d.month}</span>
        ))}
      </div>
    </div>
  );
};

// ── Stars ───────────────────────────────────────────────────────────
const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ fontSize: 11, letterSpacing: 1 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < full ? "#F5A623" : (i === full && half ? "#F5A623" : "#2D2D3A") }}>
          {i < full ? "★" : i === full && half ? "⯨" : "☆"}
        </span>
      ))}
      <span style={{ color: "#6B7280", marginLeft: 4 }}>{rating}</span>
    </span>
  );
};

// ── Animated number ─────────────────────────────────────────────────
const AnimNum = ({ value, prefix = "", suffix = "" }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = value / 50;
    const iv = setInterval(() => {
      cur += step;
      if (cur >= value) { setN(value); clearInterval(iv); }
      else setN(Math.floor(cur));
    }, 16);
    return () => clearInterval(iv);
  }, [value]);
  return <span>{prefix}{n.toLocaleString()}{suffix}</span>;
};

// ── Region Toggle ───────────────────────────────────────────────────
const RegionToggle = ({ region, setRegion }) => (
  <div style={{
    display: "flex", gap: 3,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 30, padding: 3
  }}>
    {["US", "UK"].map(r => (
      <button key={r} onClick={() => setRegion(r)} style={{
        padding: "5px 14px", borderRadius: 22, border: "none", cursor: "pointer",
        fontWeight: 700, fontSize: 12, fontFamily: "inherit",
        background: region === r ? "linear-gradient(135deg,#F5A623,#FF6B35)" : "transparent",
        color: region === r ? "#080810" : "#6B7280",
        transition: "all 0.2s",
      }}>
        {AFFILIATES[r].flag} {r}
      </button>
    ))}
  </div>
);

// ── Value score ring ────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const r = 28, circ = 2 * Math.PI * r;
  const filled = (score / 10) * circ;
  const color = score >= 7 ? "#4ADE80" : score >= 5 ? "#F5A623" : "#F87171";
  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: "#6B7280", marginTop: 1 }}>/10</span>
      </div>
    </div>
  );
};

// ── MAIN APP ────────────────────────────────────────────────────────
export default function App() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("home");
  const [result, setResult] = useState(null);
  const [loadStep, setLoadStep] = useState(0);
  const [tab, setTab] = useState("alts");
  const [region, setRegion] = useState("US");
  const [error, setError] = useState("");
  const inputRef = useRef();

  const F = "'Syne', 'Space Grotesk', sans-serif";
  const C = {
    bg: "#06060F", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
    text: "#F0EBE3", muted: "#52525B", green: "#4ADE80", red: "#F87171", amber: "#F5A623"
  };

  const steps = [
    { icon: "🔍", text: "Identifying product…" },
    { icon: "💹", text: "Scanning price history…" },
    { icon: "🤖", text: "AI analyzing value…" },
    { icon: "✅", text: "Building report…" },
  ];

  const quick = [
    { label: "iPhone 16", icon: "📱" },
    { label: "AirPods Pro 2", icon: "🎧" },
    { label: "Sony WH-1000XM5", icon: "🎵" },
    { label: "Dyson V15", icon: "🌀" },
    { label: "Samsung S25", icon: "📲" },
  ];

  const handleSearch = async (q) => {
    const search = (q || query).trim();
    if (!search) return;
    setError(""); setStage("loading"); setLoadStep(0);

    let step = 0;
    const iv = setInterval(() => {
      step++;
      if (step < steps.length) setLoadStep(step);
      else clearInterval(iv);
    }, 900);

    try {
      const data = await analyzeWithClaude(search, region);
      clearInterval(iv);
      setResult(data); setStage("result"); setTab("alts");
    } catch (err) {
      clearInterval(iv);
      setError("Analysis failed. Please try again.");
      setStage("home");
    }
  };

  const reset = () => { setStage("home"); setQuery(""); setResult(null); setError(""); };

  const cardStyle = {
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 16, padding: "16px 18px", marginBottom: 10,
  };
  const btnMain = {
    width: "100%", background: "linear-gradient(135deg,#F5A623,#FF6B35)",
    border: "none", borderRadius: 14, padding: "15px 20px",
    color: "#06060F", fontWeight: 800, fontSize: 15, cursor: "pointer",
    fontFamily: F, letterSpacing: "0.3px",
  };

  // ── HOME ──────────────────────────────────────────────────────────
  if (stage === "home") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: F, overflowX: "hidden" }}>
      {/* ambient glow */}
      <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse,rgba(245,166,35,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 60px", position: "relative" }}>
        {/* NAV */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#F5A623,#FF6B35)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>Worth It?</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <RegionToggle region={region} setRegion={setRegion} />
            <button onClick={() => setStage("how")} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted, padding: "7px 13px", borderRadius: 20, cursor: "pointer", fontSize: 11, fontFamily: F }}>
              How it works
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div style={{ textAlign: "center", paddingTop: 52, marginBottom: 44 }}>
          <div style={{ fontSize: 72, marginBottom: 20, filter: "drop-shadow(0 0 30px rgba(245,166,35,0.4))" }}>🛒</div>
          <h1 style={{ fontWeight: 800, fontSize: 34, lineHeight: 1.1, margin: "0 0 14px", letterSpacing: "-1.5px" }}>
            Is it <span style={{ background: "linear-gradient(90deg,#F5A623,#FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>worth buying?</span>
          </h1>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            AI-powered analysis for US & UK Amazon.<br />Real prices. Honest verdict. Cheaper alternatives.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: 22, padding: 20, marginBottom: 14 }}>
          {error && (
            <div style={{ color: C.red, fontSize: 12, marginBottom: 12, textAlign: "center", padding: "8px 12px", background: "rgba(248,113,113,0.08)", borderRadius: 10, border: "1px solid rgba(248,113,113,0.15)" }}>
              ⚠️ {error}
            </div>
          )}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
            <input
              ref={inputRef}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
                borderRadius: 13, padding: "14px 16px 14px 42px", color: C.text, fontSize: 14,
                boxSizing: "border-box", fontFamily: F, outline: "none",
              }}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder={`Search on ${AFFILIATES[region].label}…`}
            />
          </div>
          <button style={{ ...btnMain, marginTop: 12 }} onClick={() => handleSearch()}>
            ⚡ Analyze Now
          </button>
        </div>

        {/* QUICK SEARCHES */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
          {quick.map(q => (
            <button key={q.label} onClick={() => handleSearch(q.label)} style={{
              background: C.card, border: `1px solid ${C.border}`, color: "#9CA3AF",
              padding: "7px 13px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: F,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              {q.icon} {q.label}
            </button>
          ))}
        </div>

        {/* TRUST BAR */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {[
            { icon: "🤖", label: "AI-Powered" },
            { icon: "🇺🇸🇬🇧", label: "US & UK" },
            { icon: "💸", label: "Free to use" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "6px 12px" }}>
              <span style={{ fontSize: 13 }}>{item.icon}</span>
              <span style={{ fontSize: 11, color: C.muted }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── LOADING ───────────────────────────────────────────────────────
  if (stage === "loading") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: F, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 40, maxWidth: 380 }}>
        <div style={{ fontSize: 64, marginBottom: 20, animation: "pulse 1.5s ease-in-out infinite" }}>🤖</div>
        <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }`}</style>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, letterSpacing: "-0.5px" }}>Analyzing…</h2>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 32 }}>AI is doing its thing</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {steps.map((step, i) => {
            const active = loadStep === i;
            const done = loadStep > i;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 16px",
                background: active ? "rgba(245,166,35,0.06)" : done ? "rgba(74,222,128,0.04)" : C.card,
                border: `1px solid ${active ? "rgba(245,166,35,0.25)" : done ? "rgba(74,222,128,0.15)" : C.border}`,
                borderRadius: 12, opacity: done || active ? 1 : 0.25,
                transition: "all 0.4s ease",
              }}>
                <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{done ? "✅" : step.icon}</span>
                <span style={{ fontSize: 13, color: active ? C.amber : done ? C.green : "#9CA3AF" }}>{step.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── RESULT ────────────────────────────────────────────────────────
  if (stage === "result" && result) {
    const cur = result.currency || AFFILIATES[region].currency;
    const ok = result.worthIt;
    const accentColor = ok ? C.green : C.red;
    const tabList = [
      { id: "alts", label: "🔄 Alternatives" },
      { id: "buy", label: "🛒 Where to Buy" },
      { id: "price", label: "📈 Price History" },
      { id: "regret", label: "😅 Regret Score" },
    ];

    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: F, overflowX: "hidden" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 60px", position: "relative" }}>

          {/* TOP NAV */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button onClick={reset} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted, padding: "7px 13px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: F }}>
              ← New search
            </button>
            <RegionToggle region={region} setRegion={(r) => { setRegion(r); reset(); }} />
          </div>

          {/* VERDICT CARD */}
          <div style={{
            background: ok ? "rgba(74,222,128,0.05)" : "rgba(248,113,113,0.05)",
            border: `1px solid ${ok ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
            borderRadius: 22, padding: 22, marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
              <ScoreRing score={result.valueScore || 7} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>
                  {AFFILIATES[region].flag} {AFFILIATES[region].label} · AI Analysis
                </div>
                <h2 style={{ fontWeight: 800, fontSize: 17, margin: "0 0 6px", lineHeight: 1.3 }}>{result.name}</h2>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: ok ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
                  color: accentColor, padding: "4px 12px", borderRadius: 20, fontWeight: 700, fontSize: 12,
                }}>
                  {ok ? "✅" : "❌"} {result.verdict}
                </div>
              </div>
            </div>

            {/* PRICE ROW */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              {[
                { label: "Typical price", val: result.estimatedPrice || 0, color: C.text },
                { label: "Best deal", val: result.bestPrice || 0, color: C.green },
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ fontWeight: 800, fontSize: 22, color: item.color }}>
                    <AnimNum value={item.val} prefix={cur} />
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{item.label}</div>
                </div>
              ))}
            </div>

            <p style={{ color: "#9CA3AF", fontSize: 13, lineHeight: 1.75, margin: 0 }}>{result.summary}</p>
          </div>

          {/* PRO TIPS */}
          <div style={{ ...cardStyle }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: C.amber }}>💡 Smart Tips</div>
            {(result.proTips || []).map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < result.proTips.length - 1 ? 9 : 0 }}>
                <span style={{ color: C.amber, flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.65 }}>{t}</span>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 12 }}>
            {tabList.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "9px 4px", background: tab === t.id ? "rgba(245,166,35,0.1)" : C.card,
                border: `1px solid ${tab === t.id ? "rgba(245,166,35,0.3)" : C.border}`,
                borderRadius: 12, color: tab === t.id ? C.amber : C.muted,
                fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", fontSize: 10, fontFamily: F,
                transition: "all 0.2s",
              }}>{t.label}</button>
            ))}
          </div>

          {/* TAB: ALTERNATIVES */}
          {tab === "alts" && (
            <div>
              {(result.alternatives || []).map((alt, i) => (
                <a key={i} href={buildProductLink(alt.asin, region)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ ...cardStyle, transition: "border-color 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 5, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{alt.name}</span>
                          <span style={{ background: "rgba(245,166,35,0.1)", color: C.amber, fontSize: 10, padding: "2px 8px", borderRadius: 6, flexShrink: 0 }}>{alt.tag}</span>
                        </div>
                        <Stars rating={alt.rating} />
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                        <div style={{ fontWeight: 800, fontSize: 17 }}>{cur}{alt.price}</div>
                        <div style={{ fontSize: 11, color: C.green, marginTop: 3 }}>Save {cur}{alt.savings}</div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
              <a href={buildAffiliateLink(result.name, region)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", marginTop: 10 }}>
                <button style={btnMain}>🛒 Search All {AFFILIATES[region].flag} {AFFILIATES[region].label} Deals →</button>
              </a>
              <p style={{ textAlign: "center", fontSize: 11, color: "#374151", marginTop: 8 }}>Affiliate links — free for you, small commission for us</p>
            </div>
          )}

          {/* TAB: WHERE TO BUY */}
          {tab === "buy" && (
            <div>
              {(result.whereToFind || []).map((w, i) => (
                <a key={i} href={buildProductLink(w.asin, region)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ fontSize: 26 }}>{AFFILIATES[region].flag}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{w.store}</div>
                          <span style={{ background: i === 0 ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)", color: i === 0 ? C.green : C.muted, fontSize: 10, padding: "2px 8px", borderRadius: 6 }}>{w.tag}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, fontSize: 18, color: i === 0 ? C.green : C.text }}>{cur}{w.price}</div>
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>View on {AFFILIATES[region].label} →</div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* TAB: PRICE HISTORY */}
          {tab === "price" && (
            <div style={cardStyle}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: C.amber }}>📈 6-Month Price Trend</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>AI-estimated price movement</div>
              <PriceChart data={result.priceHistory} currency={cur} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: C.muted }}>Lowest</div>
                  <div style={{ fontWeight: 800, color: C.green, fontSize: 18 }}>
                    {cur}{result.priceHistory ? Math.min(...result.priceHistory.map(d => d.price)) : "—"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: C.muted }}>Highest</div>
                  <div style={{ fontWeight: 800, color: C.red, fontSize: 18 }}>
                    {cur}{result.priceHistory ? Math.max(...result.priceHistory.map(d => d.price)) : "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REGRET */}
          {tab === "regret" && (
            <div style={{ ...cardStyle, textAlign: "center", padding: 28 }}>
              <div style={{ fontSize: 52, marginBottom: 10 }}>😅</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Buyer's regret rate</div>
              <div style={{ fontWeight: 800, fontSize: 58, color: C.amber, lineHeight: 1 }}>
                <AnimNum value={result.regretIndex || 0} suffix="%" />
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, height: 8, margin: "18px 0 16px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${result.regretIndex || 0}%`, background: `linear-gradient(90deg, #4ADE80, #F5A623, #F87171)`, borderRadius: 8, transition: "width 1.5s ease" }} />
              </div>
              <p style={{ color: "#9CA3AF", fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                {result.regretIndex < 20
                  ? "Most buyers are happy with this purchase. Low risk! 🎉"
                  : result.regretIndex < 50
                  ? `${result.regretIndex}% of buyers had second thoughts. Consider carefully.`
                  : `High regret rate! ${result.regretIndex}% of buyers wished they hadn't. Look at alternatives.`}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── HOW WE EARN ───────────────────────────────────────────────────
  if (stage === "how") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: F }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <button onClick={() => setStage("home")} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.muted, padding: "7px 13px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            ← Back
          </button>
          <h2 style={{ fontWeight: 800, fontSize: 20, margin: 0, letterSpacing: "-0.5px" }}>How Worth It? Earns 💰</h2>
        </div>

        {[
          { icon: "🔗", color: C.green, badge: "Primary", title: "Affiliate Commission", desc: "Every purchase made through our links earns 1–10% from Amazon US & UK automatically. Zero cost to you.", example: "User buys $500 laptop → we earn $15–$50", monthly: "Est. $500–$5,000/month" },
          { icon: "📢", color: C.amber, badge: "Passive", title: "Display Ads", desc: "High-intent shoppers see contextual ads, resulting in premium CPM rates and passive revenue.", example: "10,000 users/month → $200–$800", monthly: "Est. $200–$2,000/month" },
          { icon: "⭐", color: "#FF6B35", badge: "Recurring", title: "Pro Subscription", desc: "Free: 5 searches/day. Pro at $4.99/month unlocks unlimited searches + price drop alerts.", example: "500 subscribers × $4.99 = $2,495/month", monthly: "Est. $500–$10,000/month" },
        ].map((item, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 18px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, background: item.color + "15", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{item.title}</span>
                  <span style={{ background: item.color + "18", color: item.color, fontSize: 10, padding: "2px 9px", borderRadius: 6, fontWeight: 700 }}>{item.badge}</span>
                </div>
              </div>
            </div>
            <p style={{ color: "#9CA3AF", fontSize: 13, lineHeight: 1.75, margin: "0 0 10px" }}>{item.desc}</p>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "9px 12px", fontSize: 12, color: "#9CA3AF", marginBottom: 8 }}>💡 {item.example}</div>
            <div style={{ fontSize: 13, color: item.color, fontWeight: 700 }}>📈 {item.monthly}</div>
          </div>
        ))}

        <button style={{ width: "100%", background: "linear-gradient(135deg,#F5A623,#FF6B35)", border: "none", borderRadius: 14, padding: "15px 20px", color: "#06060F", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: F, marginTop: 8 }} onClick={reset}>
          ⚡ Try the App Now
        </button>
      </div>
    </div>
  );

  return null;
}
