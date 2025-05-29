// api/alchemy-webhook.js
import axios from "axios";

export default async function handler(req, res) {
  // 1) Health-check for Alchemy “Test URL” (GET or empty POST)
  if (req.method !== "POST" || !req.body || Object.keys(req.body).length === 0) {
    return res.status(200).end("pong");
  }

  try {
    // 2) Grab the Address-Activity payload
    const { event } = req.body;

    for (const a of event.activity) {
      // Decide symbol & amount
      const isToken = a.category === "token";
      const symbol  = isToken ? a.asset : "ETH";

      // a.value for token is already in human units;
      // for ETH we need to divide wei→ETH
      const amount = isToken
        ? Number(a.value)
        : Number(a.value) / 1e18;

      // 3) Build your message
      const msg = 
        `🔔 [${event.network}] ${amount} ${symbol}\n` +
        `from ${a.fromAddress}\n` +
        `to   ${a.toAddress}`;

      // 4) Send to Discord
      await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        content: msg
      });
    }

    return res.status(200).end("OK");
  } catch (err) {
    console.error("HANDLER ERROR:", err.stack || err);
    return res.status(500).end("Internal Error");
  }
}
