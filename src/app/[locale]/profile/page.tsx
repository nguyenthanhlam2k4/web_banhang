'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Shield, LogOut, ChevronRight, ShoppingBag, CreditCard, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const commonT = useTranslations('Common');
  const authT = useTranslations('Auth');
  const orderT = useTranslations('Orders');

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Profile form state
  const [formData, setFormData] = useState({
    name: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [userRes, ordersRes] = await Promise.all([
        axios.get('/api/auth/me'),
        axios.get('/api/orders')
      ]);

      if (userRes.data.user) {
        setUser(userRes.data.user);
        setFormData({ name: userRes.data.user.name });
      }
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile data');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      toast.error(t('nameEmpty'));
      return;
    }

    setUpdateLoading(true);
    try {
      const res = await axios.patch('/api/auth/me', formData);
      if (res.data.success) {
        setUser(res.data.user);
        setIsEditing(false);
        toast.success(t('profileUpdated'));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('updateFailed'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    setUpdateLoading(true);
    try {
      const uploadRes = await axios.post('/api/auth/upload-avatar', uploadFormData);
      if (uploadRes.data.success) {
        const updateRes = await axios.patch('/api/auth/me', { avatar: uploadRes.data.url });
        if (updateRes.data.success) {
          setUser(updateRes.data.user);
          toast.success(t('avatarUpdated'));
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('avatarFailed'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('passwordsMismatch'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error(t('passwordTooShort'));
      return;
    }

    setUpdateLoading(true);
    try {
      const res = await axios.post('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.data.success) {
        toast.success(t('passwordUpdated'));
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('passwordFailed'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      toast.success(authT('logoutSuccess'));
      router.push('/login');
    } catch (error) {
      toast.error(authT('logoutError'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">{t('loadingProfile')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12 lg:py-20 nature-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              
              {/* Sidebar */}
              <aside className="lg:col-span-1 space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-card border border-border/50 premium-shadow">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative group">
                      <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden shadow-inner">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-10 w-10 text-primary" />
                        )}
                        {updateLoading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                        <span className="text-[10px] text-white font-bold uppercase">{commonT('edit')}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={updateLoading} />
                      </label>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold line-clamp-1">{user?.name}</h2>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{user?.role === 'admin' ? authT('admin') : t('customer')}</p>
                    </div>
                  </div>

                  <nav className="mt-8 space-y-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-secondary/20'}`}
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-bold">{t('accountTab')}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'profile' ? 'rotate-90' : ''}`} />
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-secondary/20'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4" />
                        <span className="text-sm font-bold">{orderT('title')}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'orders' ? 'rotate-90' : ''}`} />
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'security' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-secondary/20'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-bold">{t('securityTab')}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'security' ? 'rotate-90' : ''}`} />
                    </button>
                    <div className="pt-4 border-t border-border/50 mt-4">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl text-destructive hover:bg-destructive/10 transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-bold">{authT('logout')}</span>
                      </button>
                    </div>
                  </nav>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-8 lg:p-12 rounded-[3rem] bg-card border border-border/50 premium-shadow space-y-8"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-3xl font-black tracking-tight">{t('title')} <span className="gradient-text">{t('subtitle')}</span></h3>
                          <p className="text-muted-foreground">{t('desc')}</p>
                        </div>
                        {!isEditing ? (
                          <Button 
                            onClick={() => setIsEditing(true)}
                            variant="outline" 
                            className="rounded-2xl px-6 font-bold"
                          >
                            {t('editProfile')}
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => setIsEditing(false)}
                              variant="ghost" 
                              className="rounded-2xl px-6 font-bold text-muted-foreground"
                              disabled={updateLoading}
                            >
                              {commonT('cancel')}
                            </Button>
                            <Button 
                              onClick={handleUpdateProfile}
                              className="rounded-2xl px-6 font-bold"
                              disabled={updateLoading}
                            >
                              {updateLoading ? commonT('loading') : commonT('save')}
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{authT('name')}</label>
                          <Input 
                            value={formData.name} 
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`h-14 rounded-2xl border-border/50 bg-secondary/10 px-6 font-bold transition-all ${isEditing ? 'ring-2 ring-primary/20 bg-background' : ''}`} 
                            readOnly={!isEditing} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{authT('email')}</label>
                          <Input value={user?.email} className="h-14 rounded-2xl border-border/50 bg-secondary/10 px-6 font-bold opacity-60" readOnly />
                          <p className="text-[10px] text-muted-foreground font-medium ml-1 mt-1 italic">{t('emailHint')}</p>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-border/50">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                          {t('summaryTitle')}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="p-6 rounded-3xl bg-secondary/10 border border-border/50 space-y-2 card-hover">
                            <span className="text-3xl font-black">{orders.length}</span>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{orderT('noOrders')}</p>
                          </div>
                          <div className="p-6 rounded-3xl bg-secondary/10 border border-border/50 space-y-2 card-hover">
                            <span className="text-3xl font-black">
                              ${orders.reduce((acc, order) => order.isPaid ? acc + order.totalPrice : acc, 0).toLocaleString()}
                            </span>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('totalSpent')}</p>
                          </div>
                          <div className="p-6 rounded-3xl bg-secondary/10 border border-border/50 space-y-2 card-hover">
                            <span className="text-3xl font-black">
                              {new Date(user?.createdAt || Date.now()).getFullYear()}
                            </span>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('memberSince')}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'orders' && (
                    <motion.div
                      key="orders"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="p-8 lg:p-12 rounded-[3rem] bg-card border border-border/50 premium-shadow space-y-1 mb-8">
                        <h3 className="text-3xl font-black tracking-tight">{orderT('title')}</h3>
                        <p className="text-muted-foreground">{orderT('desc')}</p>
                      </div>

                      {orders.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-[3rem] border border-border/50 premium-shadow">
                          <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                          <h4 className="text-xl font-bold">{orderT('noOrders')}</h4>
                          <p className="text-muted-foreground mt-2">{orderT('noOrdersDesc')}</p>
                          <Button className="mt-8 rounded-2xl px-8 h-12" onClick={() => router.push('/shop')}>
                            {orderT('startShopping')}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {orders.map((order) => (
                            <motion.div
                              key={order._id}
                              className="p-6 rounded-[2rem] bg-card border border-border/50 hover:border-primary/30 transition-all premium-shadow group card-hover"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                                <div className="flex items-center gap-4">
                                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <ShoppingBag className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <h4 className="font-black text-lg">{orderT('orderId')} #{order.orderCode}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                      <Clock className="h-3 w-3" />
                                      {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    order.isPaid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                                  }`}>
                                    {order.isPaid ? orderT('paid') : orderT('unpaid')}
                                  </span>
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    order.orderStatus === 'delivered' ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'
                                  }`}>
                                    {orderT(`status.${order.orderStatus}`)}
                                  </span>
                                </div>
                              </div>

                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-border/40">
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <CreditCard className="h-3 w-3" /> {commonT('payment') || 'Payment'}
                                  </p>
                                  <p className="font-bold text-sm">{order.paymentMethod}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="h-3 w-3" /> {t('shipTo')}
                                  </p>
                                  <p className="font-bold text-sm line-clamp-1">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{commonT('total')}</p>
                                  <p className="font-black text-primary text-xl">${order.totalPrice.toLocaleString()}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-8 lg:p-12 rounded-[3rem] bg-card border border-border/50 premium-shadow space-y-8"
                    >
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black tracking-tight">{t('securityTitle')} <span className="gradient-text">{t('securitySubtitle')}</span></h3>
                        <p className="text-muted-foreground">{t('securityDesc')}</p>
                      </div>

                      <div className="p-8 rounded-[2.5rem] bg-secondary/5 border border-border/50">
                        <form onSubmit={handleChangePassword} className="space-y-6">
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t('currentPassword')}</label>
                              <Input 
                                type="password" 
                                required
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="h-14 rounded-2xl border-border/50 bg-background px-6 font-bold" 
                                placeholder="••••••••"
                              />
                            </div>
                            <div className="hidden sm:block"></div>
                            <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t('newPassword')}</label>
                              <Input 
                                type="password" 
                                required
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="h-14 rounded-2xl border-border/50 bg-background px-6 font-bold" 
                                placeholder="••••••••"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t('confirmNewPassword')}</label>
                              <Input 
                                type="password" 
                                required
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="h-14 rounded-2xl border-border/50 bg-background px-6 font-bold" 
                                placeholder="••••••••"
                              />
                            </div>
                          </div>
                          <div className="pt-4">
                            <Button 
                              type="submit" 
                              className="h-14 rounded-2xl px-10 font-bold"
                              disabled={updateLoading}
                            >
                              {updateLoading ? commonT('loading') : t('updatePassword')}
                            </Button>
                          </div>
                        </form>
                      </div>

                      <div className="pt-8 border-t border-border/50">
                        <div className="flex items-center gap-4 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                          <Shield className="h-8 w-8 text-primary" />
                          <div>
                            <h5 className="font-bold">{t('enhancedProtection')}</h5>
                            <p className="text-sm text-muted-foreground">{t('enhancedProtectionDesc')}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

