import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Only POST allowed');
  }

  const { event } = req.body;
  const amountEth = (event.value / 1e18).toFixed(6);
  const msg = `🔔 [${event.network}] ${amountEth} ETH from ${event.from}`;

  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: msg });
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}
