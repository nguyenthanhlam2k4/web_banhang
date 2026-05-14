'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCcw, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
            <div className="relative p-6 bg-red-500 rounded-full shadow-2xl shadow-red-500/40">
              <XCircle className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Payment Cancelled</h1>
          <p className="text-muted-foreground text-lg">
            Don't worry, you haven't been charged. Your order was not completed.
          </p>
        </div>

        <div className="p-6 bg-secondary/20 rounded-3xl border border-border/50 text-sm font-medium text-muted-foreground italic">
          "Something went wrong with the payment or you chose to cancel. You can try again or check your cart."
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/checkout">
            <Button className="w-full rounded-2xl h-14 font-black gap-2 shadow-xl shadow-primary/20">
              <RefreshCcw className="h-5 w-5" />
              Try Again
            </Button>
          </Link>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/cart">
              <Button variant="outline" className="w-full rounded-2xl h-14 font-bold gap-2">
                <ShoppingCart className="h-5 w-5" />
                Back to Cart
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="ghost" className="w-full rounded-2xl h-14 font-bold gap-2">
                <ArrowLeft className="h-5 w-5" />
                Shop More
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
