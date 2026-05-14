import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string, reviewId: string }> }
) {
  try {
    await dbConnect();
    const { reviewId } = await params;
    const user = await getUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Please login to vote' }, { status: 401 });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const userId = (user as any).id;
    const voteIndex = review.helpfulVotes.indexOf(userId);

    if (voteIndex === -1) {
      review.helpfulVotes.push(userId);
    } else {
      review.helpfulVotes.splice(voteIndex, 1);
    }

    await review.save();

    return NextResponse.json({ 
      success: true, 
      helpfulVotes: review.helpfulVotes 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
