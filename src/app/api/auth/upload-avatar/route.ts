import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(request: Request) {
  try {
    // Get token from cookies
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader
      ?.split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<NextResponse>((resolve) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'auto', 
          folder: 'ecommerce_avatars',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            resolve(NextResponse.json({ error: error.message }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ success: true, url: result?.secure_url }));
          }
        }
      ).end(buffer);
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
