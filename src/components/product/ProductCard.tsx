'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`Added ${product.name} to cart`);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    await toggleWishlist(product._id);
  };

  const isLiked = isInWishlist(product._id);

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <Badge variant="destructive" className="rounded-lg px-2 py-1 font-bold">
            -{discount}%
          </Badge>
        )}
        {product.featured && (
          <Badge className="bg-primary text-primary-foreground rounded-lg px-2 py-1 font-bold">
            Featured
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
        <Button 
          size="icon" 
          variant="secondary" 
          className={cn(
            "rounded-full shadow-lg transition-all duration-300",
            isLiked ? "bg-primary text-white scale-110" : "hover:bg-primary hover:text-white"
          )}
          onClick={handleWishlist}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
        </Button>
        <Link href={`/shop/${product.slug}`}>
          <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Image */}
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {product.categories?.[0]?.name || product.brand}
          </p>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xl font-black text-primary">
              ${product.price.toLocaleString()}
            </span>
            {product.comparePrice > product.price && (
              <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                ${product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            size="icon"
            className="rounded-xl h-11 w-11 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
