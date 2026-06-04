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

const analyzeWithAI = async (query, region) => {
  const cur = AFFILIATES[region].currency;
  const store = AFFILIATES[region].label;

  const response = await fetch("/.netlify/functions/analyze", {
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

  // HOME
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
      ),
      e("div", { style:{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:14, padding:16, display:"flex", gap:10 } },
        e("span", { style:{ fontSize:20 } }, "💡"),
        e("div", null,
          e("div", { style:{ fontWeight:700, fontSize:13, color:"#4ADE80", marginBottom:4 } }, "Powered by AI"),
          e("p", { style:{ color:C.muted, fontSize:12, margin:0, lineHeight:1.7 } }, "Real AI analysis for US & UK Amazon. We earn a small affiliate commission on purchases.")
        )
      )
    )
  );

  // LOADING
  if (stage === "loading") return e("div", { style:{ ...s.wrap, display:"flex", alignItems:"center", justifyContent:"center" } },
    e("div", { style:{ textAlign:"center", padding:40 } },
      e("div", { style:{ fontSize:64, marginBottom:24 } }, "🤖"),
      e("h2", { style:{ fontWeight:800, fontSize:24, marginBottom:10 } }, "🤖 AI is analyzing…"),
      e("p", { style:{ color:C.muted, fontSize:14, minHeight:22 } }, loadTxt),
      e("div", { style:{ marginTop:32, maxWidth:360, margin:"32px auto 0" } },
        steps.map((step,i) =>
          e("div", { key:i, style:{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background: loadTxt===step?"rgba(245,166,35,0.07)":C.card, border:`1px solid ${loadTxt===step?"rgba(245,166,35,0.3)":C.border}`, borderRadius:10, marginBottom:8, opacity: loadTxt===step?1:0.3 } },
            e("div", { style:{ width:7, height:7, background: loadTxt===step?"#F5A623":"#333", borderRadius:"50%", flexShrink:0 } }),
            e("span", { style:{ fontSize:13, color:"#bbb" } }, step)
          )
        )
      )
    )
  );

  // RESULT
  if (stage === "result" && result) {
    const cur = result.currency;
    const ok = result.worthIt;
    return e("div", { style:s.wrap },
      e("div", { style:{ ...s.inner, paddingTop:24 } },
        e("div", { style:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 } },
          e("button", { style:s.navBtn, onClick:reset }, "← New search"),
          e(RegionToggle, { region, setRegion:(r)=>{ setRegion(r); reset(); } })
        ),
        e("div", { style:{ background: ok?"rgba(74,222,128,0.07)":"rgba(248,113,113,0.07)", border: ok?"1px solid rgba(74,222,128,0.25)":"1px solid rgba(248,113,113,0.25)", borderRadius:22, padding:24, marginBottom:14, textAlign:"center" } },
          e("div", { style:{ fontSize:52, marginBottom:10 } }, ok?"✅":"❌"),
          e("h2", { style:{ fontWeight:800, fontSize:20, margin:"0 0 6px" } }, result.name),
          e("div", { style:{ fontSize:12, color:"#9CA3AF", marginBottom:10 } }, "AI Analysis · " + AFFILIATES[region].flag + " " + AFFILIATES[region].label),
          e("div", { style:{ display:"inline-block", background: ok?"rgba(74,222,128,0.15)":"rgba(248,113,113,0.15)", color: ok?"#4ADE80":"#F87171", padding:"6px 20px", borderRadius:20, fontWeight:700, fontSize:14, marginBottom:16 } }, result.verdict),
          e("div", { style:{ display:"flex", justifyContent:"center", gap:32, marginBottom:14 } },
            e("div", null,
              e("div", { style:{ fontWeight:800, fontSize:26 } }, e(AnimNum, { value:result.estimatedPrice||0, prefix:cur })),
              e("div", { style:{ fontSize:11, color:C.muted, marginTop:2 } }, "Typical price")
            ),
            e("div", { style:{ width:1, background:C.border } }),
            e("div", null,
              e("div", { style:{ fontWeight:800, fontSize:26, color:"#4ADE80" } }, e(AnimNum, { value:result.bestPrice||0, prefix:cur })),
              e("div", { style:{ fontSize:11, color:C.muted, marginTop:2 } }, "Best price found")
            )
          ),
          e("p", { style:{ color:"#9CA3AF", fontSize:13, lineHeight:1.7, margin:0 } }, result.summary)
        ),
        e("div", { style:{ ...s.card, marginBottom:14 } },
          e("div", { style:{ fontWeight:700, fontSize:14, marginBottom:10 } }, "💡 💡 Smart Tips"),
          (result.proTips||[]).map((t,i) =>
            e("div", { key:i, style:{ display:"flex", gap:8, marginBottom:i<result.proTips.length-1?8:0 } },
              e("span", { style:{ color:"#F5A623" } }, "→"),
              e("span", { style:{ fontSize:13, color:"#9CA3AF", lineHeight:1.6 } }, t)
            )
          )
        ),
        e("div", { style:{ display:"flex", gap:8, marginBottom:14 } },
          [{ id:"alts", label:"🔄 Alternatives" },{ id:"buy", label:"🛒 Where to Buy" },{ id:"regret", label:"😅 Regret" }].map(t =>
            e("button", { key:t.id, onClick:()=>setTab(t.id), style:{ flex:1, padding:"9px 4px", background: tab===t.id?"rgba(245,166,35,0.12)":C.card, border:`1px solid ${tab===t.id?"rgba(245,166,35,0.35)":C.border}`, borderRadius:11, color: tab===t.id?"#F5A623":C.muted, fontWeight: tab===t.id?700:400, cursor:"pointer", fontSize:11, fontFamily:F } }, t.label)
          )
        ),
        tab==="alts" && e("div", null,
          (result.alternatives||[]).map((alt,i) =>
            e("a", { key:i, href:buildProductLink(alt.asin,region), target:"_blank", rel:"noopener noreferrer", style:{ textDecoration:"none" } },
              e("div", { style:s.card },
                e("div", { style:{ display:"flex", justifyContent:"space-between", alignItems:"center" } },
                  e("div", null,
                    e("div", { style:{ display:"flex", gap:8, alignItems:"center", marginBottom:5 } },
                      e("span", { style:{ fontWeight:700, fontSize:13, color:C.text } }, alt.name),
                      e("span", { style:{ background:"rgba(245,166,35,0.12)", color:"#F5A623", fontSize:10, padding:"2px 8px", borderRadius:6 } }, alt.tag)
                    ),
                    e(Stars, { rating:alt.rating })
                  ),
                  e("div", { style:{ textAlign:"right" } },
                    e("div", { style:{ fontWeight:800, fontSize:16, color:C.text } }, cur+alt.price),
                    e("div", { style:{ fontSize:11, color:"#4ADE80", marginTop:2 } }, "Save "+cur+alt.savings)
                  )
                )
              )
            )
          ),
          e("a", { href:buildAffiliateLink(result.name,region), target:"_blank", rel:"noopener noreferrer", style:{ textDecoration:"none", display:"block", marginTop:8 } },
            e("button", { style:s.btnMain }, "🛒 Search All "+AFFILIATES[region].flag+" "+AFFILIATES[region].label+" Deals →")
          ),
          e("p", { style:{ textAlign:"center", fontSize:11, color:"#374151", marginTop:8 } }, "Affiliate links — free for you, small commission for us")
        ),
        tab==="buy" && e("div", null,
          (result.whereToFind||[]).map((w,i) =>
            e("a", { key:i, href:buildProductLink(w.asin,region), target:"_blank", rel:"noopener noreferrer", style:{ textDecoration:"none" } },
              e("div", { style:s.card },
                e("div", { style:{ display:"flex", justifyContent:"space-between", alignItems:"center" } },
                  e("div", { style:{ display:"flex", gap:12, alignItems:"center" } },
                    e("div", { style:{ fontSize:24 } }, AFFILIATES[region].flag),
                    e("div", null,
                      e("div", { style:{ fontWeight:700, fontSize:14 } }, w.store),
                      e("span", { style:{ background:i===0?"rgba(74,222,128,0.12)":"rgba(255,255,255,0.06)", color:i===0?"#4ADE80":C.muted, fontSize:10, padding:"2px 8px", borderRadius:6 } }, w.tag)
                    )
                  ),
                  e("div", { style:{ textAlign:"right" } },
                    e("div", { style:{ fontWeight:800, fontSize:18, color:i===0?"#4ADE80":C.text } }, cur+w.price),
                    e("div", { style:{ fontSize:10, color:C.muted, marginTop:2 } }, "View on "+AFFILIATES[region].label+" →")
                  )
                )
              )
            )
          )
        ),
        tab==="regret" && e("div", { style:{ ...s.card, textAlign:"center", padding:28 } },
          e("div", { style:{ fontSize:52, marginBottom:12 } }, "😅"),
          e("div", { style:{ fontSize:13, color:C.muted, marginBottom:8 } }, "Buyer's regret rate"),
          e("div", { style:{ fontWeight:800, fontSize:52, color:"#F5A623" } }, e(AnimNum, { value:result.regretIndex||0, suffix:"%" })),
          e("div", { style:{ background:"rgba(255,255,255,0.05)", borderRadius:8, height:8, margin:"16px 0", overflow:"hidden" } },
            e("div", { style:{ height:"100%", width:`${result.regretIndex||0}%`, background:"#F5A623", borderRadius:8, transition:"width 1.5s ease" } })
          ),
          e("p", { style:{ color:"#9CA3AF", fontSize:13, lineHeight:1.75, margin:0 } }, `${result.regretIndex||0}% of buyers regretted this purchase.`)
        )
      )
    );
  }

  // HOW WE EARN
  if (stage === "how") return e("div", { style:s.wrap },
    e("div", { style:{ ...s.inner, paddingTop:24 } },
      e("div", { style:{ display:"flex", alignItems:"center", gap:12, marginBottom:28 } },
        e("button", { style:s.navBtn, onClick:()=>setStage("home") }, "← Back"),
        e("h2", { style:{ fontWeight:800, fontSize:20, margin:0 } }, "How Worth It? Earns 💰")
      ),
      [
        { icon:"🔗", color:"#4ADE80", badge:"Primary",  title:"Affiliate Commission", desc:"Every purchase earns 1–10% from Amazon US & UK automatically.", example:"User buys $500 laptop → earn $15–$50", monthly:"Est. $500–$5,000/month" },
        { icon:"📢", color:"#F5A623", badge:"Passive",   title:"Display Ads",          desc:"High-intent shoppers see contextual ads = premium rates.", example:"10,000 users/month → $200–$800", monthly:"Est. $200–$2,000/month" },
        { icon:"⭐", color:"#FF6B35", badge:"Recurring", title:"Pro Subscription",     desc:"Free: 5 searches/day. Pro $4.99/month = unlimited + alerts.", example:"500 users × $4.99 = $2,495/month", monthly:"Est. $500–$10,000/month" },
      ].map((item,i) =>
        e("div", { key:i, style:{ ...s.card, marginBottom:14 } },
          e("div", { style:{ display:"flex", alignItems:"center", gap:13, marginBottom:12 } },
            e("div", { style:{ width:44, height:44, background:item.color+"18", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 } }, item.icon),
            e("div", { style:{ display:"flex", gap:8, alignItems:"center" } },
              e("span", { style:{ fontWeight:700, fontSize:15 } }, item.title),
              e("span", { style:{ background:item.color+"18", color:item.color, fontSize:10, padding:"2px 9px", borderRadius:6, fontWeight:700 } }, item.badge)
            )
          ),
          e("p", { style:{ color:"#9CA3AF", fontSize:13, lineHeight:1.75, margin:"0 0 10px" } }, item.desc),
          e("div", { style:{ background:"rgba(255,255,255,0.04)", borderRadius:9, padding:"9px 12px", fontSize:12, color:"#bbb", marginBottom:8 } }, "💡 Example: "+item.example),
          e("div", { style:{ fontSize:13, color:item.color, fontWeight:700 } }, "📈 "+item.monthly)
        )
      ),
      e("button", { style:s.btnMain, onClick:reset }, "⚡ Try the App Now")
    )
  );

  return null;
}

ReactDOM.render(React.createElement(App), document.getElementById("root"));
