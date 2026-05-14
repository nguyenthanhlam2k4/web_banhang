import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

async function getAuthUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: string };
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(authUser.id).populate('wishlist');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ wishlist: user.wishlist || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();
    const user = await User.findById(authUser.id);

    const isWishlisted = user.wishlist.some((id: any) => id.toString() === productId);
    
    if (isWishlisted) {
      user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    return NextResponse.json({ 
      message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: user.wishlist 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
