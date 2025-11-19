import crypto from 'crypto';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (SHOPIFY_WEBHOOK_SECRET) {
      const hmac = req.headers['x-shopify-hmac-sha256'];
      const body = JSON.stringify(req.body);
      const hash = crypto
        .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
        .update(body, 'utf8')
        .digest('base64');

      if (hash !== hmac) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const order = req.body;

    console.log('=== NEW ORDER CREATED ===');
    console.log('Order ID:', order.id);
    console.log('Order Number:', order.order_number);
    console.log('Total Price:', order.total_price, order.currency);
    console.log('Customer:', order.email);
    console.log('Items:', order.line_items?.length || 0);

    return res.status(200).json({
      success: true,
      orderId: order.id
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}