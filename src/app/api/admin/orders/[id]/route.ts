import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Review from '@/models/Review';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

async function isAdmin(request: Request) {
  const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === 'admin';
  } catch (error) {
    return false;
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { payload }: any = await jwtVerify(token, JWT_SECRET);
    await dbConnect();
    const { id } = await params;
    
    const order = await Order.findById(id).populate('user', 'name email');
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user is admin or the owner of the order
    if (payload.role !== 'admin' && payload.id !== order.user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Convert order to object to add virtual fields
    const orderObj = order.toObject();

    // Check which items have been reviewed by this user FOR THIS ORDER
    const reviews = await Review.find({
      user: payload.id,
      order: id,
      product: { $in: order.orderItems.map((item: any) => item.product) }
    });

    const reviewedProductIds = new Set(reviews.map(r => r.product.toString()));

    orderObj.orderItems = orderObj.orderItems.map((item: any) => ({
      ...item,
      isReviewed: reviewedProductIds.has(item.product.toString())
    }));

    return NextResponse.json({ success: true, data: orderObj });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
