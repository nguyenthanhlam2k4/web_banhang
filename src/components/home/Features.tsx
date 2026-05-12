'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Zap, Headphones } from 'lucide-react';

const FEATURES = [
  {
    title: 'Free Shipping',
    desc: 'On all orders over $100',
    icon: Truck,
    color: 'text-blue-500'
  },
  {
    title: 'Secure Payment',
    desc: '100% secure payment methods',
    icon: ShieldCheck,
    color: 'text-emerald-500'
  },
  {
    title: 'Fast Delivery',
    desc: 'Deliver within 24-48 hours',
    icon: Zap,
    color: 'text-orange-500'
  },
  {
    title: '24/7 Support',
    desc: 'Dedicated customer support',
    icon: Headphones,
    color: 'text-violet-500'
  }
];

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 rounded-2xl bg-secondary/50 shrink-0">
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div>
                  <h4 className="font-bold">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
