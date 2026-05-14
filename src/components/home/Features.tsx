'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Zap, Headphones } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Features() {
  const t = useTranslations('Features');

  const FEATURES = [
    {
      title: t('shipping'),
      desc: t('shippingDesc'),
      icon: Truck,
      color: 'text-blue-500'
    },
    {
      title: t('payment'),
      desc: t('paymentDesc'),
      icon: ShieldCheck,
      color: 'text-emerald-500'
    },
    {
      title: t('returns'),
      desc: t('returnsDesc'),
      icon: Zap,
      color: 'text-orange-500'
    },
    {
      title: t('support'),
      desc: t('supportDesc'),
      icon: Headphones,
      color: 'text-violet-500'
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
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

