'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import axios from 'axios';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Minus,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/product/ProductCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIRecommendation } from '@/components/ai/AIRecommendation';
import { ReviewSection } from '@/components/product/ReviewSection';
import { useTranslations } from 'next-intl';

export default function ProductDetailPage() {
  const t = useTranslations('Product');
  const commonT = useTranslations('Common');
  const shopT = useTranslations('Shop');
  const ft = useTranslations('Features');

  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${slug}`);
      if (data.success) {
        setProduct(data.data);
        fetchRelatedProducts(data.data.category?._id);
      }
    } catch (error) {
      console.error('Failed to fetch product');
      toast.error('Could not load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId: string) => {
    if (!categoryId) return;
    try {
      const { data } = await axios.get(`/api/products?category=${categoryId}`);
      if (data.success) {
        setRelatedProducts(data.data.filter((p: any) => p.slug !== slug).slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to fetch related products');
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(t('addedToCart', { name: product.name, quantity }) || `Added ${quantity} ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-secondary/30 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-4 w-24 bg-secondary/30 rounded" />
            <div className="h-10 w-3/4 bg-secondary/30 rounded" />
            <div className="h-6 w-32 bg-secondary/30 rounded" />
            <div className="h-32 w-full bg-secondary/30 rounded" />
            <div className="h-12 w-full bg-secondary/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Images */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-secondary/20 border border-border/50 group"
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {product.comparePrice > product.price && (
                <Badge variant="destructive" className="absolute top-6 left-6 px-3 py-1.5 rounded-xl font-bold text-sm shadow-xl">
                  -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% {t('off') || 'Off'}
                </Badge>
              )}
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative flex-shrink-0 w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-primary shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {product.categories?.map((cat: any) => (
                    <Badge key={cat._id} variant="outline" className="rounded-full px-4 py-1 border-primary/20 bg-primary/5 text-primary font-bold">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full border border-border/50 hover:bg-secondary/50">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full border border-border/50 hover:bg-secondary/50">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.numReviews} {t('reviews.label')})</span>
                </div>
                <div className="h-4 w-px bg-border/50" />
                <div className="flex items-center gap-1.5 text-sm">
                  <div className={`h-2.5 w-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-medium text-muted-foreground">
                    {product.stock > 0 ? `${t('inStock')} (${product.stock})` : t('outOfStock')}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.comparePrice > product.price && (
                  <span className="text-2xl text-muted-foreground line-through decoration-destructive/40">
                    ${product.comparePrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{t('freeShippingThreshold') || 'Free shipping on all orders over $500'}</p>
            </div>

            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Specifications */}
            {product.specifications?.length > 0 && (
              <div className="grid grid-cols-2 gap-6 p-6 bg-secondary/20 rounded-3xl border border-border/50">
                {product.specifications.map((spec: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{spec.name}</p>
                    <p className="font-bold">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center border-2 border-border/50 rounded-2xl p-1 bg-card shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-10 w-10 hover:bg-secondary/50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-black text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-10 w-10 hover:bg-secondary/50"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{t('onlyLeft', { count: product.stock }) || `Only ${product.stock} items left in stock!`}</p>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 rounded-2xl h-16 text-lg font-bold shadow-2xl shadow-primary/30 group"
                >
                  <ShoppingCart className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                  {t('addToCart')}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-2xl h-16 text-lg font-bold border-2"
                  disabled={product.stock === 0}
                  onClick={handleBuyNow}
                >
                  {t('buyNow') || 'Buy Now'}
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <Truck className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-tighter">{ft('shipping')}</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-tighter">{ft('payment')}</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-tighter">{ft('returns')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Smart Advice Section */}
        <div className="mt-20">
          <AIRecommendation 
            currentProductId={product._id} 
            category={product.categories?.[0]?._id} 
          />
        </div>

        {/* Reviews Section */}
        <div className="mt-32 pt-32 border-t border-border/50">
          <ReviewSection 
            productId={product._id} 
            initialRating={product.rating} 
            initialNumReviews={product.numReviews} 
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 space-y-12">
            <div className="flex items-end justify-between">
              <div className="space-y-4">
                <Badge className="rounded-full px-4 py-1">{commonT('discoverMore') || 'Discover More'}</Badge>
                <h2 className="text-4xl font-black tracking-tight">{t('relatedProducts') || 'Related Products'}</h2>
              </div>
              <Link href="/shop" className="group flex items-center gap-2 font-bold text-primary hover:translate-x-2 transition-all">
                {shopT('viewAll') || 'View All'} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

