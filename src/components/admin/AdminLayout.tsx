'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  List, 
  Users, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft,
  Search,
  Bell,
  Settings,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { User as UserIcon } from 'lucide-react';

const ADMIN_LINKS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: List },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      clearAuth();
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-card border-r border-border/50 transition-all duration-300 sticky top-0 h-screen',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className={cn('flex items-center gap-2 overflow-hidden', !isSidebarOpen && 'justify-center w-full')}>
            <div className="p-2 bg-primary rounded-xl flex-shrink-0">
              <ShoppingBag className="h-6 w-6 text-primary-foreground" />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-bold tracking-tight whitespace-nowrap">
                Admin<span className="text-primary">Panel</span>
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {ADMIN_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-xl transition-all group',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
              >
                <link.icon className={cn('h-5 w-5 flex-shrink-0', isActive ? '' : 'group-hover:scale-110 transition-transform')} />
                {isSidebarOpen && <span className="font-medium">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="icon"
            className="w-full rounded-xl hover:bg-secondary/50"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-card border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Admin</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-bold capitalize">
                {pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex relative items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 bg-secondary/50 border-none rounded-xl text-sm w-64 focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
            </Button>
            <div className="h-10 w-px bg-border/50" />
            
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-3 pl-2 group cursor-pointer outline-none border-none bg-transparent">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-sm font-bold leading-none group-hover:text-primary transition-colors">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">Super Admin</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl overflow-hidden border border-border/50 group-hover:border-primary transition-all bg-secondary/50 flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 mt-2 shadow-xl border-border/50 bg-popover">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-xl p-3 cursor-pointer"
                  render={
                    <Link href="/admin/profile" className="flex items-center w-full">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  }
                />
                <DropdownMenuItem
                  className="rounded-xl p-3 cursor-pointer"
                  render={
                    <Link href="/admin/settings" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  }
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="rounded-xl p-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 lg:p-10">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-card z-50 lg:hidden p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary rounded-xl">
                    <ShoppingBag className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    Admin<span className="text-primary">Panel</span>
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex-1 space-y-2">
                {ADMIN_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl transition-all',
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                          : 'text-muted-foreground hover:bg-secondary/50'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="font-bold">{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-border/50">
                <Button 
                  variant="destructive" 
                  className="w-full rounded-xl py-6 gap-3"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Logout Account
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
