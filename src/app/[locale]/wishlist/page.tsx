'use client';

import React, { useEffect } from 'react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function WishlistPage() {
  const t = useTranslations('Navbar');
  const ct = useTranslations('Common');
  const st = useTranslations('Shop');
  const { wishlist, isLoading, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest"
              >
                <Heart className="h-3 w-3 fill-current" />
                {t('wishlist')}
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                Sản phẩm <span className="gradient-text">Yêu thích</span>
              </h1>
              <p className="text-muted-foreground max-w-lg text-lg">
                Lưu trữ những sản phẩm cao cấp mà bạn yêu thích. Sẵn sàng để sở hữu chúng bất cứ lúc nào.
              </p>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="group rounded-xl px-8 h-12">
                Tiếp tục mua sắm
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 bg-secondary/10 rounded-[3rem] border-2 border-dashed border-border/50 text-center px-4"
            >
              <div className="p-6 bg-background rounded-full shadow-xl mb-8">
                <Heart className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Danh sách của bạn đang trống</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Hãy bắt đầu khám phá các bộ sưu tập của chúng tôi và thêm những món đồ bạn yêu thích vào danh sách này.
              </p>
              <Link href="/shop">
                <Button className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                  Khám phá ngay
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {wishlist.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* AI Recommendations or Footer Section */}
          {wishlist.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-24 p-12 bg-primary/5 rounded-[3rem] border border-primary/10 flex flex-col items-center text-center gap-6"
            >
              <div className="p-3 bg-primary rounded-2xl">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Hoàn tất bộ sưu tập của bạn?</h3>
              <p className="text-muted-foreground max-w-xl">
                Đừng để những sản phẩm tuyệt vời này chờ đợi quá lâu. Hãy thêm chúng vào giỏ hàng và hoàn tất thanh toán ngay hôm nay.
              </p>
              <Link href="/cart">
                <Button className="rounded-xl px-8 h-12 shadow-lg shadow-primary/20">
                  Xem giỏ hàng của bạn
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
