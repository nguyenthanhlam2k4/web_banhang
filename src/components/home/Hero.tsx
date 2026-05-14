'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

export function Hero() {
  const t = useTranslations('Hero');
  const addItem = useCartStore((state) => state.addItem);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('/api/products?featured=true&limit=5');
        if (data.success && data.data.length > 0) {
          setFeaturedProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredProducts]);

  const currentProduct = featuredProducts[currentIndex];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} đã được thêm vào giỏ hàng`);
  };

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
              {t('badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
            >
              {t('title')} <br />
              <span className="gradient-text">{t('titleGradient')}</span> <br />
              {t('titleSuffix')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t('description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link href="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl group premium-shadow">
                  {t('shopNow')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/categories" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl bg-background/50">
                  {t('explore')}
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
                { label: t('stats.customers'), value: '50k+' },
                { label: t('stats.products'), value: '2k+' },
                { label: t('stats.locations'), value: '12' },
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
            className="flex-1 relative w-full max-w-lg lg:max-w-none aspect-square lg:aspect-auto h-[500px] lg:h-[650px]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-violet-500/20 rounded-[3rem] rotate-3 blur-2xl" />
            <div className="relative h-full w-full bg-secondary rounded-[3rem] border border-border/50 overflow-hidden premium-shadow group">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProduct?._id || 'fallback'}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${currentProduct?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'})` 
                  }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProduct?._id || 'info-fallback'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary mb-1">{t('featured')}</p>
                      <h3 className="text-xl font-bold truncate text-white">
                        {currentProduct?.name || t('watchTitle')}
                      </h3>
                      <p className="text-sm text-white/80">
                        {currentProduct ? `$${currentProduct.price.toLocaleString()}` : '$299.00'}
                      </p>
                    </div>
                    {currentProduct && (
                      <Button 
                        size="icon" 
                        className="rounded-full h-12 w-12 flex-shrink-0 shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
                        onClick={(e) => handleAddToCart(e, currentProduct)}
                      >
                        <ShoppingBag className="h-5 w-5" />
                      </Button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 h-24 w-24 bg-background rounded-2xl border border-border/50 p-4 premium-shadow flex items-center justify-center z-10"
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


