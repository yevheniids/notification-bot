export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}