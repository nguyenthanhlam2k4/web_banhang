import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { stripe } from '@/lib/stripe';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

async function getAuthUser(request: Request) {
  const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function POST(request: Request) {
  console.log('--- API Order Creation Started ---');
  const user = await getAuthUser(request);
  if (!user) {
    console.error('Order API: Unauthorized access attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    console.log('Order Body Received:', JSON.stringify(body, null, 2));

    const { orderItems, shippingAddress, itemsPrice, shippingPrice, totalPrice } = body;

    if (!orderItems || orderItems.length === 0) {
      console.error('Order API: No order items provided');
      return NextResponse.json({ error: 'No order items' }, { status: 400 });
    }

    const orderCode = Math.floor(100000 + Math.random() * 900000);
    console.log('Generated Order Code:', orderCode);

    // Create Stripe Checkout Session
    const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    console.log('App Domain for redirect:', domain);
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: orderItems.map((item: any) => {
          // Stripe requires absolute URLs for images
          const imageUrl = item.image?.startsWith('http') 
            ? item.image 
            : `${domain}${item.image?.startsWith('/') ? '' : '/'}${item.image || ''}`;

          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: item.image ? [imageUrl] : [],
              },
              unit_amount: Math.round(item.price * 100), // Stripe uses cents
            },
            quantity: item.quantity,
          };
        }),
        mode: 'payment',
        success_url: `${domain}/checkout/success?orderId=${orderCode}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domain}/checkout/cancel?orderId=${orderCode}`,
        customer_email: user.email as string,
        metadata: {
          orderCode: orderCode.toString(),
        },
      });

      console.log('Stripe Session Created Successfully:', session.id);

      const order = new Order({
        user: user.id,
        orderItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        totalPrice,
        orderCode,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        checkoutUrl: session.url as string,
        stripeSessionId: session.id,
      });

      const savedOrder = await order.save();
      console.log('Order Saved to Database. ID:', savedOrder._id);

      return NextResponse.json({ 
        success: true, 
        orderId: savedOrder._id,
        checkoutUrl: session.url 
      });
    } catch (stripeError: any) {
      console.error('Stripe SDK Error Detail:', stripeError);
      return NextResponse.json({ 
        success: false, 
        error: `Stripe Error: ${stripeError.message}` 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('General API Exception:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    console.log('--- API Order Creation Ended ---');
  }
}

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
