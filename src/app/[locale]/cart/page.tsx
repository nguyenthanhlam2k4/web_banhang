'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from 'next-intl';

export default function CartPage() {
  const t = useTranslations('Cart');
  const commonT = useTranslations('Common');
  const shopT = useTranslations('Shop');
  const authT = useTranslations('Auth');
  const ft = useTranslations('Features');

  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 bg-secondary/20 rounded-full"
        >
          <ShoppingBag className="h-24 w-24 text-muted-foreground/50" />
        </motion.div>
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight">{t('emptyTitle')}</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            {t('emptyDesc')}
          </p>
        </div>
        <Link href="/shop">
          <Button className="rounded-2xl h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/30">
            <ArrowLeft className="mr-2 h-5 w-5" />
            {authT('backToStore')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-12">
          {t('title')} <span className="gradient-text">{t('subtitle')}</span>
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
              <div className="hidden md:grid grid-cols-6 gap-4 p-6 bg-secondary/30 text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                <div className="col-span-3">{t('headerProduct')}</div>
                <div className="text-center">{commonT('price')}</div>
                <div className="text-center">{t('headerQuantity')}</div>
                <div className="text-right">{commonT('total')}</div>
              </div>

              <div className="divide-y divide-border/50">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-6 grid grid-cols-1 md:grid-cols-6 gap-6 items-center hover:bg-secondary/10 transition-colors group"
                    >
                      <div className="col-span-3 flex gap-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary/30 border border-border/50">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col justify-center space-y-1">
                          <Link href={`/shop/${item.slug}`}>
                            <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{t('premiumEdition')}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center text-xs font-bold text-destructive hover:opacity-70 transition-opacity pt-2"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {commonT('remove') || 'Remove'}
                          </button>
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="font-bold text-lg">${item.price.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-center">
                        <div className="flex items-center border-2 border-border/50 rounded-xl p-1 bg-card shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:text-primary transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:text-primary transition-colors disabled:opacity-30"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-black text-primary">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
              <Link href="/shop">
                <Button variant="ghost" className="rounded-xl font-bold group">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  {t('continueShopping')}
                </Button>
              </Link>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-xs font-bold uppercase">{t('secureCheckout')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-xs font-bold uppercase">{t('freeGlobalShipping')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="space-y-8">
            <div className="bg-card rounded-3xl border border-border/50 p-8 space-y-8 shadow-xl shadow-secondary/20">
              <h2 className="text-2xl font-black tracking-tight">{t('summaryTitle')}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>{t('subtotal', { count: getTotalItems() })}</span>
                  <span className="text-foreground">${getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>{t('estimatedShipping')}</span>
                  <span className="text-primary">{commonT('free') || 'FREE'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>{t('tax')}</span>
                  <span className="text-foreground">$0.00</span>
                </div>
                <div className="h-px bg-border/50 my-4" />
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold">{t('totalAmount')}</span>
                  <span className="text-3xl font-black text-primary">${getTotalPrice().toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/checkout">
                  <Button className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 group">
                    {t('checkoutNow')}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{t('acceptCards')}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-3xl border border-primary/20 p-8 space-y-4">
              <h4 className="font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {t('protectionTitle')}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('protectionDesc')}
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}

