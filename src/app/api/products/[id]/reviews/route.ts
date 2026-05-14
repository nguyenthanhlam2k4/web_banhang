import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Review from '@/models/Review';
import User from '@/models/User';
import Order from '@/models/Order';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

async function getUser(request: Request) {
  const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

// GET all reviews for a product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const reviews = await Review.find({ product: id }).sort({ createdAt: -1 });

    // Calculate distribution
    const distribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    
    reviews.forEach(review => {
      const r = Math.round(review.rating) as keyof typeof distribution;
      if (distribution[r] !== undefined) {
        distribution[r]++;
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: reviews,
      distribution,
      total: reviews.length
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST a new review
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const tokenPayload = await getUser(request);
    
    if (!tokenPayload) {
      return NextResponse.json({ error: 'Please login to write a review' }, { status: 401 });
    }

    // Fetch full user to get the name
    const user = await User.findById(tokenPayload.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { rating, comment, images, orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if user has purchased the product in THIS specific order and it is delivered
    const order = await Order.findOne({
      _id: orderId,
      user: user._id,
      'orderItems.product': id,
      orderStatus: 'delivered'
    });

    if (!order) {
      return NextResponse.json({ 
        error: 'You can only review products from your delivered orders.' 
      }, { status: 403 });
    }

    // Check if user already reviewed for THIS specific order
    const alreadyReviewed = await Review.findOne({
      user: user._id,
      product: id,
      order: orderId
    });

    if (alreadyReviewed) {
      return NextResponse.json({ error: 'You have already reviewed this product for this order' }, { status: 400 });
    }

    const review = await Review.create({
      name: user.name,
      rating: Number(rating),
      comment,
      images: images || [],
      user: user._id,
      product: id,
      order: orderId,
    });

    // Update product rating
    const reviews = await Review.find({ product: id });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / reviews.length;

    await product.save();

    return NextResponse.json({ success: true, message: 'Review added' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
