export default async function handler(req, res) {
  console.log("REQUEST BODY:", JSON.stringify(req.body));
  if (req.method !== "POST") return res.status(405).end("Only POST");
  …
}
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Only POST");

  const body = req.body;

  // 1) Address‐Activity hook (old style)
  if (body.event?.activity) {
    for (const a of body.event.activity) {
      const amt = a.value / 1e18;
      await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        content: `🔔 [${body.event.network}] ${amt} ETH from ${a.fromAddress}`
      });
    }
  }

  // 2) Custom GraphQL hook
  else if (body.data?.block?.logs) {
    for (const log of body.data.block.logs) {
      const tx = log.transaction;
      const amt = tx.value / 1e18;
      await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        content: `🔔 [${tx.network}] ${amt} ${log.data.asset || "ETH"}\nfrom ${tx.from.address}\nto   ${tx.to.address}`
      });
    }
  }

  return res.status(200).end();
}
