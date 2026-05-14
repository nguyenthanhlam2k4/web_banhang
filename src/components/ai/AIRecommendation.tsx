'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, ArrowRight, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslations } from 'next-intl';

interface AIRecommendationProps {
  currentProductId: string;
  category: string;
}

export function AIRecommendation({ currentProductId, category }: AIRecommendationProps) {
  const t = useTranslations('Product');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/ai/recommend', {
          productId: currentProductId,
          category: category,
        });

        if (response.data.success) {
          setRecommendation(response.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch AI recommendation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRecommendation();
    }
  }, [currentProductId, category]);

  if (loading) {
    return (
      <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">{t('aiAnalysis')}</p>
      </div>
    );
  }

  if (!recommendation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-10 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-[3rem] border border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-8 relative overflow-hidden group"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-16 w-16 bg-primary rounded-3xl shadow-2xl shadow-primary/30 flex items-center justify-center border border-white/20">
              <Sparkles className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-emerald-400 rounded-full border-4 border-background flex items-center justify-center">
              <Zap className="h-3 w-3 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight leading-none mb-2">{t('aiAdvice')}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{t('aiSubtitle')}</span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="rounded-full px-4 py-1.5 border-primary/20 bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest">
          Powered by Gemini Pro
        </Badge>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      <div className="markdown-content text-base leading-relaxed relative prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {recommendation}
        </ReactMarkdown>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          < TrickInfo className="h-4 w-4" />
          {t('aiInfo')}
        </div>
        <Button className="w-full sm:w-auto rounded-2xl h-14 px-8 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 group overflow-hidden relative">
          <span className="relative z-10 flex items-center gap-2">
            {t('aiExplore')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-transform group-hover:scale-105" />
        </Button>
      </div>
    </motion.div>
  );
}

function TrickInfo(props: any) {
  return <Info {...props} />;
}
