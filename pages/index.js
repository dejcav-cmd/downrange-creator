import Head from 'next/head';
import { useState, useEffect, useRef, useCallback } from 'react';

const C = {
  bg:'#07090B', s1:'#0C0E11', s2:'#111316', s3:'#161A1E', s4:'#1C2026',
  border:'#1C1F24', hi:'#252930',
  gold:'#C8922A', goldDim:'#C8922A18', goldBorder:'#C8922A38', goldLight:'#E4A83C', goldGlow:'#C8922A40',
  green:'#22C55E', greenDim:'#22C55E14', greenBorder:'#22C55E35',
  blue:'#60A5FA', blueDim:'#60A5FA14',
  purple:'#A78BFA', purpleDim:'#A78BFA14',
  text:'#EDE8DF', mid:'#8C8F96', muted:'#52555C', red:'#EF4444',
};

const TICKER_ITEMS = [
  '🎯 "308 deer rifle scope" — 5.1× outlier · 8 min ago · Montana channel',
  '📈 Waterfowl decoy setup video trending 3.8× above average this week',
  '🔥 Gap confirmed: "best budget trail cam under $60" — zero dominant video',
  '⚡ CCW instructor channels: Wednesday 3pm posting time = 2.1× algorithm boost',
  '🎯 "Turkey call comparison" hitting 6.2× in Southeast hunting channels',
  '📊 Long-range shooting content surging +34% this month · low competition',
  '🔥 Suppressor review niche: 2.9× avg · FFL dealers not posting consistently',
  '⚡ Bowhunting setup videos: story format outperforming how-to by 1.8×',
];

const QUICK_NICHES = ['deer hunting', 'CCW & concealed carry', 'waterfowl hunting', 'long-range shooting', 'archery & bowhunting'];

// ── Hooks ─────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function useLiveCount(base = 412) {
  const [n, setN] = useState(base);
  useEffect(() => {
    const t = setInterval(() => { if (Math.random() > 0.65) setN(v => v + 1); }, 9000);
    return () => clearInterval(t);
  }, []);
  return n;
}

function useCountUp(target, active, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active || !target) return;
    let cur = 0; const step = target / (ms / 16);
    const t = setInterval(() => { cur = Math.min(cur + step, target); setV(Math.floor(cur)); if (cur >= target) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [target, active]);
  return v;
}

function useBar(target, active, delay = 200) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setW(target), delay);
    return () => clearTimeout(t);
  }, [target, active, delay]);
  return w;
}

// ── Atoms ─────────────────────────────────────────────────────────
function Dot({ color = C.green, pulse = false, size = 7 }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 ${size+2}px ${color}`, flexShrink: 0, animation: pulse ? 'pulse 2s ease infinite' : 'none' }} />;
}

function Badge({ val }) {
  const n = parseFloat(val);
  const col = n >= 5 ? C.green : n >= 3.5 ? C.gold : C.blue;
  return <span style={{ fontSize: 11, fontWeight: 800, color: col, backgroundColor: `${col}18`, border: `1px solid ${col}35`, padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{val}</span>;
}

function ConfBar({ value, color = C.gold, active, delay = 200 }) {
  const w = useBar(value, active, delay);
  return (
    <div style={{ height: 3, backgroundColor: C.s4, borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ height: '100%', backgroundColor: color, width: `${w}%`, borderRadius: 2, transition: 'width 1.1s cubic-bezier(.34,1.2,.64,1)', boxShadow: `0 0 6px ${color}50` }} />
    </div>
  );
}

function ViralRing({ score, active }) {
  const [v, setV] = useState(0);
  useEffect(() => { if (active) setTimeout(() => setV(score), 150); }, [score, active]);
  const r = 28, circ = 2 * Math.PI * r, off = circ - (v / 100) * circ;
  const col = score >= 80 ? C.green : score >= 65 ? C.gold : C.blue;
  return (
    <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0 }}>
      <svg viewBox="0 0 64 64" width="68" height="68">
        <circle cx="32" cy="32" r={r} fill="none" stroke={C.s4} strokeWidth="4" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={col} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 32 32)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(.34,1.2,.64,1)', filter: `drop-shadow(0 0 4px ${col})` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: col, lineHeight: 1 }}>{v}</span>
        <span style={{ fontSize: 7, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>viral</span>
      </div>
    </div>
  );
}

function Reticle({ size = 520, opacity = 0.042 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity, pointerEvents: 'none', animation: 'reticle 90s linear infinite' }}>
      {[90, 62, 34].map(r => <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={C.gold} strokeWidth={r === 90 ? '0.5' : '0.3'} />)}
      <circle cx="100" cy="100" r="3.5" fill="none" stroke={C.gold} strokeWidth="1" />
      {[['100','10','100','68'],['100','132','100','190'],['10','100','68','100'],['132','100','190','100']].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gold} strokeWidth="0.5" />)}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => { const r2 = a * Math.PI / 180; return <circle key={a} cx={100+90*Math.sin(r2)} cy={100-90*Math.cos(r2)} r="1.2" fill={C.gold} opacity="0.5" />; })}
    </svg>
  );
}

// ── Thumbnail Blueprint ───────────────────────────────────────────
function ThumbnailBlueprint({ concept }) {
  const tc = concept || { leftSide: 'Product on dark bg', rightSide: 'Creator reaction', textOverlay: 'BOLD TITLE TEXT', emoji: '🎯' };
  return (
    <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#0A0A0E', borderRadius: 8, overflow: 'hidden', position: 'relative', border: `1px solid ${C.border}` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '58%', background: 'linear-gradient(135deg, #12161A 0%, #1C222A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${C.border}` }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{tc.emoji || '🎯'}</div>
          <div style={{ fontSize: 9, color: C.muted, maxWidth: 80, lineHeight: 1.4, textAlign: 'center' }}>{tc.leftSide}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '42%', background: 'linear-gradient(135deg, #161C20 0%, #242C34 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>😮</div>
          <div style={{ fontSize: 9, color: C.muted, maxWidth: 60, lineHeight: 1.4, textAlign: 'center' }}>{tc.rightSide}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.95))' }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.2px', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{tc.textOverlay}</div>
      </div>
      <div style={{ position: 'absolute', top: 6, right: 6, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 3, letterSpacing: '0.05em' }}>BLUEPRINT</div>
    </div>
  );
}

// ── Full Email Mockup ─────────────────────────────────────────────
function MondayBriefEmail({ data, niche, active }) {
  const typeCols = { number: '#F59E0B', verb: C.green, topic: C.blue, hook: '#A78BFA', timeframe: C.gold };
  if (!data) return null;

  return (
    <div style={{ backgroundColor: '#09090D', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', marginTop: 28 }}>
      {/* Mac-style chrome */}
      <div style={{ backgroundColor: '#0D0F13', borderBottom: `1px solid ${C.border}`, padding: '11px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57','#FFBD2E','#28CA41'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: c }} />)}
        </div>
        <div style={{ flex: 1, backgroundColor: C.s2, border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 12px', fontSize: 11, color: C.muted, textAlign: 'center' }}>
          intel@downrangecreator.com
        </div>
        <div style={{ fontSize: 10, color: C.muted }}>Inbox (1)</div>
      </div>

      {/* Email header */}
      <div style={{ backgroundColor: C.s1, borderBottom: `1px solid ${C.border}`, padding: '16px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>
              <strong style={{ color: C.mid }}>From:</strong> DownRange Creator Intel &lt;intel@downrangecreator.com&gt;
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>
              <strong style={{ color: C.mid }}>To:</strong> creator@youremail.com
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginTop: 8 }}>
              🎯 Your Monday Brief — {data.niche || niche}
            </div>
          </div>
          <div style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace', textAlign: 'right', lineHeight: 1.6 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}<br />7:00 AM
          </div>
        </div>
      </div>

      {/* Email body */}
      <div style={{ padding: '26px 24px', maxHeight: 800, overflowY: 'auto' }}>

        {/* Brand bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dot color={C.gold} size={7} />
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold }}>DownRange Creator</span>
          </div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Niche Health */}
        <div style={{ backgroundColor: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Niche Health — {data.niche}</div>
              <div style={{ fontSize: 11, color: C.mid, fontStyle: 'italic' }}>"{data.nicheHealth?.insight}"</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: data.nicheHealth?.score >= 70 ? C.green : C.gold, lineHeight: 1, letterSpacing: '-1px' }}>{data.nicheHealth?.score}</div>
              <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase' }}>{data.nicheHealth?.label}</div>
            </div>
          </div>
          <ConfBar value={data.nicheHealth?.score} color={data.nicheHealth?.score >= 70 ? C.green : C.gold} active={active} delay={100} />
          <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
            {[[data.channelsScanned, 'channels'], [data.videosAnalyzed, 'videos analyzed'], [data.nicheHealth?.weeklyGrowth || '+7%', 'weekly growth']].map(([v, l]) => (
              <span key={l} style={{ fontSize: 11, color: C.muted }}><strong style={{ color: C.mid }}>{v}</strong> {l}</span>
            ))}
          </div>
        </div>

        {/* Outliers */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>This Week's Outliers</div>
            <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
            <div style={{ fontSize: 10, color: C.muted }}>Baseline: ~{Math.round((data.avgChannelViews || 38000) / 1000)}K avg</div>
          </div>
          {data.outliers?.map((v, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'flex-start', padding: '11px 0', borderBottom: i < (data.outliers.length - 1) ? `1px solid ${C.border}` : 'none' }}>
              <Badge val={v.multiplier} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.35, marginBottom: 5 }}>{v.title}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: C.mid }}>{v.channel}</span>
                  <span style={{ color: C.border }}>·</span>
                  <span style={{ fontSize: 10, color: C.muted }}>{v.length}</span>
                  <span style={{ color: C.border }}>·</span>
                  <span style={{ fontSize: 10, color: C.muted }}>{v.daysAgo}d ago</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.blue, backgroundColor: C.blueDim, padding: '1px 6px', borderRadius: 3 }}>{v.titleType}</span>
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontStyle: 'italic' }}>↳ {v.whyItWorked}</div>
                {v.thumbnailStyle && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>🖼 Thumbnail: {v.thumbnailStyle}</div>}
              </div>
              <div style={{ textAlign: 'right', minWidth: 52 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>{Math.round((v.views || 0) / 1000)}K</div>
                <div style={{ fontSize: 9, color: C.muted }}>views</div>
              </div>
            </div>
          ))}
        </div>

        {/* What's working */}
        <div style={{ backgroundColor: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px', marginBottom: 22 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>What's Working This Week</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 14 }}>
            {[['📝', 'Title Formula', data.patterns?.titleFormula?.formula, null], ['⏱', 'Sweet Spot', data.patterns?.bestLength?.value, data.patterns?.bestLength?.confidence], ['📅', 'Best Day', data.patterns?.bestDay?.value, data.patterns?.bestDay?.confidence], ['🕑', 'Best Time', data.patterns?.bestTime?.value, data.patterns?.bestTime?.confidence]].map(([icon, label, val, conf]) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{icon} {label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{val}</div>
                {conf && <><ConfBar value={conf} active={active} delay={500} /><div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{conf}% confidence</div></>}
              </div>
            ))}
          </div>
          {data.patterns?.titleFormula?.parts && (
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>Winning title formula this week</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {data.patterns.titleFormula.parts.map((p, i) => (
                  <div key={i} style={{ fontSize: 11, fontWeight: 700, color: typeCols[p.type] || C.mid, backgroundColor: `${typeCols[p.type] || C.mid}15`, padding: '4px 10px', borderRadius: 4, textAlign: 'center' }}>
                    {p.text}<div style={{ fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 400, marginTop: 1 }}>{p.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gap Analysis */}
        {data.gapAnalysis && (
          <div style={{ backgroundColor: `${C.purple}10`, border: `1px solid ${C.purple}30`, borderRadius: 10, padding: '14px 18px', marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12 }}>🔍</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Content Gap Detected</span>
              {data.gapAnalysis.urgency === 'High' && <span style={{ fontSize: 9, fontWeight: 700, backgroundColor: '#EF444420', color: C.red, padding: '1px 6px', borderRadius: 3, border: `1px solid ${C.red}40` }}>HIGH URGENCY</span>}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{data.gapAnalysis.title}</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{data.gapAnalysis.reason}</div>
          </div>
        )}

        {/* Next Video */}
        <div style={{ backgroundColor: `${C.gold}08`, border: `1px solid ${C.goldBorder}`, borderRadius: 12, padding: '20px 20px' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
            <ViralRing score={data.nextVideo?.viralScore || 84} active={active} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>🎯 Your Next Video</div>
              <div style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 800, color: C.text, lineHeight: 1.3, marginBottom: 10 }}>"{data.nextVideo?.title}"</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[['Publish', data.nextVideo?.publishDay], ['Length', data.nextVideo?.length], ['Time', data.nextVideo?.publishTime]].map(([l, v]) => (
                  <div key={l}><span style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l} </span><span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{v}</span></div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.65, marginBottom: 16 }}>{data.nextVideo?.angle}</div>

          {data.nextVideo?.reasons?.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              {data.nextVideo.reasons.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start' }}>
                  <span style={{ color: C.gold, fontSize: 10, marginTop: 2, flexShrink: 0 }}>◆</span>
                  <span style={{ fontSize: 12, color: C.mid, lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          )}

          {/* Thumbnail Blueprint */}
          {data.nextVideo?.thumbnailConcept && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Thumbnail Blueprint</div>
              <ThumbnailBlueprint concept={data.nextVideo.thumbnailConcept} />
            </div>
          )}

          {/* Script Hook */}
          {data.nextVideo?.scriptHook && (
            <div style={{ backgroundColor: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 12 }}>🎙</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Script Hook — First 30 Seconds</span>
                <span style={{ fontSize: 9, color: C.muted, backgroundColor: C.s3, padding: '2px 7px', borderRadius: 3, border: `1px solid ${C.border}` }}>Read on camera</span>
              </div>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.75, fontStyle: 'italic', borderLeft: `2px solid ${C.gold}`, paddingLeft: 12 }}>
                "{data.nextVideo.scriptHook}"
              </div>
            </div>
          )}

          {/* Hook options */}
          {data.nextVideo?.hooks && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>3 Alternate Opening Hooks</div>
              {data.nextVideo.hooks.map((h, i) => (
                <div key={i} style={{ backgroundColor: C.s2, border: `1px solid ${C.border}`, borderRadius: 7, padding: '10px 14px', marginBottom: 7, fontSize: 12, color: C.mid, fontStyle: 'italic', lineHeight: 1.55 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: C.gold, marginRight: 8, fontStyle: 'normal', letterSpacing: '0.06em' }}>HOOK {i + 1}</span>
                  "{h}"
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email footer */}
        <div style={{ marginTop: 22, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Dot color={C.gold} size={5} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>DownRange Creator</span>
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>Unsubscribe · Manage preferences · View in browser</div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function Home() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [briefData, setBriefData] = useState(null);
  const [animActive, setAnimActive] = useState(false);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const count = useLiveCount(412);
  const demoRef = useRef(null);

  const [heroRef, heroVisible] = useReveal(0.1);
  const [probRef, probVisible] = useReveal(0.1);
  const [howRef, howVisible] = useReveal(0.1);
  const [suiteRef, suiteVisible] = useReveal(0.1);
  const [diffRef, diffVisible] = useReveal(0.1);
  const [pricingRef, pricingVisible] = useReveal(0.1);
  const [faqRef, faqVisible] = useReveal(0.1);

  async function runDemo(n) {
    const q = (n || niche).trim();
    if (!q) return;
    setNiche(q); setLoading(true); setBriefData(null); setAnimActive(false); setError('');
    try {
      const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche: q }) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBriefData(data);
      setTimeout(() => setAnimActive(true), 150);
    } catch { setError('Analysis failed. Please try again.'); }
    finally { setLoading(false); }
  }

  async function joinTrial() {
    if (!email.includes('@')) return;
    try { await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, niche }) }); } catch {}
    setJoined(true);
  }

  const anim = (visible, delay = 0) => ({ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(22px)', transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease` });

  const btnP = { fontSize: 14, fontWeight: 700, color: '#000', backgroundColor: C.gold, padding: '14px 28px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.02em', boxShadow: `0 4px 20px ${C.goldGlow}` };
  const btnG = { fontSize: 14, fontWeight: 600, color: C.mid, backgroundColor: 'transparent', padding: '14px 28px', borderRadius: 8, border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: 'inherit' };
  const inp = { flex: 1, minWidth: 200, padding: '14px 16px', fontSize: 14, backgroundColor: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontFamily: 'inherit', outline: 'none' };

  return (
    <>
      <Head>
        <title>DownRange Creator — YouTube Intelligence for Outdoor & Firearms Creators</title>
        <meta name="description" content="Weekly channel briefs, outlier detection, and sponsor deal tools built for firearms, hunting, and outdoor YouTube creators. 7-day free trial." />
        <meta property="og:title" content="DownRange Creator — YouTube Intel for Outdoor Creators" />
        <meta property="og:description" content="Stop using generic tools. Get YouTube intelligence built for your niche." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='none' stroke='%23C8922A' stroke-width='8'/><line x1='50' y1='10' x2='50' y2='40' stroke='%23C8922A' stroke-width='4'/><line x1='50' y1='60' x2='50' y2='90' stroke='%23C8922A' stroke-width='4'/><line x1='10' y1='50' x2='40' y2='50' stroke='%23C8922A' stroke-width='4'/><line x1='60' y1='50' x2='90' y2='50' stroke='%23C8922A' stroke-width='4'/></svg>" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          html{-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
          body{background:#07090B;color:#EDE8DF;font-family:'Inter','SF Pro Display',system-ui,sans-serif}
          @keyframes reticle{to{transform:translate(-50%,-50%) rotate(360deg)}}
          @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
          @keyframes spin{to{transform:rotate(360deg)}}
          @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
          @keyframes glow{0%,100%{box-shadow:0 0 20px #C8922A30}50%{box-shadow:0 0 40px #C8922A60}}
          @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
          input:focus{outline:none;border-color:#C8922A70!important;box-shadow:0 0 0 3px #C8922A12}
          button:hover:not(:disabled){opacity:.86;transition:opacity .15s}
          .card-hover{transition:border-color .2s,box-shadow .2s}
          .card-hover:hover{border-color:#C8922A40!important;box-shadow:0 0 24px #C8922A14}
          ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1C1F24;border-radius:2px}
        `}</style>
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: C.bg }}>

        {/* TICKER */}
        <div style={{ backgroundColor: '#08090D', borderBottom: `1px solid ${C.border}`, padding: '9px 0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 60, whiteSpace: 'nowrap', animation: 'ticker 36s linear infinite', fontSize: 11, color: C.mid }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => <span key={i} style={{ flexShrink: 0 }}>{t}</span>)}
          </div>
        </div>

        {/* NAV */}
        <nav style={{ borderBottom: `1px solid ${C.border}`, padding: '15px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: `${C.bg}F4`, backdropFilter: 'blur(16px)', zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px' }}>
            <Dot color={C.gold} />
            DownRange<span style={{ color: C.gold }}>Creator</span>
          </div>
          <div style={{ display: 'flex', gap: 26, fontSize: 13, color: C.muted }}>
            {[['How It Works', '#how'], ['The Suite', '#suite'], ['Pricing', '#pricing'], ['FAQ', '#faq']].map(([l, h]) => (
              <a key={l} href={h} style={{ color: C.muted, textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.target.style.color = C.text}
                onMouseLeave={e => e.target.style.color = C.muted}>{l}</a>
            ))}
          </div>
          <button style={btnP} onClick={() => document.getElementById('trial')?.scrollIntoView({ behavior: 'smooth' })}>
            Start Free Trial →
          </button>
        </nav>

        {/* HERO */}
        <div style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${C.border}` }}>
          {/* Grid background */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.gold}08 1px, transparent 1px), linear-gradient(90deg, ${C.gold}08 1px, transparent 1px)`, backgroundSize: '44px 44px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${C.gold}10, transparent)`, pointerEvents: 'none' }} />

          <div ref={heroRef} style={{ maxWidth: 960, margin: '0 auto', padding: '100px 24px 80px', display: 'grid', gridTemplateColumns: '1fr', gap: 40, position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', ...anim(heroVisible) }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, backgroundColor: C.goldDim, border: `1px solid ${C.goldBorder}`, padding: '6px 14px', borderRadius: 4, marginBottom: 30 }}>
                <Dot color={C.green} size={6} pulse />
                {count} outdoor creators on the waitlist · 7-day free trial
              </div>
              <h1 style={{ fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.98, marginBottom: 26, color: C.text }}>
                YouTube intel<br /><span style={{ color: C.gold, filter: `drop-shadow(0 0 30px ${C.goldGlow})` }}>built for your niche.</span>
              </h1>
              <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.7, maxWidth: 580, margin: '0 auto 44px' }}>
                TubeLab and VidIQ are built for faceless gaming channels. <strong style={{ color: C.text, fontWeight: 700 }}>DownRange Creator</strong> is the only YouTube intelligence suite built specifically for hunters, shooters, outdoor guides, and 2A creators.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
                <button style={btnP} onClick={() => demoRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                  See My Monday Brief →
                </button>
                <button style={btnG} onClick={() => document.getElementById('trial')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start 7-Day Free Trial
                </button>
              </div>

              {/* Trust bar */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 0, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '20px 0' }}>
                {[['No credit card', 'to start trial'], ['7 days', 'completely free'], ['Cancel', 'anytime'], ['Lock founder', 'pricing forever']].map(([n, l], i, a) => (
                  <div key={n} style={{ textAlign: 'center', padding: '0 28px', borderRight: i < a.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.gold, marginBottom: 2 }}>{n}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Reticle size={640} opacity={0.04} />
        </div>

        {/* CREATOR TYPE MARQUEE */}
        <div style={{ backgroundColor: C.s1, borderBottom: `1px solid ${C.border}`, padding: '18px 0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 12, whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite' }}>
            {[...['Firearms Instructors', 'Deer Hunters', 'CCW Instructors', 'Bowhunters', 'Long-Range Shooters', 'Waterfowl Hunters', 'Turkey Hunters', 'Survival Creators', 'Gear Reviewers', '2A Advocates', 'FFL Dealers', 'Outdoor Guides', 'Fly Fishermen', 'Competitive Shooters', 'Bushcraft Creators', 'Hiking Channels'], ...['Firearms Instructors', 'Deer Hunters', 'CCW Instructors', 'Bowhunters', 'Long-Range Shooters', 'Waterfowl Hunters', 'Turkey Hunters', 'Survival Creators', 'Gear Reviewers', '2A Advocates', 'FFL Dealers', 'Outdoor Guides', 'Fly Fishermen', 'Competitive Shooters', 'Bushcraft Creators', 'Hiking Channels']].map((t, i) => (
              <div key={i} style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, color: C.muted, backgroundColor: C.s2, border: `1px solid ${C.border}`, padding: '7px 16px', borderRadius: 6 }}>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* PROBLEM */}
        <div ref={probRef} style={{ padding: '80px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 920, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48, ...anim(probVisible) }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>The Problem</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1.2px', marginBottom: 14 }}>Generic tools for generic creators.</h2>
              <p style={{ fontSize: 15, color: C.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>Your niche has specific terminology, compliance issues, seasonal patterns, and audience behavior that generic tools completely ignore.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {[
                ['🎯', 'No niche knowledge', "They don't know that 'suppressors' and 'silencers' are the same keyword. That deer season affects your editorial calendar. That certain CCW content gets age-restricted. You're flying blind."],
                ['🤖', 'Built for faceless automation', "Every tool testimonial is '$500/day faceless channel.' Their entire product is designed for AI-generated content farms. You're creating real, authentic content — different problem entirely."],
                ['⚠️', 'Platform compliance blind spots', "Firearms content gets shadow-restricted, age-gated, and demonetized differently. Generic tools have zero awareness of this. We built DownRange Creator knowing the rules of your specific game."],
                ['📬', 'Dashboard dependency', "Tools that require you to log in, filter, and analyze yourself get abandoned by week three. We eliminate that friction. Your intel shows up every Monday at 7am. No login required."],
              ].map(([icon, title, desc], i) => (
                <div key={title} className="card-hover" style={{ ...anim(probVisible, i * 0.08), backgroundColor: C.s1, border: `1px solid ${C.border}`, borderRadius: 11, padding: '22px 20px' }}>
                  <div style={{ fontSize: 26, marginBottom: 14 }}>{icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>{title}</div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div ref={howRef} id="how" style={{ backgroundColor: C.s1, padding: '80px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ ...anim(howVisible) }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>How Monday Brief Works</div>
              <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 42px)', fontWeight: 900, letterSpacing: '-1.2px', marginBottom: 14 }}>Three steps. Zero effort on your end.</h2>
              <p style={{ fontSize: 15, color: C.muted, maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.7 }}>We do all the work. You just make the video.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, position: 'relative' }}>
              {[
                ['01', '🔒', 'Connect your niche', 'Tell us your content focus. Deer hunting, CCW training, waterfowl — 30 seconds to set up.'],
                ['02', '🔭', 'We scan every week', 'DownRange Creator monitors 10+ channels in your niche, detects outliers, and extracts winning patterns.'],
                ['03', '📬', 'Monday at 7am', 'Your full brief arrives in your inbox — outliers, patterns, thumbnail blueprint, script hook, and your next video. Ready to film.'],
              ].map(([n, icon, title, desc], i, a) => (
                <div key={n} style={{ ...anim(howVisible, 0.1 + i * 0.12), padding: '28px 28px', borderRight: i < a.length - 1 ? `1px solid ${C.border}` : 'none', position: 'relative' }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: C.goldDim, letterSpacing: '-3px', lineHeight: 1, marginBottom: 14 }}>{n}</div>
                  <div style={{ fontSize: 24, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 10 }}>{title}</div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MONDAY BRIEF DEMO — THE CENTERPIECE */}
        <div ref={demoRef} style={{ padding: '80px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>Live Preview</div>
              <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 42px)', fontWeight: 900, letterSpacing: '-1.2px', marginBottom: 14 }}>
                This arrives Monday.<br />You just press record.
              </h2>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.65, maxWidth: 480, margin: '0 auto' }}>
                Every section of the brief below is exactly what you'd receive. Including the thumbnail blueprint and the ready-to-read script hook.
              </p>
            </div>

            <div style={{ backgroundColor: C.s1, border: `1px solid ${C.border}`, borderRadius: 12, padding: '24px' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <input style={inp} placeholder="Enter your content niche — e.g. 'deer hunting' or 'CCW training'"
                  value={niche} onChange={e => setNiche(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !loading && runDemo()} />
                <button style={{ ...btnP, padding: '14px 20px', whiteSpace: 'nowrap', opacity: loading || !niche.trim() ? 0.5 : 1 }}
                  onClick={() => runDemo()} disabled={loading || !niche.trim()}>
                  {loading ? 'Generating...' : 'Generate Brief →'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: C.muted, alignSelf: 'center' }}>Try:</span>
                {QUICK_NICHES.map(n => (
                  <button key={n} style={{ fontSize: 11, fontWeight: 600, color: C.muted, backgroundColor: C.s2, border: `1px solid ${C.border}`, padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}
                    onMouseEnter={e => { e.target.style.borderColor = C.gold; e.target.style.color = C.gold; }}
                    onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.muted; }}
                    onClick={() => runDemo(n)}>{n}</button>
                ))}
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, animation: 'spin .75s linear infinite', margin: '0 auto 16px' }} />
                  <div style={{ fontSize: 13, color: C.muted }}>Scanning niche intelligence, detecting outliers...</div>
                </div>
              )}
              {error && <div style={{ color: C.red, fontSize: 13, marginTop: 12 }}>{error}</div>}
            </div>

            {briefData && <MondayBriefEmail data={briefData} niche={niche} active={animActive} />}

            {briefData && (
              <div style={{ textAlign: 'center', marginTop: 28, padding: '24px', backgroundColor: C.goldDim, border: `1px solid ${C.goldBorder}`, borderRadius: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.gold, marginBottom: 8 }}>This hits your inbox every Monday at 7am.</div>
                <div style={{ fontSize: 13, color: C.mid, marginBottom: 18 }}>Start your 7-day free trial — no credit card required.</div>
                <button style={btnP} onClick={() => document.getElementById('trial')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start Free Trial → No Credit Card
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BUILT DIFFERENT */}
        <div ref={diffRef} style={{ backgroundColor: C.s1, padding: '80px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44, ...anim(diffVisible) }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>Built Different</div>
              <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 42px)', fontWeight: 900, letterSpacing: '-1.2px', marginBottom: 14 }}>Why creators leave their current tool.</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {[
                {
                  from: 'TubeLab', price: '$29/mo', verdict: 'Great data. Wrong audience.',
                  pain: 'TubeLab is built for faceless automation creators finding "$500/day niches." Search "deer hunting" in their outlier finder and you\'re scrolling through 5 million generic videos. No email delivery. No niche expertise. No idea what a tree stand is.',
                  us: 'DownRange Creator is pre-loaded with outdoor and firearms channels. We know your niche. We deliver the brief to you.',
                  col: C.blue,
                },
                {
                  from: 'VidIQ', price: 'From $7.50/mo', verdict: 'Good keywords. Generic ideas.',
                  pain: 'VidIQ\'s daily "personalized" video ideas are generated from the same AI every other creator in your niche uses. Their keyword suggestions are basic SEO — useful for titles, useless for understanding why one hunting video exploded while yours didn\'t.',
                  us: 'We detect actual outliers in your specific niche and explain exactly why each one performed — not generic keyword suggestions.',
                  col: '#F59E0B',
                },
                {
                  from: 'DIY + ChatGPT', price: 'Free (4-6 hrs/week)', verdict: 'Works week one. Abandoned by week four.',
                  pain: 'You can manually scan competitor channels every Sunday, paste data into ChatGPT, and write your own brief. Many creators try this. It works until life gets busy — and then it stops. The routine breaks and it never comes back.',
                  us: 'Monday Brief shows up whether you have time or not. Consistency is the product.',
                  col: C.purple,
                },
              ].map(({ from, price, verdict, pain, us, col }, i) => (
                <div key={from} className="card-hover" style={{ ...anim(diffVisible, i * 0.1), backgroundColor: C.s2, border: `1px solid ${C.border}`, borderRadius: 11, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{from}</div>
                      <div style={{ fontSize: 11, color: C.muted, backgroundColor: C.s3, padding: '3px 8px', borderRadius: 4, border: `1px solid ${C.border}` }}>{price}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col }}>{verdict}</div>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, borderLeft: `2px solid ${C.border}`, paddingLeft: 12 }}>{pain}</div>
                  <div style={{ fontSize: 12, color: C.text, lineHeight: 1.65, borderLeft: `2px solid ${col}`, paddingLeft: 12, backgroundColor: `${col}08`, padding: '10px 12px', borderRadius: '0 6px 6px 0' }}>
                    <strong style={{ color: col }}>DownRange Creator: </strong>{us}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUITE — Bento Grid */}
        <div ref={suiteRef} id="suite" style={{ padding: '80px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44, ...anim(suiteVisible) }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>The Suite</div>
              <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 42px)', fontWeight: 900, letterSpacing: '-1.2px' }}>Four tools. One niche. One subscription.</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto', gap: 14 }}>
              {/* Monday Brief - featured, spans 2 rows */}
              <div className="card-hover" style={{ ...anim(suiteVisible, 0), gridColumn: '1', gridRow: '1 / 3', backgroundColor: C.s1, border: `1px solid ${C.goldBorder}`, borderRadius: 12, padding: '28px 24px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', padding: '4px 11px', borderRadius: '0 12px 0 8px' }}>MOST POPULAR</div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>📬</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 6 }}>Monday Brief</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: C.gold, letterSpacing: '-1px', marginBottom: 4 }}>$29<span style={{ fontSize: 14, fontWeight: 600, color: C.muted }}>/mo</span></div>
                <div style={{ fontSize: 11, color: C.green, marginBottom: 16 }}>7-day free trial · no credit card</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 20, flex: 1 }}>Your weekly intelligence brief delivered every Monday at 7am. Outliers, patterns, thumbnail blueprint, script hook, and your next video. No dashboard. No login. Just results.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['5 weekly outlier videos with analysis', 'Pattern breakdown (title, timing, thumbnail)', 'Thumbnail blueprint for your next video', 'Ready-to-read script hook', 'Content gap detection', 'Niche health score'].map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: C.gold, fontSize: 11, marginTop: 1, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 12, color: C.mid }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Niche Intel */}
              <div className="card-hover" style={{ ...anim(suiteVisible, 0.1), backgroundColor: C.s1, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 20px' }}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>🔭</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>Niche Intel</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: '-0.8px', marginBottom: 12 }}>$49<span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>/mo</span></div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.65 }}>Full outlier detection dashboard. Competitor tracking, content gap analysis, title formula library.</div>
              </div>

              {/* Sponsor Deals */}
              <div className="card-hover" style={{ ...anim(suiteVisible, 0.15), backgroundColor: C.s1, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 20px' }}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>🤝</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>Sponsor Deals</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: '-0.8px', marginBottom: 12 }}>$39<span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>/mo</span></div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.65 }}>Rate calculator, media kit generator, brand pitch CRM. Know your worth. Get paid properly.</div>
              </div>

              {/* Brand Directory */}
              <div className="card-hover" style={{ ...anim(suiteVisible, 0.2), backgroundColor: C.s1, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 20px' }}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>🏷️</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>Brand Directory</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: '-0.8px', marginBottom: 12 }}>$199<span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>/mo</span></div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.65 }}>For brands: find, vet, and contact 400+ verified outdoor and firearms creators. Direct access.</div>
              </div>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div ref={pricingRef} id="pricing" style={{ backgroundColor: C.s1, padding: '80px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ ...anim(pricingVisible) }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>Pricing</div>
              <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 42px)', fontWeight: 900, letterSpacing: '-1.2px', marginBottom: 14 }}>Start free. Stay because it works.</h2>
              <p style={{ fontSize: 15, color: C.muted, maxWidth: 460, margin: '0 auto 44px', lineHeight: 1.7 }}>Every plan starts with a 7-day free trial. No credit card required. Founding members lock in this pricing forever.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, ...anim(pricingVisible, 0.1) }}>
              {[
                { name: 'Monday Brief', price: '$29', mo: '/mo', trial: true, highlight: true, items: ['Weekly email brief', 'Outlier detection', 'Script hooks', 'Thumbnail blueprint', 'Niche health score'] },
                { name: 'Niche Intel', price: '$49', mo: '/mo', trial: true, highlight: false, items: ['Everything in Brief', 'On-demand scans', 'Competitor tracking', 'Title formula library', 'Content gap alerts'] },
                { name: 'Full Bundle', price: '$79', mo: '/mo', trial: true, highlight: false, badge: 'SAVE $18', items: ['Monday Brief', 'Niche Intel', 'Sponsor Deals', 'Priority support', 'Early access to new features'] },
              ].map(({ name, price, mo, trial, highlight, badge, items }) => (
                <div key={name} className="card-hover" style={{ backgroundColor: highlight ? C.s2 : C.s2, border: `1px solid ${highlight ? C.goldBorder : C.border}`, borderRadius: 12, padding: '22px 20px', position: 'relative', overflow: 'hidden' }}>
                  {badge && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', backgroundColor: C.green, color: '#000', fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: '0 0 6px 6px', letterSpacing: '0.08em' }}>{badge}</div>}
                  <div style={{ marginTop: badge ? 14 : 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{name}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: highlight ? C.gold : C.text, letterSpacing: '-1px', marginBottom: 4 }}>{price}<span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{mo}</span></div>
                    {trial && <div style={{ fontSize: 11, color: C.green, marginBottom: 14 }}>✓ 7-day free trial</div>}
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                      {items.map(f => (
                        <div key={f} style={{ display: 'flex', gap: 7, marginBottom: 7, alignItems: 'flex-start' }}>
                          <span style={{ color: C.gold, fontSize: 10, marginTop: 1 }}>✓</span>
                          <span style={{ fontSize: 12, color: C.mid }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, fontSize: 13, color: C.muted }}>No credit card required to start. Cancel anytime. Founding price locked in forever when you join.</div>
          </div>
        </div>

        {/* FAQ */}
        <div ref={faqRef} id="faq" style={{ padding: '80px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44, ...anim(faqVisible) }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>FAQ</div>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, letterSpacing: '-1px' }}>Questions we get asked.</h2>
            </div>
            {[
              ["Is the data real or AI-generated?", "The outlier detection uses real YouTube Data API — actual view counts, actual channel averages, actual timing patterns. Claude AI analyzes those patterns to generate the written insights, script hooks, and thumbnail blueprints. The intelligence is real. The writing is AI-assisted."],
              ["What if my niche is very specific — e.g., turkey hunting in the Southeast?", "That's exactly what we're built for. The more specific your niche, the more useful DownRange Creator becomes. Generic tools fail at this because they're horizontal across all of YouTube. We're vertical. Enter 'turkey hunting Southeast' and that's exactly what we scan."],
              ["How is this different from just subscribing to TubeLab?", "TubeLab requires you to log in and search through their database yourself. We deliver the brief to you. TubeLab has no niche-specific knowledge about firearms or outdoor content. We do. And TubeLab's price point is the same as Monday Brief — you get our vertical expertise at the same cost."],
              ["What happens after the 7-day trial?", "You get billed monthly at your plan's founding rate — the lowest price we'll ever charge. You can cancel before day 7 with no charge, no questions. We'll send you a reminder on day 5."],
              ["Do I need a YouTube channel to use this?", "No. Monday Brief is useful even if you're planning to start a channel, want to understand what's working in a niche before investing time, or manage content for others. You just need a niche."],
            ].map(([q, a], i) => (
              <FaqItem key={q} q={q} a={a} visible={faqVisible} delay={i * 0.07} />
            ))}
          </div>
        </div>

        {/* TRIAL CTA */}
        <div id="trial" style={{ backgroundColor: C.s1, padding: '88px 24px', borderBottom: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 100%, ${C.gold}12, transparent)`, pointerEvents: 'none' }} />
          <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, backgroundColor: C.goldDim, border: `1px solid ${C.goldBorder}`, padding: '6px 14px', borderRadius: 4, marginBottom: 24 }}>
              <Dot color={C.green} size={6} pulse />
              {count} creators already on the list
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 900, letterSpacing: '-1.8px', marginBottom: 16, lineHeight: 1.05 }}>
              Start your 7-day free trial.
            </h2>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.65, maxWidth: 440, margin: '0 auto 32px' }}>
              No credit card. No commitment. Your first Monday Brief lands in your inbox within 7 days. If it doesn't change how you create — cancel. No questions.
            </p>
            {!joined ? (
              <>
                <div style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <input style={inp} type="email" placeholder="your@email.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && joinTrial()} />
                  <button style={btnP} onClick={joinTrial}>Start Free Trial →</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
                  {['No credit card', '7 days free', 'Cancel anytime', 'Founder pricing'].map(t => (
                    <span key={t} style={{ fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ color: C.green }}>✓</span> {t}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ backgroundColor: C.greenDim, border: `1px solid ${C.greenBorder}`, borderRadius: 12, padding: '24px 28px', maxWidth: 400, margin: '0 auto' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.green, marginBottom: 8 }}>✓ You're in.</div>
                <div style={{ fontSize: 14, color: C.mid, lineHeight: 1.65 }}>You're #{count} on the list. Your first Monday Brief will land in your inbox before the end of the week.</div>
              </div>
            )}
          </div>
        </div>

        <footer style={{ padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800 }}>
            <Dot color={C.gold} size={6} />
            DownRange<span style={{ color: C.gold }}>Creator</span>
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>YouTube intel for the niche nobody built for.</div>
          <div style={{ fontSize: 11, color: C.muted }}>© 2026 DownRange Co. · Washington State</div>
        </footer>
      </div>
    </>
  );
}

function FaqItem({ q, a, visible, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: `opacity .6s ${delay}s ease, transform .6s ${delay}s ease` }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: C.gold, fontSize: 18, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }}>+</span>
      </button>
      {open && <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, paddingBottom: 18 }}>{a}</div>}
    </div>
  );
}
