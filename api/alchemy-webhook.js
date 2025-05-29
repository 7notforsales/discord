// api/alchemy-webhook.js
import axios from "axios";

export default async function handler(req, res) {
  // 1️⃣ Always succeed on GET or empty-body POST (the “Test URL” ping)
  if (
    req.method === "GET" ||
    !req.body ||
    (typeof req.body === "object" && Object.keys(req.body).length === 0)
  ) {
    return res.status(200).end("pong");
  }

  // 2️⃣ Only POST with a payload gets here
  if (req.method !== "POST") {
    return res.status(405).end("Only POST allowed");
  }

  try {
    // LOG the real payload for debugging
    console.log("🔍 PAYLOAD:", JSON.stringify(req.body));

    // Placeholder: echo back a concise confirmation
    // You can replace this with your actual parsing & Discord calls
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: `✅ Received ${JSON.stringify(req.body).slice(0, 200)}…`
    });

    return res.status(200).end("OK");
  } catch (err) {
    console.error("❌ HANDLER ERROR:", err.stack || err.message || err);
    return res.status(500).end("Internal Error");
  }
}
