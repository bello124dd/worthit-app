const AFFILIATE_TAG = "worthit0ac-20";

const buildAffiliateLink = (query) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;

const buildProductLink = (asin) =>
  `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;

const mockAnalyze = async (query) => {
  await new Promise((r) => setTimeout(r, 2400));
  return {
    name: query,
    verdict: "Overpriced",
    verdictType: "warning",
    score: 68,
    worthIt: false,
    yourPrice: 349,
    summary: "You can get nearly identical quality for $100 less.",
    whereToFind: [
      { store: "Amazon", price: 279, asin: "B09XS7JWHH", tag: "Best Deal" },
      { store: "Amazon Warehouse", price: 229, asin: "B09XS7JWHH", tag: "Open Box" },
    ],
    alternatives: [
      { name: "Sony WH-1000XM4", price: 198, rating: 4.7, savings: 151, tag: "Best Value", asin: "B0863TXGM3" },
      { name: "Bose QC45", price: 229, rating: 4.5, savings: 120, tag: "Premium Alt", asin: "B098FKXT8L" },
      { name: "Anker Q45", price: 55, rating: 4.3, savings: 294, tag: "Budget Pick", asin: "A2DUFM3W6A" },
    ],
    regretIndex: 38,
    proTips: [
      "Price dropped $50 in the last 2 months",
      "Expected sale during Prime Day",
    ],
  };
};

const { useState, useEffect } = React;

const Stars = ({ rating }) => (
  React.createElement("span", { style: { color: "#F5A623", fontSize: "12px" } },
    "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating)) + ` ${rating}`
  )
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
  return React.createElement("span", null, `${prefix}${n.toLocaleString()}${suffix}`);
};

function App() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("home");
  const [result, setResult] = useState(null);
  const [loadTxt, setLoadTxt] = useState("");
  const [tab, setTab] = useState("alts");

  const steps = [
    "🔍 Identifying product...",
    "💹 Scanning 20+ stores...",
    "🤖 AI analyzing value...",
    "✅ Done!",
  ];

  const quickSearches = ["iPhone 15", "AirPods Pro", "Sony WH-1000XM5", "MacBook Air"];

  const handleSearch = async (q) => {
    const search = q || query;
    if (!search.trim()) return;
    setStage("loading");
    steps.forEach((s, i) => setTimeout(() => setLoadTxt(s), i * 550));
    const data = await mockAnalyze(search);
    setResult(data);
    setStage("result");
    setTab("alts");
  };

  const reset = () => { setStage("home"); setQuery(""); setResult(null); };

  const C = {
    bg: "#080810", card: "rgba(255,255,255,0.035)",
    border: "rgba(255,255,255,0.08)", accent: "#F5A623",
    accentAlt: "#FF6B35", green: "#4ADE80", red: "#F87171",
    text: "#EDE9E3", muted: "#6B7280",
  };

  const s = {
    wrap: { minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" },
    inner: { maxWidth:480, margin:"0 auto", padding:"0 20px", position:"relative" },
    nav: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0 0" },
    logo: { display:"flex", alignItems:"center", gap:9 },
    logoIcon: { width:34, height:34, background:"linear-gradient(135deg,#F5A623,#FF6B35)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 },
    logoText: { fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:18 },
    navBtn: { background:C.card, border:`1px solid ${C.border}`, color:C.muted, padding:"7px 14px", borderRadius:20, cursor:"pointer", fontSize:12 },
    hero: { textAlign:"center", marginBottom:44, paddingTop:52 },
    h1: { fontFamily:"Syne,sans-serif", fontSize:36, fontWeight:800, lineHeight:1.15, margin:"0 0 14px", letterSpacing:"-1px" },
    grad: { background:"linear-gradient(90deg,#F5A623,#FF6B35)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
    sub: { color:C.muted, fontSize:15, lineHeight:1.75, margin:0 },
    searchBox: { background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:20, marginBottom:16 },
    input: { width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, borderRadius:13, padding:"14px 16px", color:C.text, fontSize:14, boxSizing:"border-box", fontFamily:"DM Sans,sans-serif" },
    btnMain: { width:"100%", marginTop:12, background:"linear-gradient(135deg,#F5A623,#FF6B35)", border:"none", borderRadius:13, padding:15, color:"#080810", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"Syne,sans-serif" },
    chips: { display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:44 },
    chip: { background:C.card, border:`1px solid ${C.border}`, color:"#9CA3AF", padding:"7px 14px", borderRadius:20, cursor:"pointer", fontSize:12 },
    stats: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:32 },
    statCard: { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 8px", textAlign:"center" },
    statNum: { fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#F5A623" },
    statLbl: { fontSize:10, color:C.muted, marginTop:4 },
    infoBox: { background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:14, padding:16, display:"flex", gap:10, marginBottom:48 },
    card: { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:10 },
    tabs: { display:"flex", gap:8, marginBottom:14 },
  };

  if (stage === "home") return React.createElement("div", { style: s.wrap },
    React.createElement("div", { style: s.inner },
      React.createElement("nav", { style: s.nav },
        React.createElement("div", { style: s.logo },
          React.createElement("div", { style: s.logoIcon }, "⚡"),
          React.createElement("span", { style: s.logoText }, "Worth It?")
        ),
        React.createElement("button", { style: s.navBtn, onClick: () => setStage("how") }, "How we earn 💰")
      ),
      React.createElement("div", { style: s.hero },
        React.createElement("div", { style: { fontSize:64, marginBottom:18 } }, "🛒"),
        React.createElement("h1", { style: s.h1 },
          "Before you buy, ",
          React.createElement("span", { style: s.grad }, "ask us first.")
        ),
        React.createElement("p", { style: s.sub }, "AI price analysis across 20+ stores. Know if it's worth it in 3 seconds.")
      ),
      React.createElement("div", { style: s.searchBox },
        React.createElement("input", { style: s.input, value: query, onChange: e => setQuery(e.target.value), onKeyDown: e => e.key === "Enter" && handleSearch(), placeholder: 'Try "iPhone 15" or "Sony headphones"' }),
        React.createElement("button", { style: s.btnMain, onClick: () => handleSearch() }, "⚡ Analyze for Free")
      ),
      React.createElement("div", { style: s.chips },
        quickSearches.map(q => React.createElement("button", { key: q, style: s.chip, onClick: () => handleSearch(q) }, q))
      ),
      React.createElement("div", { style: s.stats },
        [{ n:"20+", l:"Stores compared" }, { n:"94%", l:"Accuracy rate" }, { n:"<3s", l:"Result time" }].map(x =>
          React.createElement("div", { key: x.l, style: s.statCard },
            React.createElement("div", { style: s.statNum }, x.n),
            React.createElement("div", { style: s.statLbl }, x.l)
          )
        )
      ),
      React.createElement("div", { style: s.infoBox },
        React.createElement("span", { style: { fontSize:20 } }, "💡"),
        React.createElement("div", null,
          React.createElement("div", { style: { fontWeight:600, fontSize:13, color:"#4ADE80", marginBottom:4 } }, "100% Free — Always"),
          React.createElement("p", { style: { color:C.muted, fontSize:12, margin:0, lineHeight:1.7 } }, "We earn a small Amazon affiliate commission when you buy through our links — at zero extra cost to you.")
        )
      )
    )
  );

  if (stage === "loading") return React.createElement("div", { style: { ...s.wrap, display:"flex", alignItems:"center", justifyContent:"center" } },
    React.createElement("div", { style: { textAlign:"center", padding:40 } },
      React.createElement("div", { style: { fontSize:64, marginBottom:24 } }, "🔍"),
      React.createElement("h2", { style: { fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, marginBottom:10 } }, "Analyzing..."),
      React.createElement("p", { style: { color:C.muted, fontSize:14, minHeight:22 } }, loadTxt),
      React.createElement("div", { style: { marginTop:32, maxWidth:360, margin:"32px auto 0" } },
        steps.map((step, i) =>
          React.createElement("div", { key: i, style: { display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background: loadTxt===step ? "rgba(245,166,35,0.07)" : C.card, border:`1px solid ${loadTxt===step ? "rgba(245,166,35,0.3)" : C.border}`, borderRadius:10, marginBottom:8, opacity: loadTxt===step ? 1 : 0.3 } },
            React.createElement("div", { style: { width:7, height:7, background: loadTxt===step ? "#F5A623":"#333", borderRadius:"50%", flexShrink:0 } }),
            React.createElement("span", { style: { fontSize:13, color:"#bbb" } }, step)
          )
        )
      )
    )
  );

  if (stage === "result" && result) return React.createElement("div", { style: s.wrap },
    React.createElement("div", { style: { ...s.inner, paddingTop:24, paddingBottom:48 } },
      React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 } },
        React.createElement("button", { style: s.navBtn, onClick: reset }, "← New search"),
        React.createElement("span", { style: { fontSize:12, color:C.muted } }, "Analysis complete")
      ),
      React.createElement("div", { style: { background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:22, padding:24, marginBottom:14, textAlign:"center" } },
        React.createElement("div", { style: { fontSize:52, marginBottom:10 } }, "❌"),
        React.createElement("h2", { style: { fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:800, margin:"0 0 10px" } }, result.name),
        React.createElement("div", { style: { display:"inline-block", background:"rgba(248,113,113,0.15)", color:"#F87171", padding:"6px 20px", borderRadius:20, fontWeight:700, fontSize:14, marginBottom:16 } }, result.verdict),
        React.createElement("div", { style: { display:"flex", justifyContent:"center", gap:32, marginBottom:14 } },
          React.createElement("div", null,
            React.createElement("div", { style: { fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800 } },
              React.createElement(AnimNum, { value: result.yourPrice, prefix:"$" })
            ),
            React.createElement("div", { style: { fontSize:11, color:C.muted, marginTop:2 } }, "Your price")
          ),
          React.createElement("div", { style: { width:1, background:C.border } }),
          React.createElement("div", null,
            React.createElement("div", { style: { fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:"#4ADE80" } },
              React.createElement(AnimNum, { value: result.whereToFind[0].price, prefix:"$" })
            ),
            React.createElement("div", { style: { fontSize:11, color:C.muted, marginTop:2 } }, "Best price found")
          )
        ),
        React.createElement("p", { style: { color:"#9CA3AF", fontSize:13, lineHeight:1.7, margin:0 } }, result.summary)
      ),
      React.createElement("div", { style: { ...s.card, marginBottom:14 } },
        React.createElement("div", { style: { fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:14, marginBottom:10 } }, "💡 Pro Tips"),
        result.proTips.map((t, i) =>
          React.createElement("div", { key:i, style: { display:"flex", gap:8, marginBottom: i<result.proTips.length-1?8:0 } },
            React.createElement("span", { style: { color:"#F5A623" } }, "→"),
            React.createElement("span", { style: { fontSize:13, color:"#9CA3AF", lineHeight:1.6 } }, t)
          )
        )
      ),
      React.createElement("div", { style: s.tabs },
        [{ id:"alts", label:"🔄 Alternatives" }, { id:"buy", label:"🛒 Where to Buy" }, { id:"regret", label:"😅 Regret" }].map(t =>
          React.createElement("button", { key:t.id, onClick:()=>setTab(t.id), style: { flex:1, padding:"9px 4px", background: tab===t.id?"rgba(245,166,35,0.12)":C.card, border:`1px solid ${tab===t.id?"rgba(245,166,35,0.35)":C.border}`, borderRadius:11, color: tab===t.id?"#F5A623":C.muted, fontWeight: tab===t.id?700:400, cursor:"pointer", fontSize:11 } }, t.label)
        )
      ),
      tab === "alts" && React.createElement("div", null,
        result.alternatives.map((alt, i) =>
          React.createElement("a", { key:i, href: buildProductLink(alt.asin), target:"_blank", rel:"noopener noreferrer", style:{ textDecoration:"none" } },
            React.createElement("div", { style: s.card },
              React.createElement("div", { style:{ display:"flex", justifyContent:"space-between", alignItems:"center" } },
                React.createElement("div", null,
                  React.createElement("div", { style:{ display:"flex", gap:8, alignItems:"center", marginBottom:5 } },
                    React.createElement("span", { style:{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:14, color:C.text } }, alt.name),
                    React.createElement("span", { style:{ background:"rgba(245,166,35,0.12)", color:"#F5A623", fontSize:10, padding:"2px 8px", borderRadius:6 } }, alt.tag)
                  ),
                  React.createElement(Stars, { rating: alt.rating })
                ),
                React.createElement("div", { style:{ textAlign:"right" } },
                  React.createElement("div", { style:{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:17, color:C.text } }, `$${alt.price}`),
                  React.createElement("div", { style:{ fontSize:11, color:"#4ADE80", marginTop:2 } }, `Save $${alt.savings}`)
                )
              )
            )
          )
        ),
        React.createElement("a", { href: buildAffiliateLink(result.name), target:"_blank", rel:"noopener noreferrer", style:{ textDecoration:"none", display:"block", marginTop:8 } },
          React.createElement("button", { style: s.btnMain }, "🛒 Search All Amazon Deals →")
        ),
        React.createElement("p", { style:{ textAlign:"center", fontSize:11, color:"#374151", marginTop:8 } }, "Affiliate links — free for you, small commission for us")
      ),
      tab === "buy" && React.createElement("div", null,
        result.whereToFind.map((w, i) =>
          React.createElement("a", { key:i, href: buildProductLink(w.asin), target:"_blank", rel:"noopener noreferrer", style:{ textDecoration:"none" } },
            React.createElement("div", { style: s.card },
              React.createElement("div", { style:{ display:"flex", justifyContent:"space-between", alignItems:"center" } },
                React.createElement("div", { style:{ display:"flex", gap:12, alignItems:"center" } },
                  React.createElement("div", { style:{ fontSize:24 } }, "🛒"),
                  React.createElement("div", null,
                    React.createElement("div", { style:{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:14 } }, w.store),
                    React.createElement("span", { style:{ background: i===0?"rgba(74,222,128,0.12)":"rgba(255,255,255,0.06)", color: i===0?"#4ADE80":C.muted, fontSize:10, padding:"2px 8px", borderRadius:6 } }, w.tag)
                  )
                ),
                React.createElement("div", { style:{ textAlign:"right" } },
                  React.createElement("div", { style:{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:18, color: i===0?"#4ADE80":C.text } }, `$${w.price}`),
                  React.createElement("div", { style:{ fontSize:10, color:C.muted, marginTop:2 } }, "View on Amazon →")
                )
              )
            )
          )
        )
      ),
      tab === "regret" && React.createElement("div", { style:{ ...s.card, textAlign:"center", padding:28 } },
        React.createElement("div", { style:{ fontSize:52, marginBottom:12 } }, "😅"),
        React.createElement("div", { style:{ fontSize:13, color:C.muted, marginBottom:8 } }, "Buyer's regret rate"),
        React.createElement("div", { style:{ fontFamily:"Syne,sans-serif", fontSize:52, fontWeight:800, color:"#F5A623" } },
          React.createElement(AnimNum, { value: result.regretIndex, suffix:"%" })
        ),
        React.createElement("div", { style:{ background:"rgba(255,255,255,0.05)", borderRadius:8, height:8, margin:"16px 0", overflow:"hidden" } },
          React.createElement("div", { style:{ height:"100%", width:`${result.regretIndex}%`, background:"#F5A623", borderRadius:8, transition:"width 1.5s ease" } })
        ),
        React.createElement("p", { style:{ color:"#9CA3AF", fontSize:13, lineHeight:1.75, margin:0 } },
          `${result.regretIndex}% of buyers regretted this purchase. Think carefully before buying.`
        )
      )
    )
  );

  if (stage === "how") return React.createElement("div", { style: s.wrap },
    React.createElement("div", { style: { ...s.inner, paddingTop:24, paddingBottom:48 } },
      React.createElement("div", { style:{ display:"flex", alignItems:"center", gap:12, marginBottom:28 } },
        React.createElement("button", { style: s.navBtn, onClick:()=>setStage("home") }, "← Back"),
        React.createElement("h2", { style:{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:20, margin:0 } }, "How Worth It? Earns 💰")
      ),
      [
        { icon:"🔗", color:"#4ADE80", badge:"Primary", title:"Affiliate Commission", desc:"Every purchase through our links earns us 1–10% from Amazon. Your tag worthit0ac-20 is on every link automatically.", example:"User buys $500 laptop → you earn $15–$50", monthly:"Est. $500–$5,000/month" },
        { icon:"📢", color:"#F5A623", badge:"Passive", title:"Display Ads", desc:"Contextual ads shown alongside results. High-intent shoppers = premium ad rates.", example:"10,000 users/month → $200–$800", monthly:"Est. $200–$2,000/month" },
        { icon:"⭐", color:"#FF6B35", badge:"Recurring", title:"Pro Subscription", desc:"Free: 5 searches/day. Pro at $4.99/month = unlimited searches + price alerts.", example:"500 Pro users × $4.99 = $2,495/month", monthly:"Est. $500–$10,000/month" },
      ].map((item, i) =>
        React.createElement("div", { key:i, style:{ ...s.card, marginBottom:14 } },
          React.createElement("div", { style:{ display:"flex", alignItems:"center", gap:13, marginBottom:12 } },
            React.createElement("div", { style:{ width:44, height:44, background:`${item.color}18`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 } }, item.icon),
            React.createElement("div", null,
              React.createElement("div", { style:{ display:"flex", gap:8, alignItems:"center" } },
                React.createElement("span", { style:{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:15 } }, item.title),
                React.createElement("span", { style:{ background:`${item.color}18`, color:item.color, fontSize:10, padding:"2px 9px", borderRadius:6, fontWeight:700 } }, item.badge)
              )
            )
          ),
          React.createElement("p", { style:{ color:"#9CA3AF", fontSize:13, lineHeight:1.75, margin:"0 0 10px" } }, item.desc),
          React.createElement("div", { style:{ background:"rgba(255,255,255,0.04)", borderRadius:9, padding:"9px 12px", fontSize:12, color:"#bbb", marginBottom:8 } }, `💡 Example: ${item.example}`),
          React.createElement("div", { style:{ fontSize:13, color:item.color, fontWeight:700 } }, `📈 ${item.monthly}`)
        )
      ),
      React.createElement("div", { style:{ background:"linear-gradient(135deg,rgba(245,166,35,0.1),rgba(255,107,53,0.06))", border:"1px solid rgba(245,166,35,0.25)", borderRadius:18, padding:24, textAlign:"center", marginBottom:20 } },
        React.createElement("div", { style:{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13, color:"#F5A623", marginBottom:8 } }, "🎯 Combined Monthly Estimate"),
        React.createElement("div", { style:{ fontFamily:"Syne,sans-serif", fontSize:34, fontWeight:800 } }, "$1,200 — $17,000"),
        React.createElement("div", { style:{ color:C.muted, fontSize:13, marginTop:6 } }, "per month after 6–12 months of growth")
      ),
      React.createElement("button", { style: s.btnMain, onClick: reset }, "⚡ Try the App Now")
    )
  );

  return null;
}

ReactDOM.render(React.createElement(App), document.getElementById("root"));
