import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

// ── Tokens ──────────────────────────────────────────────────────
const C = {
  bg: '#07090B', s1: '#0C0E11', s2: '#111316', s3: '#161A1E',
  border: '#1C1F24', borderHi: '#2A2E35',
  gold: '#C8922A', goldDim: '#C8922A20', goldBorder: '#C8922A35', goldLight: '#E4A83C',
  green: '#22C55E', greenDim: '#22C55E15',
  text: '#EDE8DF', muted: '#5C5F66', mid: '#8C8F96',
  red: '#EF4444',
};

// ── Ticker items ─────────────────────────────────────────────────
const TICKER = [
  '🎯 "308 deer rifle review" outperforming 5.1× in firearms niche · 8 min ago',
  '📈 Hunting channel in Montana gained 3.8× avg views this week',
  '🔥 "Best turkey calls 2026" trending — 0 dominant videos under 100K subs',
  '⚡ Outdoor gear review format surging — 4 outliers in 72 hrs',
  '🎯 "CCW tips for beginners" outlier at 6.2× — title formula confirmed',
  '📊 Waterfowl niche: 3 channels posting Wed afternoon seeing 2× algorithm boost',
  '🔥 "Best budget night vision" — zero dominant video under 500K subs. Gap confirmed.',
  '⚡ Suppressors review niche: 2.9× avg outlier this month, low competition',
];

// ── Fake live count ───────────────────────────────────────────────
function useLiveCount(base = 412) {
  const [n, setN] = useState(base);
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.7) setN(v => v + 1);
    }, 8000);
    return () => clearInterval(t);
  }, []);
  return n;
}

// ── Reticle SVG ───────────────────────────────────────────────────
function Reticle({ size = 340, opacity = 0.06 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200"
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity, pointerEvents: 'none', animation: 'reticle 60s linear infinite' }}>
      <circle cx="100" cy="100" r="90" fill="none" stroke={C.gold} strokeWidth="0.5" />
      <circle cx="100" cy="100" r="60" fill="none" stroke={C.gold} strokeWidth="0.3" />
      <circle cx="100" cy="100" r="30" fill="none" stroke={C.gold} strokeWidth="0.5" />
      <circle cx="100" cy="100" r="4" fill="none" stroke={C.gold} strokeWidth="0.8" />
      <line x1="100" y1="10" x2="100" y2="70" stroke={C.gold} strokeWidth="0.5" />
      <line x1="100" y1="130" x2="100" y2="190" stroke={C.gold} strokeWidth="0.5" />
      <line x1="10" y1="100" x2="70" y2="100" stroke={C.gold} strokeWidth="0.5" />
      <line x1="130" y1="100" x2="190" y2="100" stroke={C.gold} strokeWidth="0.5" />
      <line x1="36" y1="36" x2="55" y2="55" stroke={C.gold} strokeWidth="0.3" />
      <line x1="164" y1="36" x2="145" y2="55" stroke={C.gold} strokeWidth="0.3" />
      <line x1="36" y1="164" x2="55" y2="145" stroke={C.gold} strokeWidth="0.3" />
      <line x1="164" y1="164" x2="145" y2="145" stroke={C.gold} strokeWidth="0.3" />
      {[0,45,90,135,180,225,270,315].map(a => {
        const rad = a * Math.PI / 180;
        const x = 100 + 90 * Math.sin(rad);
        const y = 100 - 90 * Math.cos(rad);
        return <circle key={a} cx={x} cy={y} r="1.5" fill={C.gold} opacity="0.6" />;
      })}
    </svg>
  );
}

// ── Brief preview card ────────────────────────────────────────────
function BriefCard({ data, niche }) {
  if (!data) return null;
  return (
    <div style={{ backgroundColor: C.s2, border: `1px solid ${C.goldBorder}`, borderRadius: 12, overflow: 'hidden', marginTop: 24 }}>
      <div style={{ backgroundColor: C.s3, borderBottom: `1px solid ${C.border}`, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.green, boxShadow: `0 0 6px ${C.green}` }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Monday Brief — {niche}</span>
        </div>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
      </div>
      <div style={{ padding: '20px 22px' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>This Week's Outliers</div>
          {data.outliers?.slice(0,3).map((v,i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: parseFloat(v.multiplier) >= 4 ? C.green : C.gold, backgroundColor: parseFloat(v.multiplier) >= 4 ? C.greenDim : C.goldDim, padding: '2px 7px', borderRadius: 4, whiteSpace: 'nowrap' }}>{v.multiplier}</span>
              <span style={{ fontSize: 12, color: C.text, flex: 1 }}>{v.title}</span>
              <span style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>{Math.round(v.views/1000)}K</span>
            </div>
          ))}
        </div>
        <div style={{ backgroundColor: `${C.gold}08`, border: `1px solid ${C.goldBorder}`, borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Your Next Video</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.4, marginBottom: 10 }}>"{data.nextVideo?.title}"</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[['Post', data.nextVideo?.publishDay], ['Length', data.nextVideo?.length], ['Time', data.nextVideo?.publishTime]].map(([l,v]) => (
              <div key={l}><span style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase' }}>{l} </span><span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{v}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function Home() {
  const [demoNiche, setDemoNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [briefData, setBriefData] = useState(null);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [joinedNiche, setJoinedNiche] = useState('');
  const [error, setError] = useState('');
  const count = useLiveCount(412);
  const demoRef = useRef(null);

  const NICHES = ['hunting & deer', 'firearms & CCW', 'outdoor survival', 'archery & bowhunting', 'waterfowl & duck'];

  async function runDemo(n) {
    const q = (n || demoNiche).trim();
    if (!q) return;
    setDemoNiche(q); setLoading(true); setBriefData(null); setError('');
    try {
      const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche: q }) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBriefData(data);
    } catch {
      setError('Could not generate brief. Try again.');
    } finally { setLoading(false); }
  }

  async function joinWaitlist() {
    if (!email.includes('@')) return;
    try {
      await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, niche: demoNiche || 'general' }) });
    } catch {}
    setJoined(true); setJoinedNiche(demoNiche || 'outdoor creators');
  }

  const S = {
    wrap: { minHeight: '100vh', backgroundColor: C.bg, color: C.text },
    ticker: { backgroundColor: '#0A0C0F', borderBottom: `1px solid ${C.border}`, padding: '8px 0', overflow: 'hidden', position: 'relative' },
    tickInner: { display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'ticker 40s linear infinite', fontSize: 11, color: C.mid },
    nav: { borderBottom: `1px solid ${C.border}`, padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: `${C.bg}F0`, backdropFilter: 'blur(12px)', zIndex: 30 },
    logo: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px' },
    dot: { width: 8, height: 8, borderRadius: '50%', backgroundColor: C.gold, boxShadow: `0 0 8px ${C.gold}` },
    navLinks: { display: 'flex', gap: 28, fontSize: 13, color: C.muted },
    navCTA: { fontSize: 12, fontWeight: 700, color: '#000', backgroundColor: C.gold, padding: '8px 18px', borderRadius: 6, border: 'none', cursor: 'pointer', letterSpacing: '0.02em', fontFamily: 'inherit' },
    hero: { position: 'relative', maxWidth: 860, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center', overflow: 'hidden' },
    eyebrow: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.gold, backgroundColor: C.goldDim, border: `1px solid ${C.goldBorder}`, padding: '5px 12px', borderRadius: 4, marginBottom: 28 },
    h1: { fontSize: 'clamp(38px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.02, marginBottom: 22, color: C.text },
    sub: { fontSize: 17, color: C.muted, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' },
    heroCtaRow: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 },
    btnPrimary: { fontSize: 14, fontWeight: 700, color: '#000', backgroundColor: C.gold, padding: '13px 26px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.02em' },
    btnGhost: { fontSize: 14, fontWeight: 600, color: C.mid, backgroundColor: 'transparent', padding: '13px 26px', borderRadius: 8, border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: 'inherit' },
    statsRow: { display: 'flex', justifyContent: 'center', gap: 0, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '28px 0', marginTop: 8 },
    statItem: { textAlign: 'center', padding: '0 36px', borderRight: `1px solid ${C.border}` },
    statNum: { fontSize: 28, fontWeight: 900, color: C.gold, letterSpacing: '-1px', display: 'block' },
    statLabel: { fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 },
    section: { maxWidth: 960, margin: '0 auto', padding: '80px 24px' },
    sectionLabel: { fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 },
    h2: { fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 },
    divider: { borderTop: `1px solid ${C.border}` },
    demoBox: { backgroundColor: C.s1, border: `1px solid ${C.border}`, borderRadius: 14, padding: '36px 36px 32px', maxWidth: 680, margin: '0 auto' },
    demoInput: { flex: 1, minWidth: 200, padding: '13px 16px', fontSize: 14, backgroundColor: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontFamily: 'inherit', outline: 'none' },
    demoBtn: { padding: '13px 20px', fontSize: 13, fontWeight: 700, backgroundColor: C.gold, color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' },
    quickChip: { fontSize: 11, fontWeight: 600, color: C.muted, backgroundColor: C.s2, border: `1px solid ${C.border}`, padding: '5px 11px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },
    problemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 16 },
    problemCard: { backgroundColor: C.s1, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px 22px' },
    suiteGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 14 },
    suiteCard: { backgroundColor: C.s1, border: `1px solid ${C.border}`, borderRadius: 10, padding: '24px 22px', position: 'relative', overflow: 'hidden' },
    suiteCardFeat: { backgroundColor: C.s2, border: `1px solid ${C.goldBorder}`, borderRadius: 10, padding: '24px 22px', position: 'relative', overflow: 'hidden' },
    price: { fontSize: 28, fontWeight: 900, color: C.text, letterSpacing: '-1px' },
    priceSub: { fontSize: 12, color: C.muted, marginLeft: 4 },
    ctaSection: { backgroundColor: C.s1, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '80px 24px' },
    ctaInner: { maxWidth: 640, margin: '0 auto', textAlign: 'center' },
    emailRow: { display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' },
    emailInput: { flex: 1, minWidth: 200, padding: '13px 16px', fontSize: 14, backgroundColor: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontFamily: 'inherit', outline: 'none' },
    footer: { padding: '32px 40px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  };

  return (
    <>
      <Head>
        <title>DownRange Creator — YouTube Intelligence for Outdoor & Firearms Creators</title>
        <meta name="description" content="Weekly channel briefs, outlier detection, and sponsor deal tools built specifically for firearms, hunting, and outdoor YouTube creators." />
        <meta property="og:title" content="DownRange Creator — YouTube Intel for Outdoor Creators" />
        <meta property="og:description" content="Stop using generic tools. Get YouTube intelligence built for your niche." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='none' stroke='%23C8922A' stroke-width='8'/><line x1='50' y1='10' x2='50' y2='40' stroke='%23C8922A' stroke-width='4'/><line x1='50' y1='60' x2='50' y2='90' stroke='%23C8922A' stroke-width='4'/><line x1='10' y1='50' x2='40' y2='50' stroke='%23C8922A' stroke-width='4'/><line x1='60' y1='50' x2='90' y2='50' stroke='%23C8922A' stroke-width='4'/></svg>" />
      </Head>

      <div style={S.wrap}>

        {/* ── Live Intel Ticker ── */}
        <div style={S.ticker}>
          <div style={S.tickInner}>
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} style={{ flexShrink: 0 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── Nav ── */}
        <nav style={S.nav}>
          <div style={S.logo}>
            <div style={S.dot} />
            DownRange<span style={{ color: C.gold }}>Creator</span>
          </div>
          <div style={S.navLinks}>
            <a href="#intel" style={{ color: C.muted, textDecoration: 'none' }}>Intel</a>
            <a href="#suite" style={{ color: C.muted, textDecoration: 'none' }}>Suite</a>
            <a href="#pricing" style={{ color: C.muted, textDecoration: 'none' }}>Pricing</a>
          </div>
          <button style={S.navCTA} onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}>
            Join Waitlist
          </button>
        </nav>

        {/* ── Hero ── */}
        <div style={S.hero}>
          <Reticle size={480} opacity={0.05} />
          <div className="fu" style={{ position: 'relative', zIndex: 1 }}>
            <div style={S.eyebrow}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: C.green, animation: 'pulse 2s ease infinite' }} />
              Early Access Open · {count} creators on waitlist
            </div>
            <h1 style={S.h1}>
              YouTube intel for the<br />
              <span style={{ color: C.gold }}>niche nobody built for.</span>
            </h1>
            <p style={S.sub}>
              Every creator tool is built for faceless channels and gaming bros. DownRange Creator is built for <strong style={{ color: C.text, fontWeight: 700 }}>firearms instructors, hunters, outdoor guides, and 2A advocates</strong> — the creators these tools forgot.
            </p>
            <div style={S.heroCtaRow}>
              <button style={S.btnPrimary} onClick={() => demoRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                See Your Monday Brief →
              </button>
              <button style={S.btnGhost} onClick={() => document.getElementById('suite')?.scrollIntoView({ behavior: 'smooth' })}>
                View the Suite
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 0, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '24px 0' }}>
              {[['4 products', 'in one suite'], ['Real data', 'not AI guesses'], ['Your niche', 'not generic tools'], ['Every Monday', 'in your inbox']].map(([n, l], i, arr) => (
                <div key={n} style={{ ...S.statItem, borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <span style={{ ...S.statNum, fontSize: 18 }}>{n}</span>
                  <span style={S.statLabel}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Problem ── */}
        <div style={S.divider} />
        <div style={{ ...S.section }} id="intel">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={S.sectionLabel}>The Problem</div>
            <h2 style={S.h2}>Generic tools built for generic creators.</h2>
            <p style={{ fontSize: 16, color: C.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              TubeLab, VidIQ, OutlierKit — great tools if you're making finance content or gaming videos. Not so great when your niche involves NFA items, FFL compliance, and knowing the difference between a fawn and a doe.
            </p>
          </div>
          <div style={S.problemGrid}>
            {[
              ['🎯', 'No niche knowledge', "They don't know that 'suppressors' and 'silencers' are the same search. They don't know deer season affects your publishing schedule. You do."],
              ['📊', 'Built for faceless channels', "Every testimonial is about finding a '$500/day' automation niche. You're not automating. You're hunting, shooting, and living this content."],
              ['🔐', 'Platform risk blind spots', "Generic tools have no idea that firearms content gets demonetized differently, shadow-restricted, or flagged by YouTube's automated systems. We do."],
              ['📬', 'You have to go find the intel', "Every tool requires you to log in, browse, filter, and figure it out yourself. We send it to you. Every Monday. Done."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={S.problemCard}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Demo ── */}
        <div style={{ backgroundColor: C.s1, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '80px 24px' }} ref={demoRef}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <div style={S.sectionLabel}>Live Preview</div>
            <h2 style={{ ...S.h2, fontSize: 'clamp(24px,3.5vw,36px)', marginBottom: 12 }}>This is what lands in your inbox every Monday.</h2>
            <p style={{ fontSize: 15, color: C.muted, marginBottom: 32, lineHeight: 1.65 }}>
              Enter your niche and see a real Monday Brief — the same format delivered to your inbox every week.
            </p>
            <div style={S.demoBox}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <input style={S.demoInput} placeholder="e.g. 'deer hunting' or 'CCW training'" value={demoNiche}
                  onChange={e => setDemoNiche(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !loading && runDemo()} />
                <button style={{ ...S.demoBtn, opacity: loading || !demoNiche.trim() ? 0.5 : 1 }}
                  onClick={() => runDemo()} disabled={loading || !demoNiche.trim()}>
                  {loading ? '...' : 'Generate Brief →'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: briefData || loading ? 4 : 0 }}>
                {NICHES.map(n => (
                  <button key={n} style={S.quickChip}
                    onMouseEnter={e => { e.target.style.borderColor = C.gold; e.target.style.color = C.gold; }}
                    onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.muted; }}
                    onClick={() => runDemo(n)}>{n}</button>
                ))}
              </div>
              {loading && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: C.muted, fontSize: 13 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${C.border}`, borderTop: `2px solid ${C.gold}`, animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
                  Scanning niche intel...
                </div>
              )}
              {error && <div style={{ color: C.red, fontSize: 13, marginTop: 12 }}>{error}</div>}
              {briefData && <BriefCard data={briefData} niche={demoNiche} />}
            </div>
          </div>
        </div>

        {/* ── Suite ── */}
        <div style={S.section} id="suite">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={S.sectionLabel}>The Suite</div>
            <h2 style={S.h2}>Four tools. One niche. Your unfair advantage.</h2>
            <p style={{ fontSize: 16, color: C.muted, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Most creators need 5 different subscriptions to get what DownRange Creator delivers in one place — built for your world.
            </p>
          </div>
          <div style={S.suiteGrid} id="pricing">
            {[
              { icon: '📡', name: 'Monday Brief', tag: 'MOST POPULAR', price: '$29', sub: '/mo', desc: 'Weekly outlier scan + next video brief delivered to your inbox every Monday. No dashboard. No login. Just the intel you need.', features: ['5 weekly outlier videos', 'Pattern analysis', 'Your next video brief', 'Title + hook options', 'Best publish timing'], featured: true },
              { icon: '🔭', name: 'Niche Intel', tag: '', price: '$49', sub: '/mo', desc: 'Full outlier detection dashboard for your specific niche. Real-time data, competitor tracking, and content gap analysis.', features: ['Unlimited niche scans', 'Competitor tracking', 'Content gap detection', 'Title formula library', 'Weekly trend reports'], featured: false },
              { icon: '🤝', name: 'Sponsor Deals', tag: '', price: '$39', sub: '/mo', desc: 'Know your real market rate. Generate pro media kits. Track brand outreach. Built for creators in regulated niches.', features: ['Auto rate calculator', 'Media kit generator', 'Brand pitch templates', 'Outreach CRM', 'Deal tracking'], featured: false },
              { icon: '🏷️', name: 'Brand Directory', tag: 'FOR BRANDS', price: '$199', sub: '/mo', desc: 'For outdoor & firearms brands: find, vet, and contact verified YouTube creators in your niche. Direct access.', features: ['400+ outdoor creators', 'Engagement analytics', 'Direct contact info', 'Niche filtering', 'Monthly new additions'], featured: false },
            ].map(({ icon, name, tag, price, sub, desc, features, featured }) => (
              <div key={name} style={featured ? S.suiteCardFeat : S.suiteCard}>
                {featured && (
                  <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', padding: '4px 10px', borderBottomLeftRadius: 8 }}>
                    {tag}
                  </div>
                )}
                <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 6 }}>{name}</div>
                <div style={{ marginBottom: 14 }}>
                  <span style={S.price}>{price}</span>
                  <span style={S.priceSub}>{sub}</span>
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>{desc}</div>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 7 }}>
                      <span style={{ color: C.gold, fontSize: 11 }}>✓</span>
                      <span style={{ fontSize: 12, color: C.mid }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ fontSize: 13, color: C.muted }}>All four products available during early access. Founding member pricing locked for life.</p>
          </div>
        </div>

        {/* ── Who it's for ── */}
        <div style={{ backgroundColor: C.s1, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '72px 24px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <div style={S.sectionLabel}>Who It's For</div>
            <h2 style={{ ...S.h2, marginBottom: 40 }}>Built for creators who know this world.</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {['Firearms instructors', 'Hunting channels', 'Outdoor adventure', '2A advocates', 'Gear reviewers', 'CCW instructors', 'Bowhunters', 'Waterfowl hunters', 'Long-range shooting', 'Survival & prepping', 'Turkey hunting', 'Deer hunting', 'FFL dealers', 'Competitive shooters', 'Knife & EDC', 'Fishing & fly fishing'].map(t => (
                <div key={t} style={{ fontSize: 13, fontWeight: 600, color: C.mid, backgroundColor: C.s2, border: `1px solid ${C.border}`, padding: '8px 16px', borderRadius: 6 }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Waitlist CTA ── */}
        <div style={S.ctaSection} id="waitlist">
          <div style={S.ctaInner}>
            <div style={{ ...S.eyebrow, display: 'inline-flex', margin: '0 auto 24px' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: C.green, animation: 'pulse 2s ease infinite' }} />
              {count} creators already on the list
            </div>
            <h2 style={{ ...S.h2, fontSize: 'clamp(28px,4vw,44px)', marginBottom: 14 }}>
              Get founding member access.
            </h2>
            <p style={{ fontSize: 16, color: C.muted, marginBottom: 32, lineHeight: 1.65, maxWidth: 460, margin: '0 auto 32px' }}>
              Early access members lock in the lowest pricing — forever. We launch Monday Brief first, followed by the full suite.
            </p>
            {!joined ? (
              <>
                <div style={S.emailRow}>
                  <input style={S.emailInput} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && joinWaitlist()} />
                  <button style={{ ...S.navCTA, padding: '13px 22px', fontSize: 14 }} onClick={joinWaitlist}>
                    Join Waitlist →
                  </button>
                </div>
                <p style={{ fontSize: 11, color: C.muted, marginTop: 14 }}>No spam. No credit card. Founding price locked when you join.</p>
              </>
            ) : (
              <div style={{ backgroundColor: C.greenDim, border: `1px solid ${C.green}30`, borderRadius: 10, padding: '20px 28px', maxWidth: 400, margin: '0 auto' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.green, marginBottom: 6 }}>✓ You're in.</div>
                <div style={{ fontSize: 14, color: C.mid, lineHeight: 1.6 }}>
                  You're #{count} on the waitlist for {joinedNiche || 'outdoor creators'}. We'll email you when Monday Brief goes live.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <footer style={S.footer}>
          <div style={{ ...S.logo, fontSize: 13 }}>
            <div style={{ ...S.dot, width: 6, height: 6 }} />
            DownRange<span style={{ color: C.gold }}>Creator</span>
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>YouTube intel for the niche nobody built for.</div>
          <div style={{ fontSize: 11, color: C.muted }}>© 2026 DownRange Co. · Washington State</div>
        </footer>

      </div>
    </>
  );
}
