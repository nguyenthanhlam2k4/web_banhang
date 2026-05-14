'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderId');
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    clearCart();
    if (orderCode) {
      fetchOrderDetails();
    }
  }, [orderCode]);

  const fetchOrderDetails = async () => {
    try {
      const sessionId = searchParams.get('session_id');
      const { data } = await axios.get(`/api/orders/verify?code=${orderCode}${sessionId ? `&session_id=${sessionId}` : ''}`);
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to verify order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
            <div className="relative p-6 bg-emerald-500 rounded-full shadow-2xl shadow-emerald-500/40">
              <CheckCircle2 className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Payment Successful!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-8 bg-secondary/20 rounded-3xl border border-border/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : order ? (
          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm text-left space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Package className="h-4 w-4 text-primary" />
                Order #{order.orderCode}
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-black uppercase">Paid</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Customer</span>
                <span className="font-bold">{order.shippingAddress.fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Total Amount</span>
                <span className="font-black text-primary">${order.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Payment Method</span>
                <span className="font-bold">Stripe (Card Payment)</span>
              </div>
            </div>

            <div className="p-4 bg-secondary/50 rounded-2xl border border-border/50">
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Shipping to</p>
              <p className="text-sm font-bold leading-relaxed">
                {order.shippingAddress.address}, {order.shippingAddress.district}, {order.shippingAddress.city}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-secondary/20 rounded-3xl border border-border/50">
            <p className="font-bold text-sm">Order code: #{orderCode}</p>
            <p className="text-xs text-muted-foreground mt-1">We're updating your order status shortly.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/orders" className="flex-1">
            <Button variant="outline" className="w-full rounded-2xl h-14 font-bold gap-2">
              <ShoppingBag className="h-5 w-5" />
              View My Orders
            </Button>
          </Link>
          <Link href="/shop" className="flex-1">
            <Button className="w-full rounded-2xl h-14 font-black gap-2 shadow-xl shadow-primary/20">
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
