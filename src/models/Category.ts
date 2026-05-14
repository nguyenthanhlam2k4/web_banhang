import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
