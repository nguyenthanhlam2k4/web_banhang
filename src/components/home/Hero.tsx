'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-12 lg:pt-32 lg:pb-24">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 h-full w-full opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20"
            >
              <Sparkles className="h-4 w-4" />
              New Collection 2026 is Live
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
            >
              Experience <br />
              <span className="gradient-text">Premium Shopping</span> <br />
              Like Never Before
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Discover our curated collection of high-end lifestyle products. From minimalist electronics to handcrafted fashion, we bring you the pinnacle of quality and design.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link href="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl group premium-shadow">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/categories" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl bg-background/50">
                  Explore Categories
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 border-t border-border/50 lg:border-none"
            >
              {[
                { label: 'Happy Customers', value: '50k+' },
                { label: 'Premium Products', value: '2k+' },
                { label: 'Store Locations', value: '12' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center lg:text-left">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 relative w-full max-w-lg lg:max-w-none aspect-square lg:aspect-auto h-[400px] lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-violet-500/20 rounded-[3rem] rotate-3 blur-2xl" />
            <div className="relative h-full w-full bg-secondary rounded-[3rem] border border-border/50 overflow-hidden premium-shadow group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">Featured Item</p>
                    <h3 className="text-xl font-bold">Premium Minimal Watch</h3>
                    <p className="text-sm text-muted-foreground">$299.00</p>
                  </div>
                  <Button size="icon" className="rounded-full h-12 w-12">
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 h-24 w-24 bg-background rounded-2xl border border-border/50 p-4 premium-shadow flex items-center justify-center"
            >
              <div className="h-full w-full bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
