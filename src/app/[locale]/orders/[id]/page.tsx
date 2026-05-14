'use client';

import React, { useEffect, useState, use } from 'react';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  ExternalLink,
  Loader2,
  Phone,
  User as UserIcon,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

import { ReviewModal } from '@/components/product/ReviewModal';
import { Star } from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Orders.details');
  const ot = useTranslations('Orders');
  const pt = useTranslations('Product');
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewItem, setReviewItem] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      // We use the same API for both admin and user, it handles permission
      const { data } = await axios.get(`/api/admin/orders/${id}`);
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
          <XCircle className="h-16 w-16 text-muted-foreground opacity-20" />
          <h2 className="text-2xl font-bold">{t('notFound')}</h2>
          <Button onClick={() => router.back()}>{t('goBack')}</Button>
        </div>
        <Footer />
      </>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'shipping': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'processing': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-secondary/50 border-border/50';
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <div className="flex items-center gap-4 mb-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="rounded-xl border border-border/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle', { code: order.orderCode })}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Items and Timeline */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {t('items')}
              </h3>
              <div className="divide-y divide-border/50">
                {order.orderItems.map((item: any, idx: number) => (
                  <div key={idx} className="py-6 flex flex-col sm:flex-row gap-6 first:pt-0 last:pb-0">
                    <div className="flex gap-4 flex-1">
                      <div className="h-24 w-24 rounded-2xl bg-secondary/50 overflow-hidden border border-border/50 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base md:text-lg leading-tight mb-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-medium">{t('quantity')}: {item.quantity}</p>
                        <div className="mt-2">
                          <p className="font-black text-primary">${(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground font-bold">${item.price.toLocaleString()} {t('each')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {order.orderStatus === 'delivered' && !item.isReviewed && (
                      <div className="flex items-center justify-end">
                        <Button 
                          onClick={() => setReviewItem({ id: item.product, name: item.name })}
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl h-10 px-4 font-bold gap-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          <Star className="h-4 w-4" />
                          {pt('reviews.writeReview')}
                        </Button>
                      </div>
                    )}
                    
                    {item.isReviewed && (
                      <div className="flex items-center justify-end">
                        <Badge variant="outline" className="rounded-xl h-10 px-4 font-bold gap-2 bg-emerald-50 text-emerald-600 border-emerald-100">
                          <CheckCircle2 className="h-4 w-4" />
                          Đã đánh giá
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Review Modal */}
            <ReviewModal 
              isOpen={!!reviewItem}
              onClose={() => setReviewItem(null)}
              productId={reviewItem?.id || ''}
              productName={reviewItem?.name || ''}
              orderId={order._id}
              onSuccess={fetchOrder}
            />

            {/* Shipping Address */}
            <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t('shipping')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary/50 rounded-xl">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('recipient')}</p>
                      <p className="font-bold">{order.shippingAddress.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary/50 rounded-xl">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('phone')}</p>
                      <p className="font-bold">{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary/50 rounded-xl">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('address')}</p>
                      <p className="font-bold leading-relaxed">
                        {order.shippingAddress.address}, {order.shippingAddress.district}, {order.shippingAddress.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {order.shippingAddress.notes && (
                <div className="mt-4 p-4 bg-secondary/20 rounded-2xl border border-dashed border-border/50 italic text-sm text-muted-foreground">
                  "{t('note')}: {order.shippingAddress.notes}"
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary and Status */}
          <div className="space-y-8">
            <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{t('summary')}</h3>
                  <Badge variant="outline" className={cn("rounded-lg border font-black uppercase text-[10px] px-2.5 py-1", getStatusColor(order.orderStatus))}>
                    {ot(`status.${order.orderStatus}`)}
                  </Badge>
                </div>
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{t('subtotal')}</span>
                    <span className="font-bold">${order.itemsPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{t('shippingFee')}</span>
                    <span className="font-bold">${order.shippingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl pt-4 border-t border-border/50">
                    <span className="font-black">{t('total')}</span>
                    <span className="font-black text-primary">${order.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-border/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      {t('paymentStatus')}
                    </span>
                    <Badge variant="outline" className={cn("rounded-lg border font-black uppercase text-[10px] px-2.5 py-1", order.isPaid ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-orange-500 bg-orange-500/10 border-orange-500/20")}>
                      {order.isPaid ? t('paid') : t('unpaid')}
                    </Badge>
                  </div>
                  {order.isPaid && order.paidAt && (
                    <p className="text-[10px] text-muted-foreground font-bold text-right italic">
                      {t('chargedOn', { date: new Date(order.paidAt).toLocaleString() })}
                    </p>
                  )}
                  {!order.isPaid && order.checkoutUrl && (
                    <Link href={order.checkoutUrl}>
                      <Button className="w-full rounded-2xl h-12 font-black gap-2 shadow-lg shadow-primary/20 mt-2">
                        <ExternalLink className="h-4 w-4" />
                        {t('completePayment')}
                      </Button>
                    </Link>
                  )}
                </div>
                
                <div className="space-y-3">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {t('orderInfo')}
                  </span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-medium">{t('placedOn')}</span>
                      <span className="font-bold">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-medium">{t('method')}</span>
                      <span className="font-bold">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-3">
              <h4 className="font-black text-[10px] uppercase tracking-widest text-primary">{t('needHelp')}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('helpDesc', { code: order.orderCode })}
              </p>
              <Button variant="ghost" className="w-full rounded-xl h-10 text-xs font-bold text-primary hover:bg-primary/10">{t('contactSupport')}</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
