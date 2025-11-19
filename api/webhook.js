import crypto from 'crypto';

const SHOPIFY_SECRET = process.env.SHOPIFY_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    if (SHOPIFY_SECRET) {
      const hmacHeader = req.headers['x-shopify-hmac-sha256'];
      
      if (!hmacHeader) {
        console.error('⚠️ HMAC header missing');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const rawBody = typeof req.body === 'string' 
        ? req.body 
        : JSON.stringify(req.body);
      
      const hash = crypto
        .createHmac('sha256', SHOPIFY_SECRET)
        .update(rawBody, 'utf8')
        .digest('base64');

      if (hash !== hmacHeader) {
        console.error('⚠️ HMAC verification failed');
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } else {
      console.warn('⚠️ SHOPIFY_SECRET not set, skipping HMAC verification');
    }

    const order = body;
    
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
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}