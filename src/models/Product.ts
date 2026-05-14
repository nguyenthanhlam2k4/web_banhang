import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  brand: string;
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  tags: string[];
  specifications: {
    name: string;
    value: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      default: 0,
    },
    comparePrice: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock amount'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    specifications: [
      {
        name: String,
        value: String,
      },
    ],
  },
  { timestamps: true }
);

// Add index for search
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
