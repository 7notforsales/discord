// api/alchemy-webhook.js
import axios from "axios";

export default async function handler(req, res) {
  // 1️⃣ Alchemy “Test URL” ping uses GET or empty‐body POST
  if (req.method !== "POST" || !req.body || Object.keys(req.body).length === 0) {
    return res.status(200).end("pong");
  }

  try {
    const { event } = req.body;            // addressActivity payload
    for (const a of event.activity) {
      const msg = `🔔 [${event.network}] ${a.value} ${a.asset}\n` +
                  `from ${a.fromAddress}\n` +
                  `to   ${a.toAddress}`;
      await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: msg });
    }
    return res.status(200).end("OK");
  } catch (err) {
    console.error("HANDLER ERROR:", err);
    return res.status(500).end("Internal Error");
  }
}
