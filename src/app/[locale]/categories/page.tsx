'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Package } from 'lucide-react';
import { Link } from '@/i18n/routing';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

export default function CategoriesPage() {
  const t = useTranslations('Shop');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen bg-background">
        {/* Header Section */}
        <section className="relative py-20 bg-secondary/10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
          <div className="container relative mx-auto px-4 text-center space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black tracking-tight"
            >
              {t('explore')}
            </motion.h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t('categoriesDesc')}
            </p>
            
            <div className="max-w-md mx-auto relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={t('searchCategoriesPlaceholder')}
                className="pl-12 h-14 rounded-2xl bg-background border-border/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-64 rounded-[2.5rem] bg-secondary/20 animate-pulse" />
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-32 space-y-4">
                <div className="w-20 h-20 bg-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold">{t('noCategoriesFound')}</h3>
                <p className="text-muted-foreground">{t('noCategoriesDesc')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCategories.map((category, idx) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link 
                      href={`/shop?category=${category.slug}`}
                      className="group relative block h-80 rounded-[2.5rem] overflow-hidden bg-card border border-border/50 hover:border-primary/40 transition-all duration-500 premium-shadow hover:-translate-y-2"
                    >
                      {/* Image Background */}
                      <div className="absolute inset-0">
                        <img 
                          src={category.image || `https://source.unsplash.com/800x600/?${category.name}`} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                        <h3 className="text-2xl font-black mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{category.name}</h3>
                        <p className="text-sm text-white/70 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          {category.description || t('categoriesSection.fallbackDesc', { name: category.name })}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-bold text-primary-foreground bg-primary px-4 py-2 rounded-xl self-start opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 shadow-xl">
                          {t('viewProducts')}
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

