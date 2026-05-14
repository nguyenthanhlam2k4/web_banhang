'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, Link } from '@/i18n/routing';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Plus,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function AdminDashboard() {
  const t = useTranslations('Admin');
  const ct = useTranslations('Common');
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/stats');
      if (data.success) {
        setData(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { name: t('totalRevenue'), value: `$${(data?.stats.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+0%' },
    { name: t('totalOrders'), value: (data?.stats.orders || 0).toString(), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+0%' },
    { name: t('totalProducts'), value: data?.stats.products || '0', icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10', trend: '+12%' },
    { name: t('totalUsers'), value: data?.stats.users || '0', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '+5%' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-card rounded-3xl border border-border/50" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-card rounded-3xl border border-border/50" />
          <div className="h-96 bg-card rounded-3xl border border-border/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">{t('dashboard')}</h1>
          <p className="text-muted-foreground">{t('welcome')}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new">
            <Button className="rounded-xl px-6 h-12 gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" />
              {t('addProduct')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-card rounded-3xl border border-border/50 hover:border-primary/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn('p-3 rounded-2xl', stat.bg, stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">{stat.name}</p>
              <h3 className="text-3xl font-black group-hover:text-primary transition-colors">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">{t('recentOrders')}</h3>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="rounded-xl text-primary font-bold">
                {ct('viewAll')}
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/20 border-b border-border/50">
                  <th className="px-6 py-3">{t('orderCode')}</th>
                  <th className="px-6 py-3">{t('customer')}</th>
                  <th className="px-6 py-3">{ct('status.label')}</th>
                  <th className="px-6 py-3 text-right">{ct('total')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data?.recentOrders?.map((order: any) => (
                  <tr key={order._id} className="hover:bg-secondary/10 transition-colors group cursor-pointer" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                    <td className="px-6 py-4 font-bold text-sm">#{order.orderCode}</td>
                    <td className="px-6 py-4 text-sm font-medium">{order.shippingAddress.fullName}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("rounded-lg text-[10px] font-black uppercase", order.isPaid ? "text-emerald-500 bg-emerald-500/10" : "text-orange-500 bg-orange-500/10")}>
                        {order.isPaid ? t('paid') : t('pending')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-primary">${order.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">{t('newCustomers')}</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {data?.recentUsers.map((u: any) => (
              <div key={u._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-border/50 bg-secondary/50">
                    <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{u.name}</h4>
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">{u.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => router.push(`/admin/users/${u._id}`)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

