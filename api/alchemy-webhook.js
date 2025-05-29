// api/alchemy-webhook.js
import axios from "axios";

// 🔄 v3 – override for GET ping
export default async function handler(req, res) {
  // 1️⃣ Catch ANY non-POST (including GET & empty) and return 200
  if (req.method !== "POST" || !req.body || Object.keys(req.body).length === 0) {
    return res.status(200).end("pong v3");
  }

  try {
    console.log("🔍 PAYLOAD:", JSON.stringify(req.body));

    // Placeholder echo
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: `✅ Got payload — ${JSON.stringify(req.body).slice(0,200)}…`
    });

    return res.status(200).end("OK");
  } catch (err) {
    console.error("❌ HANDLER ERROR:", err);
    return res.status(500).end("Internal Error");
  }
}
