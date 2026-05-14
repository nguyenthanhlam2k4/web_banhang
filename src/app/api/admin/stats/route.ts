import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import User from '@/models/User';
import Order from '@/models/Order';
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

export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    
    const [productCount, categoryCount, userCount, orderCount, revenueData, recentProducts, recentUsers, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Product.find().sort({ createdAt: -1 }).limit(5).populate('categories', 'name'),
      User.find().sort({ createdAt: -1 }).limit(5),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name'),
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    return NextResponse.json({
      success: true,
      stats: {
        products: productCount,
        categories: categoryCount,
        users: userCount,
        orders: orderCount,
        revenue: totalRevenue,
      },
      recentProducts,
      recentUsers,
      recentOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
