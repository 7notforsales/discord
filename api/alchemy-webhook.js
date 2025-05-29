import axios from "axios";

export default async function handler(req, res) {
  // 1) Dump the incoming payload to your function logs
  console.log("REQUEST BODY:", JSON.stringify(req.body));

  // 2) Only allow POSTs
  if (req.method !== "POST") {
    return res.status(405).end("Only POST allowed");
  }

  const body = req.body;

  // 3a) Legacy Address‐Activity hook
  if (body.event?.activity) {
    for (const a of body.event.activity) {
      const amt = a.value / 1e18;
      const msg = `🔔 [${body.event.network}] ${amt} ETH from ${a.fromAddress}`;
      await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: msg });
    }
  }
  // 3b) Custom GraphQL hook
  else if (body.data?.block?.logs) {
    for (const log of body.data.block.logs) {
      const tx = log.transaction;
      const amt = tx.value / 1e18;
      const msg = `🔔 [${tx.network}] ${amt} ${log.data.asset || "ETH"}\nfrom ${tx.from.address}\nto   ${tx.to.address}`;
      await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: msg });
    }
  }
  // 3c) Unknown payload
  else {
    console.log("Unknown payload shape");
  }

  return res.status(200).end("OK");
}
