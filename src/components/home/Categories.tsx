'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Laptop, Watch, Shirt, Home, Package } from 'lucide-react';
import { Link } from '@/i18n/routing';
import axios from 'axios';
import { useTranslations } from 'next-intl';

export function Categories() {
  const t = useTranslations('Shop');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      if (data.success) {
        setCategories(data.data.slice(0, 4)); // Show first 4
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get random icon if none provided
  const getIcon = (idx: number) => {
    const icons = [Laptop, Watch, Shirt, Home];
    return icons[idx % icons.length];
  };

  const colors = [
    'bg-blue-500/10 text-blue-500',
    'bg-orange-500/10 text-orange-500',
    'bg-pink-500/10 text-pink-500',
    'bg-emerald-500/10 text-emerald-500',
  ];

  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t('categoriesSection.title')} <span className="gradient-text">{t('categoriesSection.titleGradient')}</span></h2>
            <p className="text-muted-foreground max-w-lg">
              {t('categoriesSection.subtitle')}
            </p>
          </div>
          <Link href="/categories" className="group flex items-center gap-2 font-bold text-primary hover:translate-x-2 transition-all">
            {t('categoriesSection.viewAll')} <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 rounded-[2.5rem] bg-background border border-border/50 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-background/50 rounded-[2.5rem] border-2 border-dashed border-border">
            <Package className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">{t('categoriesSection.noCategories')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => {
              const Icon = getIcon(idx);
              return (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link 
                    href={`/shop?category=${category.slug}`}
                    className="group block p-8 rounded-[2rem] bg-background border border-border/50 hover:border-primary/50 transition-all duration-300 premium-shadow hover:-translate-y-2"
                  >
                    <div className={`w-16 h-16 rounded-2xl ${colors[idx % colors.length]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-1 line-clamp-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description || t('categoriesSection.fallbackDesc', { name: category.name })}</p>
                    <div className="flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all">
                      {t('categoriesSection.exploreNow')}
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
