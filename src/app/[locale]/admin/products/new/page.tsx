'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Plus, 
  Trash2,
  Info,
  Layers,
  Tag,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function NewProductPage() {
  const t = useTranslations('Admin.productForm');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<{ id: string; name: string; value: string }[]>([]);

  const productSchema = z.object({
    name: z.string().min(3, t('nameRequired')),
    slug: z.string().min(3, t('slugRequired')),
    description: z.string().min(10, t('descRequired')),
    price: z.coerce.number().min(0, t('pricePositive')),
    comparePrice: z.coerce.number().optional(),
    categories: z.array(z.string()).min(1, t('categoryRequired')),
    brand: z.string().min(1, t('brandRequired')),
    stock: z.coerce.number().min(0, t('stockNegative')),
    featured: z.boolean().default(false),
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      comparePrice: 0,
      categories: [],
      brand: '',
      stock: 0,
      featured: false,
    }
  });

  const name = watch('name');

  useEffect(() => {
    if (name) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [name, setValue]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { id: Math.random().toString(36).substr(2, 9), name: '', value: '' }]);
  };

  const updateSpecification = (id: string, field: 'name' | 'value', val: string) => {
    setSpecifications(specifications.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const removeSpecification = (id: string) => {
    setSpecifications(specifications.filter((s) => s.id !== id));
  };

  const onSubmit = async (values: any) => {
    if (images.length === 0) {
      toast.error(t('uploadImageError'));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...values,
        images,
        specifications: specifications.filter(s => s.name && s.value),
      };

      const { data } = await axios.post('/api/admin/products', payload);
      if (data.success) {
        toast.success(t('createSuccess'));
        router.push('/admin/products');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon" className="rounded-xl border border-border/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{t('createTitle')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          disabled={loading}
          className="rounded-xl px-8 h-12 gap-2 shadow-xl shadow-primary/20"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {t('publish')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">{t('generalInfo')}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('productName')}</Label>
                <Input 
                  {...register('name')} 
                  placeholder="e.g. Premium Wireless Headphones"
                  className="rounded-xl h-12 bg-secondary/20 border-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && <p className="text-xs text-destructive font-bold">{errors.name.message as string}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('slug')}</Label>
                  <Input 
                    {...register('slug')} 
                    placeholder="premium-wireless-headphones"
                    className="rounded-xl h-12 bg-secondary/20 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('brand')}</Label>
                  <Input 
                    {...register('brand')} 
                    placeholder="Apple, Sony, etc."
                    className="rounded-xl h-12 bg-secondary/20 border-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('description')}</Label>
                <Textarea 
                  {...register('description')} 
                  placeholder={t('descriptionPlaceholder')}
                  className="rounded-xl min-h-[150px] bg-secondary/20 border-none resize-none focus:ring-1 focus:ring-primary"
                />
                {errors.description && <p className="text-xs text-destructive font-bold">{errors.description.message as string}</p>}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">{t('media')}</h3>
            </div>
            <ImageUpload 
              value={images}
              onChange={(urls) => setImages(urls)}
              onRemove={(url) => setImages(images.filter(i => i !== url))}
            />
          </div>

          <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">{t('specifications')}</h3>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={addSpecification} className="rounded-lg text-primary font-bold">
                <Plus className="h-4 w-4 mr-2" /> {t('addSpec')}
              </Button>
            </div>

            <div className="space-y-4">
              {specifications.map((spec) => (
                <div key={spec.id} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Input 
                      placeholder={t('specName')} 
                      value={spec.name}
                      onChange={(e) => updateSpecification(spec.id, 'name', e.target.value)}
                      className="rounded-xl h-11 bg-secondary/20 border-none"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input 
                      placeholder={t('specValue')} 
                      value={spec.value}
                      onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
                      className="rounded-xl h-11 bg-secondary/20 border-none"
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeSpecification(spec.id)}
                    className="h-11 w-11 text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              {specifications.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 italic">{t('noSpecs')}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">{t('pricing')}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('basePrice')}</Label>
                <Input 
                  {...register('price')} 
                  type="number"
                  placeholder="0.00"
                  className="rounded-xl h-12 bg-secondary/20 border-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('comparePrice')}</Label>
                <Input 
                  {...register('comparePrice')} 
                  type="number"
                  placeholder="0.00"
                  className="rounded-xl h-12 bg-secondary/20 border-none"
                />
              </div>
              <div className="pt-4 flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-bold text-sm">{t('featured')}</Label>
                  <p className="text-xs text-muted-foreground">{t('featuredDesc')}</p>
                </div>
                <Switch 
                  checked={watch('featured')}
                  onCheckedChange={(checked) => setValue('featured', checked)}
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">{t('organization')}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('category')}</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-4 bg-secondary/20 rounded-xl border border-border/50">
                  {categories.map((cat) => (
                    <div key={cat._id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`cat-${cat._id}`}
                        value={cat._id}
                        checked={(watch('categories') || []).includes(cat._id)}
                        onChange={(e) => {
                          const currentCats = watch('categories') || [];
                          if (e.target.checked) {
                            setValue('categories', [...currentCats, cat._id]);
                          } else {
                            setValue('categories', currentCats.filter((id: string) => id !== cat._id));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`cat-${cat._id}`} className="text-sm font-medium cursor-pointer">
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.categories && <p className="text-xs text-destructive font-bold">{errors.categories.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('inventory')}</Label>
                <Input 
                  {...register('stock')} 
                  type="number"
                  placeholder="0"
                  className="rounded-xl h-12 bg-secondary/20 border-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
