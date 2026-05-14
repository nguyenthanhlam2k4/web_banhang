'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import axios from 'axios';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { useTranslations } from 'next-intl';

export function FeaturedProducts() {
  const t = useTranslations('Shop');
  const ct = useTranslations('Common');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/products?featured=true&limit=4');
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t('featuredTitle') || 'Featured'} <span className="gradient-text">{t('featuredSubtitle') || 'Products'}</span></h2>
            <p className="text-muted-foreground max-w-lg">
              {t('featuredDesc') || 'Explore our top picks of the season. Hand-selected for quality and style.'}
            </p>
          </div>
          <Link href="/shop">
            <Button variant="ghost" className="group rounded-xl">
              {t('viewAllProducts') || 'View All Products'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-secondary/10 rounded-3xl border-2 border-dashed border-border/50">
            <PackageX className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium">{t('noFeaturedProducts') || 'No featured products available at the moment.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


