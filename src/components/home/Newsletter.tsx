'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Newsletter() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-primary p-8 sm:p-12 lg:p-20 relative overflow-hidden premium-shadow">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[100%] bg-violet-500/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left relative z-10">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/10">
                <Sparkles className="h-3 w-3" />
                Join the Elite
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Get Exclusive Access to <br /> New Drops & Offers
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-lg">
                Subscribe to our newsletter and receive a 15% discount on your first order. No spam, only premium content.
              </p>
            </div>

            <div className="w-full max-w-md space-y-4">
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full h-16 pl-12 pr-32 rounded-2xl bg-white border-none text-slate-900 placeholder:text-slate-400 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-white/20"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all">
                  Subscribe
                </Button>
              </form>
              <p className="text-white/60 text-xs">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
