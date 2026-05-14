'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
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
              <div key={i} className="h-96 rounded-[2.5rem] bg-background border border-border/50 animate-pulse" />
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
              return (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link 
                    href={`/shop?category=${category.slug}`}
                    className="group relative block h-[450px] rounded-[2.5rem] overflow-hidden border border-border/50 transition-all duration-500 premium-shadow hover:-translate-y-2"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <Package className="h-12 w-12 opacity-20" />
                        </div>
                      )}
                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                      <h3 className="text-3xl font-black mb-2 tracking-tight drop-shadow-lg">{category.name}</h3>
                      <p className="text-sm text-white/70 mb-6 line-clamp-2 max-w-[200px] font-medium leading-relaxed">
                        {category.description || t('categoriesSection.fallbackDesc', { name: category.name })}
                      </p>
                      
                      <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:scale-105">
                        {t('categoriesSection.exploreNow')}
                        <ArrowRight className="h-4 w-4" />
                      </div>
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
