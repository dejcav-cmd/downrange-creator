export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, niche } = req.body;
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Invalid email" });
  // TODO: wire to Airtable — POST to https://api.airtable.com/v0/{BASE_ID}/Waitlist
  // with fields: Email, Niche, CreatedAt
  console.log("[WAITLIST]", { email, niche, ts: new Date().toISOString() });
  res.status(200).json({ ok: true });
}
