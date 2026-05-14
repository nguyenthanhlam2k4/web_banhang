'use client';

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function UserOrdersPage() {
  const t = useTranslations('Orders');
  const commonT = useTranslations('Common');
  const authT = useTranslations('Auth');

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders');
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'shipping': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'processing': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-secondary/50 border-border/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="h-3 w-3" />;
      case 'shipping': return <Truck className="h-3 w-3" />;
      case 'processing': return <Clock className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.orderStatus === filter);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('desc')}</p>
        </div>
        <Link href="/shop">
          <Button className="rounded-2xl h-12 gap-2 shadow-lg shadow-primary/20 px-6 font-bold">
            <ShoppingBag className="h-5 w-5" />
            {t('continueShopping')}
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {['all', 'pending', 'processing', 'shipping', 'delivered', 'cancelled'].map((s) => (
          <Button
            key={s}
            variant={filter === s ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-xl px-4 h-9 font-bold capitalize",
              filter !== s && "text-muted-foreground hover:bg-secondary/50"
            )}
          >
            {t(`status.${s}`)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-secondary/20 rounded-3xl animate-pulse border border-border/50" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-border/50">
          <div className="flex justify-center mb-4 opacity-20">
            <Package className="h-16 w-16" />
          </div>
          <h3 className="text-xl font-bold">{t('noOrders')}</h3>
          <p className="text-muted-foreground mt-1 mb-6">{t('noOrdersDesc')}</p>
          <Link href="/shop">
            <Button variant="outline" className="rounded-xl px-8 h-12 font-bold">{t('startShopping')}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <motion.div
              layout
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                {/* Order Meta */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('orderId')}</p>
                      <p className="font-black text-sm">#{order.orderCode}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest text-right">{t('date')}</p>
                      <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest text-right">{commonT('total')}</p>
                      <p className="font-black text-lg text-primary">${order.totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={cn("rounded-lg border font-black uppercase text-[10px] gap-1 px-2.5 py-1", getStatusColor(order.orderStatus))}>
                        {getStatusIcon(order.orderStatus)}
                        {t(`status.${order.orderStatus}`)}
                      </Badge>
                      <Badge variant="outline" className={cn("rounded-lg border font-black uppercase text-[10px] px-2.5 py-1", order.isPaid ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-orange-500 bg-orange-500/10 border-orange-500/20")}>
                        {order.isPaid ? t('paid') : t('unpaid')}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex -space-x-3 overflow-hidden p-1">
                    {order.orderItems.map((item: any, idx: number) => (
                      <div key={idx} className="h-12 w-12 rounded-xl border-2 border-card bg-secondary/50 overflow-hidden ring-1 ring-border/50">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" title={item.name} />
                      </div>
                    ))}
                    {order.orderItems.length > 5 && (
                      <div className="h-12 w-12 rounded-xl border-2 border-card bg-secondary flex items-center justify-center text-xs font-bold ring-1 ring-border/50 text-muted-foreground">
                        +{order.orderItems.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center justify-end md:justify-center gap-4 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8">
                  <Link href={`/orders/${order._id}`} className="w-full">
                    <Button variant="ghost" className="w-full rounded-xl h-12 gap-2 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      {commonT('details') || 'Details'}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  {!order.isPaid && order.paymentStatus !== 'cancelled' && order.checkoutUrl && (
                    <Link href={order.checkoutUrl} className="w-full">
                      <Button variant="outline" size="sm" className="w-full rounded-xl h-9 text-xs font-black uppercase tracking-wider text-primary border-primary/20 hover:bg-primary/5">
                        {t('payNow')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

