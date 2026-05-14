'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function CartDrawer() {
  const t = useTranslations('Cart');
  const commonT = useTranslations('Common');
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger render={
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <ShoppingBag className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </Button>
      }>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            {t('cartDrawerTitle')}
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              {t('itemsCount', { count: getTotalItems() })}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="p-6 bg-secondary/30 rounded-full">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{t('emptyTitle')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('emptyDesc')}
                  </p>
                </div>
                <SheetTrigger render={
                  <Button className="rounded-xl px-8" render={<Link href="/shop">{t('continueShopping')}</Link>} />
                } />
              </motion.div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 group"
                  >
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary/30 border border-border/50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            <Link href={`/shop/${item.slug}`}>{item.name}</Link>
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{t('premiumEdition')}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border/50 rounded-lg bg-secondary/20">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-primary transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-sm">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border/50 space-y-4 bg-secondary/5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('subtotal', { count: getTotalItems() })}</span>
                <span className="font-medium">${getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('shipping')}</span>
                <span className="text-primary font-medium">{commonT('free')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>{commonT('total')}</span>
                <span className="text-primary">${getTotalPrice().toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Link href="/cart" className="w-full">
                <Button variant="outline" className="w-full rounded-xl h-12">
                  {t('viewFullCart')}
                </Button>
              </Link>
              <Link href="/checkout" className="w-full">
                <Button className="w-full rounded-xl h-12 shadow-lg shadow-primary/20 group">
                  {t('checkoutNow')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
