import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'secret'
);

async function isAdmin(req: Request) {
  const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
