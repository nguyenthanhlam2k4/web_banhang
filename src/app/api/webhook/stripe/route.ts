import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !webhookSecret) {
      throw new Error('Missing stripe-signature or webhook secret');
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const orderCode = session.metadata.orderCode;

      await dbConnect();
      const order = await Order.findOne({ orderCode: Number(orderCode) });

      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentStatus = 'paid';
        order.orderStatus = 'processing';
        await order.save();

        // DECREASE STOCK
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
          });
        }
        
        console.log(`Order #${orderCode} updated to PAID and stock decreased`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Database Update Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


