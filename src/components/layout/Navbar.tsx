'use client';

import React, { useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronDown,
  ShoppingBag,
  LogOut,
  Package,
  Settings,
  Heart,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

import { CartDrawer } from '@/components/cart/CartDrawer';

export function Navbar() {
  const t = useTranslations('Navbar');
  const ct = useTranslations('Common');
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, clearAuth } = useAuthStore();

  const NAV_LINKS = [
    { name: t('home'), href: '/' },
    { name: t('shop'), href: '/shop' },
    { name: t('categories'), href: '/categories' },
    { name: t('about'), href: '/about' },
  ] as const;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      clearAuth();
      toast.success(t('logoutSuccess') || 'Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error(t('logoutError') || 'Logout failed');
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'glass py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <ShoppingBag className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              Premium<span className="gradient-text">Store</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href as any}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar (Desktop) */}
            <div className="hidden lg:flex relative items-center max-w-sm">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={ct('search')}
                className="pl-10 w-64 bg-secondary/50 border-none rounded-full h-10 focus-visible:ring-1"
              />
            </div>

            <LanguageSwitcher />
            <ThemeToggle />

            <CartDrawer />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-border/50 outline-none">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-popover border border-border/50 shadow-xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer text-primary bg-primary/5 focus:bg-primary/10">
                      <Link href="/admin" className="flex items-center w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>{t('admin')}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                    <Link href="/profile" className="flex items-center w-full">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>{t('profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                    <Link href="/orders" className="flex items-center w-full">
                      <Package className="mr-2 h-4 w-4" />
                      <span>{t('orders') || 'My Orders'}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                    <Link href="/wishlist" className="flex items-center w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{t('wishlist') || 'Wishlist'}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('settings') || 'Settings'}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="rounded-xl p-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button variant="default" className="rounded-full px-6">
                  {t('login')}
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-xs">
                  <SheetHeader>
                    <SheetTitle className="text-left flex items-center gap-2">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                      <span>Premium<span className="text-primary">Store</span></span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-12">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href as any}
                        className={cn(
                          'text-lg font-medium py-2 border-b border-border/50',
                          pathname === link.href ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <div className="flex flex-col gap-4 mt-4">
                      {user ? (
                        <Button variant="destructive" className="w-full rounded-xl py-6" onClick={handleLogout}>
                          {t('logout')}
                        </Button>
                      ) : (
                        <>
                          <Link href="/login">
                            <Button className="w-full rounded-xl py-6">{t('login')}</Button>
                          </Link>
                          <Link href="/register">
                            <Button variant="outline" className="w-full rounded-xl py-6">{t('register')}</Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


