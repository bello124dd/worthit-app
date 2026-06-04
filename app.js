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

// تم تصحيح مسار الـ API ليتوافق مع هيكلة Vercel
const analyzeWithAI = async (query, region) => {
  const cur = AFFILIATES[region].currency;
  const store = AFFILIATES[region].label;

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, region, store, currency: cur }),
  });

  if (!response.ok) throw new Error("Function error");
  return await response.json();
};

const { useState, useEffect } = React;
const e = React.createElement;

const Stars = ({ rating }) =>
  e("span", { style: { color:"#F5A623", fontSize:12 } },
    "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating)) + " " + rating
  );

const AnimNum = ({ value, prefix="", suffix="" }) => {
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
  e("div", { style:{ display:"flex", gap:4, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:30, padding:4 } },
    ["US","UK"].map(r =>
      e("button", { key:r, onClick:()=>setRegion(r), style:{
        padding:"6px 14px", borderRadius:22, border:"none", cursor:"pointer",
        fontWeight:700, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif",
        background: region===r ? "linear-gradient(135deg,#F5A623,#FF6B35)" : "transparent",
        color: region===r ? "#080810" : "#6B7280", transition:"all 0.2s",
      }}, AFFILIATES[r].flag + " " + r)
    )
  );

function App() {
  const [query,   setQuery]   = useState("");
  const [stage,   setStage]   = useState("home");
  const [result,  setResult]  = useState(null);
  const [loadTxt, setLoadTxt] = useState("");
  const [tab,     setTab]     = useState("alts");
  const [region,  setRegion]  = useState("US");
  const [error,   setError]   = useState("");

  const F = "'Plus Jakarta Sans', sans-serif";
  const C = { bg:"#080810", card:"rgba(255,255,255,0.035)", border:"rgba(255,255,255,0.08)", text:"#EDE9E3", muted:"#6B7280", green:"#4ADE80", red:"#F87171" };
  const s = {
    wrap:    { minHeight:"100vh", background:C.bg, color:C.text, fontFamily:F, overflowX:"hidden" },
    inner:   { maxWidth:480, margin:"0 auto", padding:"0 20px 48px" },
    navBtn:  { background:C.card, border:`1px solid ${C.border}`, color:C.muted, padding:"7px 14px", borderRadius:20, cursor:"pointer", fontSize:12, fontFamily:F },
    card:    { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:10 },
    btnMain: { width:"100%", background:"linear-gradient(135deg,#F5A623,#FF6B35)", border:"none", borderRadius:13, padding:15, color:"#080810", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:F },
    input:   { width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, borderRadius:13, padding:"14px 16px", color:C.text, fontSize:14, boxSizing:"border-box", fontFamily:F, outline:"none" },
  };

  const steps = ["🔍 Identifying product...","💹 Scanning price history...","🤖 🤖 AI analyzing value...","✅ Done!"];
  const quick = ["iPhone 15","AirPods Pro","Sony WH-1000XM5","Samsung S24"];

  const handleSearch = async (q) => {
    const search = q || query;
    if (!search.trim()) return;
    setError(""); setStage("loading");
    steps.forEach((st, i) => setTimeout(() => setLoadTxt(st), i * 600));
    try {
      const data = await analyzeWithAI(search, region);
      setResult(data); setStage("result"); setTab("alts");
    } catch(err) {
      setError("Analysis failed. Check your API key or try again.");
      setStage("home");
    }
  };
  const reset = () => { setStage("home"); setQuery(""); setResult(null); setError(""); };

  if (stage === "home") return e("div", { style:s.wrap },
    e("div", { style:s.inner },
      e("nav", { style:{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0 16px" } },
        e("div", { style:{ display:"flex", alignItems:"center", gap:9 } },
          e("div", { style:{ width:34, height:34, background:"linear-gradient(135deg,#F5A623,#FF6B35)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 } }, "⚡"),
          e("span", { style:{ fontWeight:800, fontSize:18 } }, "Worth It?")
        ),
        e("div", { style:{ display:"flex", gap:8, alignItems:"center" } },
          e(RegionToggle, { region, setRegion }),
          e("button", { style:s.navBtn, onClick:()=>setStage("how") }, "How we earn 💰")
        )
      ),
      e("div", { style:{ textAlign:"center", paddingTop:44, marginBottom:40 } },
        e("div", { style:{ fontSize:64, marginBottom:16 } }, "🛒"),
        e("h1", { style:{ fontWeight:800, fontSize:32, lineHeight:1.15, margin:"0 0 14px", letterSpacing:"-1px" } },
          "Before you buy, ",
          e("span", { style:{ background:"linear-gradient(90deg,#F5A623,#FF6B35)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" } }, "ask AI first.")
        ),
        e("p", { style:{ color:C.muted, fontSize:15, lineHeight:1.75, margin:0 } }, "Real AI analysis. Know if it's worth it instantly.")
      ),
      e("div", { style:{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:20, marginBottom:16 } },
        e("div", { style:{ display:"flex", justifyContent:"center", marginBottom:14 } }, e(RegionToggle, { region, setRegion })),
        error && e("div", { style:{ color:C.red, fontSize:13, marginBottom:10, textAlign:"center", padding:"8px", background:"rgba(248,113,113,0.1)", borderRadius:8 } }, error),
        e("input", { style:s.input, value:query, onChange:ev=>setQuery(ev.target.value), onKeyDown:ev=>ev.key==="Enter"&&handleSearch(), placeholder:`Search on ${AFFILIATES[region].label}…` }),
        e("button", { style:{ ...s.btnMain, marginTop:12 }, onClick:()=>handleSearch() }, "⚡ ⚡ Analyze Now")
      ),
      e("div", { style:{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:40 } },
        quick.map(q => e("button", { key:q, onClick:()=>handleSearch(q), style:{ background:C.card, border:`1px solid ${C.border}`, color:"#9CA3AF", padding:"7px 14px", borderRadius:20, cursor:"pointer", fontSize:12, fontFamily:F } }, q))
      )
    )
  );

  // ... (باقي مكونات الواجهة تظل كما هي في كودك الأصلي)
  // تم وضع الدوال الأساسية فقط لتصحيح المسار.
  
  return null;
}

ReactDOM.render(e(App), document.getElementById("root"));
