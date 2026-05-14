'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Layers,
  Loader2,
  Save,
  X,
  ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useTranslations } from 'next-intl';

export default function AdminCategoriesPage() {
  const t = useTranslations('Admin');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', image: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/categories');
      if (data.success) setCategories(data.data);
    } catch (error: any) {
      toast.error(t('categories.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name, 
        slug: category.slug, 
        image: category.image || '' 
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', image: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug) {
      toast.error(t('categories.fillAllFields'));
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        const { data } = await axios.patch(`/api/admin/categories/${editingCategory._id}`, formData);
        if (data.success) {
          toast.success(t('categories.updateSuccess'));
          fetchCategories();
          setIsDialogOpen(false);
        }
      } else {
        const { data } = await axios.post('/api/admin/categories', formData);
        if (data.success) {
          toast.success(t('categories.createSuccess'));
          fetchCategories();
          setIsDialogOpen(false);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('categories.deleteConfirmDetail'))) return;
    try {
      const { data } = await axios.delete(`/api/admin/categories/${id}`);
      if (data.success) {
        toast.success(t('categories.deleteSuccess'));
        fetchCategories();
      }
    } catch (error: any) {
      toast.error(t('categories.deleteError'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t('categories.title')}</h1>
          <p className="text-muted-foreground">{t('categories.subtitle')}</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" />
          {t('categories.addCategory')}
        </Button>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                <th className="px-6 py-4">{t('categories.table.image')}</th>
                <th className="px-6 py-4">{t('categories.table.name')}</th>
                <th className="px-6 py-4">{t('categories.table.slug')}</th>
                <th className="px-6 py-4 text-right">{t('categories.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8"><div className="h-8 bg-secondary/50 rounded-xl" /></td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Layers className="h-12 w-12 opacity-20" />
                      <p className="font-bold">{t('categories.noCategories')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-secondary/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-xl bg-secondary/50 overflow-hidden border border-border/50">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-6 w-6 opacity-20" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold">{cat.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-secondary/50 px-2 py-1 rounded-md text-primary font-bold">/{cat.slug}</code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-xl hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleOpenDialog(cat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(cat._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black">{editingCategory ? t('categories.editCategory') : t('categories.addCategory')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('categories.categoryImage')}</label>
              <ImageUpload 
                value={formData.image ? [formData.image] : []}
                onChange={(urls) => setFormData({ ...formData, image: urls[0] })}
                onRemove={() => setFormData({ ...formData, image: '' })}
                maxFiles={1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('categories.categoryName')}</label>
              <Input 
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ 
                    ...formData,
                    name: val, 
                    slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
                  });
                }}
                placeholder="e.g. Electronics"
                className="rounded-xl h-12 bg-secondary/20 border-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('categories.urlSlug')}</label>
              <Input 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. electronics"
                className="rounded-xl h-12 bg-secondary/20 border-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <DialogFooter className="mt-10 gap-3 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12 font-bold px-6">{t('categories.cancel')}</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="rounded-xl h-12 px-8 font-bold gap-2 shadow-lg shadow-primary/20">
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {editingCategory ? t('categories.updateCategory') : t('categories.createCategory')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
