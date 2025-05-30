import fs from "fs/promises";
import axios from "axios";

const PART   = process.env.PART;                       // "1" or "2"
const TOKEN  = process.env.ALCHEMY_AUTH_TOKEN;         // dashboard auth
const URL    = process.env.WEBHOOK_URL;                // Vercel endpoint
const HOOKS  = JSON.parse(await fs.readFile(`./addresses${PART}.json`, "utf-8"));

/* every mainnet Alchemy supports right now ----------------------------- */
const CHAINS = [
  "ETH_MAINNET","BSC_MAINNET","POLYGON_MAINNET","AVALANCHE_MAINNET",
  "ARBITRUM_MAINNET","OPT_MAINNET","BASE_MAINNET","FTM_MAINNET",
  "CELO_MAINNET","AURORA_MAINNET","LINEA_MAINNET","BLAST_MAINNET",
  "MANTLE_MAINNET","SCROLL_MAINNET","ZKSYNC_MAINNET","ZETACHAIN_MAINNET"
  /* add/remove as you need; list is ~80 total, trimmed here for brevity */
];
/* --------------------------------------------------------------------- */

const api = axios.create({
  baseURL: "https://dashboard.alchemy.com/api",
  headers: { "X-Alchemy-Token": TOKEN, "Content-Type":"application/json" },
});

async function main() {
  const { data: hooks } = await api.post("/get-webhooks", {});
  for (const net of CHAINS) {
    const name = `tx-alerts-${net}-part${PART}`;
    let hook   = hooks.find(h => h.name === name);

    if (!hook) {
      const res = await api.post("/create-webhook", {
        type: "ADDRESS_ACTIVITY",
        name,
        url:  URL,
        params: { addresses: HOOKS, network: net }
      });
      console.log("✚ Created", res.data.webhookId);
    } else {
      await api.patch("/update-webhook-addresses", {
        webhook_id: hook.webhookId,
        addresses_to_add: HOOKS,
        addresses_to_remove: []
      });
      console.log("↻ Updated", hook.webhookId);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
