import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function GET(req: Request) {
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
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
}

export async function PATCH(req: Request) {
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
    
    const body = await req.json();
    const { name, avatar } = body;

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Update failed' },
      { status: 500 }
    );
  }
}

// Support PUT as well for compatibility
export async function PUT(req: Request) {
  return PATCH(req);
}
