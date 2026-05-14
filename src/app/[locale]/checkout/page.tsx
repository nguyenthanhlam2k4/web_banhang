'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Loader2,
  MapPin,
  Phone,
  User as UserIcon,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { useTranslations } from 'next-intl';

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const commonT = useTranslations('Common');
  const cartT = useTranslations('Cart');

  const router = useRouter();
  const { items: cart, getTotalPrice } = useCartStore();
  const itemsPrice = getTotalPrice();
  const shippingPrice = itemsPrice > 1000 ? 0 : 20; // Example shipping logic
  const totalPrice = itemsPrice + shippingPrice;
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const checkoutSchema = z.object({
    fullName: z.string().min(2, t('errors.name')),
    phone: z.string().min(10, t('errors.phone')),
    address: z.string().min(5, t('errors.address')),
    city: z.string().min(2, t('errors.city')),
    district: z.string().min(2, t('errors.district')),
    notes: z.string().optional(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      phone: '',
      address: '',
      city: '',
      district: '',
      notes: '',
    }
  });

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/shop');
    }
    if (!user) {
      toast.error(t('loginToCheckout'));
      router.push('/login?redirect=/checkout');
    }
  }, [cart, user, router, t]);

  const onInvalid = () => {
    toast.error(t('fillRequired'));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.map(item => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price
        })),
        shippingAddress: data,
        itemsPrice,
        shippingPrice,
        totalPrice,
      };

      const response = await axios.post('/api/orders', orderData);
      
      if (response.data.success && response.data.checkoutUrl) {
        toast.success(t('redirecting'));
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error(response.data.error || t('failedToCreate'));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('failed'));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 || !user) return null;

  return (
    <div className="min-h-screen bg-secondary/5 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Column: Form */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">{t('shippingInfo')}</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <UserIcon className="h-3 w-3" /> {t('fullName')}
                    </Label>
                    <Input 
                      {...register('fullName')}
                      placeholder={t('namePlaceholder')}
                      className="rounded-xl h-12 bg-secondary/20 border-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.fullName && <p className="text-xs text-destructive font-bold">{errors.fullName.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3 w-3" /> {t('phoneNumber')}
                    </Label>
                    <Input 
                      {...register('phone')}
                      placeholder={t('phonePlaceholder')}
                      className="rounded-xl h-12 bg-secondary/20 border-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.phone && <p className="text-xs text-destructive font-bold">{errors.phone.message as string}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> {t('address')}
                  </Label>
                  <Input 
                    {...register('address')}
                    placeholder={t('addressPlaceholder')}
                    className="rounded-xl h-12 bg-secondary/20 border-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.address && <p className="text-xs text-destructive font-bold">{errors.address.message as string}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('district')}</Label>
                    <Input 
                      {...register('district')}
                      placeholder={t('districtPlaceholder')}
                      className="rounded-xl h-12 bg-secondary/20 border-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.district && <p className="text-xs text-destructive font-bold">{errors.district.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('city')}</Label>
                    <Input 
                      {...register('city')}
                      placeholder={t('cityPlaceholder')}
                      className="rounded-xl h-12 bg-secondary/20 border-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.city && <p className="text-xs text-destructive font-bold">{errors.city.message as string}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('notes')}</Label>
                  <Textarea 
                    {...register('notes')}
                    placeholder={t('notesPlaceholder')}
                    className="rounded-xl min-h-[100px] bg-secondary/20 border-none resize-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-sm p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {t('secureAgreement')}
              </div>
            </form>
          </div>

          {/* Right Column: Summary */}
          <div className="w-full md:w-[400px]">
            <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm sticky top-24 space-y-8">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">{cartT('summaryTitle')}</h2>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 rounded-xl bg-secondary/50 overflow-hidden border border-border/50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{t('qty')}: {item.quantity}</p>
                        <p className="text-sm font-black">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{t('subtotal')}</span>
                  <span className="font-bold">${itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{t('shipping')}</span>
                  <span className="font-bold">${shippingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl pt-4 border-t border-border/50">
                  <span className="font-black">{cartT('totalAmount')}</span>
                  <span className="font-black text-primary">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-center text-muted-foreground font-medium px-4">
                  {t('termsAgreement')} <span className="text-primary cursor-pointer hover:underline">{t('termsLink')}</span>.
                </p>
                <Button 
                  onClick={handleSubmit(onSubmit, onInvalid)} 
                  disabled={loading}
                  className="w-full rounded-2xl h-14 text-lg font-black gap-3 shadow-xl shadow-primary/20"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="h-6 w-6" />
                      {t('completePayment')}
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('securedBy')}</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

