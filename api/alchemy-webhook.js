import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { event } = req.body;

    // Build message: chain, amount, and the sending address
    const amountEth = (event.value / 1e18).toFixed(6);
    const msg = `🔔 [${event.network}] ${amountEth} ETH from ${event.from}`;

    // Send to Discord
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: msg
    });

    return res.status(200).end();
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).end();
  }
}
