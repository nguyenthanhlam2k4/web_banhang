'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const PRODUCTS = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 199.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    category: 'Electronics',
    isNew: true
  },
  {
    id: 2,
    name: 'Minimalist Leather Wallet',
    price: 49.00,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
    category: 'Accessories',
    isNew: false
  },
  {
    id: 3,
    name: 'Mechanical Keyboard Pro',
    price: 159.50,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop',
    category: 'Electronics',
    isNew: true
  },
  {
    id: 4,
    name: 'Smart Designer Lamp',
    price: 89.00,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop',
    category: 'Home',
    isNew: false
  }
];

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Featured <span className="gradient-text">Products</span></h2>
            <p className="text-muted-foreground max-w-lg">
              Explore our top picks of the season. Hand-selected for quality and style.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="ghost" className="group rounded-xl">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group"
            >
              <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-secondary mb-4 premium-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-none px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
                    {product.category}
                  </Badge>
                  {product.isNew && (
                    <Badge className="bg-primary text-primary-foreground border-none px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
                      New Arrival
                    </Badge>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" className="rounded-full h-14 w-14 premium-shadow scale-90 group-hover:scale-100 transition-transform">
                    <ShoppingCart className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 px-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-xs font-bold text-foreground">{product.rating}</span>
                </div>
                <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black">${product.price.toFixed(2)}</p>
                  <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs font-bold hover:bg-primary/10 hover:text-primary">
                    Quick View
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

