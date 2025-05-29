import axios from "axios";

export default async function handler(req, res) {
  // 1) Always 200 for UI/Test pings (GET or empty‐body POST)
  if (req.method !== "POST" || !req.body || Object.keys(req.body).length === 0) {
    return res.status(200).end("pong");
  }

  try {
    const { event } = req.body;            // built-in Address Activity payload
    const a = event.activity[0];           // one activity per call
    const amount = Number(a.value) / 1e18; // raw wei → ETH
    const msg = `🔔 [${event.network}] ${amount} ETH\n`
              + `from ${a.from}\n`
              + `to   ${a.to}`;

    // send to Discord
    await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: msg });
    return res.status(200).end("OK");

  } catch (err) {
    console.error("HANDLER ERROR:", err.stack || err);
    return res.status(500).end("Internal Error");
  }
}
