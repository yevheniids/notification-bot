import TelegramBot from 'node-telegram-bot-api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const order = req.body;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('Missing environment variables:', { hasToken: !!token, hasChatId: !!chatId });
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const bot = new TelegramBot(token, { polling: false });

    const message = `
      🛒 New order created!
      --------------------------
      📦 Order ID: ${order.id}
      🔢 Order number: ${order.order_number}
      💰 Total price: ${order.total_price} ${order.currency}
      👤 Customer: ${order.email}
      🧾 Items: ${order.line_items?.length || 0}
    `;

    await bot.sendMessage(chatId, message);

    return res.status(200).json({
      success: true,
      orderId: order.id
    });
  } catch (error) {
    console.error('Webhook error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}