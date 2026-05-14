'use client';

import { Link } from '@/i18n/routing';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Auth');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side: Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary/30 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-500/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10 space-y-8 text-center max-w-md">
          <div className="inline-flex p-4 bg-primary rounded-3xl premium-shadow rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <ShoppingBag className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            {t('welcomeBack') || 'Welcome back to the'} <span className="gradient-text">Elite Circle</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('loginDesc')}
          </p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="p-2 bg-primary rounded-xl">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Premium<span className="text-primary">Store</span></span>
            </Link>
            
            <Link href="/" className="hidden lg:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {t('backToStore') || 'Back to Store'}
            </Link>
            
            <h1 className="text-3xl font-bold tracking-tight">{t('login')}</h1>
            <p className="text-muted-foreground">
              {t('enterCredentials') || 'Enter your credentials to access your account'}
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              {t('createOne') || 'Create one for free'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

