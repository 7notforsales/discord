import axios from "axios";

// ───────────────────────────────────────────────────────────────
// Vercel serverless function – handles any Address-Activity hook
// ───────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // 1) Answer Alchemy’s “Test URL” pings (GET or empty POST)
  if (req.method !== "POST" ||
      !req.body ||
      Object.keys(req.body).length === 0) {
    return res.status(200).end("pong");
  }

  try {
    const { event } = req.body; // top-level Address-Activity object

    for (const a of event.activity) {
      const isToken   = a.category === "token";
      const symbol    = isToken ? a.asset : nativeSymbol(event.network);
      const decimals  = isToken ? Number(a.rawContract?.decimals ?? 18) : 18;
      const amount    = Number(a.value) / 10 ** decimals;

      const msg =
        `🔔 [${event.network}] ${amount} ${symbol}\n` +
        `from ${a.fromAddress}\n` +
        `to   ${a.toAddress}`;

      await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: msg });
    }

    return res.status(200).end("OK");
  } catch (err) {
    console.error(err);
    return res.status(500).end("Internal Error");
  }
}

/* Helper: map Alchemy network → native coin symbol */
function nativeSymbol(network) {
  switch (network) {
    case "BNB_MAINNET":       return "BNB";
    case "POLYGON_MAINNET":   return "MATIC";
    case "AVALANCHE_MAINNET": return "AVAX";
    case "FTM_MAINNET":       return "FTM";
    case "CELO_MAINNET":      return "CELO";
    case "ARBITRUM_MAINNET":  return "ETH";
    case "OPT_MAINNET":       return "ETH";
    case "BASE_MAINNET":      return "ETH";
    // …add others if you like …
    default:                  return "ETH";
  }
}
