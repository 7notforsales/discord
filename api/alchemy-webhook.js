import axios from "axios";

export default async function handler(req, res) {
  // 1) Respond OK to GET / UI tests
  if (req.method === "GET" || Object.keys(req.body || {}).length === 0) {
    return res.status(200).end("OK");
  }

  // 2) Only POST with payload get here
  if (req.method !== "POST") {
    return res.status(405).end("Only POST allowed");
  }

  try {
    const body = req.body;

    // 3a) Address-Activity events
    if (body.event?.activity) {
      for (const a of body.event.activity) {
        const amt = Number(a.value) / 1e18;
        await axios.post(process.env.DISCORD_WEBHOOK_URL, {
          content: `🔔 [${body.event.network}] ${amt} ETH\nfrom ${a.fromAddress}\nto   ${a.toAddress}`,
        });
      }
    }
    // 3b) Custom-GraphQL block/log events
    else if (body.data?.block?.logs) {
      for (const log of body.data.block.logs) {
        const tx = log.transaction;
        const amt = Number(tx.value) / 1e18;
        await axios.post(process.env.DISCORD_WEBHOOK_URL, {
          content: `🔔 [${tx.network}] ${amt} ${log.data.asset || "ETH"}\nfrom ${tx.from.address}\nto   ${tx.to.address}`,
        });
      }
    }

    return res.status(200).end("OK");
  } catch (err) {
    console.error("HANDLER ERROR:", err.stack || err);
    return res.status(500).end("Internal Error");
  }
}
