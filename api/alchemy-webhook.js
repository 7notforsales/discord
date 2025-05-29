import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("REQUEST BODY:", JSON.stringify(req.body));

    if (req.method !== "POST") {
      return res.status(405).end("Only POST allowed");
    }

    const body = req.body;

    // Address-Activity payload
    if (body.event?.activity) {
      for (const a of body.event.activity) {
        const amt = Number(a.value) / 1e18;
        const msg = `🔔 [${body.event.network}] ${amt} ETH from ${a.fromAddress}\nto   ${a.toAddress}`;
        await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: msg });
      }
    }
    // Custom GraphQL payload
    else if (body.data?.block?.logs) {
      for (const log of body.data.block.logs) {
        const tx = log.transaction;
        const amt = Number(tx.value) / 1e18;
        const msg = `🔔 [${tx.network}] ${amt} ${log.data.asset || "ETH"}\nfrom ${tx.from.address}\nto   ${tx.to.address}`;
        await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: msg });
      }
    }
    else {
      console.error("Unknown payload shape:", JSON.stringify(body));
    }

    return res.status(200).end("OK");
  } catch (err) {
    console.error("HANDLER ERROR:", err.stack || err);
    return res.status(500).end("Internal Error");
  }
}
