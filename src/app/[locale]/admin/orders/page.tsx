'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Truck, 
  CheckCircle2, 
  XCircle,
  Clock,
  ArrowUpDown,
  Package,
  Loader2,
  Mail,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AdminOrdersPage() {
  const t = useTranslations('Admin');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/orders');
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      toast.error(t('orders.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const { data } = await axios.patch(`/api/admin/orders/${orderId}`, { orderStatus: status });
      if (data.success) {
        toast.success(t('orders.updateSuccess'));
        fetchOrders();
      }
    } catch (error) {
      toast.error('Failed to update order status');
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderCode.toString().includes(search) || 
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t('orders.title')}</h1>
          <p className="text-muted-foreground">{t('orders.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-xl h-10 px-4 gap-2 font-bold bg-primary/5 text-primary border-primary/20">
            <ShoppingBag className="h-4 w-4" />
            {t('orders.table.total')}: {orders.length}
          </Badge>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50 flex flex-col md:flex-row gap-4 items-center justify-between bg-secondary/10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('orders.search')}
              className="pl-10 bg-background border-border/50 rounded-xl h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-xl bg-background border border-border/50 px-4 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="all">{t('orders.statusLabels.all')}</option>
              <option value="pending">{t('orders.statusLabels.pending')}</option>
              <option value="processing">{t('orders.statusLabels.processing')}</option>
              <option value="shipping">{t('orders.statusLabels.shipping')}</option>
              <option value="delivered">{t('orders.statusLabels.delivered')}</option>
              <option value="cancelled">{t('orders.statusLabels.cancelled')}</option>
            </select>
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
                <th className="px-6 py-4">{t('orders.table.order')}</th>
                <th className="px-6 py-4">{t('orders.table.customer')}</th>
                <th className="px-6 py-4">{t('orders.table.total')}</th>
                <th className="px-6 py-4">{t('orders.table.payment')}</th>
                <th className="px-6 py-4">{t('orders.table.status')}</th>
                <th className="px-6 py-4 text-right">{t('orders.table.actions')}</th>
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
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-12 w-12 opacity-20" />
                      <p className="font-bold">{t('orders.noOrders')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-secondary/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-black text-sm">#{order.orderCode}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-bold text-sm truncate max-w-[150px]">{order.shippingAddress.fullName}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                          <Mail className="h-3 w-3" />
                          {order.user?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-sm text-primary">${order.totalPrice.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("rounded-lg border font-black uppercase text-[10px] px-2.5 py-1", order.isPaid ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-orange-500 bg-orange-500/10 border-orange-500/20")}>
                        {order.isPaid ? t('orders.paymentStatus.paid') : t('orders.paymentStatus.unpaid')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("rounded-lg border font-black uppercase text-[10px] gap-1 px-2.5 py-1", getStatusColor(order.orderStatus))}>
                        {t(`orders.statusLabels.${order.orderStatus}`)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-border/50">
                          <DropdownMenuItem 
                            className="rounded-xl p-3 cursor-pointer" 
                            render={
                              <Link href={`/admin/orders/${order._id}`} className="flex items-center w-full">
                                <Eye className="h-4 w-4 mr-2" /> {t('orders.viewDetails')}
                              </Link>
                            }
                          />
                          <DropdownMenuSeparator />
                          <div className="p-2">
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 px-1">{t('orders.updateStatus')}</p>
                            <div className="grid grid-cols-2 gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-lg h-8 text-[10px] font-bold"
                                onClick={() => handleUpdateStatus(order._id, 'processing')}
                              >
                                {t('orders.statusLabels.processing')}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-lg h-8 text-[10px] font-bold"
                                onClick={() => handleUpdateStatus(order._id, 'shipping')}
                              >
                                {t('orders.statusLabels.shipping')}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-lg h-8 text-[10px] font-bold"
                                onClick={() => handleUpdateStatus(order._id, 'delivered')}
                              >
                                {t('orders.statusLabels.delivered')}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-lg h-8 text-[10px] font-bold text-destructive"
                                onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                              >
                                {t('orders.statusLabels.cancelled')}
                              </Button>
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
