import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Only POST allowed");

  // Address-Activity payload → event.activity is an array (1 item per tx)
  const activities = req.body?.event?.activity || [];

  for (const a of activities) {
    // value is a string in wei; convert to ETH (18 decimals)
    const eth = Number(a.value) / 1e18;             // quick conversion
    const msg = `🔔 [${a.network}] ${eth} ${a.asset}  
from ${a.from}  
to   ${a.to}`;

    await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: msg });
  }

  res.status(200).end();
}
