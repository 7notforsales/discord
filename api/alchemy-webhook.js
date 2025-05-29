export default async function handler(req, res) {
  // Alchemy UI sends a GET (or POST with no body) to test the URL
  if (req.method === "GET" || !req.body || Object.keys(req.body).length === 0) {
    return res.status(200).end("pong");   // <-- Alchemy now sees 200
  }
  // ──────────────────────────────────────────────────────────────
  // Real payload handling goes below … add yours later.
  console.log("REAL PAYLOAD:", JSON.stringify(req.body));
  return res.status(200).end("ok");
}
