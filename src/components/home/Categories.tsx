'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, Watch, Shirt, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { name: 'Electronics', icon: Laptop, color: 'bg-blue-500/10 text-blue-500', count: '120+ Products' },
  { name: 'Accessories', icon: Watch, color: 'bg-orange-500/10 text-orange-500', count: '85+ Products' },
  { name: 'Fashion', icon: Shirt, color: 'bg-pink-500/10 text-pink-500', count: '240+ Products' },
  { name: 'Living', icon: Home, color: 'bg-emerald-500/10 text-emerald-500', count: '90+ Products' },
];

export function Categories() {
  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Shop by <span className="gradient-text">Category</span></h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Find exactly what you&apos;re looking for with our curated collections across all departments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link 
                  href={`/shop?category=${category.name.toLowerCase()}`}
                  className="group block p-8 rounded-[2rem] bg-background border border-border/50 hover:border-primary/50 transition-all duration-300 premium-shadow hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.count}</p>
                  <div className="flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all">
                    Explore Now
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
