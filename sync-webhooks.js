import fs from "fs/promises";
import { Alchemy, Network } from "alchemy-sdk";

// which batch: "1" or "2" (set via env var in GitHub Actions)
const PART    = process.env.PART;
const WALLETS = JSON.parse(await fs.readFile(`./addresses${PART}.json`, "utf-8"));

// dynamically grab every EVM mainnet supported
const CHAINS = Object.values(Network).filter(n =>
  typeof n === "string" && n.endsWith("_MAINNET")
);

const alchemy = new Alchemy({ apiKey: process.env.ALCHEMY_API_KEY });

async function sync() {
  const existing = await alchemy.notify.getWebhooks();
  for (const network of CHAINS) {
    const name = `tx-alerts-${network}-part${PART}`;
    let hook = existing.find(h => h.name === name);
    if (!hook) {
      hook = await alchemy.notify.createWebhook({
        type:  "ADDRESS_ACTIVITY",
        name,
        url:   process.env.WEBHOOK_URL,
        params:{ addresses: WALLETS, network }
      });
      console.log(`✚ Created ${hook.webhookId}`);
    } else {
      await alchemy.notify.updateWebhookAddresses({
        webhookId:         hook.webhookId,
        addresses_to_add:   WALLETS,
        addresses_to_remove:[]
      });
      console.log(`↻ Updated ${hook.webhookId}`);
    }
  }
}

sync().catch(e => { console.error(e); process.exit(1); });
