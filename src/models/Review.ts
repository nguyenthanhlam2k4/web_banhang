import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  commentReply?: string;
  replyAt?: Date;
  images?: string[];
  helpfulVotes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    commentReply: {
      type: String,
    },
    replyAt: {
      type: Date,
    },
    images: {
      type: [String],
      default: [],
    },
    helpfulVotes: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Review;
}

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
