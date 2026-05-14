import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { jwtVerify } from 'jose';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

export async function POST(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<NextResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'ecommerce_products' },
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
