import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

const C = {
  bg:'#07090B',s1:'#0C0E11',s2:'#111316',s3:'#161A1E',s4:'#1C2026',
  border:'#1C1F24',hi:'#252930',
  gold:'#C8922A',goldDim:'#C8922A18',goldBorder:'#C8922A38',goldLight:'#E4A83C',goldGlow:'#C8922A40',
  green:'#22C55E',greenDim:'#22C55E14',greenBorder:'#22C55E35',
  blue:'#60A5FA',blueDim:'#60A5FA14',
  purple:'#A78BFA',purpleDim:'#A78BFA14',
  text:'#EDE8DF',mid:'#8C8F96',muted:'#52555C',red:'#EF4444',
};

const TICKER=['🎯 "308 deer rifle scope" 5.1× outlier · 8 min ago · Montana channel','📈 Waterfowl decoy setup video 3.8× above avg this week','🔥 Gap: "best budget trail cam under $60" — zero dominant video','⚡ CCW channels: Wed 3pm posting = 2.1× algorithm boost','🎯 "Turkey call comparison" 6.2× in Southeast hunting channels','📊 Long-range shooting content +34% this month · low competition','🔥 Suppressor review niche: 2.9× avg · FFL dealers not posting'];
const QUICK=['deer hunting','CCW & concealed carry','waterfowl hunting','long-range shooting','archery & bowhunting'];
const SLUG_MAP={'deer hunting':'deer-hunting','ccw & concealed carry':'ccw-concealed-carry','waterfowl hunting':'waterfowl-hunting','long-range shooting':'long-range-shooting','archery & bowhunting':'archery-bowhunting'};

// Top opportunities this week (static, looks live)
const NICHE_LEADERBOARD=[
  {rank:1,niche:'Budget trail cameras',signal:'Zero dominant video under 500K subs',score:94,trend:'🔥'},
  {rank:2,niche:'Turkey hunting early season',signal:'Search volume +34% this week',score:87,trend:'📈'},
  {rank:3,niche:'Archery & bowhunting',signal:'No dominant channel under 300K subs in pre-season content',score:83,trend:'🏹'},
];

function useReveal(t=0.1){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:t});if(r.current)io.observe(r.current);return()=>io.disconnect();},[]);return[r,v];}
function useLiveCount(b=412){const[n,setN]=useState(b);useEffect(()=>{const t=setInterval(()=>{if(Math.random()>.65)setN(v=>v+1);},9000);return()=>clearInterval(t);},[]);return n;}
function useBar(target,active,delay=200){const[w,setW]=useState(0);useEffect(()=>{if(!active)return;const t=setTimeout(()=>setW(target),delay);return()=>clearTimeout(t);},[target,active,delay]);return w;}

function Dot({color=C.green,pulse=false,size=7}){return<div style={{width:size,height:size,borderRadius:'50%',backgroundColor:color,boxShadow:`0 0 ${size+2}px ${color}`,flexShrink:0,animation:pulse?'pulse 2s ease infinite':'none'}}/>;}
function ConfBar({value,color=C.gold,active,delay=200}){const w=useBar(value,active,delay);return<div style={{height:3,backgroundColor:C.s4,borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',backgroundColor:color,width:`${w}%`,borderRadius:2,transition:'width 1.1s cubic-bezier(.34,1.2,.64,1)',boxShadow:`0 0 6px ${color}50`}}/></div>;}

// ── FLOATING HERO THUMBNAILS ──────────────────────────────────────
const HERO_THUMBS=[
  {t:"I Tested 5 Budget Trail Cams",v:"298K",m:"5.2×",e:"🦌",rot:-7,style:{left:'-55px',top:'12%'},delay:0},
  {t:"Why I Switched to Bow Hunting",v:"187K",m:"3.9×",e:"🏹",rot:5,style:{left:'-38px',top:'62%'},delay:1.2},
  {t:"Best CCW for Everyday Carry",v:"156K",m:"3.2×",e:"🎯",rot:-4,style:{right:'-48px',top:'8%'},delay:0.6},
  {t:"Waterfowl Setup That Changed Everything",v:"128K",m:"2.8×",e:"🦆",rot:6,style:{right:'-38px',top:'60%'},delay:1.8},
];
function FloatingThumb({t,v,m,e,rot,style,delay}){
  return(
    <div style={{position:'absolute',...style,width:165,opacity:0.12,transform:`rotate(${rot}deg)`,animation:`floatThumb 5s ${delay}s ease-in-out infinite`,pointerEvents:'none',zIndex:0}}>
      <div style={{aspectRatio:'16/9',background:'linear-gradient(135deg,#101A10,#1A2A1A)',borderRadius:'7px 7px 0 0',border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:3}}>
        <span style={{fontSize:24}}>{e}</span>
      </div>
      <div style={{background:'#0E1115',borderRadius:'0 0 7px 7px',padding:'6px 8px',border:`1px solid ${C.border}`,borderTop:'none'}}>
        <div style={{fontSize:9,fontWeight:700,color:'#C8C5BF',lineHeight:1.35,marginBottom:3}}>{t}</div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <span style={{fontSize:8,color:'#506070'}}>{v}</span>
          <span style={{fontSize:9,fontWeight:800,color:parseFloat(m)>=5?C.green:C.gold}}>{m}</span>
        </div>
      </div>
    </div>
  );
}

// ── REAL THUMBNAIL BLUEPRINT ─────────────────────────────────────
// Now renders a genuine-looking YouTube thumbnail, not placeholder boxes
function RealThumbnail({concept,title}){
  const tc=concept||{leftSide:'Product on dark surface',rightSide:'Creator reaction',textOverlay:'BOLD TITLE TEXT',emoji:'🎯'};
  const bgGradient='linear-gradient(150deg,#0D1A0D 0%,#1A2618 35%,#0A1008 100%)';
  return(
    <div style={{width:'100%',aspectRatio:'16/9',position:'relative',borderRadius:10,overflow:'hidden',border:`1px solid #2A3A2A`,fontFamily:"'Arial Black','Impact',system-ui,sans-serif",background:bgGradient,userSelect:'none'}}>
      {/* Ambient light */}
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 80% at 25% 50%,#1A3A1A30,transparent),radial-gradient(ellipse 40% 60% at 75% 50%,#2A1A1A30,transparent)',pointerEvents:'none'}}/>

      {/* LEFT PANEL — product/subject */}
      <div style={{position:'absolute',left:'3%',top:'8%',width:'44%',height:'84%',background:'linear-gradient(145deg,#1C2A1C,#0E1A0E)',borderRadius:7,border:'1px solid #2A3A2A',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:4,overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 30%,#2A4A2A30,transparent 70%)'}}/>
        <span style={{fontSize:32,position:'relative',zIndex:1,filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.8))'}}>{tc.emoji||'🎯'}</span>
        <span style={{fontSize:8,color:'#6A8A6A',textAlign:'center',padding:'0 8px',lineHeight:1.4,position:'relative',zIndex:1,fontFamily:'system-ui'}}>{tc.leftSide}</span>
      </div>

      {/* RIGHT PANEL — creator face */}
      <div style={{position:'absolute',right:'3%',top:'8%',width:'44%',height:'84%',background:'linear-gradient(145deg,#2A1A1A,#1A0E0E)',borderRadius:7,border:'1px solid #3A2A2A',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:4,overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 30%,#3A1A1A30,transparent 70%)'}}/>
        <span style={{fontSize:38,position:'relative',zIndex:1,filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.8))'}}>😮</span>
        <span style={{fontSize:8,color:'#8A6A6A',textAlign:'center',padding:'0 8px',lineHeight:1.4,position:'relative',zIndex:1,fontFamily:'system-ui'}}>{tc.rightSide}</span>
      </div>

      {/* VS divider */}
      <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:26,height:26,borderRadius:'50%',backgroundColor:'#C8922A',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 12px #C8922A60',zIndex:3}}>
        <span style={{fontSize:9,fontWeight:900,color:'#000',letterSpacing:'-0.5px'}}>VS</span>
      </div>

      {/* Bottom text overlay */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,0.96))',padding:'18px 8px 7px',zIndex:2}}>
        <div style={{fontSize:'clamp(10px,1.8vw,13px)',fontWeight:900,color:'#FFFFFF',textTransform:'uppercase',letterSpacing:'-0.3px',lineHeight:1.15,textShadow:'2px 2px 4px rgba(0,0,0,0.9),-1px -1px 2px rgba(0,0,0,0.9)',wordBreak:'break-word'}}>
          {tc.textOverlay||title}
        </div>
      </div>

      {/* Channel name area */}
      <div style={{position:'absolute',top:7,left:8,zIndex:3,display:'flex',alignItems:'center',gap:4}}>
        <div style={{width:16,height:16,borderRadius:'50%',backgroundColor:'#C8922A',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:800,color:'#000',flexShrink:0}}>D</div>
        <span style={{fontSize:9,color:'rgba(255,255,255,0.7)',fontFamily:'system-ui',fontWeight:600}}>DownRange Creator</span>
      </div>

      {/* TESTED badge */}
      <div style={{position:'absolute',top:7,right:7,backgroundColor:'#C8922A',color:'#000',fontSize:8,fontWeight:900,letterSpacing:'0.05em',padding:'2px 7px',borderRadius:4,zIndex:3,boxShadow:'0 2px 8px rgba(0,0,0,0.6)'}}>
        TESTED ✓
      </div>

      {/* Duration */}
      <div style={{position:'absolute',bottom:7,right:7,backgroundColor:'rgba(0,0,0,0.85)',color:'#fff',fontSize:9,fontWeight:700,padding:'2px 5px',borderRadius:3,zIndex:3}}>
        15:42
      </div>
    </div>
  );
}

// Annotations below thumbnail
function ThumbnailAnnotations({concept}){
  if(!concept)return null;
  return(
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginTop:10}}>
        {[['⬅ Left Panel',concept.leftSide,'Product / subject matter — establishes context at first glance'],['📝 Text Overlay',concept.textOverlay,'All-caps, high contrast — drives click urgency'],['➡ Right Panel',concept.rightSide,'Creator reaction — authentic emotion builds trust & curiosity']].map(([label,val,tip])=>(
          <div key={label} style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:7,padding:'9px 11px'}}>
            <div style={{fontSize:9,fontWeight:700,color:C.gold,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>{label}</div>
            <div style={{fontSize:11,fontWeight:600,color:C.text,marginBottom:4,lineHeight:1.35}}>{val}</div>
            <div style={{fontSize:10,color:C.muted,lineHeight:1.45}}>{tip}</div>
          </div>
        ))}
      </div>
      <div style={{backgroundColor:`${C.gold}08`,border:`1px solid ${C.goldBorder}`,borderRadius:7,padding:'10px 14px',marginTop:8,display:'flex',alignItems:'flex-start',gap:8}}>
        <span style={{fontSize:14,flexShrink:0,marginTop:1}}>💡</span>
        <div style={{fontSize:12,color:C.mid,lineHeight:1.6}}>
          <strong style={{color:C.gold}}>Pattern insight: </strong>
          Split-screen thumbnails (product + creator reaction) outperform single-subject thumbnails by <strong style={{color:C.text}}>2.1× in outdoor gear content</strong> this month. This format generated 73% of the top outliers scanned this week.
        </div>
      </div>
    </div>
  );
}

// ── ROI CALCULATOR ────────────────────────────────────────────────
function ROICalculator(){
  const[hours,setHours]=useState(3);
  const[rate,setRate]=useState(50);
  const monthly=hours*4*rate;
  const saved=monthly-29;
  const[ref,vis]=useReveal(0.15);
  return(
    <div ref={ref} style={{opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(20px)',transition:'opacity .6s ease,transform .6s ease'}}>
      <div style={{backgroundColor:C.s1,border:`1px solid ${C.border}`,borderRadius:14,padding:'36px 32px',maxWidth:680,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontSize:10,fontWeight:700,color:C.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:10}}>Value Calculator</div>
          <h3 style={{fontSize:'clamp(20px,3vw,30px)',fontWeight:900,letterSpacing:'-0.8px',marginBottom:8}}>Is $29/month worth it?</h3>
          <p style={{fontSize:14,color:C.muted}}>Adjust the sliders to your situation and see the math.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28,marginBottom:28}}>
          {/* Slider 1 */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>Research hours per week</span>
              <span style={{fontSize:16,fontWeight:900,color:C.gold}}>{hours} hrs</span>
            </div>
            <input type="range" min="1" max="10" value={hours} onChange={e=>setHours(Number(e.target.value))}
              style={{width:'100%',accentColor:C.gold,cursor:'pointer',height:4}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:C.muted,marginTop:4}}>
              <span>1 hr</span><span>10 hrs</span>
            </div>
          </div>
          {/* Slider 2 */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>Your hourly value</span>
              <span style={{fontSize:16,fontWeight:900,color:C.gold}}>${rate}</span>
            </div>
            <input type="range" min="25" max="200" step="5" value={rate} onChange={e=>setRate(Number(e.target.value))}
              style={{width:'100%',accentColor:C.gold,cursor:'pointer',height:4}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:C.muted,marginTop:4}}>
              <span>$25/hr</span><span>$200/hr</span>
            </div>
          </div>
        </div>
        {/* Result */}
        <div style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:10,padding:'20px 22px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:0,marginBottom:16,textAlign:'center'}}>
            {[[`${hours*4} hrs`,`Per month on research`,'',C.mid],[`$${monthly.toLocaleString()}`,`Monthly time cost`,`at $${rate}/hr`,C.red],['$29','DownRange Intel','per month',C.gold]].map(([v,l,sub,col],i,a)=>(
              <div key={l} style={{padding:'0 16px',borderRight:i<a.length-1?`1px solid ${C.border}`:'none'}}>
                <div style={{fontSize:'clamp(22px,3vw,32px)',fontWeight:900,color:col,letterSpacing:'-1px',lineHeight:1}}>{v}</div>
                <div style={{fontSize:11,color:C.mid,marginTop:4}}>{l}</div>
                {sub&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{sub}</div>}
              </div>
            ))}
          </div>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,textAlign:'center'}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>DownRange Intel eliminates {hours*4} hours of manual research per month</div>
            <div style={{fontSize:'clamp(18px,2.5vw,26px)',fontWeight:900,color:C.green,letterSpacing:'-0.8px'}}>
              Net value: ${saved.toLocaleString()}/month saved
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:4}}>
              That's a <strong style={{color:C.text}}>{Math.round(monthly/29)}× return</strong> on your $29/month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MONDAY BRIEF EMAIL ────────────────────────────────────────────
function MondayBriefEmail({data,niche,active}){
  const[copied,setCopied]=useState(false);
  if(!data)return null;
  function copyHook(){if(data.nextVideo?.scriptHook){navigator.clipboard?.writeText(data.nextVideo.scriptHook).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2500);}}
  const SL=({icon,text,extra})=>(
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
      <span style={{fontSize:14}}>{icon}</span>
      <span style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'0.12em'}}>{text}</span>
      <div style={{flex:1,height:1,backgroundColor:C.border}}/>
      {extra&&<span style={{fontSize:10,color:C.muted}}>{extra}</span>}
    </div>
  );
  return(
    <div style={{backgroundColor:'#09090D',border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden',marginTop:28}}>
      {/* Chrome */}
      <div style={{backgroundColor:'#0D0F13',borderBottom:`1px solid ${C.border}`,padding:'11px 18px',display:'flex',alignItems:'center',gap:12}}>
        <div style={{display:'flex',gap:6}}>{['#FF5F57','#FFBD2E','#28CA41'].map(c=><div key={c} style={{width:11,height:11,borderRadius:'50%',backgroundColor:c}}/>)}</div>
        <div style={{flex:1,backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:6,padding:'3px 12px',fontSize:11,color:C.muted,textAlign:'center'}}>intel@downrangeintel.com</div>
        <Dot color={C.green} size={6}/>
      </div>
      {/* Header */}
      <div style={{backgroundColor:C.s1,borderBottom:`1px solid ${C.border}`,padding:'14px 22px 12px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
          <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}><strong style={{color:C.mid}}>From: </strong>DownRange Co. Intelligence &lt;intel@downrangeco.com&gt;</div><div style={{fontSize:13,fontWeight:700,color:C.text}}>🎯 Monday Brief — {data.niche||niche}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontSize:10,color:C.muted,fontFamily:'monospace'}}>{new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})}</div><div style={{fontSize:10,color:C.muted}}>7:00 AM</div></div>
        </div>
      </div>
      <div style={{padding:'24px 22px'}}>
        {/* Niche Health */}
        <div style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 16px',marginBottom:22,display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:140}}><div style={{fontSize:10,color:C.muted,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700}}>Niche Health — {data.niche}</div><ConfBar value={data.nicheHealth?.score} color={data.nicheHealth?.score>=70?C.green:C.gold} active={active} delay={100}/></div>
          {[[data.nicheHealth?.score,'Score',data.nicheHealth?.score>=70?C.green:C.gold],[data.nicheHealth?.weeklyGrowth||'+7%','This week',C.text],[data.channelsScanned,'Channels',C.mid]].map(([v,l,col])=>(
            <div key={l} style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:900,color:col,lineHeight:1,letterSpacing:'-0.5px'}}>{v}</div><div style={{fontSize:9,color:C.muted,textTransform:'uppercase',marginTop:2}}>{l}</div></div>
          ))}
        </div>

        {/* YOUR VIDEO */}
        <div style={{backgroundColor:`${C.gold}0A`,border:`1px solid ${C.goldBorder}`,borderRadius:12,padding:'20px 20px',marginBottom:20}}>
          <SL icon="🎯" text="Your Video This Week"/>
          <div style={{fontSize:'clamp(15px,2.5vw,20px)',fontWeight:900,color:C.text,lineHeight:1.25,marginBottom:14,letterSpacing:'-0.5px'}}>"{data.nextVideo?.title}"</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:12}}>
            {[['Publish',data.nextVideo?.publishDay],['Length',data.nextVideo?.length],['Time',data.nextVideo?.publishTime],['Viral Score',`${data.nextVideo?.viralScore||86}/100`]].map(([l,v])=>(
              <div key={l} style={{backgroundColor:C.s3,border:`1px solid ${l==='Viral Score'?C.goldBorder:C.border}`,borderRadius:6,padding:'7px 12px',textAlign:'center'}}>
                <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>{l}</div>
                <div style={{fontSize:12,fontWeight:700,color:l==='Viral Score'?C.gold:C.text}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:13,color:C.mid,lineHeight:1.6,borderLeft:`2px solid ${C.goldBorder}`,paddingLeft:12}}>{data.nextVideo?.angle}</div>
        </div>

        {/* SCRIPT HOOK */}
        {data.nextVideo?.scriptHook&&(
          <div style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:10,padding:'18px 18px',marginBottom:20}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,flexWrap:'wrap',gap:8}}>
              <SL icon="🎙" text="Read This On Camera — First 30 Seconds"/>
              <button onClick={copyHook} style={{fontSize:11,fontWeight:700,color:copied?C.green:C.gold,backgroundColor:copied?C.greenDim:C.goldDim,border:`1px solid ${copied?C.greenBorder:C.goldBorder}`,padding:'5px 12px',borderRadius:5,cursor:'pointer',fontFamily:'inherit',flexShrink:0,marginTop:-8}}>
                {copied?'✓ Copied!':'Copy to clipboard'}
              </button>
            </div>
            <div style={{fontSize:13,color:C.text,lineHeight:1.8,fontStyle:'italic',backgroundColor:`${C.gold}06`,border:`1px solid ${C.goldBorder}`,borderRadius:8,padding:'14px 16px'}}>"{data.nextVideo.scriptHook}"</div>
            <div style={{fontSize:11,color:C.muted,marginTop:8}}>↳ Open with this verbatim. First 30 seconds determine whether viewers stay.</div>
          </div>
        )}

        {/* REAL THUMBNAIL BLUEPRINT */}
        {data.nextVideo?.thumbnailConcept&&(
          <div style={{marginBottom:20}}>
            <SL icon="🖼" text="Thumbnail Blueprint" extra="Build this in Canva — takes 8 mins"/>
            <RealThumbnail concept={data.nextVideo.thumbnailConcept} title={data.nextVideo.title}/>
            <ThumbnailAnnotations concept={data.nextVideo.thumbnailConcept}/>
          </div>
        )}

        {/* 4-WEEK CALENDAR */}
        {data.contentCalendar?.length>0&&(
          <div style={{marginBottom:20}}>
            <SL icon="📅" text="4-Week Content Calendar"/>
            {data.contentCalendar.map((w,i)=>(
              <div key={i} style={{display:'grid',gridTemplateColumns:'64px 1fr',gap:12,alignItems:'start',backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:8,padding:'10px 14px',marginBottom:8}}>
                <div style={{textAlign:'center'}}><div style={{fontSize:10,fontWeight:800,color:C.gold,textTransform:'uppercase'}}>{w.week}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{w.day}</div></div>
                <div><div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:3}}>{w.title}</div><div style={{fontSize:11,color:C.muted,lineHeight:1.4}}>{w.angle}</div></div>
              </div>
            ))}
          </div>
        )}

        {/* COMPETITOR PULSE */}
        {data.competitorPulse?.length>0&&(
          <div style={{marginBottom:20}}>
            <SL icon="👁" text="Competitor Pulse This Week"/>
            {data.competitorPulse.map((c,i)=>(
              <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'9px 0',borderBottom:i<data.competitorPulse.length-1?`1px solid ${C.border}`:'none'}}>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:3}}>{c.channel}</div><div style={{fontSize:11,color:C.mid,marginBottom:3}}>Posted: "{c.lastVideo}"</div><div style={{fontSize:11,color:C.muted,fontStyle:'italic'}}>↳ {c.note}</div></div>
                <div style={{textAlign:'right',flexShrink:0}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{Math.round((c.views||0)/1000)}K</div><div style={{fontSize:9,color:C.muted}}>views</div></div>
              </div>
            ))}
          </div>
        )}

        {/* SHORTS IDEAS */}
        {data.shortsIdeas?.length>0&&(
          <div style={{marginBottom:20}}>
            <SL icon="⚡" text="3 Shorts Repurpose Ideas"/>
            {data.shortsIdeas.map((idea,i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:7,padding:'10px 14px',marginBottom:8}}>
                <span style={{fontSize:11,fontWeight:800,color:C.purple,fontFamily:'monospace',flexShrink:0,marginTop:1}}>#{i+1}</span>
                <span style={{fontSize:12,color:C.mid,lineHeight:1.5}}>{idea}</span>
              </div>
            ))}
          </div>
        )}

        {/* TRENDING QUESTIONS */}
        {data.trendingQuestions?.length>0&&(
          <div style={{marginBottom:20}}>
            <SL icon="💬" text="What Your Audience Is Asking"/>
            {data.trendingQuestions.map((q,i)=>(
              <div key={i} style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:7,padding:'9px 14px',marginBottom:7,fontSize:12,color:C.mid,display:'flex',gap:8,alignItems:'flex-start'}}>
                <span style={{color:C.blue,fontSize:11,flexShrink:0,marginTop:1}}>Q</span>
                <span style={{lineHeight:1.5}}>{q}</span>
              </div>
            ))}
            <div style={{fontSize:11,color:C.muted,marginTop:8}}>↳ Answer one of these questions in your next video hook for instant relevance.</div>
          </div>
        )}

        {/* SEASONAL ALERT */}
        {data.seasonalAlert?.active&&(
          <div style={{backgroundColor:`${C.green}08`,border:`1px solid ${C.greenBorder}`,borderRadius:10,padding:'14px 16px',marginBottom:20}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <span style={{fontSize:14}}>🗓</span>
              <span style={{fontSize:10,fontWeight:700,color:C.green,textTransform:'uppercase',letterSpacing:'0.1em'}}>Seasonal Alert</span>
              {data.seasonalAlert.urgency==='High'&&<span style={{fontSize:9,fontWeight:700,backgroundColor:'#EF444420',color:C.red,padding:'1px 6px',borderRadius:3,border:`1px solid ${C.red}40`}}>ACT NOW</span>}
            </div>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:6}}>{data.seasonalAlert.title}</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>{data.seasonalAlert.content}</div>
          </div>
        )}

        {/* TITLE A/B VARIANTS */}
        {data.nextVideo?.titleVariants?.length>0&&(
          <div style={{marginBottom:20}}>
            <SL icon="🔤" text="3 Title Variations to Test"/>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {data.nextVideo.titleVariants.map((v,i)=>(
                <div key={i} style={{backgroundColor:i===0?`${C.gold}0A`:C.s2,border:`1px solid ${i===0?C.goldBorder:C.border}`,borderRadius:8,padding:'10px 14px'}}>
                  <div style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:5}}>
                    <span style={{fontSize:10,fontWeight:800,color:i===0?C.gold:C.muted,textTransform:'uppercase',flexShrink:0,marginTop:1,width:20}}>{i===0?'★':String.fromCharCode(65+i)}</span>
                    <span style={{fontSize:12,fontWeight:i===0?700:600,color:i===0?C.text:C.mid,lineHeight:1.4}}>"{v.title}"</span>
                  </div>
                  <div style={{display:'flex',gap:6,alignItems:'center',paddingLeft:28}}>
                    <span style={{fontSize:10,fontWeight:700,color:i===0?C.gold:C.muted,backgroundColor:`${i===0?C.gold:'#8C8F96'}18`,padding:'1px 7px',borderRadius:3}}>{v.trigger}</span>
                    <span style={{fontSize:10,color:C.muted}}>{v.why}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:8}}>↳ Star = recommended. Run A/B test by uploading the same video twice with different titles (unlisted first, then switch).</div>
          </div>
        )}

        {/* UPLOAD CHECKLIST */}
        {data.nextVideo?.uploadChecklist?.length>0&&(
          <div style={{marginBottom:20}}>
            <SL icon="✅" text="Pre-Publish Checklist"/>
            <div style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:9,padding:'14px 16px'}}>
              {data.nextVideo.uploadChecklist.map((item,i)=>(
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'6px 0',borderBottom:i<data.nextVideo.uploadChecklist.length-1?`1px solid ${C.border}`:'none'}}>
                  <span style={{fontSize:12,color:C.green,flexShrink:0,marginTop:1}}>☐</span>
                  <span style={{fontSize:12,color:C.mid,lineHeight:1.5}}>{item}</span>
                </div>
              ))}
              {data.nextVideo.pinComment&&(
                <div style={{marginTop:12,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                  <div style={{fontSize:10,color:C.muted,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:5}}>📌 Pin this comment immediately after publishing</div>
                  <div style={{fontSize:12,color:C.text,fontStyle:'italic',lineHeight:1.6}}>"{data.nextVideo.pinComment}"</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTENT REPURPOSING */}
        {data.contentRepurposing&&(
          <div style={{marginBottom:20}}>
            <SL icon="♻️" text="Repurpose This Video"/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {/* Blog outline */}
              {data.contentRepurposing.blogOutline&&(
                <div style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 14px'}}>
                  <div style={{fontSize:9,fontWeight:700,color:C.blue,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:7}}>📝 Blog Post</div>
                  <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:8,lineHeight:1.4}}>{data.contentRepurposing.blogOutline.title}</div>
                  {data.contentRepurposing.blogOutline.sections?.map((s,i)=>(
                    <div key={i} style={{fontSize:11,color:C.muted,marginBottom:4,display:'flex',gap:6}}>
                      <span style={{color:C.blue,flexShrink:0}}>H2</span><span>{s}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Social captions */}
              {data.contentRepurposing.socialCaptions&&(
                <div style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 14px'}}>
                  <div style={{fontSize:9,fontWeight:700,color:C.purple,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:7}}>📱 Social Captions</div>
                  {[['Instagram',data.contentRepurposing.socialCaptions.instagram],['Twitter/X',data.contentRepurposing.socialCaptions.twitter],['Facebook',data.contentRepurposing.socialCaptions.facebook]].map(([platform,caption])=>(
                    <div key={platform} style={{marginBottom:8,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
                      <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',marginBottom:3}}>{platform}</div>
                      <div style={{fontSize:10,color:C.mid,lineHeight:1.5}}>{caption?.slice(0,120)}{caption?.length>120?'…':''}</div>
                    </div>
                  ))}
                </div>
              )}
              {/* Newsletter + Reddit */}
              {data.contentRepurposing.newsletterExcerpt&&(
                <div style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 14px'}}>
                  <div style={{fontSize:9,fontWeight:700,color:C.gold,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:7}}>✉️ Newsletter Teaser</div>
                  <div style={{fontSize:11,color:C.mid,lineHeight:1.6}}>{data.contentRepurposing.newsletterExcerpt}</div>
                </div>
              )}
              {data.contentRepurposing.redditPost&&(
                <div style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 14px'}}>
                  <div style={{fontSize:9,fontWeight:700,color:C.red,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:7}}>🔴 Reddit — {data.contentRepurposing.redditPost.subreddit}</div>
                  <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:5}}>{data.contentRepurposing.redditPost.title}</div>
                  <div style={{fontSize:11,color:C.mid,lineHeight:1.55}}>{data.contentRepurposing.redditPost.body}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MONETIZATION ANGLE */}
        {data.monetizationAngle&&(
          <div style={{marginBottom:20}}>
            <SL icon="💰" text="Monetization Angle"/>
            <div style={{backgroundColor:`${C.green}08`,border:`1px solid ${C.greenBorder}`,borderRadius:9,padding:'14px 16px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                <div>
                  <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',marginBottom:4}}>Best affiliate category</div>
                  <div style={{fontSize:13,fontWeight:700,color:C.text}}>{data.monetizationAngle.primaryProduct}</div>
                </div>
                <div>
                  <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',marginBottom:4}}>Estimated commission</div>
                  <div style={{fontSize:13,fontWeight:700,color:C.green}}>{data.monetizationAngle.estimatedCommission}</div>
                </div>
              </div>
              {data.monetizationAngle.ctaScript&&(
                <div style={{backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:6,padding:'10px 12px'}}>
                  <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',marginBottom:5}}>🎙 Say this on camera</div>
                  <div style={{fontSize:12,color:C.text,fontStyle:'italic',lineHeight:1.6}}>"{data.monetizationAngle.ctaScript}"</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OUTLIERS REFERENCE */}
        <div>
          <SL icon="📈" text="This Week's Top Performers" extra={`Baseline ~${Math.round((data.avgChannelViews||38000)/1000)}K`}/>
          {data.outliers?.slice(0,3).map((v,i)=>(
            <div key={i} style={{display:'flex',gap:10,alignItems:'center',padding:'8px 0',borderBottom:i<2?`1px solid ${C.border}`:'none'}}>
              <span style={{fontSize:11,fontWeight:800,color:parseFloat(v.multiplier)>=5?C.green:C.gold,fontFamily:'monospace',minWidth:32}}>{v.multiplier}</span>
              <span style={{fontSize:12,color:C.text,flex:1}}>{v.title}</span>
              <span style={{fontSize:11,color:C.muted,whiteSpace:'nowrap'}}>{Math.round((v.views||0)/1000)}K</span>
            </div>
          ))}
        </div>

        <div style={{marginTop:20,paddingTop:14,borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}><Dot color={C.gold} size={5}/><span style={{fontSize:11,fontWeight:700,color:C.muted}}>DownRange Intel</span></div>
          <span style={{fontSize:11,color:C.muted}}>Unsubscribe · Preferences</span>
        </div>
      </div>
    </div>
  );
}

// ── COMPARISON ────────────────────────────────────────────────────
function ComparisonSection(){
  const[sel,setSel]=useState('downrange');
  return(
    <div style={{backgroundColor:C.s1,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:'80px 24px'}} id="compare">
      <div style={{maxWidth:1040,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontSize:10,fontWeight:700,color:C.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>Real Comparison</div>
          <h2 style={{fontSize:'clamp(26px,3.8vw,42px)',fontWeight:900,letterSpacing:'-1.2px',marginBottom:14}}>Same niche. Different experience.</h2>
          <p style={{fontSize:15,color:C.muted,maxWidth:500,margin:'0 auto',lineHeight:1.7}}>Type any niche — deer hunting, archery, CCW — into each tool. Here's exactly what you get back.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
          {[{id:'tubelab',hours:'3-4 hrs/week',label:'TubeLab',sub:'Browse 5M+ videos yourself',col:C.red},{id:'vidiq',hours:'1-2 hrs/week',label:'VidIQ',sub:'Review 50 daily idea cards',col:'#F59E0B'},{id:'downrange',hours:'0 hrs/week',label:'DownRange Intel',sub:'Brief arrives Monday 7am',col:C.green}].map(({id,hours,label,sub,col})=>(
            <button key={id} onClick={()=>setSel(id)} style={{backgroundColor:sel===id?C.s2:C.s1,border:`1px solid ${sel===id?(id==='downrange'?C.goldBorder:C.hi):C.border}`,borderRadius:10,padding:'14px 16px',cursor:'pointer',fontFamily:'inherit',textAlign:'center',transition:'all .15s'}}>
              <div style={{fontSize:10,color:C.muted,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>{label}</div>
              <div style={{fontSize:22,fontWeight:900,color:col,letterSpacing:'-1px',lineHeight:1,marginBottom:3}}>{hours}</div>
              <div style={{fontSize:11,color:C.muted}}>{sub}</div>
            </button>
          ))}
        </div>
        {sel==='tubelab'&&<TubeLabMock/>}
        {sel==='vidiq'&&<VidIQMock/>}
        {sel==='downrange'&&<DownRangeMock/>}
        <div style={{marginTop:24,overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${C.border}`}}>
                {['Feature','TubeLab $29/mo','VidIQ $16.58/mo','DownRange Intel $29/mo'].map((h,i)=>(
                  <th key={h} style={{padding:'10px 14px',textAlign:i===0?'left':'center',color:i===3?C.gold:C.muted,fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',backgroundColor:i===3?C.goldDim:'transparent'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[['Delivered to inbox','✗','✗','✓ Monday 7am'],['Script hook (ready to read)','✗','✗','✓ Every week'],['Real thumbnail blueprint','✗','✗','✓ CSS mockup + notes'],['4-week content calendar','✗','✗','✓ Every week'],['Competitor pulse','Browse yourself','Partial','✓ 3 channels tracked'],['Shorts repurpose ideas','✗','✗','✓ 3 ideas weekly'],['Seasonal alerts','✗','✗','✓ Outdoor niche-specific'],['Niche expertise','Generic','Generic','✓ Firearms / outdoor built-in'],['Hours required/week','3-4 hrs','1-2 hrs','0 hrs']].map((row,ri)=>(
                <tr key={ri} style={{borderBottom:`1px solid ${C.border}`,backgroundColor:ri%2===0?'transparent':C.s1}}>
                  {row.map((cell,ci)=>(
                    <td key={ci} style={{padding:'10px 14px',textAlign:ci===0?'left':'center',color:ci===3?(cell==='✗'?C.muted:C.text):(cell.startsWith('✓'))?C.green:cell==='✗'?C.muted:C.mid,fontWeight:ci===3&&cell!=='✗'?600:400,backgroundColor:ci===3?C.goldDim:'transparent',fontSize:ci===0?12:13}}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TubeLabMock(){const v=[{m:'8.2x',t:'I Found the Best Deer Hunting Spot in America',ch:'OutdoorPassion',v:'2.1M',d:3},{m:'7.1x',t:'10 Deer Hunting Tips That Actually Work',ch:'HunterPro',v:'1.8M',d:7},{m:'6.4x',t:'Budget Deer Rifle That Outshot My $3,000 Setup',ch:'RifleReview',v:'1.4M',d:12},{m:'5.8x',t:'Why I Switched From Rifle to Bow Hunting',ch:'BowLife',v:'1.1M',d:15},{m:'5.1x',t:'The PERFECT Deer Stand Location Formula',ch:'DeerScouts',v:'980K',d:19}];return(<div style={{background:'#0E1115',border:'1px solid #232830',borderRadius:12,overflow:'hidden'}}><div style={{background:'#0A0D10',borderBottom:'1px solid #1A1E24',padding:'12px 18px',display:'flex',alignItems:'center',gap:10}}><div style={{width:20,height:20,backgroundColor:'#2A6EFF',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff'}}>T</div><span style={{fontSize:13,fontWeight:700,color:'#E8EAF0'}}>Outliers Finder</span><span style={{fontSize:11,color:'#606570',marginLeft:6}}>5,247,832 videos · deer hunting, archery, CCW...</span><div style={{marginLeft:'auto',display:'flex',gap:6}}>{['Niche ▼','Multiplier ▼','RPM ▼','+17 filters'].map(f=><div key={f} style={{fontSize:10,background:'#1A1E24',border:'1px solid #2A2E35',borderRadius:4,padding:'4px 8px',color:'#8090A0'}}>{f}</div>)}</div></div><div style={{maxHeight:260,overflowY:'auto'}}>{v.map((v,i)=><div key={i} style={{display:'grid',gridTemplateColumns:'36px auto 1fr auto',gap:10,padding:'10px 18px',borderBottom:'1px solid #151820',alignItems:'center'}}><div style={{width:36,height:24,background:'#1A1E26',borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#404550'}}>▶</div><span style={{fontSize:10,fontWeight:800,color:'#2A6EFF',background:'#2A6EFF18',border:'1px solid #2A6EFF30',padding:'2px 6px',borderRadius:3,fontFamily:'monospace',whiteSpace:'nowrap'}}>{v.m}</span><div><div style={{fontSize:12,fontWeight:600,color:'#D0D4DC',marginBottom:2}}>{v.t}</div><div style={{fontSize:10,color:'#606570'}}>{v.ch} · {v.d}d ago</div></div><div style={{textAlign:'right'}}><div style={{fontSize:12,fontWeight:700,color:'#D0D4DC'}}>{v.v}</div><div style={{fontSize:9,color:'#606570'}}>views</div></div></div>)}</div><div style={{padding:'10px 18px',background:'#0A0D10',borderTop:'1px solid #1A1E24',display:'flex',justifyContent:'space-between'}}><span style={{fontSize:11,color:'#606570'}}>Showing 7 of 5,247,832 results across all niches. Find your own patterns.</span><div style={{fontSize:11,color:'#2A6EFF',cursor:'pointer'}}>Load 50 more →</div></div><div style={{padding:'10px 18px',background:`${C.red}0A`,borderTop:`1px solid ${C.red}20`,display:'flex',gap:8,alignItems:'center'}}><span>⚠️</span><span style={{fontSize:11,color:C.red}}>No script. No thumbnail. No email. No niche expertise. No calendar. 3-4 hrs/week to find your own patterns.</span></div></div>);}

function VidIQMock(){const ideas=[{s:'Very High',t:'10 Mistakes New Deer Hunters Make (And How to Fix Them)',v:'Est. 45K–120K views'},{s:'High',t:'Best Budget Deer Hunting Setup Under $500 for Beginners',v:'Est. 32K–89K views'},{s:'High',t:'How to Find the Perfect Deer Stand Location Every Time',v:'Est. 28K–74K views'},{s:'Medium',t:'Trail Camera Setup Tips for Early Season Scouting 2026',v:'Est. 18K–45K views'},{s:'Medium',t:'Deer Hunting Gear I Wish I Had When Starting Out',v:'Est. 15K–38K views'}];const sc={'Very High':C.green,'High':'#F59E0B','Medium':C.blue};return(<div style={{background:'#0E1115',border:'1px solid #232830',borderRadius:12,overflow:'hidden'}}><div style={{background:'#0A0D10',borderBottom:'1px solid #1A1E24',padding:'12px 18px',display:'flex',alignItems:'center',gap:10}}><div style={{width:20,height:20,backgroundColor:'#1D9BF0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff'}}>V</div><span style={{fontSize:13,fontWeight:700,color:'#E8EAF0'}}>Daily Ideas</span><span style={{fontSize:10,color:C.green,background:`${C.green}18`,padding:'2px 8px',borderRadius:10,fontWeight:700}}>50 new today</span><div style={{marginLeft:'auto',fontSize:11,color:'#606570'}}>Same ideas across all 20M+ VidIQ users — deer hunting, archery, everything</div></div><div style={{maxHeight:260,overflowY:'auto',padding:'12px 18px',display:'flex',flexDirection:'column',gap:10}}>{ideas.map((idea,i)=><div key={i} style={{background:'#141820',border:'1px solid #1E2228',borderRadius:8,padding:'12px 14px',display:'flex',gap:12,alignItems:'flex-start'}}><div style={{flex:1}}><div style={{display:'flex',gap:6,marginBottom:7}}><span style={{fontSize:10,fontWeight:700,color:sc[idea.s]||C.blue,background:`${sc[idea.s]||C.blue}18`,padding:'2px 7px',borderRadius:3}}>🔥 {idea.s} Views</span></div><div style={{fontSize:12,fontWeight:600,color:'#D0D4DC',lineHeight:1.4,marginBottom:5}}>{idea.t}</div><div style={{fontSize:11,color:'#606570'}}>{idea.v}</div></div><div style={{display:'flex',gap:6,flexShrink:0,paddingTop:2}}><div style={{fontSize:16,cursor:'pointer',color:C.green}}>✓</div><div style={{fontSize:16,cursor:'pointer',color:C.red}}>✗</div></div></div>)}</div><div style={{padding:'10px 18px',background:`${C.red}0A`,borderTop:`1px solid ${C.red}20`,display:'flex',gap:8,alignItems:'center'}}><span>⚠️</span><span style={{fontSize:11,color:C.red}}>Every creator in your niche — deer hunting, archery, CCW — gets the same AI cards. No outlier data, no script, no thumbnail. 1-2 hrs/week swiping.</span></div></div>);}

function DownRangeMock(){return(<div style={{background:'#09090D',border:`1px solid ${C.goldBorder}`,borderRadius:12,overflow:'hidden'}}><div style={{background:'#0D0F13',borderBottom:`1px solid ${C.border}`,padding:'11px 18px',display:'flex',alignItems:'center',gap:12}}><div style={{display:'flex',gap:6}}>{['#FF5F57','#FFBD2E','#28CA41'].map(c=><div key={c} style={{width:11,height:11,borderRadius:'50%',backgroundColor:c}}/>)}</div><div style={{flex:1,background:C.s2,border:`1px solid ${C.border}`,borderRadius:6,padding:'3px 12px',fontSize:11,color:C.muted,textAlign:'center'}}>intel@downrangeintel.com</div><Dot color={C.green} size={6}/></div><div style={{background:C.s1,borderBottom:`1px solid ${C.border}`,padding:'12px 20px'}}><div style={{fontSize:11,color:C.muted,marginBottom:3}}><strong style={{color:C.mid}}>From: </strong>DownRange Intel — Monday Brief</div><div style={{fontSize:13,fontWeight:700,color:C.text}}>🎯 Monday Brief — Archery & Bowhunting · Week 24</div></div><div style={{padding:'18px 20px'}}><div style={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:7,padding:'10px 14px',marginBottom:14,display:'flex',gap:14,alignItems:'center'}}><div style={{flex:1}}><div style={{fontSize:9,color:C.muted,marginBottom:5,textTransform:'uppercase',fontWeight:700}}>NICHE HEALTH — Archery & Bowhunting</div><div style={{height:3,background:C.s4,borderRadius:2}}><div style={{height:'100%',width:'76%',backgroundColor:C.green,borderRadius:2}}/></div></div><div style={{fontSize:18,fontWeight:900,color:C.green}}>76</div><div style={{fontSize:12,fontWeight:700,color:C.mid}}>+11%</div></div><div style={{background:`${C.gold}0A`,border:`1px solid ${C.goldBorder}`,borderRadius:10,padding:'14px 16px',marginBottom:12}}><div style={{fontSize:9,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>🎯 YOUR VIDEO THIS WEEK</div><div style={{fontSize:15,fontWeight:900,color:C.text,lineHeight:1.25,marginBottom:10,letterSpacing:'-0.3px'}}>"I Shot 100 Arrows a Day for 30 Days — Here's What Actually Changed"</div><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{[['Post','Thursday'],['Length','20-22 min'],['Time','7pm EST'],['Score','84/100']].map(([l,v])=><div key={l} style={{background:C.s3,border:`1px solid ${l==='Score'?C.goldBorder:C.border}`,borderRadius:5,padding:'5px 10px',textAlign:'center'}}><div style={{fontSize:9,color:C.muted,textTransform:'uppercase',marginBottom:1}}>{l}</div><div style={{fontSize:11,fontWeight:700,color:l==='Score'?C.gold:C.text}}>{v}</div></div>)}</div></div><div style={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:8,padding:'11px 14px',marginBottom:12}}><div style={{fontSize:9,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:7}}>🎙 READ ON CAMERA (first 30 sec)</div><div style={{fontSize:12,color:C.text,lineHeight:1.7,fontStyle:'italic'}}>"Thirty days ago I made myself a deal — one hundred arrows every single day, no exceptions. I filmed every session. By day fourteen something clicked that I've been trying to explain to students for years. By day thirty I had the tightest groups I've shot in twelve years of bowhunting..."</div></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}><div style={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:7,padding:'10px 12px'}}><div style={{fontSize:9,color:C.muted,textTransform:'uppercase',marginBottom:6}}>📅 4-WEEK CALENDAR</div>{['W1: 100-arrow 30-day challenge','W2: Recurve vs compound guide','W3: Release aid mistakes','W4: Pre-season shooting routine'].map((w,i)=><div key={i} style={{fontSize:10,color:C.mid,marginBottom:4}}>{w}</div>)}</div><div style={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:7,padding:'10px 12px'}}><div style={{fontSize:9,color:C.muted,textTransform:'uppercase',marginBottom:6}}>⚡ SHORTS IDEAS</div>{['30s: Day 1 vs Day 30 arrow group','45s: Release aid fix quick tip','60s: Best archery warm-up drill'].map((s,i)=><div key={i} style={{fontSize:10,color:C.mid,marginBottom:4}}>{s}</div>)}</div></div></div><div style={{padding:'10px 18px',background:`${C.green}08`,borderTop:`1px solid ${C.greenBorder}`,display:'flex',gap:8,alignItems:'center'}}><span>✅</span><span style={{fontSize:11,color:C.green}}>Works for archery, deer hunting, CCW, waterfowl — any outdoor niche. Script hook + thumbnail + calendar + Shorts + seasonal. 0 hrs/week.</span></div></div>);}

// ── PRICING TABS ──────────────────────────────────────────────────
const ALL_SECTIONS=[
  {icon:'🎯',name:'Your Video This Week',desc:'The one video to make this week — specific title, publish day, optimal time, viral score, and strategic angle. No guessing.',in:['lite','full','intel']},
  {icon:'🎙',name:'Script Hook',desc:'Ready-to-read 2-3 sentence camera script for the first 30 seconds. Copy to clipboard — read it on camera verbatim.',in:['lite','full','intel']},
  {icon:'🖼',name:'Thumbnail Blueprint',desc:'CSS-rendered thumbnail mockup showing exactly what goes left, right, and in text overlay. Build it in Canva in 8 minutes.',in:['lite','full','intel']},
  {icon:'📈',name:'Niche Health Score',desc:'Weekly trend score (0–100) with growth percentage and a one-sentence market insight telling you if now is a good time to post.',in:['lite','full','intel']},
  {icon:'📅',name:'4-Week Content Calendar',desc:'Full month of video titles, strategic angles, and optimal posting days — planned around your niche\'s seasonal and algorithm patterns.',in:['full','intel']},
  {icon:'👁',name:'Competitor Pulse',desc:'3 channels in your niche tracked weekly — what they posted, how many views it got, and what that means for your next move.',in:['full','intel']},
  {icon:'⚡',name:'Shorts Ideas',desc:'3 specific YouTube Shorts repurpose ideas with duration (30–60 sec), content angle, and how it drives back to your long-form video.',in:['full','intel']},
  {icon:'💬',name:'Trending Questions',desc:"The top questions your niche audience is actively asking this week — in comments, Reddit, and search. Answer one in your hook.",in:['full','intel']},
  {icon:'🗓',name:'Seasonal Alert',desc:'Outdoor season timing with urgency score — tells you exactly when the search curve is rising so you post before it peaks.',in:['full','intel']},
  {icon:'🔤',name:'3 Title Variants',desc:'Three title options with the psychological trigger each uses (curiosity gap, controversy, budget anxiety) and A/B testing guidance.',in:['full','intel']},
  {icon:'✅',name:'Upload Checklist',desc:'Five pre-publish action items specific to your video type — tags, description opener, card placement, end screen, and the exact comment to pin.',in:['full','intel']},
  {icon:'♻️',name:'Content Repurposing',desc:'Blog post outline with H2 structure, Instagram/Twitter/Facebook captions, newsletter teaser, and a Reddit post — all generated and ready to paste.',in:['full','intel']},
  {icon:'💰',name:'Monetization Angle',desc:'Best affiliate product category for this exact video, commission estimate, and the exact on-camera line to say so it doesn\'t sound like an ad.',in:['full','intel']},
  {icon:'🔭',name:'On-Demand Scans',desc:'Run a full niche scan any time you want — not just Monday delivery. Custom niche, instant output, no waiting for the weekly cycle.',in:['intel']},
  {icon:'🏆',name:'Multi-Niche Support',desc:'Track multiple content niches simultaneously. Run a deer hunting brief AND an archery brief. Separate Monday outputs per niche.',in:['intel']},
  {icon:'📊',name:'Title Formula Library',desc:'Searchable, growing library of proven title structures from your niche\'s top performers — organized by content type and trigger.',in:['intel']},
  {icon:'🚨',name:'Content Gap Alerts',desc:'Get notified the moment a significant content gap opens in your niche before competitors see it. First-mover advantage, automated.',in:['intel']},
];

const TIERS=[
  {id:'lite',name:'Brief Lite',price:'$9.99',period:'/mo',tagline:'The three essentials. One video to make, one script to read, one thumbnail to build.',detail:'Delivered every Monday at 7am · 4 sections',color:C.blue,count:4},
  {id:'full',name:'Brief Full',price:'$29',period:'/mo',tagline:'Complete weekly intelligence. Every section. Nothing left to research or figure out.',detail:'All 13 sections · Delivered Monday 7am · Founding rate',color:C.gold,count:13,featured:true},
  {id:'intel',name:'Niche Intel',price:'$49',period:'/mo',tagline:'Full brief plus on-demand scans, multi-niche support, and real-time gap alerts.',detail:'17 features · Brief + on-demand intelligence',color:C.purple,count:17},
];

function PricingTabs({onCTA}){
  const[tab,setTab]=useState('full');
  const tier=TIERS.find(t=>t.id===tab);
  const included=ALL_SECTIONS.filter(s=>s.in.includes(tab));
  const excluded=ALL_SECTIONS.filter(s=>!s.in.includes(tab));
  return(
    <div style={{backgroundColor:C.s1,padding:'80px 24px',borderBottom:`1px solid ${C.border}`}} id="pricing">
      <div style={{maxWidth:900,margin:'0 auto'}}>
        {/* Header */}
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontSize:10,fontWeight:700,color:C.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>Preview Pricing</div>
          <h2 style={{fontSize:'clamp(26px,3.8vw,42px)',fontWeight:900,letterSpacing:'-1.2px',marginBottom:12}}>Choose your plan.</h2>
          <p style={{fontSize:15,color:C.muted,maxWidth:460,margin:'0 auto',lineHeight:1.7}}>Founding members lock in these rates permanently. Click a plan to see exactly what you get.</p>
        </div>

        {/* Tab buttons */}
        <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:36,flexWrap:'wrap'}}>
          {TIERS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{fontFamily:'inherit',cursor:'pointer',borderRadius:10,padding:'14px 24px',border:`2px solid ${tab===t.id?t.color:C.border}`,backgroundColor:tab===t.id?`${t.color}12`:C.s2,transition:'all .18s',minWidth:160,textAlign:'center',position:'relative'}}>
              {t.featured&&tab!==t.id&&<div style={{position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',backgroundColor:C.gold,color:'#000',fontSize:9,fontWeight:800,padding:'2px 10px',borderRadius:4,whiteSpace:'nowrap'}}>MOST VALUE</div>}
              <div style={{fontSize:13,fontWeight:700,color:tab===t.id?t.color:C.mid,marginBottom:4}}>{t.name}</div>
              <div style={{fontSize:24,fontWeight:900,color:tab===t.id?t.color:C.text,letterSpacing:'-1px',lineHeight:1}}>{t.price}<span style={{fontSize:12,fontWeight:500,color:C.muted}}>{t.period}</span></div>
              <div style={{fontSize:10,color:C.muted,marginTop:4}}>{t.count} features</div>
            </button>
          ))}
        </div>

        {/* Selected tier detail */}
        <div style={{backgroundColor:C.s2,border:`2px solid ${tier.color}30`,borderRadius:14,overflow:'hidden'}}>
          {/* Tier header bar */}
          <div style={{background:`linear-gradient(135deg,${tier.color}18,${tier.color}08)`,borderBottom:`1px solid ${tier.color}25`,padding:'24px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                <div style={{fontSize:22,fontWeight:900,color:tier.color,letterSpacing:'-1px'}}>{tier.price}<span style={{fontSize:13,fontWeight:500,color:C.muted}}>{tier.period}</span></div>
                {tier.featured&&<span style={{fontSize:10,fontWeight:800,backgroundColor:C.gold,color:'#000',padding:'2px 8px',borderRadius:4}}>RECOMMENDED</span>}
              </div>
              <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>{tier.name}</div>
              <div style={{fontSize:13,color:C.muted,maxWidth:440,lineHeight:1.6}}>{tier.tagline}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <button onClick={onCTA} style={{fontSize:13,fontWeight:700,color:tier.id==='full'?'#000':C.text,backgroundColor:tier.id==='full'?C.gold:tier.color,padding:'12px 24px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'inherit',display:'block',marginBottom:8,whiteSpace:'nowrap',boxShadow:tier.id==='full'?`0 4px 16px ${C.goldGlow}`:'none'}}>
                Request Early Access →
              </button>
              <div style={{fontSize:11,color:C.muted}}>{tier.detail}</div>
            </div>
          </div>

          {/* Included sections */}
          <div style={{padding:'24px 28px'}}>
            <div style={{fontSize:11,fontWeight:700,color:C.green,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
              <span>✓</span> What's included — {included.length} feature{included.length!==1?'s':''}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10,marginBottom:included.length&&excluded.length?28:0}}>
              {included.map(s=>(
                <div key={s.name} style={{backgroundColor:C.s3,border:`1px solid ${C.border}`,borderRadius:9,padding:'12px 14px',display:'flex',gap:10,alignItems:'flex-start'}}>
                  <span style={{fontSize:18,flexShrink:0,marginTop:1}}>{s.icon}</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:4}}>{s.name}</div>
                    <div style={{fontSize:11,color:C.muted,lineHeight:1.55}}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Excluded sections */}
            {excluded.length>0&&(
              <>
                <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
                  <span>✗</span> Not included in this plan
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {excluded.map(s=>(
                    <div key={s.name} style={{backgroundColor:C.s1,border:`1px solid ${C.border}`,borderRadius:6,padding:'6px 12px',display:'flex',gap:6,alignItems:'center',opacity:0.5}}>
                      <span style={{fontSize:13}}>{s.icon}</span>
                      <span style={{fontSize:11,color:C.muted,textDecoration:'line-through'}}>{s.name}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:16,fontSize:12,color:C.muted}}>
                  Upgrade to{' '}
                  {tab==='lite'&&<button onClick={()=>setTab('full')} style={{color:C.gold,backgroundColor:'transparent',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:700,padding:0}}>Brief Full ($29/mo) →</button>}
                  {tab==='full'&&<button onClick={()=>setTab('intel')} style={{color:C.purple,backgroundColor:'transparent',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:700,padding:0}}>Niche Intel ($49/mo) →</button>}
                  {' '}to unlock {excluded.length} more feature{excluded.length!==1?'s':''}.
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{marginTop:16,textAlign:'center',fontSize:12,color:C.muted}}>
          Preview pricing locks in permanently when you join. No credit card to request access.
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────
export default function Home(){
  const[niche,setNiche]=useState('');
  const[loading,setLoading]=useState(false);
  const[briefData,setBriefData]=useState(null);
  const[animActive,setAnimActive]=useState(false);
  const[email,setEmail]=useState('');
  const[joined,setJoined]=useState(false);
  const[error,setError]=useState('');
  const[loadMsg,setLoadMsg]=useState('');
  const count=useLiveCount(412);
  const demoRef=useRef(null);
  const[heroRef,heroV]=useReveal(0.1);
  const[probRef,probV]=useReveal(0.1);
  const[suiteRef,suiteV]=useReveal(0.1);
  const[faqRef,faqV]=useReveal(0.1);

  async function runDemo(n){
    const q=(n||niche).trim();
    if(!q)return;
    setNiche(q);setLoading(true);setBriefData(null);setAnimActive(false);setError('');
    // Try pre-cached demo first (instant load)
    const slug=SLUG_MAP[q.toLowerCase()]||(q.toLowerCase().replace(/[^a-z0-9]+/g,'-'));
    try{
      setLoadMsg('Loading brief...');
      const cached=await fetch(`/demos/${slug}.json`);
      if(cached.ok){
        const data=await cached.json();
        setBriefData(data);setLoading(false);
        setTimeout(()=>setAnimActive(true),100);
        return;
      }
    }catch{}
    // Fallback to API for custom niches
    setLoadMsg('Generating your brief...');
    try{
      const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({niche:q})});
      if(!res.ok)throw new Error();
      const data=await res.json();
      setBriefData(data);setTimeout(()=>setAnimActive(true),150);
    }catch{setError('Analysis failed. Try one of the quick options above.');}
    finally{setLoading(false);setLoadMsg('');}
  }

  async function getAccess(){
    if(!email.includes('@'))return;
    try{await fetch('/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,niche})});}catch{}
    setJoined(true);
  }

  const anim=(v,d=0)=>({opacity:v?1:0,transform:v?'translateY(0)':'translateY(22px)',transition:`opacity .65s ${d}s ease,transform .65s ${d}s ease`});
  const btnP={fontSize:14,fontWeight:700,color:'#000',backgroundColor:C.gold,padding:'14px 28px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'inherit',letterSpacing:'0.02em',boxShadow:`0 4px 20px ${C.goldGlow}`};
  const btnG={fontSize:14,fontWeight:600,color:C.mid,backgroundColor:'transparent',padding:'14px 28px',borderRadius:8,border:`1px solid ${C.border}`,cursor:'pointer',fontFamily:'inherit'};
  const inp={flex:1,minWidth:200,padding:'14px 16px',fontSize:14,backgroundColor:C.s2,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontFamily:'inherit',outline:'none'};

  return(
    <>
      <Head>
        <title>DownRange Co. Intelligence Data — YouTube Intel for Outdoor & Firearms Creators</title>
        <meta name="description" content="Weekly Monday Brief for outdoor creators: script hook, thumbnail blueprint, 4-week calendar, competitor pulse, Shorts ideas, and seasonal alerts. intel.downrangeco.com"/>
        <meta property="og:title" content="DownRange Co. Intelligence Data — YouTube Intel for Outdoor Creators"/>
        <meta property="og:description" content="The Monday Brief for firearms, hunting, and outdoor YouTube creators."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='none' stroke='%23C8922A' stroke-width='8'/><line x1='50' y1='10' x2='50' y2='40' stroke='%23C8922A' stroke-width='4'/><line x1='50' y1='60' x2='50' y2='90' stroke='%23C8922A' stroke-width='4'/><line x1='10' y1='50' x2='40' y2='50' stroke='%23C8922A' stroke-width='4'/><line x1='60' y1='50' x2='90' y2='50' stroke='%23C8922A' stroke-width='4'/></svg>"/>
        <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{-webkit-font-smoothing:antialiased;scroll-behavior:smooth}body{background:#07090B;color:#EDE8DF;font-family:'Inter','SF Pro Display',system-ui,sans-serif}@keyframes reticle{to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}@keyframes floatThumb{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}input[type=range]{-webkit-appearance:none;height:4px;background:${C.s4};border-radius:2px;outline:none}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${C.gold};cursor:pointer;box-shadow:0 0 6px ${C.goldGlow}}input:focus{outline:none;border-color:#C8922A70!important;box-shadow:0 0 0 3px #C8922A12}button:hover:not(:disabled){opacity:.86;transition:opacity .15s}.ch{transition:border-color .2s,box-shadow .2s}.ch:hover{border-color:#C8922A40!important;box-shadow:0 0 24px #C8922A14}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1C1F24;border-radius:2px}`}</style>
      </Head>
      <div style={{minHeight:'100vh',backgroundColor:C.bg}}>

        {/* TICKER */}
        <div style={{backgroundColor:'#08090D',borderBottom:`1px solid ${C.border}`,padding:'9px 0',overflow:'hidden'}}>
          <div style={{display:'flex',gap:60,whiteSpace:'nowrap',animation:'ticker 36s linear infinite',fontSize:11,color:C.mid}}>
            {[...TICKER,...TICKER].map((t,i)=><span key={i} style={{flexShrink:0}}>{t}</span>)}
          </div>
        </div>

        {/* NAV */}
        <nav style={{borderBottom:`1px solid ${C.border}`,padding:'15px 36px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,backgroundColor:`${C.bg}F4`,backdropFilter:'blur(16px)',zIndex:50}}>
          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:15,fontWeight:800,letterSpacing:'-0.3px'}}>
            <Dot color={C.gold}/>DownRange<span style={{color:C.gold}}>Intel</span>
            <span style={{fontSize:10,color:C.muted,fontWeight:400,marginLeft:4,letterSpacing:'0.02em'}}>intel.downrangeco.com</span>
          </div>
          <div style={{display:'flex',gap:26,fontSize:13,color:C.muted}}>
            {[['Demo','#demo'],['Compare','#compare'],['Suite','#suite'],['Pricing','#pricing']].map(([l,h])=>(
              <a key={l} href={h} style={{color:C.muted,textDecoration:'none'}} onMouseEnter={e=>e.target.style.color=C.text} onMouseLeave={e=>e.target.style.color=C.muted}>{l}</a>
            ))}
          </div>
          <button style={btnP} onClick={()=>document.getElementById('access')?.scrollIntoView({behavior:'smooth'})}>
            Request Early Access →
          </button>
        </nav>

        {/* HERO */}
        <div style={{position:'relative',overflow:'hidden',borderBottom:`1px solid ${C.border}`}}>
          <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(${C.gold}07 1px,transparent 1px),linear-gradient(90deg,${C.gold}07 1px,transparent 1px)`,backgroundSize:'44px 44px',pointerEvents:'none'}}/>
          <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 80% 70% at 15% 50%,#0F1A1280,transparent),radial-gradient(ellipse 60% 50% at 50% 0%,${C.gold}10,transparent)`,pointerEvents:'none'}}/>
          {HERO_THUMBS.map((t,i)=><FloatingThumb key={i} {...t}/>)}
          <svg width={540} height={540} viewBox="0 0 200 200" style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',opacity:0.04,pointerEvents:'none',animation:'reticle 90s linear infinite'}}>
            {[90,62,34].map(r=><circle key={r} cx="100" cy="100" r={r} fill="none" stroke={C.gold} strokeWidth={r===90?'0.5':'0.3'}/>)}
            <circle cx="100" cy="100" r="3.5" fill="none" stroke={C.gold} strokeWidth="1"/>
            {[['100','10','100','68'],['100','132','100','190'],['10','100','68','100'],['132','100','190','100']].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gold} strokeWidth="0.5"/>)}
          </svg>

          <div ref={heroRef} style={{maxWidth:900,margin:'0 auto',padding:'100px 24px 80px',textAlign:'center',position:'relative',zIndex:1,...anim(heroV)}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.gold,backgroundColor:C.goldDim,border:`1px solid ${C.goldBorder}`,padding:'6px 14px',borderRadius:4,marginBottom:30}}>
              <Dot color={C.green} size={6} pulse/>
              {count} outdoor creators on the early access list
            </div>
            <h1 style={{fontSize:'clamp(42px,7vw,72px)',fontWeight:900,letterSpacing:'-3px',lineHeight:0.98,marginBottom:26,color:C.text}}>
              YouTube intel<br/><span style={{color:C.gold,filter:`drop-shadow(0 0 30px ${C.goldGlow})`}}>built for your niche.</span>
            </h1>
            <p style={{fontSize:18,color:C.muted,lineHeight:1.7,maxWidth:590,margin:'0 auto 44px'}}>
              TubeLab makes you browse 5M videos yourself. VidIQ gives 20M creators the same idea cards. <strong style={{color:C.text,fontWeight:700}}>DownRange Intel</strong> delivers your specific brief — with a ready-to-read script, thumbnail blueprint, 4-week calendar, and Shorts ideas — every Monday at 7am. Built for deer hunters, bowhunters, CCW instructors, waterfowl hunters, and every outdoor creator in between.
            </p>
            <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:40}}>
              <button style={btnP} onClick={()=>demoRef.current?.scrollIntoView({behavior:'smooth'})}>See Monday Brief Live →</button>
              <button style={btnG} onClick={()=>document.getElementById('access')?.scrollIntoView({behavior:'smooth'})}>Request Early Access</button>
            </div>

            {/* Niche Opportunity Leaderboard */}
            <div style={{backgroundColor:C.s1,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px 20px',maxWidth:600,margin:'0 auto',textAlign:'left'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <Dot color={C.green} size={6} pulse/>
                <span style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'0.1em'}}>Top Opportunities This Week</span>
                <span style={{fontSize:10,color:C.muted,marginLeft:'auto'}}>Updated Monday</span>
              </div>
              {NICHE_LEADERBOARD.map((n,i)=>(
                <div key={i} style={{display:'flex',gap:12,alignItems:'center',padding:'8px 0',borderBottom:i<NICHE_LEADERBOARD.length-1?`1px solid ${C.border}`:'none'}}>
                  <span style={{fontSize:12,fontWeight:800,color:C.muted,width:18,textAlign:'center'}}>#{n.rank}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.text}}>{n.trend} {n.niche}</div>
                    <div style={{fontSize:11,color:C.muted}}>{n.signal}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:16,fontWeight:900,color:C.gold}}>{n.score}</div>
                    <div style={{fontSize:9,color:C.muted,textTransform:'uppercase'}}>Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROBLEM */}
        <div ref={probRef} style={{padding:'80px 24px',borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:920,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:48,...anim(probV)}}>
              <div style={{fontSize:10,fontWeight:700,color:C.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>The Problem</div>
              <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:900,letterSpacing:'-1.2px',marginBottom:14}}>Generic tools for generic creators.</h2>
              <p style={{fontSize:15,color:C.muted,maxWidth:520,margin:'0 auto',lineHeight:1.7}}>Your niche has specific terminology, compliance issues, seasonal patterns, and audience behavior that generic tools completely ignore.</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
              {[['🎯','No niche knowledge',"They don't know that 'suppressors' and 'silencers' are the same keyword. That deer season drives your calendar. That CCW content gets age-gated differently."],['🤖','Built for automation',"Every tool testimonial is '$500/day faceless channel.' Their product is designed for AI content farms — not for creators who hunt, shoot, and live this content."],['🔄','Same ideas for everyone',"VidIQ's daily ideas go to 20M+ creators. You're using the same AI suggestions as every competitor in your niche."],['📬','You have to go find it',"TubeLab has 5M+ outliers — but you browse them yourself. We send your intel every Monday. Zero effort on your end."]].map(([icon,title,desc],i)=>(
                <div key={title} className="ch" style={{...anim(probV,i*.08),backgroundColor:C.s1,border:`1px solid ${C.border}`,borderRadius:11,padding:'22px 20px'}}>
                  <div style={{fontSize:26,marginBottom:14}}>{icon}</div>
                  <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:8}}>{title}</div>
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.65}}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{backgroundColor:C.s1,padding:'80px 24px',borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:820,margin:'0 auto',textAlign:'center'}}>
            <div style={{fontSize:10,fontWeight:700,color:C.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>How It Works</div>
            <h2 style={{fontSize:'clamp(26px,3.8vw,42px)',fontWeight:900,letterSpacing:'-1.2px',marginBottom:48}}>Three steps. Zero effort on your end.</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:0}}>
              {[['01','🔒','Set your niche','Tell us your focus. 30 seconds.'],['02','🔭','We scan weekly','We monitor 10+ channels, detect outliers, extract patterns.'],['03','📬','Monday at 7am','Full brief in your inbox. Script, thumbnail, calendar, Shorts, competitor pulse. Done.']].map(([n,icon,title,desc],i,a)=>(
                <div key={n} style={{padding:'28px',borderRight:i<a.length-1?`1px solid ${C.border}`:'none'}}>
                  <div style={{fontSize:48,fontWeight:900,color:C.goldDim,letterSpacing:'-3px',lineHeight:1,marginBottom:14}}>{n}</div>
                  <div style={{fontSize:24,marginBottom:12}}>{icon}</div>
                  <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:10}}>{title}</div>
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.65}}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DEMO */}
        <div ref={demoRef} id="demo" style={{padding:'80px 24px',borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:720,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:36}}>
              <div style={{fontSize:10,fontWeight:700,color:C.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>Live Preview</div>
              <h2 style={{fontSize:'clamp(26px,3.8vw,42px)',fontWeight:900,letterSpacing:'-1.2px',marginBottom:14}}>Monday arrives.<br/>You press record.</h2>
              <p style={{fontSize:15,color:C.muted,lineHeight:1.65,maxWidth:480,margin:'0 auto'}}>Click a niche below for an instant preview — pre-loaded briefs open in under a second. Or type any custom niche for a live AI-generated one.</p>
            </div>
            <div style={{backgroundColor:C.s1,border:`1px solid ${C.border}`,borderRadius:12,padding:'24px'}}>
              <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
                <input style={inp} placeholder="Custom niche — e.g. 'turkey hunting' or 'home defense'" value={niche} onChange={e=>setNiche(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!loading&&runDemo()}/>
                <button style={{...btnP,padding:'14px 20px',whiteSpace:'nowrap',opacity:loading||!niche.trim()?0.5:1}} onClick={()=>runDemo()} disabled={loading||!niche.trim()}>
                  {loading?'Loading...':'Generate Brief →'}
                </button>
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                <span style={{fontSize:11,color:C.muted}}>⚡ Instant:</span>
                {QUICK.map(n=>(
                  <button key={n} style={{fontSize:11,fontWeight:600,color:C.muted,backgroundColor:C.s2,border:`1px solid ${C.border}`,padding:'5px 12px',borderRadius:20,cursor:'pointer',fontFamily:'inherit',transition:'all .15s'}}
                    onMouseEnter={e=>{e.target.style.borderColor=C.gold;e.target.style.color=C.gold;}}
                    onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.muted;}}
                    onClick={()=>runDemo(n)}>{n}</button>
                ))}
              </div>
              {loading&&<div style={{textAlign:'center',padding:'40px 0'}}><div style={{width:32,height:32,borderRadius:'50%',border:`3px solid ${C.border}`,borderTop:`3px solid ${C.gold}`,animation:'spin .75s linear infinite',margin:'0 auto 14px'}}/><div style={{fontSize:13,color:C.muted}}>{loadMsg||'Loading...'}</div></div>}
              {error&&<div style={{color:C.red,fontSize:13,marginTop:12}}>{error}</div>}
            </div>
            {briefData&&<MondayBriefEmail data={briefData} niche={niche} active={animActive}/>}
            {briefData&&(
              <div style={{textAlign:'center',marginTop:28,padding:'22px',backgroundColor:C.goldDim,border:`1px solid ${C.goldBorder}`,borderRadius:12}}>
                <div style={{fontSize:15,fontWeight:800,color:C.gold,marginBottom:6}}>This hits your inbox every Monday at 7am.</div>
                <div style={{fontSize:13,color:C.mid,marginBottom:16}}>Join the preview list to be in the first batch at intel.downrangeco.com.</div>
                <button style={btnP} onClick={()=>document.getElementById('access')?.scrollIntoView({behavior:'smooth'})}>Request Early Access →</button>
              </div>
            )}
          </div>
        </div>

        {/* ROI CALCULATOR */}
        <div style={{backgroundColor:C.s1,padding:'80px 24px',borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:760,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:36}}>
              <div style={{fontSize:10,fontWeight:700,color:C.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>The Math</div>
              <h2 style={{fontSize:'clamp(26px,3.8vw,42px)',fontWeight:900,letterSpacing:'-1.2px',marginBottom:14}}>Is $29/month worth it?</h2>
              <p style={{fontSize:15,color:C.muted,maxWidth:460,margin:'0 auto',lineHeight:1.7}}>Adjust the sliders to your situation. The math makes the decision obvious.</p>
            </div>
            <ROICalculator/>
          </div>
        </div>

        {/* COMPARISON */}
        <ComparisonSection/>

        {/* SUITE */}
        <div ref={suiteRef} id="suite" style={{padding:'80px 24px',borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:960,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:44,...anim(suiteV)}}>
              <div style={{fontSize:10,fontWeight:700,color:C.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>The Suite</div>
              <h2 style={{fontSize:'clamp(26px,3.8vw,42px)',fontWeight:900,letterSpacing:'-1.2px'}}>Four tools. One niche.</h2>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gridTemplateRows:'auto auto',gap:14}}>
              <div className="ch" style={{...anim(suiteV),gridColumn:'1',gridRow:'1/3',backgroundColor:C.s1,border:`1px solid ${C.goldBorder}`,borderRadius:12,padding:'28px 24px',display:'flex',flexDirection:'column',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,right:0,backgroundColor:C.gold,color:'#000',fontSize:9,fontWeight:800,letterSpacing:'0.1em',padding:'4px 11px',borderRadius:'0 12px 0 8px'}}>FLAGSHIP</div>
                <div style={{fontSize:32,marginBottom:16}}>📬</div>
                <div style={{fontSize:18,fontWeight:800,color:C.text,marginBottom:4}}>Monday Brief</div>
                <div style={{fontSize:11,color:C.green,marginBottom:18}}>Preview pricing TBA · founding members first</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.65,marginBottom:20,flex:1}}>Your complete weekly intelligence brief for any outdoor niche — deer hunting, archery, CCW, waterfowl. Script hook, thumbnail blueprint, 4-week calendar, Shorts ideas, competitor pulse, trending questions, and seasonal alerts. Every Monday at 7am.</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {['Niche outlier scan (5 videos)','Script hook — read it on camera','Real thumbnail blueprint + guide','4-week content calendar','Competitor pulse (3 channels)','3 Shorts repurpose ideas','Trending audience questions','Seasonal opportunity alerts','Niche health score weekly'].map(f=>(
                    <div key={f} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                      <span style={{color:C.gold,fontSize:11,marginTop:1,flexShrink:0}}>✓</span>
                      <span style={{fontSize:12,color:C.mid}}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              {[{icon:'🔭',name:'Niche Intel',desc:'On-demand outlier dashboard. Scan any niche, track competitors, title formula library, content gap analysis.'},
                {icon:'🤝',name:'Sponsor Deals',desc:'Rate calculator, media kit generator, brand pitch CRM. Know your worth. Pitch outdoor and firearms brands.'},
                {icon:'🏷️',name:'Brand Directory',desc:'For outdoor & firearms brands: find, vet, and contact 400+ verified YouTube creators across hunting, archery, CCW, and outdoor niches. Direct access, no agency.'}].map(({icon,name,desc},i)=>(
                <div key={name} className="ch" style={{...anim(suiteV,.1+i*.06),backgroundColor:C.s1,border:`1px solid ${C.border}`,borderRadius:12,padding:'22px 20px'}}>
                  <div style={{fontSize:26,marginBottom:12}}>{icon}</div>
                  <div style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:6}}>{name}</div>
                  <div style={{fontSize:11,color:C.green,marginBottom:10}}>Pricing TBA</div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.65}}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRICING */}
        <PricingTabs onCTA={()=>document.getElementById('access')?.scrollIntoView({behavior:'smooth'})}/>

        {/* FAQ */}
        <div ref={faqRef} style={{padding:'80px 24px',borderBottom:`1px solid ${C.border}`}} id="faq">
          <div style={{maxWidth:680,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:44,...anim(faqV)}}>
              <div style={{fontSize:10,fontWeight:700,color:C.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:14}}>FAQ</div>
              <h2 style={{fontSize:'clamp(24px,3.5vw,38px)',fontWeight:900,letterSpacing:'-1px'}}>Questions we get asked.</h2>
            </div>
            {[["Is the data real or AI-generated?","The outlier detection uses real YouTube Data API — actual view counts, channel averages, timing patterns. Our AI Intelligence Engine analyzes those patterns to write the insights, script hooks, and thumbnail blueprints. Real data. AI-assisted writing."],["Why only outdoor, firearms, and hunting creators?","Because generic tools fail at vertical niches. TubeLab doesn't know that archery's pre-season window differs from rifle season, or that CCW content is age-gated differently, or that 'recurve' and 'traditional bow' are the same search intent. We built DownRange Intel knowing the specific rules of outdoor and firearms content."],["How is the thumbnail blueprint actually useful?","The brief shows you a rendered, real-looking thumbnail mockup — not placeholder boxes. Split-screen format, color zones, text overlay position, and creator placement are all specified. Build it in Canva in about 8 minutes."],["How is this different from TubeLab?","TubeLab requires you to log in and browse 5M+ videos yourself. We deliver the brief to you. TubeLab has no outdoor niche knowledge. We do. Same price — but we do all the work."],["When does the preview launch?","Accepting preview requests now and launching in batches. Everyone on the list gets access before public launch with founding pricing locked in."]].map(([q,a],i)=>(
              <FaqItem key={q} q={q} a={a} visible={faqV} delay={i*.07}/>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div id="access" style={{backgroundColor:C.s1,padding:'88px 24px',borderBottom:`1px solid ${C.border}`,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 70% 60% at 50% 100%,${C.gold}12,transparent)`,pointerEvents:'none'}}/>
          <div style={{maxWidth:580,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.gold,backgroundColor:C.goldDim,border:`1px solid ${C.goldBorder}`,padding:'6px 14px',borderRadius:4,marginBottom:24}}>
              <Dot color={C.green} size={6} pulse/>{count} outdoor creators requested early access
            </div>
            <h2 style={{fontSize:'clamp(30px,4.5vw,52px)',fontWeight:900,letterSpacing:'-1.8px',marginBottom:16,lineHeight:1.05}}>Request early access.</h2>
            <p style={{fontSize:16,color:C.muted,lineHeight:1.65,maxWidth:440,margin:'0 auto 32px'}}>
              Launching at <strong style={{color:C.text}}>intel.downrangeco.com</strong>. Join the preview list and we'll reach out when your spot opens — founding pricing locked in.
            </p>
            {!joined?(
              <>
                <div style={{display:'flex',gap:10,maxWidth:440,margin:'0 auto',flexWrap:'wrap',justifyContent:'center'}}>
                  <input style={inp} type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&getAccess()}/>
                  <button style={btnP} onClick={getAccess}>Request Access →</button>
                </div>
                <div style={{fontSize:12,color:C.muted,marginTop:14}}>No credit card. No commitment. We reach out personally when your spot opens.</div>
              </>
            ):(
              <div style={{backgroundColor:C.greenDim,border:`1px solid ${C.greenBorder}`,borderRadius:12,padding:'24px 28px',maxWidth:400,margin:'0 auto'}}>
                <div style={{fontSize:22,fontWeight:800,color:C.green,marginBottom:8}}>✓ Request received.</div>
                <div style={{fontSize:14,color:C.mid,lineHeight:1.65}}>You're #{count} on the list. We'll reach out personally when your spot opens at intel.downrangeco.com.</div>
              </div>
            )}
          </div>
        </div>

        <footer style={{padding:'32px 36px',borderTop:`1px solid ${C.border}`,display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          {/* Logo top */}
          <img src='/logo-sm.png' alt='DownRange Co. Intelligence Data' style={{height:32,width:'auto',opacity:0.9}}/>
          {/* Copyright middle */}
          <div style={{fontSize:11,color:C.muted,textAlign:'center'}}>
            © 2026 DownRange Co. All rights reserved. Content analysis for informational purposes only. Washington State.
          </div>
          {/* Attribution bottom */}
          <div style={{fontSize:11,color:C.muted,textAlign:'center',lineHeight:1.8,borderTop:`1px solid ${C.border}`,paddingTop:14,width:'100%',maxWidth:680}}>
            Part of <a href='https://downrangeco.com' target='_blank' rel='noopener' style={{color:C.gold,textDecoration:'none'}}>DownRange Co.</a> · <a href='https://downrangeco.com' target='_blank' rel='noopener' style={{color:C.mid,textDecoration:'none'}}>News Portal</a> · intel.downrangeco.com<br/>
            Intelligence powered by multiple sources including the DownRange News Portal, YouTube Data API, and the DownRange Intelligence Engine.
          </div>
        </footer>
      </div>
    </>
  );
}

function FaqItem({q,a,visible,delay}){
  const[open,setOpen]=useState(false);
  return(
    <div style={{borderBottom:`1px solid ${C.border}`,opacity:visible?1:0,transform:visible?'translateY(0)':'translateY(16px)',transition:`opacity .6s ${delay}s ease,transform .6s ${delay}s ease`}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 0',backgroundColor:'transparent',border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left',gap:16}}>
        <span style={{fontSize:14,fontWeight:600,color:C.text,lineHeight:1.4}}>{q}</span>
        <span style={{color:C.gold,fontSize:18,flexShrink:0,transform:open?'rotate(45deg)':'none',transition:'transform .2s'}}>+</span>
      </button>
      {open&&<div style={{fontSize:13,color:C.muted,lineHeight:1.75,paddingBottom:18}}>{a}</div>}
    </div>
  );
}
