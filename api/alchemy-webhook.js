import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Only POST allowed");

  const { event } = req.body || {};
  const activities = event?.activity || [];

  for (const a of activities) {
    const amt = a.value;                 // already human-readable
    const msg = `🔔 [${event.network}] ${amt} ${a.asset}\n`
              + `from ${a.fromAddress}\n`
              + `to   ${a.toAddress}`;

    await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: msg });
  }
  res.status(200).end();
}
