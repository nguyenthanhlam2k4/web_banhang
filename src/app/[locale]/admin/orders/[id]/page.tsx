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
  Calendar,
  Mail,
  MoreVertical,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Link, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/orders/${id}`);
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      toast.error(t('orders.orderDetail.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      setUpdating(true);
      const { data } = await axios.patch(`/api/admin/orders/${id}`, { orderStatus: status });
      if (data.success) {
        toast.success(t('orders.updateSuccess'));
        setOrder(data.data);
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
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
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <XCircle className="h-16 w-16 text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold">{t('orders.orderDetail.orderNotFound')}</h2>
        <Button onClick={() => router.push('/admin/orders')}>{t('orders.orderDetail.backToOrders')}</Button>
      </div>
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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="rounded-xl border border-border/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{t('orders.orderDetail.title')}</h1>
            <p className="text-muted-foreground">{t('orders.orderDetail.managingOrder', { code: order.orderCode })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("rounded-xl h-10 px-4 gap-2 font-bold", getStatusColor(order.orderStatus))}>
            {t(`orders.statusLabels.${order.orderStatus}`).toUpperCase()}
          </Badge>
          <Badge variant="outline" className={cn("rounded-xl h-10 px-4 gap-2 font-bold", order.isPaid ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-orange-500 bg-orange-500/10 border-orange-500/20")}>
            {order.isPaid ? t('orders.paymentStatus.paid').toUpperCase() : t('orders.paymentStatus.unpaid').toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t('orders.orderDetail.updateStatus')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['processing', 'shipping', 'delivered', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={order.orderStatus === status ? 'default' : 'outline'}
                  disabled={updating || order.orderStatus === status}
                  onClick={() => handleUpdateStatus(status)}
                  className={cn(
                    "rounded-2xl h-14 font-bold capitalize flex items-center justify-center gap-2",
                    status === 'cancelled' && "text-destructive border-destructive/20 hover:bg-destructive/10"
                  )}
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  <span>{t(`orders.statusLabels.${status}`)}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {t('orders.orderDetail.itemsSummary')}
            </h3>
            <div className="divide-y divide-border/50">
              {order.orderItems.map((item: any, idx: number) => (
                <div key={idx} className="py-6 flex gap-6 first:pt-0 last:pb-0">
                  <div className="h-24 w-24 rounded-2xl bg-secondary/50 overflow-hidden border border-border/50 flex-shrink-0 shadow-sm">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="font-black text-lg leading-tight mb-1">{item.name}</p>
                    <p className="text-sm text-muted-foreground font-bold">{t('orders.orderDetail.quantity', { qty: item.quantity })}</p>
                    <p className="text-xs text-muted-foreground">Product ID: {item.product}</p>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <p className="font-black text-xl text-primary">${(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground font-bold">${item.price.toLocaleString()} {t('orders.orderDetail.unit')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              {t('orders.orderDetail.customerInfo')}
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full overflow-hidden border border-border/50 bg-secondary/30">
                  <img src={order.user?.avatar} alt={order.user?.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-lg leading-none">{order.user?.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{order.user?.email}</p>
                </div>
              </div>
              <div className="h-px bg-border/50" />
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-secondary/50 rounded-xl">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('orders.orderDetail.emailAddress')}</p>
                    <p className="font-bold truncate">{order.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-secondary/50 rounded-xl">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('orders.orderDetail.contactNumber')}</p>
                    <p className="font-bold">{order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t('orders.orderDetail.shippingAddress')}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('orders.orderDetail.recipient')}</p>
                <p className="font-bold">{order.shippingAddress.fullName}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('orders.orderDetail.fullAddress')}</p>
                <p className="font-bold leading-relaxed">
                  {order.shippingAddress.address}, {order.shippingAddress.district}, {order.shippingAddress.city}
                </p>
              </div>
              {order.shippingAddress.notes && (
                <div className="p-4 bg-primary/5 rounded-2xl border border-dashed border-primary/20 italic text-sm text-muted-foreground">
                  {t('orders.orderDetail.note', { text: order.shippingAddress.notes })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-xl shadow-primary/20 space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t('orders.orderDetail.financials')}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium opacity-80">
                <span>{t('orders.orderDetail.itemsSubtotal')}</span>
                <span>${order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium opacity-80">
                <span>{t('orders.orderDetail.shippingFee')}</span>
                <span>${order.shippingPrice.toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/20" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{t('orders.orderDetail.grandTotal')}</span>
                <span className="text-3xl font-black">${order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="pt-2">
              <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest opacity-70">{t('orders.orderDetail.paymentStatus')}</span>
                <span className="font-black text-sm">{order.isPaid ? t('orders.paymentStatus.paid').toUpperCase() : t('orders.paymentStatus.pending').toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
