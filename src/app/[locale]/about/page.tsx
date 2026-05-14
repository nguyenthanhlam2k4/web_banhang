'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, Award, Users, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('About');

  const STATS = [
    { label: t('stats.customers'), value: '50K+', icon: Users },
    { label: t('stats.products'), value: '120K+', icon: Truck },
    { label: t('stats.experience'), value: '10+', icon: Award },
    { label: t('stats.countries'), value: '25+', icon: Globe },
  ];

  const VALUES = [
    {
      title: t('values.quality'),
      description: t('values.qualityDesc'),
      icon: ShieldCheck,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: t('values.delivery'),
      description: t('values.deliveryDesc'),
      icon: Clock,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      title: t('values.customer'),
      description: t('values.customerDesc'),
      icon: Award,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  {t('badge')}
                </span>
                <h1 className="mt-6 text-5xl lg:text-7xl font-black tracking-tight leading-none">
                  {t('title')} <span className="gradient-text">{t('titleGradient')}</span>
                </h1>
                <p className="mt-8 text-xl text-muted-foreground leading-relaxed">
                  {t('description')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-border/50 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center text-center space-y-2"
                  >
                    <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/50">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-3xl font-black">{stat.value}</span>
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-square rounded-[3rem] overflow-hidden group shadow-2xl shadow-primary/10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                  alt="Team Working" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight">{t('team.title')} <span className="text-primary">{t('team.titleGradient')}</span></h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t('team.description')}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="p-6 rounded-3xl bg-secondary/20 border border-border/50">
                    <h4 className="font-bold mb-2 text-primary">{t('team.innovation')}</h4>
                    <p className="text-sm text-muted-foreground italic">{t('team.innovationQuote')}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-secondary/20 border border-border/50">
                    <h4 className="font-bold mb-2 text-primary">{t('team.transparency')}</h4>
                    <p className="text-sm text-muted-foreground italic">{t('team.transparencyQuote')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10" />
          
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tight">{t('values.title')} <span className="gradient-text">{t('values.titleGradient')}</span></h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {VALUES.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/40 transition-all duration-300 premium-shadow group"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
