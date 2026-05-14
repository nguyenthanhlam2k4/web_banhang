'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface FilterSidebarProps {
  categories: any[];
  onClose?: () => void;
}

export function FilterSidebar({ categories, onClose }: FilterSidebarProps) {
  const t = useTranslations('Shop');
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset page on filter change
    params.delete('page');
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/shop');
    if (onClose) onClose();
  };

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          {t('categories')}
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => updateFilters({ category: '' })}
            className={`flex items-center justify-between p-2 rounded-xl text-sm transition-all ${
              !currentCategory ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-secondary/50'
            }`}
          >
            <span>{t('allCategories')}</span>
            {!currentCategory && <ChevronRight className="h-4 w-4" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilters({ category: cat.slug })}
              className={`flex items-center justify-between p-2 rounded-xl text-sm transition-all ${
                currentCategory === cat.slug ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-secondary/50'
              }`}
            >
              <span>{cat.name}</span>
              {currentCategory === cat.slug && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">{t('priceRange')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground ml-1">{t('min')} ($)</label>
            <Input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
              className="bg-secondary/30 border-none rounded-xl h-10"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground ml-1">{t('max')} ($)</label>
            <Input
              type="number"
              placeholder="1000+"
              value={maxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
              className="bg-secondary/30 border-none rounded-xl h-10"
            />
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">{t('sortBy')}</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: t('sort.newest'), value: 'newest' },
            { label: t('sort.price_asc'), value: 'price_asc' },
            { label: t('sort.price_desc'), value: 'price_desc' },
            { label: t('sort.rating'), value: 'rating' },
          ].map((option) => (
            <Badge
              key={option.value}
              variant={currentSort === option.value ? 'default' : 'secondary'}
              className="cursor-pointer px-3 py-1.5 rounded-full hover:scale-105 transition-transform"
              onClick={() => updateFilters({ sort: option.value })}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear All */}
      <Button
        variant="outline"
        className="w-full rounded-xl h-12 border-dashed border-2"
        onClick={clearFilters}
      >
        {t('clearFilters')}
      </Button>
    </div>
  );
}
