import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { stripe } from '@/lib/stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderCode = searchParams.get('code');
  const sessionId = searchParams.get('session_id');

  if (!orderCode) {
    return NextResponse.json({ error: 'Missing order code' }, { status: 400 });
  }

  try {
    await dbConnect();
    
    const order = await Order.findOne({ orderCode: Number(orderCode) });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If session_id is provided, check with Stripe for real-time verification
    if (sessionId && !order.isPaid) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
          order.isPaid = true;
          order.paidAt = new Date();
          order.paymentStatus = 'paid';
          order.orderStatus = 'processing';
          await order.save();

          // DECREASE STOCK (Fallback for local dev without webhook)
          for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: -item.quantity }
            });
          }
          console.log(`Order #${orderCode} verified and stock decreased via Success Page`);
        }
      } catch (stripeError: any) {
        console.warn('Stripe verification failed:', stripeError.message);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
