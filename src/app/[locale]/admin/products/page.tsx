'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AdminProductsPage() {
  const t = useTranslations('Admin');
  const ct = useTranslations('Common');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/products?page=${page}&search=${search}`);
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      }
    } catch (error: any) {
      console.error('Fetch Error:', error.response?.data || error.message);
      toast.error(t('products.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('products.deleteConfirm'))) return;
    try {
      const { data } = await axios.delete(`/api/admin/products/${id}`);
      if (data.success) {
        toast.success(t('products.deleteSuccess'));
        fetchProducts();
      }
    } catch (error: any) {
      toast.error(t('products.deleteError'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t('products.title')}</h1>
          <p className="text-muted-foreground">{t('products.subtitle')}</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" />
            {t('products.addProduct')}
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50 flex flex-col md:flex-row gap-4 items-center justify-between bg-secondary/10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('products.search')}
              className="pl-10 bg-background border-border/50 rounded-xl h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" className="rounded-xl h-11 gap-2 flex-1 md:flex-none">
              <Filter className="h-4 w-4" />
              {t('products.filter')}
            </Button>
            <Button variant="outline" className="rounded-xl h-11 gap-2 flex-1 md:flex-none">
              <ArrowUpDown className="h-4 w-4" />
              {t('products.sort')}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                <th className="px-6 py-4">{t('products.table.product')}</th>
                <th className="px-6 py-4">{t('products.table.category')}</th>
                <th className="px-6 py-4">{t('products.table.price')}</th>
                <th className="px-6 py-4">{t('products.table.stock')}</th>
                <th className="px-6 py-4">{t('products.table.status')}</th>
                <th className="px-6 py-4 text-right">{t('products.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8">
                      <div className="h-12 bg-secondary/50 rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-12 w-12 opacity-20" />
                      <p className="font-bold">{t('products.noProducts')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-secondary/10 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-secondary/50 overflow-hidden border border-border/50 flex-shrink-0">
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">SKU: {product._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.categories && product.categories.length > 0 ? (
                          product.categories.map((cat: any) => (
                            <Badge key={cat._id} variant="outline" className="rounded-lg bg-secondary/50 border-none font-bold text-[10px]">
                              {cat.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground italic text-xs">{ct('all')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-sm">${product.price.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`} />
                        <span className="text-sm font-bold">{product.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.featured ? (
                        <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase">
                          <CheckCircle2 className="h-3 w-3" /> {t('products.status.featured')}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-black uppercase">
                          <XCircle className="h-3 w-3" /> {t('products.status.standard')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-40 rounded-xl p-2 shadow-xl border-border/50">
                          <DropdownMenuItem
                            className="rounded-lg cursor-pointer"
                            render={
                              <Link href={`/admin/products/${product._id}`} className="flex items-center w-full">
                                <Edit className="h-4 w-4 mr-2" /> {ct('edit')}
                              </Link>
                            }
                          />
                          <DropdownMenuItem 
                            className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> {ct('delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="p-6 border-t border-border/50 flex items-center justify-between bg-secondary/5">
            <p className="text-sm text-muted-foreground">
              {t('products.showing')} <span className="font-bold text-foreground">{(page - 1) * 10 + 1}</span> {t('products.to')} <span className="font-bold text-foreground">{Math.min(page * 10, pagination.total)}</span> {t('products.of')} <span className="font-bold text-foreground">{pagination.total}</span> {t('products.title').toLowerCase()}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-9 font-bold"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                {t('products.prev')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-9 font-bold"
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                {t('products.next')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
