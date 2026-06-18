export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { niche } = req.body;
  if (!niche) return res.status(400).json({ error: "niche required" });
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        system: "You are a YouTube intelligence engine for outdoor, firearms, and hunting creators. Return ONLY valid compact JSON. No markdown. Be hyper-specific and data-driven.",
        messages: [{ role: "user", content: `Analyze YouTube niche: "${niche}". Return exactly this JSON:
{"niche":"cleaned name","channelsScanned":12,"videosAnalyzed":287,"avgChannelViews":38000,"nicheHealth":{"score":74,"label":"Growing","trend":"rising","insight":"specific one-sentence insight","weeklyGrowth":"+8%"},"outliers":[{"rank":1,"title":"compelling specific title","channel":"channel name","views":298000,"multiplier":"5.2x","daysAgo":7,"length":"16:42","whyItWorked":"one specific reason","titleType":"How-to","thumbnailStyle":"describe the thumbnail in 6 words"},{"rank":2,"title":"compelling specific title","channel":"channel name","views":187000,"multiplier":"3.9x","daysAgo":13,"length":"11:28","whyItWorked":"specific reason","titleType":"Story","thumbnailStyle":"describe the thumbnail in 6 words"},{"rank":3,"title":"compelling specific title","channel":"channel name","views":152000,"multiplier":"3.2x","daysAgo":18,"length":"22:05","whyItWorked":"specific reason","titleType":"List","thumbnailStyle":"describe thumbnail in 6 words"},{"rank":4,"title":"compelling title","channel":"channel name","views":128000,"multiplier":"2.8x","daysAgo":24,"length":"14:11","whyItWorked":"specific reason","titleType":"Controversy","thumbnailStyle":"describe thumbnail"},{"rank":5,"title":"compelling title","channel":"channel name","views":108000,"multiplier":"2.5x","daysAgo":28,"length":"9:52","whyItWorked":"specific reason","titleType":"Tutorial","thumbnailStyle":"describe thumbnail"}],"patterns":{"titleFormula":{"formula":"specific formula for this niche","parts":[{"text":"[Number]","type":"number"},{"text":"Action Verb","type":"verb"},{"text":"Specific Topic","type":"topic"},{"text":"+ Result","type":"hook"}]},"bestLength":{"value":"14-18 min","confidence":83},"bestDay":{"value":"Wednesday","confidence":76},"bestTime":{"value":"2-5pm EST","confidence":71},"thumbnailPattern":{"value":"specific thumbnail pattern description","confidence":79}},"gapAnalysis":{"title":"specific content gap in this niche","reason":"why this gap exists","urgency":"High"},"nextVideo":{"title":"specific compelling video title","viralScore":86,"angle":"one specific sentence","length":"15-17 min","publishDay":"Wednesday","publishTime":"3pm EST","thumbnailConcept":{"leftSide":"what goes on left side of thumbnail","rightSide":"what goes on right side","textOverlay":"the main text overlay","bgColor":"dark forest green","emoji":"🎯"},"scriptHook":"Write the exact first 30 seconds of this video as a script. Make it compelling, specific, and ready to read on camera. 2-3 sentences.","hooks":["Hook option 1 — compelling opener","Hook option 2 — different angle","Hook option 3 — curiosity gap"],"reasons":["data reason 1","data reason 2","data reason 3"]}}
Make everything specific to "${niche}". Use realistic channel names and video titles for this exact niche.` }]
      })
    });
    const data = await response.json();
    const raw = data.content?.[0]?.text || "";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
}
