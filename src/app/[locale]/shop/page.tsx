'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import axios from 'axios';
import { Filter, Search, SlidersHorizontal, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from 'next-intl';

function ShopContent() {
  const t = useTranslations('Shop');
  const ct = useTranslations('Common');
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryString = searchParams.toString();
      const { data } = await axios.get(`/api/products?${queryString}`);
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar categories={categories} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{pagination?.total || 0}</span>
              <span>{t('productsFound')}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  className="pl-10 bg-secondary/30 border-none rounded-xl h-11"
                  defaultValue={searchParams.get('search') || ''}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                      const params = new URLSearchParams(searchParams.toString());
                      if (e.target.value) params.set('search', e.target.value);
                      else params.delete('search');
                      window.location.href = `/shop?${params.toString()}`;
                    }
                  }}
                />
              </div>

              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden rounded-xl h-11 w-11">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-xs">
                  <SheetHeader className="mb-6">
                    <SheetTitle>{t('filters')}</SheetTitle>
                  </SheetHeader>
                  <FilterSidebar categories={categories} />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 bg-secondary/10 rounded-3xl border-2 border-dashed border-border/50">
              <div className="p-6 bg-secondary/30 rounded-full">
                <PackageX className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-xl">{t('noProducts')}</h3>
                <p className="text-muted-foreground max-w-xs">
                  {t('noProductsDesc')}
                </p>
              </div>
              <Link href="/shop">
                <Button 
                  variant="outline" 
                  className="rounded-xl px-8"
                >
                  {t('clearFilters')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 pt-8">
              {[...Array(pagination.pages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === pagination.page;
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? 'default' : 'outline'}
                    className={`h-11 w-11 rounded-xl font-bold transition-all ${
                      isActive ? 'shadow-lg shadow-primary/20 scale-110' : 'hover:scale-105'
                    }`}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('page', pageNum.toString());
                      window.location.href = `/shop?${params.toString()}`;
                    }}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const ct = useTranslations('Common');
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      </div>
    }>
      <Navbar />
      <ShopContent />
      <Footer />
    </Suspense>
  );
}

