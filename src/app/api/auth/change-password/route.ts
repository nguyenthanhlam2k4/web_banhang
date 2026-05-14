import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Get token from cookies
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader
      ?.split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current and new passwords are required' },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Incorrect current password' },
        { status: 401 }
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { message: 'Failed to update password' },
      { status: 500 }
    );
  }
}
