export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, niche } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

  const entry = { email, niche: niche || 'not specified', signedUpAt: new Date().toISOString() };
  console.log('[WAITLIST]', entry);

  // Send notification email via Resend
  try {
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (RESEND_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({
          from: 'DownRange Intel <intel@downrangeco.com>',
          to: ['dj@downrangeco.com'],
          subject: `🎯 New Early Access Request — ${email}`,
          html: `
            <div style="font-family:monospace;background:#07090B;color:#EDE8DF;padding:32px;border-radius:10px;max-width:520px">
              <div style="color:#C8922A;font-weight:900;font-size:18px;margin-bottom:20px">DownRange Intel — New Signup</div>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="color:#52555C;padding:6px 0;font-size:13px">Email</td><td style="color:#EDE8DF;font-size:13px">${email}</td></tr>
                <tr><td style="color:#52555C;padding:6px 0;font-size:13px">Niche</td><td style="color:#C8922A;font-size:13px">${niche || 'Not specified'}</td></tr>
                <tr><td style="color:#52555C;padding:6px 0;font-size:13px">Time</td><td style="color:#EDE8DF;font-size:13px">${new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})}</td></tr>
              </table>
              <div style="margin-top:20px;padding-top:16px;border-top:1px solid #1C1F24;font-size:11px;color:#52555C">
                intel.downrangeco.com · DownRange Co.
              </div>
            </div>
          `,
        }),
      });
    }
  } catch (err) {
    console.error('[WAITLIST] Resend error:', err.message);
  }

  res.status(200).json({ ok: true });
}
