import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  image: string;
  price: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  notes?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  orderStatus: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  orderCode: number; // For reference
  checkoutUrl?: string;
  stripeSessionId?: string;
}

const orderSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      notes: { type: String },
    },
    paymentMethod: { type: String, required: true, default: 'PayOS' },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    orderCode: { type: Number, required: true, unique: true },
    checkoutUrl: { type: String },
    stripeSessionId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
