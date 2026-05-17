import { useState, useEffect } from "react";

// =============================================================================
// 🛡️ MAMORU — 統合版 v0.5
// ホーム + Ep1〜4（探偵/フェイク/闇バイト/なりすまし）+ 攻撃者体験
// =============================================================================

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=DotGothic16&family=Share+Tech+Mono&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#0d0d1a;overscroll-behavior:none;}

    @keyframes float     {0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(2deg)}}
    @keyframes float2    {0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)}}
    @keyframes blink     {0%,100%{opacity:1} 50%{opacity:0.2}}
    @keyframes slideUp   {from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)}}
    @keyframes popIn     {0%{opacity:0;transform:scale(0.75)} 70%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)}}
    @keyframes shimmer   {0%{background-position:200% center} 100%{background-position:-200% center}}
    @keyframes orb       {0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.1)} 66%{transform:translate(-20px,10px) scale(0.95)}}
    @keyframes orb2      {0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-25px,15px) scale(1.08)} 66%{transform:translate(20px,-25px) scale(0.93)}}
    @keyframes pulse     {0%,100%{box-shadow:0 0 0 0 rgba(255,60,60,0.6)} 50%{box-shadow:0 0 0 10px rgba(255,60,60,0)}}
    @keyframes scanDown  {0%{top:0;opacity:0.7} 100%{top:100%;opacity:0}}
    @keyframes heartbeat {0%,100%{transform:scale(1)} 25%{transform:scale(1.18)} 75%{transform:scale(1.08)}}
    @keyframes shake     {0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 60%{transform:translateX(5px)}}
    @keyframes notifDrop {0%{transform:translateY(-80px);opacity:0} 60%{transform:translateY(8px)} 100%{transform:translateY(0);opacity:1}}
    @keyframes redFlash  {0%,100%{background:rgba(255,40,40,0)} 50%{background:rgba(255,40,40,0.12)}}
    @keyframes celebrate {0%,100%{transform:rotate(0) scale(1)} 25%{transform:rotate(-8deg) scale(1.1)} 75%{transform:rotate(8deg) scale(1.1)}}
    @keyframes confettiFall{0%{transform:translateY(-100vh) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
    @keyframes newBadge  {0%,100%{transform:scale(1)} 50%{transform:scale(1.14)}}
    @keyframes wingFlap  {0%,100%{transform:rotate(0deg)} 50%{transform:rotate(8deg)}}
  `}</style>
);

// ─────────────────────────────────────────────
// SHARED: OWL CHARACTER
// ─────────────────────────────────────────────
function OwlMolly({ size = 80, mood = "happy", style: s = {} }) {
  const ry = mood === "worried" ? 3 : 6;
  const ec = mood === "worried" ? "#ff6b6b" : "#2c1810";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}
      style={{ animation: "float2 3s ease-in-out infinite", display: "block", ...s }}>
      <ellipse cx="22" cy="65" rx="14" ry="22" fill="#8b6240"
        style={{ transformOrigin: "30px 50px", animation: "wingFlap 2s ease-in-out infinite" }} />
      <ellipse cx="98" cy="65" rx="14" ry="22" fill="#8b6240"
        style={{ transformOrigin: "90px 50px", animation: "wingFlap 2s ease-in-out infinite reverse" }} />
      <ellipse cx="60" cy="70" rx="38" ry="42" fill="#c9986a" />
      <ellipse cx="60" cy="78" rx="26" ry="30" fill="#f4d4a8" />
      <circle cx="45" cy="40" r="14" fill="#fff" />
      <circle cx="75" cy="40" r="14" fill="#fff" />
      <circle cx="45" cy="40" r="14" fill="none" stroke="#8b6240" strokeWidth="2" />
      <circle cx="75" cy="40" r="14" fill="none" stroke="#8b6240" strokeWidth="2" />
      <ellipse cx="45" cy="38" rx="5" ry={ry} fill={ec} />
      <ellipse cx="75" cy="38" rx="5" ry={ry} fill={ec} />
      <circle cx="46.5" cy="35" r="2" fill="#fff" />
      <circle cx="76.5" cy="35" r="2" fill="#fff" />
      <path d="M55 48 L65 48 L60 56Z" fill="#ffa940" />
      <path d="M35 18 L32 32 L42 26Z" fill="#8b6240" />
      <path d="M85 18 L88 32 L78 26Z" fill="#8b6240" />
      <circle cx="45" cy="40" r="11" fill="none" stroke="#5c3a1e" strokeWidth="1.5" opacity="0.4" />
      <circle cx="75" cy="40" r="11" fill="none" stroke="#5c3a1e" strokeWidth="1.5" opacity="0.4" />
      <line x1="56" y1="40" x2="64" y2="40" stroke="#5c3a1e" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// SHARED: TYPEWRITER
// ─────────────────────────────────────────────
function Typewriter({ text, speed = 60, style: s = {}, onDone }) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(""); setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); onDone?.(); }
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return <span style={s}>{out}{!done && <span style={{ animation: "blink .7s infinite" }}>▊</span>}</span>;
}

// ─────────────────────────────────────────────
// SHARED: OWL DIALOGUE BUBBLE
// ─────────────────────────────────────────────
function OwlSay({ children, mood = "happy" }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, margin: "14px 0", animation: "slideUp .4s ease" }}>
      <OwlMolly size={64} mood={mood} />
      <div style={{
        background: "#fff", borderRadius: "18px 18px 18px 4px",
        padding: "11px 15px", boxShadow: "0 4px 16px rgba(94,64,32,.12)",
        border: "2px solid #f4d4a8", fontSize: 13, lineHeight: 1.75,
        color: "#3d2817", fontFamily: "'Zen Maru Gothic',sans-serif",
        fontWeight: 500, maxWidth: 270,
      }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DATA: Episode 1 posts
// ─────────────────────────────────────────────
const POSTS = [
  {
    id: 1, day: "3月12日", text: "やっと新学期！1年生になったよ🌸 これから3年間よろしく！",
    photoBg: "linear-gradient(135deg,#ffd6e0,#ffafcc)", photoIcon: "🌸",
    elements: [
      { x: 30, y: 25, emoji: "🏫", label: "校章", danger: true, info: "制服の左胸の校章 → 学校が特定できる" },
      { x: 70, y: 40, emoji: "🌸", label: "桜", danger: false, info: "季節がわかるだけで個人特定にはつながらない" },
    ],
  },
  {
    id: 2, day: "3月20日", text: "今日のおやつ🍰 ベランダで食べると気持ちいい☀️",
    photoBg: "linear-gradient(135deg,#fff4d6,#ffc97a)", photoIcon: "🍰",
    elements: [
      { x: 25, y: 35, emoji: "🏢", label: "向かいの看板", danger: true, info: "特徴的な看板 → Google検索で場所が特定できる" },
      { x: 75, y: 30, emoji: "🗼", label: "ランドマーク", danger: true, info: "遠くのタワー → 区まで特定可能" },
    ],
  },
  {
    id: 3, day: "4月2日", text: "お気に入りのカフェ☕ ここのケーキ最高〜",
    photoBg: "linear-gradient(135deg,#d6e8ff,#7ab8ff)", photoIcon: "☕",
    elements: [
      { x: 30, y: 30, emoji: "📋", label: "メニュー表", danger: true, info: "店名が写っている → 行動範囲がバレる" },
      { x: 70, y: 35, emoji: "📍", label: "位置情報タグ", danger: true, info: "緯度経度が公開状態になっている" },
    ],
  },
  {
    id: 4, day: "4月8日", text: "今日はお散歩日和🐕 近所の桜がキレイ",
    photoBg: "linear-gradient(135deg,#e0d6ff,#a98aff)", photoIcon: "🐕",
    elements: [
      { x: 25, y: 25, emoji: "🏠", label: "表札", danger: true, info: "ぼかしていない表札 → 苗字と住所が完全に判明" },
      { x: 75, y: 30, emoji: "🚗", label: "ナンバープレート", danger: true, info: "車のナンバー → 所有者が特定可能" },
    ],
  },
];

// ─────────────────────────────────────────────
// ██ HOME SCREEN
// ─────────────────────────────────────────────
function HomeScreen({ onNavigate, progress }) {
  const modes = [
    {
      id: "ep1", tag: "EPISODE 01 · 探偵モード",
      title: "消えた写真の秘密",
      icon: "🔍", desc: "ミナちゃんの投稿から危険なポイントを見つける探偵体験。",
      duration: "約7分", audience: "小〜中学生",
      accent: "#ffa940", bg1: "#1a1000", bg2: "#0f0800",
      done: progress.ep1,
    },
    {
      id: "ep2", tag: "EPISODE 02 · 情報鑑定モード",
      title: "フェイクニュースを見抜け",
      icon: "🔎", desc: "SNSに流れる「本物・偽物」の投稿を見分ける情報鑑定ゲーム。",
      duration: "約8分", audience: "小〜中学生",
      accent: "#7c3aed", bg1: "#0f0a1e", bg2: "#07041a",
      done: progress.ep2,
    },
    {
      id: "ep3", tag: "EPISODE 03 · 選択体験モード",
      title: "断れなくなる前に",
      icon: "⚠️", desc: "「高収入バイト」のDMに返信するとどうなる？闇バイト勧誘を体験。",
      duration: "約8分", audience: "中学生〜・親子で",
      accent: "#16a34a", bg1: "#0a1a0a", bg2: "#041004",
      done: progress.ep3,
    },
    {
      id: "ep4", tag: "EPISODE 04 · なりすまし体験",
      title: "友達のふりをした罠",
      icon: "🔐", desc: "「友達から」のメッセージで認証コードを要求される。信じてしまうと…アカウントが乗っ取られる手口を体験。",
      duration: "約7分", audience: "小〜中学生・親子で",
      accent: "#0ea5e9", bg1: "#031220", bg2: "#020c18",
      done: progress.ep4,
    },
    {
      id: "attacker", tag: "SPECIAL · 攻撃者体験",
      title: "投稿したら、何がバレる？",
      icon: "🎭", desc: "自分で投稿→AIが悪意ある人物に切り替わる。何がバレるか体験。",
      duration: "約5分", audience: "親子で",
      accent: "#ff4343", bg1: "#1a0505", bg2: "#0f0303",
      done: progress.attacker,
    },
  ];
  const soon = [
    { icon: "💬", title: "ネットいじめ・グループ外し", tag: "EPISODE 05" },
    { icon: "📸", title: "自画撮り被害・画像拡散", tag: "EPISODE 06" },
    { icon: "👨‍👩‍👧", title: "2台モード（親が犯罪者役）", tag: "COMING SOON" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      {/* Hero */}
      <div style={{ position: "relative", padding: "44px 20px 28px", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,169,64,.13) 0%,transparent 70%)", top: -80, left: -60, animation: "orb 12s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,67,67,.08) 0%,transparent 70%)", top: 40, right: -40, animation: "orb2 15s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 9, color: "rgba(255,255,255,.3)", letterSpacing: ".3em", marginBottom: 4 }}>SNS LITERACY APP</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#fff", letterSpacing: "-.02em" }}>マモル 🛡️</div>
            </div>
            <div style={{ background: "rgba(255,169,64,.12)", border: "1px solid rgba(255,169,64,.3)", borderRadius: 8, padding: "4px 12px", fontSize: 10, color: "#ffa940", fontWeight: 700 }}>β版</div>
          </div>
          {/* Owl greeting */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 28 }}>
            <OwlMolly size={88} mood="happy" />
            <div style={{ background: "rgba(255,255,255,.06)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "18px 18px 18px 6px", padding: "13px 16px", flex: 1, animation: "slideUp .5s .2s both ease" }}>
              <div style={{ fontSize: 14, color: "#fff", fontWeight: 700, marginBottom: 4 }}>やあ！モリィだよ🦉</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>SNSの危険を<strong style={{ color: "#ffa940" }}>体験して学ぼう</strong>。<br />どのモードからはじめる？</div>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 4 }}>
            {[
              { icon: "🎮", val: "5", label: "モード" },
              { icon: "⭐", val: Object.values(progress).filter(Boolean).length * 3, label: "スター" },
              { icon: "✅", val: `${Object.values(progress).filter(Boolean).length}/5`, label: "クリア" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "12px 10px", textAlign: "center", animation: `popIn .4s ${i * .1}s both ease` }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'DotGothic16',monospace" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "0 20px 48px", maxWidth: 440, margin: "0 auto" }}>
        {/* PLAY section */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 12px" }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "rgba(255,255,255,.4)", letterSpacing: ".2em" }}>PLAY</div>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {modes.map((m, i) => (
            <button key={m.id} onClick={() => onNavigate(m.id)}
              style={{
                width: "100%", background: `linear-gradient(135deg,${m.bg1},${m.bg2})`,
                border: `1.5px solid ${m.accent}35`, borderRadius: 22, padding: "20px 18px",
                cursor: "pointer", textAlign: "left", fontFamily: "'Zen Maru Gothic',sans-serif",
                position: "relative", overflow: "hidden",
                boxShadow: `0 6px 20px rgba(0,0,0,.3)`,
                animation: `slideUp .5s ${i * .12}s both ease`,
              }}>
              {/* Glow */}
              <div style={{ position: "absolute", width: 130, height: 130, borderRadius: "50%", background: m.accent, opacity: .06, right: -35, top: -35, filter: "blur(30px)", pointerEvents: "none" }} />
              {/* Scan (attacker) */}
              {m.id === "attacker" && <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${m.accent}60,transparent)`, animation: "scanDown 4s linear infinite", pointerEvents: "none" }} />}
              {/* Done badge */}
              {m.done && <div style={{ position: "absolute", top: 12, right: 12, background: "#22c55e", color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 9px", borderRadius: 99, letterSpacing: ".1em" }}>✓ クリア</div>}
              {!m.done && <div style={{ position: "absolute", top: 12, right: 12, background: m.accent, color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 9px", borderRadius: 99, letterSpacing: ".1em", animation: "newBadge 2s ease-in-out infinite" }}>NEW</div>}
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${m.accent}18`, border: `1.5px solid ${m.accent}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: 9, fontFamily: "'DotGothic16',monospace", color: m.accent, letterSpacing: ".15em", marginBottom: 4 }}>{m.tag}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>{m.title}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.75, margin: "0 0 14px" }}>{m.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>⏱ {m.duration}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>👤 {m.audience}</span>
                </div>
                <div style={{ background: m.accent, borderRadius: 99, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff" }}>→</div>
              </div>
            </button>
          ))}
        </div>

        {/* COMING SOON */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "rgba(255,255,255,.25)", letterSpacing: ".2em" }}>COMING SOON</div>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.05)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {soon.map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.03)", border: "1px dashed rgba(255,255,255,.09)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, animation: `slideUp .5s ${i * .08}s both ease` }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, opacity: .5, filter: "grayscale(1)", flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.35)" }}>{item.title}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.2)", marginTop: 2 }}>{item.tag}</div>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.2)", fontFamily: "'DotGothic16',monospace" }}>準備中</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ EPISODE 1 — 探偵モード
// ─────────────────────────────────────────────
function Episode1({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro|normal|horror|investigate|explain|dialogue|complete
  const [step, setStep] = useState(0);
  const [postIdx, setPostIdx] = useState(0);
  const [found, setFound] = useState({});
  const [detail, setDetail] = useState(null);
  const [horrorStage, setHorrorStage] = useState(0);
  const [animStars, setAnimStars] = useState(false);

  // Horror phase timer
  useEffect(() => {
    if (phase !== "horror") return;
    const timers = [
      setTimeout(() => setHorrorStage(1), 1200),
      setTimeout(() => setHorrorStage(2), 3000),
      setTimeout(() => setHorrorStage(3), 6500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const post = POSTS[postIdx];
  const dangerN = post?.elements.filter(e => e.danger).length ?? 0;
  const foundN = (found[post?.id] || []).length;
  const allFoundHere = foundN >= dangerN;

  const nextPost = () => {
    setDetail(null);
    if (postIdx < POSTS.length - 1) setPostIdx(postIdx + 1);
    else setPhase("explain");
  };

  // ── Intro ──
  if (phase === "intro") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#2a1810,#0f0a08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(28)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, background: "#fff", borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * .7 + .2, animation: `blink ${Math.random() * 3 + 2}s infinite` }} />)}
      <OwlMolly size={120} />
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#ffa940", letterSpacing: ".4em", margin: "16px 0 8px" }}>EPISODE 01</div>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center" }}>消えた写真の秘密</h1>
      <p style={{ color: "#ffd28a", fontSize: 12, margin: "0 0 28px", opacity: .8 }}>— マモル: SNSリテラシーアドベンチャー —</p>
      <div style={{ background: "rgba(255,255,255,.06)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,169,64,.2)", borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#f4e4c0", fontSize: 13, lineHeight: 1.9, marginBottom: 28 }}>
        友だちの<strong style={{ color: "#ffa940" }}>ミナちゃん</strong>が、知らない人からの怖いメッセージで困っているみたい。<br /><br />ミナの投稿から<strong style={{ color: "#ffa940" }}>「どこから情報がもれたか」</strong>を一緒に見つけてあげよう。
      </div>
      <button onClick={() => setPhase("normal")} style={{ background: "linear-gradient(135deg,#ffa940,#ff7e20)", border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(255,169,64,.4)" }}>はじめる</button>
    </div>
  );

  // ── Normal (see posts) ──
  if (phase === "normal") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <OwlSay>まずは、ミナちゃんのいつものSNSをみてみよう🦉</OwlSay>
        <div style={{ background: "#fff", borderRadius: 22, padding: 14, boxShadow: "0 10px 36px rgba(94,64,32,.12)", border: "1px solid #f4d4a8", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px 12px", borderBottom: "1px solid #fef0d9" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#ffafcc,#ffd6e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👧</div>
            <div><div style={{ fontWeight: 900, fontSize: 14, color: "#3d2817" }}>ミナ @mina_0414</div><div style={{ fontSize: 11, color: "#a08060" }}>中学1年生</div></div>
            <div style={{ marginLeft: "auto", background: "#ffe4b5", color: "#a05500", padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>フォロワー 248</div>
          </div>
          <div style={{ padding: "12px 4px", display: "flex", flexDirection: "column", gap: 12 }}>
            {POSTS.slice(0, step + 1).map((p, idx) => (
              <div key={p.id} style={{ background: "#fff8f0", borderRadius: 12, padding: 10, border: "1px solid #fef0d9", animation: "popIn .4s ease" }}>
                <div style={{ fontSize: 10, color: "#a08060", marginBottom: 6 }}>{p.day}</div>
                <div style={{ background: p.photoBg, borderRadius: 10, height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, marginBottom: 8 }}>{p.photoIcon}</div>
                <div style={{ fontSize: 12, color: "#3d2817", lineHeight: 1.55 }}>{p.text}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 10, color: "#a08060" }}>
                  <span>❤️ {[42, 38, 51, 29][idx]}</span><span>💬 {[8, 5, 12, 4][idx]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {step < POSTS.length - 1
          ? <button onClick={() => setStep(step + 1)} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>次の投稿をみる →</button>
          : <button onClick={() => setPhase("horror")} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>ミナちゃんは楽しそう ✨</button>}
      </div>
    </div>
  );

  // ── Horror (DM) ──
  if (phase === "horror") return (
    <div style={{ minHeight: "100vh", background: horrorStage >= 1 ? "radial-gradient(ellipse at center,#1a0a0a,#000)" : "linear-gradient(180deg,#fff8f0,#ffeed6)", transition: "background 1.2s ease", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {horrorStage >= 1 && <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(255,0,0,.025) 2px,rgba(255,0,0,.025) 4px)", pointerEvents: "none" }} />}
      {horrorStage === 0 && <div style={{ textAlign: "center", color: "#3d2817", fontSize: 14, opacity: .6 }}>...数日後...</div>}
      {horrorStage >= 1 && (
        <div style={{ position: "fixed", top: 16, left: 16, right: 16, background: "rgba(20,0,0,.95)", border: "1px solid rgba(255,67,67,.5)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, animation: "notifDrop .6s ease, pulse 1.5s infinite", backdropFilter: "blur(10px)", maxWidth: 400, margin: "0 auto", zIndex: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#ff4343", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, animation: "heartbeat 1s infinite" }}>📩</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#ff8a8a", fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em" }}>UNKNOWN SENDER</div>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, marginTop: 2 }}>新しいDM</div>
          </div>
          <div style={{ fontSize: 10, color: "#ff8a8a" }}>たった今</div>
        </div>
      )}
      {horrorStage >= 2 && (
        <div style={{ background: "rgba(30,10,10,.6)", border: "1px solid rgba(255,67,67,.3)", borderRadius: 20, padding: "18px 16px", maxWidth: 340, width: "100%", marginTop: 80, animation: "slideUp .5s ease", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, borderBottom: "1px solid rgba(255,67,67,.2)", marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2a0a0a", border: "2px solid #ff4343", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff4343", fontSize: 20, fontFamily: "'DotGothic16',monospace" }}>?</div>
            <div><div style={{ fontSize: 13, color: "#ffaaaa", fontWeight: 700 }}>不明なユーザー</div><div style={{ fontSize: 10, color: "#ff6b6b", animation: "blink 2s infinite" }}>● オンライン</div></div>
          </div>
          <div style={{ background: "rgba(255,67,67,.1)", border: "1px solid rgba(255,67,67,.3)", borderRadius: 14, borderTopLeftRadius: 4, padding: "12px 14px", color: "#ffe0e0", fontSize: 14, lineHeight: 1.7 }}>
            <Typewriter text="ミナちゃん、今日のおやつ美味しそうだったね。" speed={70} />
          </div>
          {horrorStage >= 3 && (
            <div style={{ background: "rgba(255,67,67,.15)", border: "1px solid rgba(255,67,67,.4)", borderRadius: 14, borderTopLeftRadius: 4, padding: "12px 14px", marginTop: 8, color: "#fff", fontSize: 16, fontWeight: 900, animation: "shake .4s ease" }}>
              <Typewriter text="君の家、知ってるよ。" speed={120} />
            </div>
          )}
        </div>
      )}
      {horrorStage >= 3 && (
        <div style={{ marginTop: 28, width: "100%", maxWidth: 340, animation: "slideUp .6s 1.5s both ease" }}>
          <div style={{ color: "#ffaaaa", fontSize: 12, marginBottom: 14, animation: "blink 1.5s infinite", textAlign: "center" }}>⚠️ ミナちゃんが助けを求めている</div>
          <button onClick={() => setPhase("investigate")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ff4343,#cc0000)", border: "1px solid #ff8a8a", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(255,67,67,.4)", animation: "pulse 2s infinite" }}>🔍 投稿を調べる</button>
        </div>
      )}
    </div>
  );

  // ── Investigate ──
  if (phase === "investigate") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0f0a,#0a0a0f)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ background: "rgba(255,169,64,.1)", borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: "1px solid rgba(255,169,64,.2)", display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#ffa940", letterSpacing: ".1em" }}>EVIDENCE SCAN</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#ffd28a" }}>{postIdx + 1}/{POSTS.length}</span>
        </div>
        <OwlSay mood="worried">投稿の中から<strong style={{ color: "#ff6b6b" }}>「危険なポイント」</strong>をタップして見つけよう。{dangerN}個あるよ。</OwlSay>
        <div style={{ background: "#fff", borderRadius: 18, padding: 14, marginBottom: 12, boxShadow: "0 12px 40px rgba(0,0,0,.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10, borderBottom: "1px solid #fef0d9", marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#ffafcc,#ffd6e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👧</div>
            <div><div style={{ fontWeight: 900, fontSize: 12, color: "#3d2817" }}>ミナ</div><div style={{ fontSize: 10, color: "#a08060" }}>{post.day}</div></div>
          </div>
          {/* Photo area */}
          <div style={{ position: "relative", background: post.photoBg, borderRadius: 12, paddingTop: "72%", overflow: "hidden", marginBottom: 10 }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#ffa940,transparent)", animation: "scanDown 3s infinite linear", boxShadow: "0 0 10px #ffa940" }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontSize: 46, opacity: .3 }}>{post.photoIcon}</div>
            {post.elements.map((el, i) => {
              const isFound = (found[post.id] || []).includes(el.label);
              return (
                <button key={i} onClick={() => {
                  setDetail(el);
                  if (el.danger && !(found[post.id] || []).includes(el.label))
                    setFound({ ...found, [post.id]: [...(found[post.id] || []), el.label] });
                }} style={{ position: "absolute", left: `${el.x}%`, top: `${el.y}%`, transform: "translate(-50%,-50%)", width: 46, height: 46, borderRadius: "50%", border: isFound ? "2px solid #ff4343" : "2px dashed rgba(255,255,255,.7)", background: isFound ? "rgba(255,67,67,.85)" : "rgba(255,255,255,.3)", backdropFilter: "blur(4px)", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", animation: isFound ? "none" : "pulse 2s infinite" }}>{isFound ? "✓" : "?"}</button>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: "#3d2817", margin: 0, lineHeight: 1.6 }}>{post.text}</p>
        </div>
        <div style={{ background: "rgba(255,255,255,.05)", borderRadius: 12, padding: "9px 14px", marginBottom: 14, fontSize: 12, color: "#ffd28a" }}>
          発見済み: <strong style={{ color: "#ff8a8a" }}>{foundN}/{dangerN}</strong>
        </div>
        {/* Detail modal */}
        {detail && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100, animation: "slideUp .3s ease" }} onClick={() => setDetail(null)}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "22px 20px", maxWidth: 340, width: "100%", border: `3px solid ${detail.danger ? "#ff4343" : "#4caf50"}` }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 38, textAlign: "center", marginBottom: 8, animation: detail.danger ? "shake .5s ease" : "none" }}>{detail.emoji}</div>
              <div style={{ background: detail.danger ? "#ff4343" : "#4caf50", color: "#fff", fontSize: 11, fontWeight: 900, padding: "3px 12px", borderRadius: 99, display: "block", width: "fit-content", margin: "0 auto 10px", letterSpacing: ".1em" }}>{detail.danger ? "⚠️ キケン" : "✅ あんしん"}</div>
              <h3 style={{ color: "#3d2817", fontSize: 17, fontWeight: 900, textAlign: "center", margin: "8px 0 12px" }}>{detail.label}</h3>
              <p style={{ color: "#5d4017", fontSize: 13, lineHeight: 1.8, margin: "0 0 14px" }}>{detail.info}</p>
              <button onClick={() => setDetail(null)} style={{ width: "100%", padding: 12, background: "#ffa940", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>なるほど！</button>
            </div>
          </div>
        )}
        {allFoundHere && (
          <button onClick={nextPost} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "popIn .4s ease" }}>
            {postIdx < POSTS.length - 1 ? "次の投稿を調べる →" : "捜査完了 → 解説へ"}
          </button>
        )}
      </div>
    </div>
  );

  // ── Explain ──
  if (phase === "explain") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}><OwlMolly size={96} /></div>
        <div style={{ background: "#fff", borderRadius: 20, padding: "18px 16px", border: "2px solid #ffa940", marginBottom: 14, textAlign: "center" }}>
          <h2 style={{ fontSize: 20, color: "#3d2817", margin: "0 0 10px", fontWeight: 900 }}>ミナちゃんのSNSの問題点</h2>
          <div style={{ fontSize: 34, color: "#ff4343", fontWeight: 900, fontFamily: "'DotGothic16',monospace" }}>{Object.values(found).reduce((a, b) => a + b.length, 0)}<span style={{ fontSize: 14, color: "#a08060" }}>個の危険発見</span></div>
        </div>
        <OwlSay>これだけの情報があれば、悪い人は<strong style={{ color: "#ff4343" }}>家まで突き止められる</strong>んだ…</OwlSay>
        <div style={{ background: "rgba(255,67,67,.08)", border: "1px solid rgba(255,67,67,.3)", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ display: "inline-block", background: "#ff4343", color: "#fff", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 99, marginBottom: 10, letterSpacing: ".1em" }}>実際の被害事例</div>
          <p style={{ color: "#3d2817", fontSize: 13, lineHeight: 1.8, margin: 0 }}>女子中学生がSNSに投稿した写真の<strong>校章・背景・位置情報タグ</strong>から、知らない男性が自宅を突き止め待ち伏せした事件が実際に報告されています。</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 14, border: "2px solid #f4d4a8" }}>
          {[["📍", "投稿する前に写真の隅々まで確認", "校章・表札・看板・ナンバープレート"],
            ["📱", "位置情報タグは常にオフ", "スマホ設定→プライバシー→位置情報"],
            ["🔒", "「家の近く」がわかる投稿は控える", "自宅・通学路・行きつけのお店"]].map(([ic, t, d], i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#ffa940,#ff8c1a)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{ic}</div>
              <div><div style={{ fontSize: 13, fontWeight: 900, color: "#3d2817" }}>{t}</div><div style={{ fontSize: 11, color: "#a08060", marginTop: 2 }}>{d}</div></div>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("dialogue")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>おうちの人とお話しする →</button>
      </div>
    </div>
  );

  // ── Dialogue ──
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#ffe8d6,#ffd4a3)", borderRadius: 20, padding: "22px 18px", textAlign: "center", marginBottom: 18, border: "2px solid #ffa940" }}>
          <div style={{ fontSize: 34, marginBottom: 6 }}>👨‍👩‍👧</div>
          <h2 style={{ fontSize: 20, color: "#3d2817", margin: "0 0 6px", fontWeight: 900 }}>おうちの人と話してみよう</h2>
          <p style={{ fontSize: 12, color: "#5d4017", margin: 0, lineHeight: 1.7 }}>今日学んだことを一緒に話し合おう</p>
        </div>
        {[["💬", "#ffafcc", "わたしのSNS投稿、見直してみる？", "家がバレるヒントは入っていない？"],
          ["📱", "#a8e6cf", "スマホの位置情報、どうなってる？", "一緒に設定を確認しよう"],
          ["🛡️", "#ffd6a5", "もし変なDMが来たらどうする？", "返事しない・スクショ・家の人に相談"],
          ["✨", "#caffbf", "「投稿しない勇気」って大切？", "全部をSNSにのせる必要はない"]].map(([ic, col, q, d], i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px 14px 14px 18px", marginBottom: 8, borderLeft: `5px solid ${col}`, display: "flex", gap: 12, alignItems: "flex-start", boxShadow: "0 4px 12px rgba(94,64,32,.07)", animation: `slideUp .4s ${i * .1}s both ease` }}>
            <div style={{ fontSize: 22, flexShrink: 0 }}>{ic}</div>
            <div><div style={{ fontSize: 13, fontWeight: 900, color: "#3d2817", lineHeight: 1.5, marginBottom: 3 }}>{q}</div><div style={{ fontSize: 11, color: "#a08060", lineHeight: 1.6 }}>{d}</div></div>
          </div>
        ))}
        <button onClick={() => { setAnimStars(true); setPhase("complete"); }} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginTop: 14 }}>🏆 修了証をもらう</button>
      </div>
    </div>
  );

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#fff4d6,#ffeed6,#ffd28a)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: ["#ff8a8a", "#ffa940", "#ffd28a", "#a8e6cf", "#ffafcc"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#fff8f0)", borderRadius: 22, padding: "28px 22px", border: "3px double #ffa940", textAlign: "center", boxShadow: "0 20px 60px rgba(94,64,32,.18)", position: "relative" }}>
          {[{top:12,left:12},{top:12,right:12},{bottom:12,left:12},{bottom:12,right:12}].map((pos,i)=><div key={i} style={{position:"absolute",...pos,fontSize:16,color:"#ffa940"}}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a08060", letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#3d2817", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#5d4017", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            あなたは「マモル」第1話<br /><strong style={{ color: "#3d2817", fontSize: 14 }}>消えた写真の秘密</strong><br />をクリアしました。
          </p>
          <div style={{ background: "linear-gradient(135deg,#ffe4b5,#ffd28a)", borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: "#a05500", marginBottom: 3 }}>EPISODE 01 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#3d2817", fontWeight: 900 }}>⭐ 個人情報マスター ⭐</div>
          </div>
          <div style={{ fontSize: 10, color: "#a08060", marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP1 クリア！", text: "SNSリテラシーアプリ「マモル」で個人情報マスターになりました🏆" }).catch(() => {})} style={{ flex: 1, padding: 14, background: "#fff", border: "2px solid #ffa940", borderRadius: 14, color: "#a05500", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={onComplete} style={{ flex: 1, padding: 14, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ EPISODE 2 — フェイクニュースを見抜け
// ─────────────────────────────────────────────

const FAKE_POSTS = [
  {
    id: 1,
    verdict: "fake",
    account: "緊急速報_bot",
    accountIcon: "⚡",
    accountColor: "#ff4343",
    verified: false,
    time: "2分前",
    text: "【緊急】○○市で大規模地震発生！マグニチュード7.8。今すぐ高台へ避難してください。ライフライン完全停止中。#緊急 #拡散希望",
    likes: 48200, rts: 92100, replies: 3400,
    photoBg: "linear-gradient(135deg,#1a0000,#3d0000)",
    photoIcon: "🚨",
    dangerPoints: [
      { x: 15, y: 20, emoji: "⚡", label: "アカウント名", info: "「緊急速報_bot」という個人アカウント。公式機関ではない。フォロワー数も確認すべき。" },
      { x: 80, y: 20, emoji: "📅", label: "投稿時刻", info: "「2分前」という超速報。本物の災害情報は公式機関が確認してから発表するので時間がかかる。" },
      { x: 50, y: 70, emoji: "#️⃣", label: "拡散希望タグ", info: "「#拡散希望」は感情を煽って確認前に拡散させる典型的な手口。本物の公式情報にはつかない。" },
    ],
    whyFake: "気象庁・市区町村の公式アカウントから同じ情報が出ていない。公式情報は必ず複数の機関から同時に発表される。",
    checkMethod: "気象庁（jma.go.jp）・NHK・市区町村の公式サイトを確認する",
  },
  {
    id: 2,
    verdict: "fake",
    account: "速報ニュース_JP",
    accountIcon: "📺",
    accountColor: "#ff8c00",
    verified: false,
    time: "1時間前",
    text: "【衝撃】有名芸能人○○さんが詐欺で逮捕されたと警視庁が発表。本人のSNSアカウントも突然削除。関係者は口を閉ざす…",
    likes: 31000, rts: 44000, replies: 8900,
    photoBg: "linear-gradient(135deg,#1a0a00,#3d2000)",
    photoIcon: "📰",
    dangerPoints: [
      { x: 20, y: 25, emoji: "📺", label: "非公式アカウント", info: "実在するニュース局に似た名前だが、認証バッジ（✓）がない。なりすましアカウントの典型。" },
      { x: 75, y: 30, emoji: "🤫", label: "曖昧な情報源", info: "「警視庁が発表」と書いてあるが、警視庁の公式サイトに該当情報がない。具体的なリンクもない。" },
      { x: 50, y: 72, emoji: "💭", label: "煽り文句", info: "「口を閉ざす」「突然削除」など感情を刺激する表現。読者の好奇心を利用して拡散させる手法。" },
    ],
    whyFake: "実在する芸能人・企業名を使ったなりすまし投稿。クリック誘導や個人情報詐取が目的のことが多い。",
    checkMethod: "当該芸能人の公式サイト・大手ニュースサイト（NHK・読売・毎日など）で同じ情報が出ているか確認する",
  },
  {
    id: 3,
    verdict: "fake",
    account: "社会問題を考える会",
    accountIcon: "🌐",
    accountColor: "#2563eb",
    verified: false,
    time: "3時間前",
    text: "これが現実です。子どもたちが危険にさらされています。今すぐシェアして周りに知らせてください。この写真を見てください。",
    likes: 22000, rts: 67000, replies: 1200,
    photoBg: "linear-gradient(135deg,#0a0a2e,#1a1a4e)",
    photoIcon: "🖼️",
    dangerPoints: [
      { x: 50, y: 30, emoji: "🖼️", label: "写真の出典不明", info: "「この写真を見てください」と言うだけで、いつ・どこで・誰が撮った写真かが一切書かれていない。古い写真や別の国の写真を使い回しているケースが多い。" },
      { x: 20, y: 65, emoji: "😱", label: "感情操作", info: "「これが現実」「今すぐ」という言葉で焦りと怒りを煽る。冷静な判断をさせないための心理的テクニック。" },
      { x: 78, y: 65, emoji: "🔁", label: "無条件に拡散を求める", info: "「今すぐシェア」と内容確認より拡散を優先させる。本物の情報発信者は確認を促す。" },
    ],
    whyFake: "写真の出典・日時・場所が不明。画像の逆検索（Googleレンズ等）で別の文脈の古い写真とわかることが多い。",
    checkMethod: "Googleレンズやtineye.comで写真を逆検索して、同じ画像がいつ・どこで使われたか調べる",
  },
  {
    id: 4,
    verdict: "real",
    account: "NHKニュース",
    accountIcon: "🏛️",
    accountColor: "#1d4ed8",
    verified: true,
    time: "45分前",
    text: "【速報】内閣府は15日、2025年度の実質GDP成長率が前年比プラス1.2%になったと発表しました。輸出の回復が主な要因としています。詳細はNHKニュースウェブでご覧ください。",
    likes: 4200, rts: 1800, replies: 890,
    photoBg: "linear-gradient(135deg,#0a1628,#0d2142)",
    photoIcon: "📊",
    dangerPoints: [
      { x: 18, y: 22, emoji: "✅", label: "認証済みアカウント", info: "青い認証バッジ（✓）がついている。これはプラットフォームが本物であることを確認したアカウント。" },
      { x: 75, y: 22, emoji: "📅", label: "具体的な日付", info: "「15日」と具体的な日付が明記されている。信頼できる情報は「いつ」が明確。" },
      { x: 50, y: 72, emoji: "🔗", label: "公式サイトへのリンク", info: "「NHKニュースウェブで詳細を」と一次情報源への誘導がある。信頼できる情報源は詳細確認手段を提示する。" },
    ],
    whyFake: "これは本物です。認証バッジ・具体的な発表機関・一次情報源へのリンクが揃っている。",
    checkMethod: "✓ このニュースは信頼できます。NHKニュースの公式アカウントからの正確な情報です。",
    isReal: true,
  },
];

function Episode2({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro|timeline|judge|spread|checklist|dialogue|complete
  const [postIdx, setPostIdx] = useState(0);
  const [verdicts, setVerdicts] = useState({}); // {postId: "real"|"fake"}
  const [showResult, setShowResult] = useState(false);
  const [foundPoints, setFoundPoints] = useState({});
  const [pointDetail, setPointDetail] = useState(null);
  const [spreadStep, setSpreadStep] = useState(0);
  const [checkStep, setCheckStep] = useState(0);

  const post = FAKE_POSTS[postIdx];
  const userVerdict = verdicts[post?.id];
  const isCorrect = userVerdict === post?.verdict;
  const allFound = (foundPoints[post?.id] || []).length >= post?.dangerPoints.length;
  const totalCorrect = FAKE_POSTS.filter(p => verdicts[p.id] === p.verdict).length;

  const handleVerdict = (v) => {
    setVerdicts(prev => ({ ...prev, [post.id]: v }));
    setShowResult(true);
  };

  const handlePointTap = (pt) => {
    setPointDetail(pt);
    const cur = foundPoints[post.id] || [];
    if (!cur.includes(pt.label)) setFoundPoints(prev => ({ ...prev, [post.id]: [...cur, pt.label] }));
  };

  const nextPost = () => {
    setShowResult(false);
    setPointDetail(null);
    if (postIdx < FAKE_POSTS.length - 1) setPostIdx(postIdx + 1);
    else setPhase("spread");
  };

  const spreadData = [
    { time: "0分", rts: 0, label: "あなたがRTした" },
    { time: "10分", rts: 240, label: "フォロワーが拡散" },
    { time: "1時間", rts: 8400, label: "トレンド入り" },
    { time: "3時間", rts: 92000, label: "全国拡散・パニック" },
    { time: "翌日", rts: 0, label: "訂正記事が出るも手遅れ" },
  ];

  const checklist = [
    { icon: "👤", title: "誰が発信しているか", desc: "公式機関・認証済みアカウントか？個人が運営するbotではないか？" },
    { icon: "📅", title: "いつの情報か", desc: "古い情報を新しいことのように使い回していないか？日付を確認する。" },
    { icon: "🔗", title: "一次情報源があるか", desc: "公式サイトや大手メディアで同じ情報が出ているか検索して確認する。" },
    { icon: "🖼️", title: "写真・動画の出典は", desc: "Googleレンズで逆検索。別の事件・別の国の映像を使い回していないか。" },
    { icon: "💭", title: "感情を煽っていないか", desc: "「拡散希望」「今すぐ」「衝撃」など焦りや怒りを刺激する言葉に注意。" },
  ];

  // ── Intro ──
  if (phase === "intro") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top, #0f0a2e 0%, #07041a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(30)].map((_, i) => (
        <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: "#a78bfa", borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.6 + 0.1, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />
      ))}
      <div style={{ fontSize: 72, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🔎</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a78bfa", letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 02</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.2 }}>フェイクニュースを<br />見抜け</h1>
      <p style={{ color: "rgba(255,255,255,.5)", fontSize: 12, margin: "0 0 26px", textAlign: "center", lineHeight: 1.7 }}>— マモル: SNSリテラシーアドベンチャー —</p>
      <div style={{ background: "rgba(167,139,250,.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#e0d9ff", fontSize: 13, lineHeight: 1.9, marginBottom: 28 }}>
        SNSには<strong style={{ color: "#a78bfa" }}>本物と偽物の情報</strong>が混ざっています。<br /><br />
        4つの投稿を見て「本物か・フェイクか」を見分ける<strong style={{ color: "#a78bfa" }}>情報鑑定士</strong>になろう。
      </div>
      <OwlSay mood="happy">生成AIが作った偽画像も増えてるよ。騙されないようにしようね🦉</OwlSay>
      <button onClick={() => setPhase("judge")} style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(124,58,237,.4)", marginTop: 8 }}>鑑定スタート 🔎</button>
    </div>
  );

  // ── Judge ──
  if (phase === "judge") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(167,139,250,.1)", borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: "1px solid rgba(167,139,250,.2)" }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a78bfa", letterSpacing: ".1em" }}>FACT CHECK</div>
          <div style={{ fontSize: 12, color: "#c4b5fd" }}>{postIdx + 1} / {FAKE_POSTS.length}</div>
        </div>

        {!showResult && <OwlSay mood="worried">この投稿、<strong style={{ color: "#a78bfa" }}>本物？フェイク？</strong>まず直感で判断してみよう。</OwlSay>}

        {/* Fake SNS post card */}
        <div style={{ background: "#0d1117", borderRadius: 18, padding: 16, marginBottom: 14, border: `1px solid ${post.accountColor}30`, boxShadow: `0 8px 32px rgba(0,0,0,.5)` }}>
          {/* Account header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${post.accountColor}22`, border: `2px solid ${post.accountColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{post.accountIcon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 900, fontSize: 14, color: "#fff" }}>{post.account}</span>
                {post.verified && <span style={{ background: "#1d9bf0", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span>}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{post.time}</div>
            </div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,.3)" }}>⋯</div>
          </div>

          {/* Post text */}
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.9)", lineHeight: 1.75, margin: "0 0 12px" }}>{post.text}</p>

          {/* Photo */}
          <div style={{ position: "relative", background: post.photoBg, borderRadius: 12, height: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, overflow: "hidden" }}>
            <div style={{ fontSize: 48, opacity: 0.4 }}>{post.photoIcon}</div>
            {/* Scan line */}
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#a78bfa,transparent)", animation: "scanDown 3s linear infinite", opacity: 0.5 }} />
            {/* Tappable danger points — shown only after verdict */}
            {showResult && post.dangerPoints.map((pt, i) => {
              const found = (foundPoints[post.id] || []).includes(pt.label);
              const isRealPost = post.verdict === "real";
              return (
                <button key={i} onClick={() => handlePointTap(pt)}
                  style={{ position: "absolute", left: `${pt.x}%`, top: `${pt.y}%`, transform: "translate(-50%,-50%)", width: 42, height: 42, borderRadius: "50%", border: `2px ${found ? "solid" : "dashed"} ${isRealPost ? "#22c55e" : "#a78bfa"}`, background: found ? (isRealPost ? "rgba(34,197,94,.8)" : "rgba(167,139,250,.8)") : "rgba(255,255,255,.15)", backdropFilter: "blur(4px)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", animation: found ? "none" : "pulse 2s infinite" }}>
                  {found ? "✓" : "?"}
                </button>
              );
            })}
          </div>

          {/* Engagement stats */}
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(255,255,255,.4)" }}>
            <span>❤️ {post.likes.toLocaleString()}</span>
            <span>🔁 {post.rts.toLocaleString()}</span>
            <span>💬 {post.replies.toLocaleString()}</span>
          </div>
        </div>

        {/* Verdict buttons */}
        {!showResult && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <button onClick={() => handleVerdict("real")}
              style={{ padding: "16px 12px", background: "rgba(34,197,94,.1)", border: "2px solid rgba(34,197,94,.4)", borderRadius: 14, color: "#86efac", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
              ✅ 本物
            </button>
            <button onClick={() => handleVerdict("fake")}
              style={{ padding: "16px 12px", background: "rgba(239,68,68,.1)", border: "2px solid rgba(239,68,68,.4)", borderRadius: 14, color: "#fca5a5", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
              ❌ フェイク
            </button>
          </div>
        )}

        {/* Result */}
        {showResult && (
          <div style={{ animation: "slideUp .4s ease" }}>
            {/* Correct/Wrong banner */}
            <div style={{ background: isCorrect ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)", border: `2px solid ${isCorrect ? "#22c55e" : "#ef4444"}`, borderRadius: 16, padding: "14px 16px", marginBottom: 12, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{isCorrect ? "🎯" : "😅"}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: isCorrect ? "#86efac" : "#fca5a5", marginBottom: 6 }}>
                {isCorrect ? "正解！その通り！" : `不正解。これは${post.verdict === "fake" ? "フェイク" : "本物"}でした`}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>{post.whyFake}</div>
            </div>

            {/* Find danger points */}
            <div style={{ background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.2)", borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 700, marginBottom: 6 }}>
                {post.verdict === "real" ? "✅ 信頼できるポイントをタップ" : "⚠️ 危険なポイントをタップして見つけよう"}
                　<span style={{ color: "rgba(255,255,255,.4)" }}>{(foundPoints[post.id] || []).length}/{post.dangerPoints.length}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>写真の中の「?」をタップ</div>
            </div>

            {/* Check method */}
            <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, marginBottom: 4 }}>💡 確認方法</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>{post.checkMethod}</div>
            </div>

            <button onClick={nextPost}
              style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(124,58,237,.35)", animation: "popIn .4s ease" }}>
              {postIdx < FAKE_POSTS.length - 1 ? "次の投稿を鑑定する →" : "結果を見る 📊"}
            </button>
          </div>
        )}

        {/* Point detail modal */}
        {pointDetail && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100, animation: "slideUp .3s ease" }} onClick={() => setPointDetail(null)}>
            <div style={{ background: "#1a1040", borderRadius: 20, padding: "22px 20px", maxWidth: 340, width: "100%", border: "2px solid #7c3aed" }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 36, textAlign: "center", marginBottom: 8 }}>{pointDetail.emoji}</div>
              <h3 style={{ color: "#e0d9ff", fontSize: 16, fontWeight: 900, textAlign: "center", margin: "0 0 12px" }}>{pointDetail.label}</h3>
              <p style={{ color: "#c4b5fd", fontSize: 13, lineHeight: 1.8, margin: "0 0 14px" }}>{pointDetail.info}</p>
              <button onClick={() => setPointDetail(null)} style={{ width: "100%", padding: 12, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>なるほど！</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Spread simulation ──
  if (phase === "spread") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📊</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>鑑定結果</h2>
          <div style={{ fontSize: 28, fontWeight: 900, color: totalCorrect >= 3 ? "#86efac" : "#fca5a5", fontFamily: "'DotGothic16',monospace" }}>
            {totalCorrect} / {FAKE_POSTS.length} 正解
          </div>
        </div>

        <OwlSay mood={totalCorrect >= 3 ? "happy" : "worried"}>
          {totalCorrect >= 3 ? "すごい！情報鑑定士の才能があるね🦉" : "フェイクニュースは巧妙だね…次は見抜けるようになろう🦉"}
        </OwlSay>

        {/* Spread simulation */}
        <div style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 18, padding: "18px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#fca5a5", marginBottom: 14 }}>
            ⚠️ もしフェイクをRTしていたら…
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {spreadData.slice(0, spreadStep + 1).map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", animation: "slideUp .3s ease" }}>
                <div style={{ width: 60, flexShrink: 0, fontSize: 11, color: "rgba(255,255,255,.4)", fontFamily: "'DotGothic16',monospace" }}>{d.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: i === 4 ? "0%" : `${Math.min((d.rts / 92000) * 100, 100)}%`, background: i >= 3 ? "#ef4444" : i >= 2 ? "#f97316" : "#a78bfa", borderRadius: 4, transition: "width .8s ease" }} />
                  </div>
                  <div style={{ fontSize: 11, color: i >= 3 ? "#fca5a5" : "rgba(255,255,255,.55)", marginTop: 3 }}>
                    {d.rts > 0 ? `RT ${d.rts.toLocaleString()}件` : "−"} {d.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {spreadStep < spreadData.length - 1 && (
            <button onClick={() => setSpreadStep(s => s + 1)}
              style={{ width: "100%", marginTop: 14, padding: "10px", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 12, color: "#fca5a5", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              続きを見る →
            </button>
          )}
        </div>

        {spreadStep >= spreadData.length - 1 && (
          <button onClick={() => setPhase("checklist")}
            style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .5s ease" }}>
            フェイクの見抜き方を学ぶ →
          </button>
        )}
      </div>
    </div>
  );

  // ── Checklist ──
  if (phase === "checklist") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <OwlMolly size={90} mood="happy" style={{ margin: "0 auto" }} />
        </div>
        <OwlSay>情報を見たときに、この5つを確認する習慣をつけよう🦉</OwlSay>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {checklist.slice(0, checkStep + 1).map((item, i) => (
            <div key={i} style={{ background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.2)", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", animation: "slideUp .4s ease" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(167,139,250,.15)", border: "1px solid rgba(167,139,250,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#e0d9ff", marginBottom: 4 }}>{i + 1}. {item.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {checkStep < checklist.length - 1
          ? <button onClick={() => setCheckStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: "rgba(167,139,250,.15)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 14, color: "#c4b5fd", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            次のポイント →
          </button>
          : <button onClick={() => setPhase("dialogue")}
            style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(124,58,237,.35)" }}>
            おうちの人とお話しする →
          </button>}
      </div>
    </div>
  );

  // ── Dialogue ──
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0eeff,#e0d9ff)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", borderRadius: 20, padding: "22px 18px", textAlign: "center", marginBottom: 18, border: "2px solid #7c3aed" }}>
          <div style={{ fontSize: 34, marginBottom: 6 }}>👨‍👩‍👧</div>
          <h2 style={{ fontSize: 20, color: "#3730a3", margin: "0 0 6px", fontWeight: 900 }}>おうちの人と話してみよう</h2>
          <p style={{ fontSize: 12, color: "#5b21b6", margin: 0, lineHeight: 1.7 }}>今日学んだことを一緒に話し合おう</p>
        </div>
        {[
          ["🔍", "#c4b5fd", "今日RTしそうになった情報、あった？", "自分が信じかけたフェイクを振り返ろう"],
          ["📱", "#93c5fd", "おうちのSNSグループで流れてきた情報、確認した？", "家族グループLINEも要注意！"],
          ["🤔", "#6ee7b7", "どうやって本物かどうか確認する？", "Google、NHK、気象庁を習慣にしよう"],
          ["🚫", "#fca5a5", "「拡散希望」を見たらどうする？", "まず疑うのが正解。拡散は後回しにする"],
        ].map(([ic, col, q, d], i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px 14px 14px 18px", marginBottom: 8, borderLeft: `5px solid ${col}`, display: "flex", gap: 12, alignItems: "flex-start", boxShadow: "0 4px 12px rgba(124,58,237,.08)", animation: `slideUp .4s ${i * .1}s both ease` }}>
            <div style={{ fontSize: 22, flexShrink: 0 }}>{ic}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#3730a3", lineHeight: 1.5, marginBottom: 3 }}>{q}</div>
              <div style={{ fontSize: 11, color: "#6d28d9", lineHeight: 1.6 }}>{d}</div>
            </div>
          </div>
        ))}
        <button onClick={() => setPhase("complete")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginTop: 14, boxShadow: "0 8px 24px rgba(124,58,237,.35)" }}>🏆 修了証をもらう</button>
      </div>
    </div>
  );

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#ede9fe,#ddd6fe,#c4b5fd)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: ["#a78bfa", "#7c3aed", "#c4b5fd", "#818cf8", "#6ee7b7"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#f5f3ff)", borderRadius: 22, padding: "28px 22px", border: "3px double #7c3aed", textAlign: "center", boxShadow: "0 20px 60px rgba(124,58,237,.2)", position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: "#7c3aed" }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#6d28d9", letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#3730a3", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#5b21b6", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            あなたは「マモル」第2話<br /><strong style={{ color: "#3730a3", fontSize: 14 }}>フェイクニュースを見抜け</strong><br />をクリアしました。<br />
            <span style={{ fontSize: 16, fontWeight: 900 }}>{totalCorrect}/{FAKE_POSTS.length}</span> 問正解 🎯
          </p>
          <div style={{ background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: "#6d28d9", marginBottom: 3 }}>EPISODE 02 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#3730a3", fontWeight: 900 }}>🔎 情報鑑定士 🔎</div>
          </div>
          <div style={{ fontSize: 10, color: "#a78bfa", marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP2 クリア！", text: `フェイクニュースを${totalCorrect}/${FAKE_POSTS.length}問正解！SNSリテラシーアプリ「マモル」🔎` }).catch(() => {})} style={{ flex: 1, padding: 14, background: "#fff", border: "2px solid #7c3aed", borderRadius: 14, color: "#6d28d9", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={onComplete} style={{ flex: 1, padding: 14, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ EPISODE 3 — 断れなくなる前に（闇バイト勧誘体験）
// ─────────────────────────────────────────────

// 会話シナリオデータ
const CONVO_STEPS = [
  {
    id: 0,
    phase: "timeline",
    senderMsg: null,
    situation: "Xのタイムラインに投稿が流れてきた",
    post: {
      account: "副業_情報局📢",
      text: "【急募】日払い可💴 1日3〜5万円保証✅ 詳細はDMへ。学生歓迎。身バレなし。スマホだけでOK👍 #高収入 #学生バイト #即日払い",
      likes: 892, rts: 341,
    },
    choices: [
      { label: "DMを送ってみる", emoji: "💬", safe: false, next: 1 },
      { label: "無視してスクロール", emoji: "👆", safe: true, next: "safe_end" },
    ],
    owlMsg: "「日払い・高収入・スマホだけ」…気になる？でもちょっと待って🦉",
  },
  {
    id: 1,
    phase: "dm",
    senderMsg: "はじめまして！興味あってDMしました",
    replyMsg: "連絡ありがとう！！やる気ある子大歓迎😊 簡単な仕事だから安心して。まず名前教えてくれる？（ニックネームでOK）",
    situation: "相手からすぐ返信が来た",
    choices: [
      { label: "ニックネームを教える", emoji: "😊", safe: false, next: 2 },
      { label: "なぜ名前が必要か聞く", emoji: "🤔", safe: false, next: "pressure_1" },
      { label: "やっぱりやめておく", emoji: "🚪", safe: true, next: "safe_end" },
    ],
    owlMsg: "最初は「ニックネームでOK」。でも次第に本名を求めてくるよ🦉",
    dangerLevel: 1,
  },
  {
    id: 2,
    phase: "dm",
    senderMsg: "ケンって言います",
    replyMsg: "ケンくん！いい名前😊 仕事は荷物の受け取りをするだけ。簡単でしょ？ LINEに移動していい？もっと詳しく説明するよ",
    situation: "LINEへの誘導が始まった",
    choices: [
      { label: "LINEを教える", emoji: "📱", safe: false, next: 3 },
      { label: "このまま話す", emoji: "💬", safe: false, next: "pressure_2" },
      { label: "やっぱりやめる", emoji: "🚪", safe: true, next: "safe_end" },
    ],
    owlMsg: "LINEに移ると履歴が追いにくくなる。これは意図的な誘導だよ🦉",
    dangerLevel: 2,
  },
  {
    id: 3,
    phase: "dm",
    senderMsg: "（LINEを教えた）",
    replyMsg: "ありがとう！では確認のため、学校名と学年を教えて。個人情報は絶対に外に出さないから安心して😊 あと顔写真も1枚欲しいな。身分証明のため",
    situation: "個人情報の要求がエスカレートしてきた",
    choices: [
      { label: "学校名と写真を送る", emoji: "📸", safe: false, next: 4 },
      { label: "なぜ必要か聞く", emoji: "🤔", safe: false, next: "pressure_3" },
      { label: "断ってブロックする", emoji: "🚫", safe: true, next: "safe_end" },
    ],
    owlMsg: "ここが一番重要！顔写真＋学校名＋LINEは脅迫の材料になる🦉",
    dangerLevel: 3,
    warning: "⚠️ ここで個人情報を渡すと、あとで脅迫に使われます",
  },
  {
    id: 4,
    phase: "trap",
    senderMsg: "（写真と学校名を送った）",
    replyMsg: null, // special phase
    situation: "罠にかかった",
    choices: [],
    owlMsg: null,
    dangerLevel: 4,
  },
];

const PRESSURE_MSGS = {
  pressure_1: {
    msg: "名前は連絡用だよ😅 疑うならいいけど、他にやりたい人はたくさんいるから〜。もし本気なら教えてね",
    backTo: 1,
    owlMsg: "断ろうとすると「他にいる」と焦らせてくる。これも手口だよ🦉",
  },
  pressure_2: {
    msg: "LINEの方が詳しく話せるんだよね。DM見られたくないし。不安なら無理にとは言わないけど…本当にもったいないよ？",
    backTo: 2,
    owlMsg: "「もったいない」「不安なら」という言葉で罪悪感を植え付けてくる🦉",
  },
  pressure_3: {
    msg: "身分確認は法的に必要なんだよ。それもできないなら詐欺師だと思われるよ？こっちだって怖いし。証明してくれないなら仕事頼めない",
    backTo: 3,
    owlMsg: "今度は「お前が信用されていない」と逆転させてくる。巧みな心理操作だよ🦉",
  },
};

function Episode3({ onComplete }) {
  const [phase, setPhase] = useState("intro");
  const [stepId, setStepId] = useState(0);
  const [pressureKey, setPressureKey] = useState(null);
  const [choiceHistory, setChoiceHistory] = useState([]);
  const [trapStage, setTrapStage] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [caseIdx, setCaseIdx] = useState(0);
  const [debriefStep, setDebriefStep] = useState(0);

  const step = CONVO_STEPS.find(s => s.id === stepId) || CONVO_STEPS[0];
  const pressure = pressureKey ? PRESSURE_MSGS[pressureKey] : null;

  const realCases = [
    { age: "高校2年生（17歳）", role: "受け子", result: "逮捕・少年院送致。被害額800万円の連帯責任を問われた。", detail: "「荷物を受け取るだけ」と言われ、実際は詐欺被害者から現金を受け取る役割。知らなかったでは済まなかった。" },
    { age: "中学3年生（15歳）", role: "出し子", result: "保護観察処分。被害者の老夫婦に謝罪文を書かされた。", detail: "SNSで「簡単に稼げる」と誘われATMから現金を引き出す役割。顔・学校・住所を事前に送っていたため逃げられなかった。" },
    { age: "高校1年生（16歳）", role: "SNS勧誘担当", result: "逮捕・実名報道。大学進学が白紙に。", detail: "「友達を紹介するだけ」と言われ自分も勧誘役に。主犯格と同じ罪に問われた。" },
  ];

  const checkpoints = [
    { icon: "💰", sign: "「日払い・即日・高収入」", desc: "まともなバイトで即日5万円は存在しない。破格の条件は詐欺の入口。" },
    { icon: "📱", sign: "「LINEで話そう」「Telegramへ」", desc: "記録が残りにくいアプリに移動させるのは証拠隠滅のため。" },
    { icon: "📸", sign: "「身分確認で写真を」", desc: "顔写真＋個人情報＝脅迫の材料。正当なバイトで事前に顔写真は要求しない。" },
    { icon: "📦", sign: "「荷物を受け取るだけ」", desc: "受け子・出し子は詐欺の実行犯。知らなかったでも逮捕される。" },
    { icon: "🔒", sign: "「絶対に外に出さない」", desc: "この言葉自体が危険信号。情報を渡した時点でコントロールされる。" },
  ];

  // Handle choice
  const handleChoice = (choice) => {
    setChoiceHistory(h => [...h, choice.label]);
    if (choice.next === "safe_end") {
      setPhase("safe_end");
    } else if (choice.next === "pressure_1" || choice.next === "pressure_2" || choice.next === "pressure_3") {
      setPressureKey(choice.next);
    } else if (choice.next === 4) {
      setStepId(4);
      setPhase("trap");
      setTimeout(() => setTrapStage(1), 1500);
      setTimeout(() => setTrapStage(2), 4000);
      setTimeout(() => setTrapStage(3), 7000);
    } else {
      setPressureKey(null);
      setStepId(choice.next);
    }
  };

  const resumeFromPressure = () => {
    setStepId(pressure.backTo);
    setPressureKey(null);
  };

  const accentGreen = "#16a34a";
  const accentRed = "#dc2626";

  // ── Intro ──
  if (phase === "intro") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#0a1a0a,#041004)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(24)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: "#4ade80", borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.4 + 0.05, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>⚠️</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#4ade80", letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 03</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.2 }}>断れなくなる前に</h1>
      <p style={{ color: "rgba(255,255,255,.45)", fontSize: 12, margin: "0 0 22px", textAlign: "center", lineHeight: 1.7 }}>— 闇バイト勧誘シミュレーター —</p>
      <div style={{ background: "rgba(74,222,128,.07)", backdropFilter: "blur(10px)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#dcfce7", fontSize: 13, lineHeight: 1.9, marginBottom: 20 }}>
        あなたはSNSで<strong style={{ color: "#4ade80" }}>「高収入バイト」の投稿</strong>を見た。<br /><br />
        選択肢を選びながら、<strong style={{ color: "#4ade80" }}>「どこで断るべきだったか」</strong>を体験しよう。
      </div>
      <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 14, padding: "12px 18px", maxWidth: 320, marginBottom: 24, fontSize: 12, color: "#fca5a5", lineHeight: 1.75, textAlign: "center" }}>
        ⚠️ 実際の被害事例をもとにした教育コンテンツです。<br />登場人物はすべてフィクションです。
      </div>
      <OwlSay mood="worried">気をつけて。断れなくなる「罠」がどこにあるか、一緒に見ていこう🦉</OwlSay>
      <button onClick={() => setPhase("convo")} style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(22,163,74,.4)", marginTop: 8 }}>体験スタート</button>
    </div>
  );

  // ── Safe End (断った！) ──
  if (phase === "safe_end") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0fdf4,#dcfce7)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 64, marginBottom: 8, animation: "celebrate 1s infinite" }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#166534", margin: "0 0 6px" }}>正しく断れました！</h2>
          <p style={{ fontSize: 13, color: "#15803d", lineHeight: 1.7 }}>
            {choiceHistory.length <= 1 ? "最初から疑ってかかれた。完璧な判断です。" : "途中で気づいて断れた。勇気ある行動です。"}
          </p>
        </div>
        <OwlSay mood="happy">「断る」のが一番正しい選択。断ることは全然悪くないよ🦉</OwlSay>
        <div style={{ background: "#fff", borderRadius: 18, padding: "18px 16px", border: "2px solid #86efac", marginBottom: 14, boxShadow: "0 6px 20px rgba(22,163,74,.12)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: "#166534", margin: "0 0 12px" }}>🛑 断るための3つの言葉</h3>
          {[
            ["「やっぱり興味ありません」", "理由を説明する必要はない。一言で十分。"],
            ["「個人情報は教えられません」", "どんな理由があっても、見知らぬ人に渡さない。"],
            ["「ブロックします」", "しつこく来たらブロック。それは正当な自衛手段。"],
          ].map(([t, d], i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
              <div><div style={{ fontSize: 13, fontWeight: 900, color: "#166534" }}>{t}</div><div style={{ fontSize: 11, color: "#4ade80", marginTop: 2, color: "#15803d" }}>{d}</div></div>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("cases")} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>実際の被害事例を見る →</button>
      </div>
    </div>
  );

  // ── Trap phase ──
  if (phase === "trap") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0000,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(220,38,38,.02) 2px,rgba(220,38,38,.02) 4px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 400, width: "100%", position: "relative", zIndex: 2 }}>

        {trapStage >= 0 && (
          <div style={{ background: "rgba(30,10,10,.7)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 20, padding: "18px 16px", marginBottom: 14, backdropFilter: "blur(20px)", animation: "slideUp .5s ease" }}>
            <div style={{ fontSize: 11, color: "#f87171", fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em", marginBottom: 8 }}>相手からのメッセージ</div>
            <Typewriter text="ありがとう！確認できたよ😊 じゃあ仕事の説明するね——" speed={60} style={{ color: "#fff", fontSize: 14, lineHeight: 1.7 }} />
          </div>
        )}

        {trapStage >= 1 && (
          <div style={{ background: "rgba(40,0,0,.8)", border: "1px solid rgba(220,38,38,.5)", borderRadius: 20, padding: "18px 16px", marginBottom: 14, backdropFilter: "blur(20px)", animation: "slideUp .4s ease, shake .3s ease" }}>
            <div style={{ fontSize: 11, color: "#f87171", fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em", marginBottom: 8, animation: "blink 1s infinite" }}>⚠️ 突然、トーンが変わった</div>
            <Typewriter text="あ、そうそう。送ってもらった写真と学校名、もう記録してあるから。もし今更やめたいとか言い出したら…わかるよね？" speed={75} style={{ color: "#ffaaaa", fontSize: 14, lineHeight: 1.75, fontWeight: 700 }} />
          </div>
        )}

        {trapStage >= 2 && (
          <div style={{ background: "rgba(60,0,0,.9)", border: "2px solid #dc2626", borderRadius: 20, padding: "18px 16px", marginBottom: 14, animation: "slideUp .4s ease, pulse 2s infinite" }}>
            <div style={{ fontSize: 11, color: "#fca5a5", fontFamily: "'DotGothic16',monospace", marginBottom: 8 }}>📍 脅迫に変わった</div>
            <Typewriter text="学校に連絡するのも、SNSに顔写真バラまくのも簡単だよ。大人しくやってくれれば何もしない。最初の仕事は明日ね。" speed={80} style={{ color: "#fff", fontSize: 14, lineHeight: 1.8, fontWeight: 700 }} />
          </div>
        )}

        {trapStage >= 3 && (
          <div style={{ animation: "slideUp .5s ease" }}>
            <div style={{ background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#fca5a5", marginBottom: 6 }}>罠にかかってしまいました</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.75 }}>
                個人情報を渡した時点で、相手にコントロールされます。<br />「知らなかった」では済まない状況になります。
              </div>
            </div>
            <button onClick={() => setPhase("cases")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#dc2626,#991b1b)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(220,38,38,.4)" }}>実際の逮捕事例を見る →</button>
          </div>
        )}
      </div>
    </div>
  );

  // ── Real cases ──
  if (phase === "cases") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a0a0f,#0f0a14)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>⚖️</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>実際の被害・逮捕事例</h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>すべて実際に起きた事件をもとにした事例です</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {realCases.map((c, i) => (
            <div key={i} style={{ background: i === caseIdx ? "rgba(220,38,38,.1)" : "rgba(255,255,255,.03)", border: `1px solid ${i === caseIdx ? "rgba(220,38,38,.4)" : "rgba(255,255,255,.07)"}`, borderRadius: 16, padding: "16px", cursor: "pointer", transition: "all .2s", animation: `slideUp .4s ${i * .1}s both ease` }} onClick={() => setCaseIdx(i)}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(220,38,38,.15)", border: "1px solid rgba(220,38,38,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚖️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#f87171", fontWeight: 700, marginBottom: 3 }}>{c.age} / 役割：{c.role}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)", fontWeight: 700, lineHeight: 1.5, marginBottom: i === caseIdx ? 8 : 0 }}>{c.result}</div>
                  {i === caseIdx && <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.75, borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 8, marginTop: 4 }}>{c.detail}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#f87171", marginBottom: 8 }}>⚖️ 法的な現実</div>
          {[
            "「知らなかった」「使われただけ」は刑事責任を免れる理由にならない",
            "未成年でも逮捕・少年院送致・実名報道になることがある",
            "被害者への損害賠償は数百万〜数千万円規模になることも",
          ].map((t, i) => <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.7, paddingLeft: 14, position: "relative", marginBottom: 4 }}><span style={{ position: "absolute", left: 0, color: "#f87171" }}>▸</span>{t}</div>)}
        </div>

        <button onClick={() => setPhase("checkpoints")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>見抜き方を学ぶ →</button>
      </div>
    </div>
  );

  // ── Checkpoints ──
  if (phase === "checkpoints") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a1a0a,#041004)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <OwlMolly size={90} mood="happy" style={{ margin: "0 auto" }} />
        </div>
        <OwlSay mood="happy">この5つのサインが出たら、即座に離れよう🦉</OwlSay>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {checkpoints.map((cp, i) => (
            <div key={i} style={{ background: "rgba(74,222,128,.05)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", animation: `slideUp .4s ${i * .08}s both ease` }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(74,222,128,.12)", border: "1px solid rgba(74,222,128,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{cp.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#4ade80", marginBottom: 3 }}>🚨 {cp.sign}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>{cp.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#4ade80", marginBottom: 8 }}>📞 もし誘われたら、どこに相談する？</div>
          {[
            ["警察相談専用電話", "#9110"],
            ["法務省 子どもの人権110番", "0120-007-110"],
            ["おうちの人・学校の先生", "まず一番近くの大人に"],
          ].map(([n, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>{n}</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: "#4ade80" }}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("dialogue")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(22,163,74,.35)" }}>おうちの人とお話しする →</button>
      </div>
    </div>
  );

  // ── Dialogue ──
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0fdf4,#dcfce7)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#bbf7d0,#86efac)", borderRadius: 20, padding: "22px 18px", textAlign: "center", marginBottom: 18, border: "2px solid #16a34a" }}>
          <div style={{ fontSize: 34, marginBottom: 6 }}>👨‍👩‍👧</div>
          <h2 style={{ fontSize: 20, color: "#14532d", margin: "0 0 6px", fontWeight: 900 }}>おうちの人と話してみよう</h2>
          <p style={{ fontSize: 12, color: "#166534", margin: 0, lineHeight: 1.7 }}>今日体験したことを一緒に話し合おう</p>
        </div>
        {[
          ["💬", "#86efac", "もしこんなDMが来たら、どうする？", "「すぐ家の人に見せる」が正解"],
          ["🤔", "#67e8f9", "なぜ断りにくくなるか、わかった？", "「もったいない」「他にいる」という言葉で焦らされる"],
          ["📱", "#fde68a", "SNSのDM設定、見直してみよう", "知らない人からのDMを受け取らない設定に"],
          ["📞", "#fca5a5", "もし困ったら、誰に相談する？", "「#9110」「0120-007-110」を覚えておこう"],
        ].map(([ic, col, q, d], i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px 14px 14px 18px", marginBottom: 8, borderLeft: `5px solid ${col}`, display: "flex", gap: 12, alignItems: "flex-start", boxShadow: "0 4px 12px rgba(22,163,74,.08)", animation: `slideUp .4s ${i * .1}s both ease` }}>
            <div style={{ fontSize: 22, flexShrink: 0 }}>{ic}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#14532d", lineHeight: 1.5, marginBottom: 3 }}>{q}</div>
              <div style={{ fontSize: 11, color: "#166534", lineHeight: 1.6 }}>{d}</div>
            </div>
          </div>
        ))}
        <button onClick={() => setPhase("complete")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginTop: 14 }}>🏆 修了証をもらう</button>
      </div>
    </div>
  );

  // ── Convo (main game) ──
  if (phase === "convo") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a1a0a,#041004)", padding: "16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(74,222,128,.08)", borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: "1px solid rgba(74,222,128,.15)" }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#4ade80", letterSpacing: ".1em" }}>SIMULATION</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4].map(lv => (
              <div key={lv} style={{ width: 20, height: 6, borderRadius: 3, background: step.dangerLevel >= lv ? "#dc2626" : "rgba(255,255,255,.1)" }} />
            ))}
            <span style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginLeft: 6 }}>危険度</span>
          </div>
        </div>

        {/* Situation */}
        <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 12, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "rgba(255,255,255,.5)", fontStyle: "italic", textAlign: "center" }}>
          📍 {step.situation}
        </div>

        {/* Warning banner */}
        {step.warning && (
          <div style={{ background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 12, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#fca5a5", fontWeight: 700, textAlign: "center", animation: "blink 1.5s infinite" }}>
            {step.warning}
          </div>
        )}

        {/* Timeline post (step 0 only) */}
        {step.phase === "timeline" && step.post && (
          <div style={{ background: "#0d1117", borderRadius: 18, padding: 16, marginBottom: 14, border: "1px solid rgba(74,222,128,.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📢</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{step.post.account}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>フォロワー 1,842</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.85)", lineHeight: 1.75, margin: "0 0 10px" }}>{step.post.text}</p>
            <div style={{ display: "flex", gap: 14, fontSize: 11, color: "rgba(255,255,255,.35)" }}>
              <span>❤️ {step.post.likes}</span><span>🔁 {step.post.rts}</span>
            </div>
          </div>
        )}

        {/* DM conversation */}
        {step.phase === "dm" && (
          <div style={{ background: "#0d1117", borderRadius: 18, padding: 14, marginBottom: 14, border: "1px solid rgba(255,255,255,.08)" }}>
            {/* DM header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,.06)", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(74,222,128,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📢</div>
              <div><div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>副業_情報局📢</div><div style={{ fontSize: 10, color: "#4ade80", animation: "blink 2s infinite" }}>● オンライン</div></div>
            </div>
            {/* My message */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <div style={{ background: "#1d9bf0", borderRadius: "14px 14px 4px 14px", padding: "10px 14px", maxWidth: "75%", fontSize: 13, color: "#fff", lineHeight: 1.6 }}>{step.senderMsg}</div>
            </div>
            {/* Their reply */}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(74,222,128,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📢</div>
              <div style={{ background: "rgba(255,255,255,.07)", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", maxWidth: "80%", fontSize: 13, color: "rgba(255,255,255,.9)", lineHeight: 1.7 }}>
                <Typewriter text={step.replyMsg} speed={40} />
              </div>
            </div>
          </div>
        )}

        {/* Pressure message (intermediate) */}
        {pressure && (
          <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 18, padding: 14, marginBottom: 14, animation: "slideUp .4s ease" }}>
            <div style={{ fontSize: 11, color: "#f87171", marginBottom: 8, fontWeight: 700 }}>⚠️ 圧力をかけてきた</div>
            <div style={{ background: "rgba(255,255,255,.05)", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,.85)", lineHeight: 1.7, marginBottom: 10 }}>
              <Typewriter text={pressure.msg} speed={50} />
            </div>
            <OwlSay mood="worried">{pressure.owlMsg}</OwlSay>
            <button onClick={resumeFromPressure} style={{ width: "100%", padding: 12, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, color: "rgba(255,255,255,.7)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>もう一度選択する</button>
          </div>
        )}

        {/* Owl advice */}
        {!pressure && step.owlMsg && <OwlSay mood={step.dangerLevel >= 3 ? "worried" : "happy"}>{step.owlMsg}</OwlSay>}

        {/* Choices */}
        {!pressure && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {step.choices.map((choice, i) => (
              <button key={i} onClick={() => handleChoice(choice)}
                style={{
                  width: "100%", padding: "14px 16px",
                  background: choice.safe ? "rgba(74,222,128,.08)" : "rgba(255,255,255,.04)",
                  border: `1.5px solid ${choice.safe ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.1)"}`,
                  borderRadius: 14, color: choice.safe ? "#86efac" : "rgba(255,255,255,.8)",
                  fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                  transition: "all .15s",
                }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{choice.emoji}</span>
                {choice.label}
                {choice.safe && <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>✓ 安全</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#f0fdf4,#dcfce7,#bbf7d0)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: ["#4ade80", "#16a34a", "#86efac", "#22c55e", "#bbf7d0"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#f0fdf4)", borderRadius: 22, padding: "28px 22px", border: "3px double #16a34a", textAlign: "center", boxShadow: "0 20px 60px rgba(22,163,74,.2)", position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: "#16a34a" }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#166534", letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#14532d", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#166534", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            あなたは「マモル」第3話<br /><strong style={{ color: "#14532d", fontSize: 14 }}>断れなくなる前に</strong><br />をクリアしました。
          </p>
          <div style={{ background: "linear-gradient(135deg,#bbf7d0,#86efac)", borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: "#166534", marginBottom: 3 }}>EPISODE 03 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#14532d", fontWeight: 900 }}>🛡️ 闇バイト免疫マスター 🛡️</div>
          </div>
          <div style={{ fontSize: 10, color: "#16a34a", marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP3 クリア！", text: "闇バイト勧誘シミュレーターを体験！SNSリテラシーアプリ「マモル」🛡️" }).catch(() => {})} style={{ flex: 1, padding: 14, background: "#fff", border: "2px solid #16a34a", borderRadius: 14, color: "#166534", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={onComplete} style={{ flex: 1, padding: 14, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ EPISODE 4 — 友達のふりをした罠（なりすまし・乗っ取り）
// ─────────────────────────────────────────────

// LINE風メッセージUI
function LineMsg({ from, text, isMe = false, time, typing = false }) {
  const sky = "#0ea5e9";
  return (
    <div style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", alignItems: "flex-end", gap: 8, marginBottom: 10 }}>
      {!isMe && (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${sky}44,${sky}22)`, border: `2px solid ${sky}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
          {from === "haruki" ? "👦" : from === "fake" ? "😈" : "👧"}
        </div>
      )}
      <div style={{ maxWidth: "72%" }}>
        {!isMe && <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginBottom: 4, paddingLeft: 4 }}>{from === "haruki" ? "ハルキ" : from === "fake" ? "ハルキ（？）" : "ミナ"}</div>}
        {typing ? (
          <div style={{ background: "rgba(255,255,255,.08)", borderRadius: isMe ? "14px 4px 14px 14px" : "4px 14px 14px 14px", padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
            {[0, .2, .4].map((d, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: sky, animation: `blink 1s ${d}s infinite` }} />)}
          </div>
        ) : (
          <div style={{ background: isMe ? sky : "rgba(255,255,255,.09)", borderRadius: isMe ? "14px 4px 14px 14px" : "4px 14px 14px 14px", padding: "11px 14px", fontSize: 13, color: "#fff", lineHeight: 1.7, wordBreak: "break-word" }}>
            {text}
          </div>
        )}
        {time && <div style={{ fontSize: 10, color: "rgba(255,255,255,.25)", marginTop: 3, textAlign: isMe ? "left" : "right", paddingLeft: isMe ? 0 : 4 }}>{time}</div>}
      </div>
    </div>
  );
}

// 疑似スマホ画面ラッパー
function PhoneFrame({ children, header }) {
  return (
    <div style={{ background: "#0d1117", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(14,165,233,.2)", boxShadow: "0 12px 40px rgba(0,0,0,.5)", marginBottom: 14 }}>
      {header}
      <div style={{ padding: "14px 14px 4px" }}>{children}</div>
    </div>
  );
}

function Episode4({ onComplete }) {
  const [phase, setPhase] = useState("intro");
  // intro → story1 → choice1 → [safe_call | gave_code] → aftermath → spotdiff → settings → dialogue → complete
  const [storyStep, setStoryStep] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [afterStep, setAfterStep] = useState(0);
  const [spotIdx, setSpotIdx] = useState(null);
  const [foundSpots, setFoundSpots] = useState([]);
  const [settingStep, setSettingStep] = useState(0);
  const [choseCode, setChoseCode] = useState(false);

  const sky = "#0ea5e9";
  const skyDark = "#0369a1";

  // Story messages that appear one by one
  const storyMsgs = [
    { from: "haruki", text: "ねー急いで聞きたいんだけど", time: "14:22" },
    { from: "haruki", text: "LINEの認証コードが間違えてお前の番号に届いちゃったんだけど…", time: "14:22" },
    { from: "haruki", text: "届いてる？6桁のやつ。教えてくれたら助かる🙏", time: "14:23" },
  ];

  // Aftermath messages — show after giving code
  const afterMsgs = [
    { text: "アカウントが乗っ取られました", isAlert: true },
    { from: "fake", text: "ハルキくんのお母さんですか？ハルキが急に入院して手術代が必要になって…今すぐ3万円PayPayで送ってもらえますか？", isFamily: true, label: "家族グループに送られたメッセージ" },
    { from: "fake", text: "【至急】俺やばいことになった…今すぐ5万円貸してほしい。後で絶対返す。PayPayでお願い🙏", isFriend: true, label: "友達全員に送られたメッセージ" },
    { from: "fake", text: "さらに…あなたの過去の会話・写真・連絡先がすべて盗まれました", isAlert: true },
  ];

  // Spot the difference clues (おかしい点を見つけるゲーム)
  const suspiciousPoints = [
    { id: 0, icon: "⚡", label: "「急いで」という焦らせ方", desc: "本物の友達でもこんなに急かす？落ち着いて確認する時間は必ずある。" },
    { id: 1, icon: "🔢", label: "認証コードの要求", desc: "認証コードは絶対に他人に教えてはいけない。LINEもGoogleも公式サービスは「コードを誰かに教えないでください」と明記している。" },
    { id: 2, icon: "📱", label: "別のアプリで確認していない", desc: "本当にハルキ本人？電話で確認すれば一瞬でわかる。テキストだけで信じてはいけない。" },
    { id: 3, icon: "🤔", label: "「自分のコードが他人に届く」はありえない", desc: "LINEの認証コードは登録した番号にしか届かない。「間違えて届いた」という話自体がおかしい。" },
  ];

  // 2段階認証の設定手順
  const securitySteps = [
    { icon: "⚙️", title: "LINE設定を開く", desc: "ホーム画面右上の歯車アイコン → 「設定」" },
    { icon: "🔐", title: "「アカウント」を選ぶ", desc: "設定一覧の中から「アカウント」をタップ" },
    { icon: "📱", title: "「2段階認証」をオンにする", desc: "PINコード（4桁）を設定する。誕生日や1234はNG" },
    { icon: "📧", title: "メールアドレスを登録する", desc: "乗っ取られた時の復旧手段になる。必ず設定しよう" },
    { icon: "✅", title: "完了！これで守られる", desc: "コードだけでなくPINも必要になり、乗っ取りが格段に難しくなる" },
  ];

  useEffect(() => {
    if (phase === "story1") {
      setShowTyping(true);
      const t = setTimeout(() => setShowTyping(false), 1200);
      return () => clearTimeout(t);
    }
  }, [phase, storyStep]);

  // ── Intro ──
  if (phase === "intro") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#031220,#020c18)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(28)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: sky, borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.4 + 0.05, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🔐</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: sky, letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 04</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.2 }}>友達のふりをした罠</h1>
      <p style={{ color: "rgba(255,255,255,.45)", fontSize: 12, margin: "0 0 22px", textAlign: "center", lineHeight: 1.7 }}>— なりすまし・アカウント乗っ取り体験 —</p>
      <div style={{ background: `${sky}11`, backdropFilter: "blur(10px)", border: `1px solid ${sky}33`, borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#e0f2fe", fontSize: 13, lineHeight: 1.9, marginBottom: 20 }}>
        突然、<strong style={{ color: sky }}>仲の良い友達「ハルキ」</strong>からメッセージが届いた。<br /><br />
        「認証コードを教えて」——<strong style={{ color: sky }}>信じてしまったら何が起きる？</strong>
      </div>
      <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 14, padding: "12px 18px", maxWidth: 320, marginBottom: 22, fontSize: 12, color: "#fca5a5", lineHeight: 1.75, textAlign: "center" }}>
        ⚠️ 実際の被害事例をもとにした教育コンテンツです
      </div>
      <OwlSay mood="worried">「友達から」というだけで信じてしまうのが、この手口の怖さだよ🦉</OwlSay>
      <button onClick={() => setPhase("story1")} style={{ background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${sky}44`, marginTop: 8 }}>体験スタート</button>
    </div>
  );

  // ── Story (see the DM) ──
  if (phase === "story1") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: `${sky}11`, borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: `1px solid ${sky}22`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: sky, letterSpacing: ".1em" }}>LINE · DM</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>今日 14:22</span>
        </div>

        <OwlSay>ハルキくんからLINEが来たよ。どんな内容？</OwlSay>

        <PhoneFrame header={
          <div style={{ background: "#0a1628", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${sky}22` }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${sky}22`, border: `2px solid ${sky}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👦</div>
            <div>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>ハルキ</div>
              <div style={{ fontSize: 10, color: "#4ade80", animation: "blink 2s infinite" }}>● オンライン</div>
            </div>
          </div>
        }>
          {storyMsgs.slice(0, storyStep + 1).map((m, i) => (
            <LineMsg key={i} from={m.from} text={m.text} time={m.time} />
          ))}
          {showTyping && <LineMsg from="haruki" typing />}
        </PhoneFrame>

        {storyStep < storyMsgs.length - 1 ? (
          <button onClick={() => { setStoryStep(s => s + 1); setShowTyping(true); setTimeout(() => setShowTyping(false), 900); }}
            style={{ width: "100%", padding: 14, background: `${sky}18`, border: `1px solid ${sky}35`, borderRadius: 14, color: sky, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            次のメッセージを見る →
          </button>
        ) : (
          <div style={{ animation: "slideUp .4s ease" }}>
            <OwlSay mood="worried">「認証コードを教えて」…あなたはどうする？🦉</OwlSay>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => { setChoseCode(false); setPhase("safe_call"); }}
                style={{ width: "100%", padding: "14px 16px", background: "rgba(74,222,128,.08)", border: "1.5px solid rgba(74,222,128,.3)", borderRadius: 14, color: "#86efac", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 22 }}>📞</span>
                <div><div>電話してハルキ本人か確認する</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>ちょっと待って、確認してみよう</div></div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>✓ 安全</span>
              </button>
              <button onClick={() => { setChoseCode(true); setPhase("gave_code"); }}
                style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.1)", borderRadius: 14, color: "rgba(255,255,255,.75)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 22 }}>💬</span>
                <div><div>コードを教えてあげる（友達だし…）</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 2 }}>困ってるなら助けてあげたい</div></div>
              </button>
              <button onClick={() => { setChoseCode(false); setPhase("safe_call"); }}
                style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.1)", borderRadius: 14, color: "rgba(255,255,255,.75)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 22 }}>🚫</span>
                <div><div>無視する・返信しない</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 2 }}>なんか怪しい気がする</div></div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>✓ 安全</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Safe: Called Haruki ──
  if (phase === "safe_call") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* Phone call animation */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(74,222,128,.1)", border: "3px solid #4ade80", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, animation: "float2 1.5s infinite", boxShadow: "0 0 0 12px rgba(74,222,128,.05), 0 0 0 24px rgba(74,222,128,.025)" }}>📞</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#4ade80", marginBottom: 4 }}>ハルキに電話した</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>本人かどうか、声で確認できる</div>
        </div>

        <PhoneFrame header={
          <div style={{ background: "#0a1628", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${sky}22` }}>
            <div style={{ fontSize: 18 }}>👦</div>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>ハルキ</div>
            <div style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>通話中 0:12</div>
          </div>
        }>
          <LineMsg from="haruki" text="あ、もしもし？え、認証コード？俺そんなLINEしてないよ？？" time="14:24" />
          <LineMsg isMe text="え！じゃあさっきのLINEは偽物だった？？" time="14:24" />
          <LineMsg from="haruki" text="やばい！俺のアカウント乗っ取られてたかも…！！ありがとう教えなくて本当によかった" time="14:25" />
        </PhoneFrame>

        <div style={{ background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 16, padding: "16px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#4ade80", marginBottom: 6 }}>完璧な対応でした！</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.75 }}>
            電話で本人確認するのが<strong style={{ color: "#4ade80" }}>最速・最強の防御</strong>です。<br />テキストは誰でも偽造できるけど、声は偽造しにくい。
          </div>
        </div>

        <OwlSay mood="happy">「コードは絶対に教えない」と「別の方法で本人確認」の2つを覚えておこう🦉</OwlSay>

        <button onClick={() => setPhase("spotdiff")}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${sky}33` }}>
          なりすましの見抜き方を学ぶ →
        </button>
      </div>
    </div>
  );

  // ── Bad: Gave the code ──
  if (phase === "gave_code") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0505,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(255,0,0,.02) 2px,rgba(255,0,0,.02) 4px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8, animation: "redFlash 1.5s infinite" }}>
          <span style={{ fontSize: 16, animation: "heartbeat 1s infinite" }}>🚨</span>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#f87171", letterSpacing: ".1em" }}>コードを送ってしまった…</span>
        </div>

        <PhoneFrame header={
          <div style={{ background: "#1a0505", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(220,38,38,.2)" }}>
            <div style={{ fontSize: 18 }}>👦</div>
            <div style={{ fontSize: 13, color: "#ffaaaa", fontWeight: 700 }}>ハルキ（？）</div>
            <div style={{ marginLeft: "auto", fontSize: 10, color: "#f87171", animation: "blink 1.5s infinite" }}>● 不審な動き</div>
          </div>
        }>
          <LineMsg isMe text="届いてるよ！847291 だよ" time="14:23" />
          <LineMsg from="fake" text="ありがとう！助かった〜😊" time="14:23" />
          <LineMsg from="fake" typing />
        </PhoneFrame>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {afterMsgs.slice(0, afterStep + 1).map((m, i) => (
            <div key={i} style={{ animation: "slideUp .4s ease" }}>
              {m.isAlert ? (
                <div style={{ background: "rgba(220,38,38,.12)", border: "1px solid rgba(220,38,38,.5)", borderRadius: 14, padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#f87171", letterSpacing: ".05em" }}>⚠️ {m.text}</div>
                </div>
              ) : (
                <div style={{ background: "#0d1117", borderRadius: 16, padding: 12, border: "1px solid rgba(220,38,38,.25)" }}>
                  <div style={{ fontSize: 10, color: "#f87171", fontFamily: "'DotGothic16',monospace", marginBottom: 8, letterSpacing: ".08em" }}>
                    {m.label}
                  </div>
                  <LineMsg from="fake" text={m.text} />
                </div>
              )}
            </div>
          ))}
        </div>

        {afterStep < afterMsgs.length - 1 ? (
          <button onClick={() => setAfterStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: "rgba(220,38,38,.12)", border: "1px solid rgba(220,38,38,.35)", borderRadius: 14, color: "#f87171", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            続きを見る → （怖いかも）
          </button>
        ) : (
          <button onClick={() => setPhase("spotdiff")}
            style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#dc2626,#991b1b)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .5s ease" }}>
            なりすましの見抜き方を学ぶ →
          </button>
        )}
      </div>
    </div>
  );

  // ── Spot the suspicious points ──
  if (phase === "spotdiff") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🕵️</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}>おかしい点を見つけよう</h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 6, lineHeight: 1.6 }}>なりすましメッセージには必ずヒントがある</p>
        </div>

        {/* Re-show the suspicious message */}
        <PhoneFrame header={
          <div style={{ background: "#0a1628", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${sky}22` }}>
            <div style={{ fontSize: 16 }}>👦</div>
            <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>ハルキ（？）</div>
            <div style={{ marginLeft: "auto", fontSize: 10, color: "#f87171" }}>⚠️ なりすまし</div>
          </div>
        }>
          <LineMsg from="fake" text="ねー急いで聞きたいんだけど" time="14:22" />
          <LineMsg from="fake" text="LINEの認証コードが間違えてお前の番号に届いちゃったんだけど…" time="14:22" />
          <LineMsg from="fake" text="届いてる？6桁のやつ。教えてくれたら助かる🙏" time="14:23" />
        </PhoneFrame>

        <OwlSay mood="worried">このメッセージ、どこかおかしい。タップして見つけよう🦉 <strong style={{ color: sky }}>（{foundSpots.length}/{suspiciousPoints.length}個）</strong></OwlSay>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {suspiciousPoints.map((pt) => {
            const found = foundSpots.includes(pt.id);
            return (
              <button key={pt.id} onClick={() => { if (!found) setFoundSpots(s => [...s, pt.id]); setSpotIdx(pt.id); }}
                style={{ width: "100%", padding: "13px 16px", background: found ? `${sky}18` : "rgba(255,255,255,.04)", border: `1.5px solid ${found ? sky + "55" : "rgba(255,255,255,.1)"}`, borderRadius: 14, color: found ? sky : "rgba(255,255,255,.65)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left", transition: "all .2s" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{pt.icon}</span>
                <span style={{ flex: 1 }}>{pt.label}</span>
                {found ? <span style={{ color: sky, fontSize: 16 }}>✓</span> : <span style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>タップ</span>}
              </button>
            );
          })}
        </div>

        {/* Detail popup */}
        {spotIdx !== null && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100 }} onClick={() => setSpotIdx(null)}>
            <div style={{ background: "#0a1628", borderRadius: 20, padding: "22px 20px", maxWidth: 340, width: "100%", border: `2px solid ${sky}` }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 34, textAlign: "center", marginBottom: 8 }}>{suspiciousPoints[spotIdx]?.icon}</div>
              <h3 style={{ color: "#e0f2fe", fontSize: 16, fontWeight: 900, textAlign: "center", margin: "0 0 12px" }}>{suspiciousPoints[spotIdx]?.label}</h3>
              <p style={{ color: "#93c5fd", fontSize: 13, lineHeight: 1.8, margin: "0 0 14px" }}>{suspiciousPoints[spotIdx]?.desc}</p>
              <button onClick={() => setSpotIdx(null)} style={{ width: "100%", padding: 12, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>なるほど！</button>
            </div>
          </div>
        )}

        {foundSpots.length >= suspiciousPoints.length && (
          <button onClick={() => setPhase("settings")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${sky}33`, animation: "popIn .4s ease" }}>
            アカウントを守る設定を学ぶ →
          </button>
        )}
      </div>
    </div>
  );

  // ── Security settings ──
  if (phase === "settings") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <OwlMolly size={90} mood="happy" style={{ margin: "0 auto" }} />
        </div>
        <OwlSay>2段階認証を設定すると、コードを盗まれても乗っ取られにくくなるよ🦉</OwlSay>

        <div style={{ background: `${sky}0a`, border: `1px solid ${sky}22`, borderRadius: 18, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: sky, marginBottom: 14 }}>📱 LINEの2段階認証設定方法</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {securitySteps.slice(0, settingStep + 1).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", animation: "slideUp .4s ease" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${sky}18`, border: `1px solid ${sky}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#e0f2fe", marginBottom: 3 }}>STEP {i + 1}：{s.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3原則 */}
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: sky, marginBottom: 10 }}>🛡️ 認証コードの3原則</div>
          {[
            "絶対に誰にも教えない（友達でも・家族でも）",
            "コードを求められたら「なりすまし」を疑う",
            "不審なら電話で本人確認を取る",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: sky, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.6 }}>{t}</div>
            </div>
          ))}
        </div>

        {settingStep < securitySteps.length - 1 ? (
          <button onClick={() => setSettingStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: `${sky}18`, border: `1px solid ${sky}33`, borderRadius: 14, color: sky, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            次のステップ →
          </button>
        ) : (
          <button onClick={() => setPhase("dialogue")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${sky}33` }}>
            おうちの人とお話しする →
          </button>
        )}
      </div>
    </div>
  );

  // ── Dialogue ──
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#e0f2fe,#bae6fd)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#bae6fd,#7dd3fc)", borderRadius: 20, padding: "22px 18px", textAlign: "center", marginBottom: 18, border: `2px solid ${sky}` }}>
          <div style={{ fontSize: 34, marginBottom: 6 }}>👨‍👩‍👧</div>
          <h2 style={{ fontSize: 20, color: "#0c4a6e", margin: "0 0 6px", fontWeight: 900 }}>おうちの人と話してみよう</h2>
          <p style={{ fontSize: 12, color: "#075985", margin: 0, lineHeight: 1.7 }}>今日体験したことを一緒に確認しよう</p>
        </div>
        {[
          ["🔐", "#7dd3fc", "LINEの2段階認証、設定してある？", "おうちの人と一緒に確認・設定しよう"],
          ["📞", "#86efac", "友達からおかしなLINEが来たら？", "「まず電話して確認する」を合言葉にしよう"],
          ["🔢", "#fde68a", "認証コードは絶対に教えない！", "どんな理由があっても・誰が頼んでも"],
          ["💳", "#fca5a5", "もし乗っ取られたらどうする？", "すぐLINEのサポートに連絡・パスワード変更"],
        ].map(([ic, col, q, d], i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px 14px 14px 18px", marginBottom: 8, borderLeft: `5px solid ${col}`, display: "flex", gap: 12, alignItems: "flex-start", boxShadow: `0 4px 12px ${sky}18`, animation: `slideUp .4s ${i * .1}s both ease` }}>
            <div style={{ fontSize: 22, flexShrink: 0 }}>{ic}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#0c4a6e", lineHeight: 1.5, marginBottom: 3 }}>{q}</div>
              <div style={{ fontSize: 11, color: "#075985", lineHeight: 1.6 }}>{d}</div>
            </div>
          </div>
        ))}
        <button onClick={() => setPhase("complete")}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginTop: 14, boxShadow: `0 8px 24px ${sky}44` }}>
          🏆 修了証をもらう
        </button>
      </div>
    </div>
  );

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#e0f2fe,#bae6fd,#7dd3fc)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: [sky, "#38bdf8", "#7dd3fc", "#0ea5e9", "#bae6fd"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#f0f9ff)", borderRadius: 22, padding: "28px 22px", border: `3px double ${sky}`, textAlign: "center", boxShadow: `0 20px 60px ${sky}33`, position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: sky }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: skyDark, letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#0c4a6e", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#075985", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            あなたは「マモル」第4話<br /><strong style={{ color: "#0c4a6e", fontSize: 14 }}>友達のふりをした罠</strong><br />をクリアしました。
          </p>
          <div style={{ background: `linear-gradient(135deg,${sky}33,#bae6fd)`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: skyDark, marginBottom: 3 }}>EPISODE 04 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#0c4a6e", fontWeight: 900 }}>🔐 アカウント守護者 🔐</div>
          </div>
          <div style={{ fontSize: 10, color: sky, marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP4 クリア！", text: "なりすまし・アカウント乗っ取り対策を学んだ！SNSリテラシーアプリ「マモル」🔐" }).catch(() => {})}
            style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${sky}`, borderRadius: 14, color: skyDark, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={onComplete}
            style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ ATTACKER MODE
// ─────────────────────────────────────────────
const PHOTO_OPTIONS = [
  { id: "cafe", emoji: "☕", label: "カフェでの自撮り", risks: ["顔写真", "店名", "制服"] },
  { id: "school", emoji: "🏫", label: "学校の前", risks: ["校舎", "制服", "校章"] },
  { id: "home", emoji: "🏠", label: "家のベランダ", risks: ["背景", "周辺建物"] },
  { id: "park", emoji: "🌸", label: "近所の公園", risks: ["場所", "行動エリア"] },
];

function AttackerMode({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro|posting|attacker|debrief
  const [postData, setPostData] = useState(null);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [tags, setTags] = useState({ location: false, school: false, face: false });
  const [extracted, setExtracted] = useState([]);
  const [dms, setDms] = useState([]);
  const [attackStage, setAttackStage] = useState(0); // 0=terminal 1=dm
  const [allDone, setAllDone] = useState(false);
  const [debriefStep, setDebriefStep] = useState(0);

  const handlePost = () => {
    const leaks = [];
    if (text.includes("学校") || text.includes("中学")) leaks.push("学校名");
    if (text.includes("家") || text.includes("自宅")) leaks.push("自宅情報");
    if (tags.location) leaks.push("GPSタグ（緯度経度）");
    if (tags.school) leaks.push("プロフィールの学校名");
    if (tags.face) leaks.push("顔写真");
    if (photo) PHOTO_OPTIONS.find(p => p.id === photo)?.risks.forEach(r => { if (!leaks.includes(r)) leaks.push(r); });
    if (leaks.length === 0) leaks.push("投稿パターン・行動時間帯");
    setPostData({ text, photo, tags, leaks });
    setPhase("attacker");
  };

  // Generate DMs via Claude API
  useEffect(() => {
    if (phase !== "attacker" || !postData) return;
    const ctx = [
      photo && `写真: ${PHOTO_OPTIONS.find(p => p.id === photo)?.label}`,
      text && `投稿テキスト:「${text}」`,
      tags.location && "位置情報タグ: オン",
      tags.school && "プロフィールに学校名公開",
      tags.face && "顔出し写真あり",
      `検出リスク: ${postData.leaks.join("、")}`,
    ].filter(Boolean).join("\n");

    const run = async () => {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: `あなたはSNSリテラシー教育コンテンツのシナリオライターです。教育目的のフィクションとして、悪意ある人物が投稿から個人情報を抽出しDMを送るシナリオを生成してください。返答はJSONのみ。説明・前置き・コードブロック不要。
フォーマット:{"extracted":[{"label":"情報の種類","value":"具体的内容","danger":1〜3}],"dms":[{"delay":0か4か9,"text":"短く不気味なDM文"}]}
extractedは3〜4件、dmsは3件。過度な暴力・性的表現は含めない。`,
            messages: [{ role: "user", content: `以下のSNS投稿情報から教育シナリオを生成:\n${ctx}` }],
          }),
        });
        const data = await res.json();
        const raw = data.content?.find(b => b.type === "text")?.text || "";
        const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        for (const item of parsed.extracted) {
          await new Promise(r => setTimeout(r, 700));
          setExtracted(prev => [...prev, item]);
        }
        await new Promise(r => setTimeout(r, 1000));
        setAttackStage(1);
        for (const dm of parsed.dms) {
          await new Promise(r => setTimeout(r, dm.delay * 1000 + 1000));
          setDms(prev => [...prev, dm]);
        }
      } catch {
        // Fallback
        const fb = [
          { label: "学校", value: "制服・背景から○○中学校と特定", danger: 3 },
          { label: "生活エリア", value: "△△駅周辺と判断", danger: 3 },
          { label: "行動パターン", value: "平日16〜18時に外出する習慣", danger: 2 },
        ];
        const fdms = [
          { delay: 0, text: "今日の制服、かわいかったね。" },
          { delay: 4, text: "○○駅の近くに住んでるんだね。知ってたよ。" },
          { delay: 9, text: "学校の帰り道、いつも同じルートだね。気をつけてね。" },
        ];
        for (const item of fb) { await new Promise(r => setTimeout(r, 700)); setExtracted(prev => [...prev, item]); }
        await new Promise(r => setTimeout(r, 1000));
        setAttackStage(1);
        for (const dm of fdms) { await new Promise(r => setTimeout(r, dm.delay * 1000 + 1000)); setDms(prev => [...prev, dm]); }
      }
      await new Promise(r => setTimeout(r, 2000));
      setAllDone(true);
    };
    run();
  }, [phase]);

  if (phase === "intro") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#1e1b4b,#0f0a1e)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(22)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, background: "#a78bfa", borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * .5 + .1, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🎭</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a78bfa", letterSpacing: ".3em", marginBottom: 12 }}>ATTACKER VIEW MODE</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.2 }}>投稿したら、<br />何がバレる？</h1>
      <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13, margin: "0 0 26px", textAlign: "center", lineHeight: 1.7 }}>投稿した後、AIが悪意ある人物の視点に切り替わります。</p>
      <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,67,67,.3)", borderRadius: 14, padding: "14px 18px", maxWidth: 320, marginBottom: 26, fontSize: 12, color: "#fca5a5", lineHeight: 1.8, textAlign: "center" }}>⚠️ 教育目的のシミュレーションです。<br />実際の犯罪を促進するものではありません。</div>
      <button onClick={() => setPhase("posting")} style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 50, padding: "15px 42px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 28px rgba(124,58,237,.45)" }}>体験スタート</button>
    </div>
  );

  if (phase === "posting") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4ff,#e8f0fe)", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e7ff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👧</div>
        <div><div style={{ fontWeight: 900, fontSize: 14, color: "#1e1b4b" }}>ミナ</div><div style={{ fontSize: 10, color: "#7c3aed" }}>新しい投稿を作成</div></div>
        <div style={{ marginLeft: "auto", fontSize: 22 }}>📸</div>
      </div>
      <div style={{ padding: "20px 16px", maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: "13px 15px", marginBottom: 18, border: "2px solid #e0e7ff", fontSize: 13, color: "#3730a3", lineHeight: 1.7 }}>🎭 <strong>ミナとして投稿してみよう。</strong><br />普段どんな投稿をするか、いつも通りに入力してね。</div>
        {/* Photo picker */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>📷 写真を選ぶ（任意）</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PHOTO_OPTIONS.map(p => (
              <button key={p.id} onClick={() => setPhoto(photo === p.id ? null : p.id)} style={{ background: photo === p.id ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#fff", border: `2px solid ${photo === p.id ? "#7c3aed" : "#e0e7ff"}`, borderRadius: 12, padding: "11px 10px", cursor: "pointer", textAlign: "center", fontFamily: "inherit" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{p.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: photo === p.id ? "#fff" : "#4b5563", lineHeight: 1.4 }}>{p.label}</div>
              </button>
            ))}
          </div>
        </div>
        {/* Text */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>✏️ キャプション</div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder={"今日は学校帰りにカフェ寄った☕\n家の近くのお気に入りの場所🌸"} rows={4} style={{ width: "100%", padding: "12px 14px", fontSize: 14, border: "2px solid #e0e7ff", borderRadius: 14, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.7, color: "#1e1b4b", background: "#fff" }} />
        </div>
        {/* Tags */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>🏷️ タグ・設定</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[["location", "📍 位置情報タグをつける"], ["school", "🏫 通学先をプロフに公開中"], ["face", "😊 顔が写っている写真"]].map(([k, l]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 12, background: tags[k] ? "rgba(124,58,237,.08)" : "#fff", border: `1.5px solid ${tags[k] ? "#7c3aed" : "#e0e7ff"}`, borderRadius: 12, padding: "10px 14px", cursor: "pointer" }}>
                <input type="checkbox" checked={tags[k]} onChange={e => setTags({ ...tags, [k]: e.target.checked })} style={{ width: 18, height: 18, accentColor: "#7c3aed" }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1b4b" }}>{l}</div>
              </label>
            ))}
          </div>
        </div>
        <button onClick={handlePost} disabled={!text && !photo} style={{ width: "100%", padding: 15, background: (text || photo) ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#e5e7eb", border: "none", borderRadius: 14, color: (text || photo) ? "#fff" : "#9ca3af", fontSize: 16, fontWeight: 900, cursor: (text || photo) ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: (text || photo) ? "0 8px 24px rgba(124,58,237,.35)" : "none" }}>📤 投稿する</button>
      </div>
    </div>
  );

  if (phase === "attacker") return (
    <div style={{ minHeight: "100vh", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      {/* Terminal view */}
      {attackStage === 0 && (
        <div style={{ minHeight: "100vh", background: "#0a0f0a", padding: "20px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#00ff41,transparent)", animation: "scanDown 4s linear infinite", opacity: .4 }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,.015) 2px,rgba(0,255,65,.015) 4px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div style={{ borderBottom: "1px solid #00ff4130", paddingBottom: 12, marginBottom: 18 }}>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "#00ff41", letterSpacing: ".2em", opacity: .7 }}>▶ MAMORU EDUCATION SYSTEM — ATTACKER SIMULATION MODE</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "#ff6b6b", animation: "blink 1.5s infinite", marginTop: 4 }}>⚠ これは教育シミュレーションです</div>
            </div>
            <div style={{ background: "rgba(255,45,45,.08)", border: "1px solid rgba(255,45,45,.4)", borderRadius: 12, padding: "13px 15px", marginBottom: 18, animation: "redFlash 2s infinite" }}>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "#ff2d2d", letterSpacing: ".1em", marginBottom: 6 }}>🎭 視点が切り替わりました</div>
              <p style={{ fontSize: 13, color: "#ffaaaa", margin: 0, lineHeight: 1.7 }}>今、あなたは<strong style={{ color: "#fff" }}>「悪意ある人物」の視点</strong>にいます。ミナちゃんの投稿から何が読み取れるか見てください。</p>
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", color: "#00ff41", fontSize: 11, marginBottom: 10, letterSpacing: ".1em" }}>▶ 投稿解析中...</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {extracted.map((item, i) => (
                <div key={i} style={{ background: "rgba(255,45,45,.06)", border: `1px solid rgba(255,45,45,${item.danger === 3 ? ".6" : ".3"})`, borderLeft: `4px solid ${item.danger === 3 ? "#ff2d2d" : "#ff9900"}`, borderRadius: 10, padding: "10px 14px", animation: "slideUp .4s ease" }}>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: item.danger === 3 ? "#ff2d2d" : "#ff9900" }}>{"█".repeat(item.danger)}{"░".repeat(3 - item.danger)} {item.danger === 3 ? "HIGH" : item.danger === 2 ? "MID" : "LOW"} RISK</div>
                  <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'Share Tech Mono',monospace", marginTop: 3 }}>[{item.label}]</div>
                  <div style={{ fontSize: 13, color: "#fff", marginTop: 4, lineHeight: 1.5 }}>{item.value}</div>
                </div>
              ))}
            </div>
            {extracted.length === 0 && <div style={{ fontFamily: "'Share Tech Mono',monospace", color: "#00ff41", fontSize: 12, animation: "blink 1s infinite", textAlign: "center", padding: "30px 0" }}>ANALYZING...</div>}
            {extracted.length >= 2 && <div style={{ fontFamily: "'Share Tech Mono',monospace", color: "#ff2d2d", fontSize: 11, animation: "blink .8s infinite", letterSpacing: ".15em", textAlign: "center", padding: "12px 0" }}>▶ DMを送信中...</div>}
          </div>
        </div>
      )}
      {/* DM view */}
      {attackStage === 1 && (
        <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0505,#000)", padding: "20px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(255,0,0,.02) 3px,rgba(255,0,0,.02) 4px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.04)", borderRadius: 14, padding: "10px 14px", marginBottom: 18, border: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#ffafcc,#ffd6e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👧</div>
              <div><div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>ミナのDMトレイ</div><div style={{ fontSize: 10, color: "#ff6b6b", animation: "blink 1.5s infinite" }}>● ミナ視点</div></div>
            </div>
            <div style={{ fontSize: 13, color: "#ffaaaa", marginBottom: 18, background: "rgba(255,45,45,.08)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(255,45,45,.2)", lineHeight: 1.7 }}>投稿したあと、<strong style={{ color: "#fff" }}>知らない人からDMが届き始めた...</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {dms.map((dm, i) => (
                <div key={i} style={{ animation: "slideUp .4s ease" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,45,45,.12)", border: "1px solid rgba(255,45,45,.35)", borderRadius: "12px 12px 0 0", padding: "6px 12px" }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: "#ff2d2d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, animation: "blink 1s infinite" }}>!</div>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#ff8a8a", letterSpacing: ".1em" }}>UNKNOWN SENDER</div>
                    <div style={{ marginLeft: "auto", fontSize: 10, color: "#666" }}>たった今</div>
                  </div>
                  <div style={{ background: "rgba(40,10,10,.8)", border: "1px solid rgba(255,45,45,.3)", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "12px 14px", backdropFilter: "blur(10px)" }}>
                    <Typewriter text={dm.text} speed={80} style={{ color: "#ffe0e0", fontSize: 15, lineHeight: 1.7 }} />
                  </div>
                </div>
              ))}
              {!allDone && dms.length < 3 && (
                <div style={{ background: "rgba(40,10,10,.6)", border: "1px solid rgba(255,45,45,.2)", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, .2, .4].map((d, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6b6b", animation: `blink 1s ${d}s infinite` }} />)}
                  <span style={{ fontSize: 11, color: "#ff6b6b", marginLeft: 6 }}>入力中...</span>
                </div>
              )}
            </div>
            {allDone && <button onClick={() => setPhase("debrief")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ff4343,#cc0000)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(255,67,67,.4)", animation: "slideUp .5s ease" }}>🔓 実はこれは...</button>}
          </div>
        </div>
      )}
    </div>
  );

  if (phase === "debrief") {
    const steps = [
      { bg: "linear-gradient(160deg,#fff8f0,#ffeed6)", icon: "😮", title: "これは全部、フィクションでした", body: `今見たDMは、AIが「ミナの投稿から読み取れる情報だけ」で自動生成したものです。\n\n本物の犯罪者は、これをもっと巧みに実行します。`, color: "#f97316" },
      { bg: "linear-gradient(160deg,#fff8f0,#ffeed6)", icon: "🔍", title: "何から情報がバレていたか", items: postData?.leaks, body: "「普通の投稿」をしただけで、これだけの情報が漏れていました。", color: "#ef4444" },
      { bg: "linear-gradient(160deg,#f0fdf4,#dcfce7)", icon: "🛡️", title: "今日から気をつけること", tips: ["写真を投稿前に隅々まで確認する", "位置情報タグは常にオフ", "制服・校章・表札が写った写真は慎重に", "「今日○○にいる」は時間と場所の同時公開", "怖いDMが来たら即ブロック＋家の人に相談"], color: "#16a34a" },
    ];
    const s = steps[debriefStep];
    return (
      <div style={{ minHeight: "100vh", background: s.bg, padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", transition: "background .5s" }}>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <div style={{ textAlign: "center", fontSize: 62, marginBottom: 12, animation: debriefStep === 0 ? "popIn .5s ease" : "float2 3s infinite" }}>{s.icon}</div>
          <h2 style={{ fontSize: 21, fontWeight: 900, color: "#1c1917", textAlign: "center", margin: "0 0 18px", lineHeight: 1.35 }}>{s.title}</h2>
          <div style={{ background: "#fff", borderRadius: 20, padding: "18px 16px", border: `2px solid ${s.color}30`, marginBottom: 18, boxShadow: "0 8px 32px rgba(0,0,0,.07)" }}>
            {s.body && <p style={{ fontSize: 13, lineHeight: 1.85, color: "#44403c", margin: "0 0 12px", whiteSpace: "pre-wrap" }}>{s.body}</p>}
            {s.items && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{s.items.map((item, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(239,68,68,.07)", borderRadius: 10, borderLeft: "4px solid #ef4444", animation: `slideUp .4s ${i * .1}s both ease` }}><span>⚠️</span><span style={{ fontSize: 13, color: "#1c1917", fontWeight: 700 }}>{item}</span></div>)}</div>}
            {s.tips && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{s.tips.map((tip, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", background: "rgba(22,163,74,.07)", borderRadius: 10, borderLeft: "4px solid #16a34a", animation: `slideUp .4s ${i * .1}s both ease` }}><span>✅</span><span style={{ fontSize: 13, color: "#1c1917", lineHeight: 1.6 }}>{tip}</span></div>)}</div>}
          </div>
          {debriefStep < steps.length - 1
            ? <button onClick={() => setDebriefStep(debriefStep + 1)} style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${s.color},${s.color}bb)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>次へ →</button>
            : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "2px solid #ffa940", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>👨‍👩‍👧</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1c1917", marginBottom: 4 }}>おうちの人と話し合おう</div>
                <div style={{ fontSize: 12, color: "#78716c", lineHeight: 1.7 }}>「どの投稿が一番危なかった？」<br />「次から何を気をつける？」</div>
              </div>
              <button onClick={onComplete} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ戻る</button>
            </div>}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
            {steps.map((_, i) => <div key={i} style={{ width: i === debriefStep ? 24 : 8, height: 8, borderRadius: 4, background: i === debriefStep ? s.color : "#d6d3d1", transition: "all .3s" }} />)}
          </div>
        </div>
      </div>
    );
  }
}

// ─────────────────────────────────────────────
// ██ ROOT APP (Router)
// ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [progress, setProgress] = useState({ ep1: false, ep2: false, ep3: false, ep4: false, attacker: false });

  const navigate = (to) => { setScreen(to); window.scrollTo(0, 0); };
  const finishEp1 = () => { setProgress(p => ({ ...p, ep1: true })); navigate("home"); };
  const finishEp2 = () => { setProgress(p => ({ ...p, ep2: true })); navigate("home"); };
  const finishEp3 = () => { setProgress(p => ({ ...p, ep3: true })); navigate("home"); };
  const finishEp4 = () => { setProgress(p => ({ ...p, ep4: true })); navigate("home"); };
  const finishAttacker = () => { setProgress(p => ({ ...p, attacker: true })); navigate("home"); };

  return (
    <>
      <GlobalStyle />
      {screen === "home" && <HomeScreen onNavigate={navigate} progress={progress} />}
      {screen === "ep1" && <Episode1 onComplete={finishEp1} />}
      {screen === "ep2" && <Episode2 onComplete={finishEp2} />}
      {screen === "ep3" && <Episode3 onComplete={finishEp3} />}
      {screen === "ep4" && <Episode4 onComplete={finishEp4} />}
      {screen === "attacker" && <AttackerMode onComplete={finishAttacker} />}
    </>
  );
}
