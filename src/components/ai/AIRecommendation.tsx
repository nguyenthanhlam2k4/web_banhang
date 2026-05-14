'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Loader2, ArrowRight, Zap, Info, RefreshCcw } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const fetchRecommendation = useCallback(async () => {
    if (!currentProductId) return;
    
    try {
      setLoading(true);
      setError(false);
      const response = await axios.post('/api/ai/recommend', {
        productId: currentProductId,
        category: category,
      });

      if (response.data.success) {
        setRecommendation(response.data.content);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Failed to fetch AI recommendation:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [currentProductId, category]);

  useEffect(() => {
    fetchRecommendation();
  }, [fetchRecommendation]);

  if (loading) {
    return (
      <div className="p-12 bg-primary/5 rounded-[3rem] border border-primary/10 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
          <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-lg font-bold text-primary animate-pulse">{t('aiAnalysis')}</p>
          <p className="text-xs text-muted-foreground">Sử dụng trí tuệ nhân tạo để phân tích thông số kỹ thuật...</p>
        </div>
      </div>
    );
  }

  if (error || (!loading && !recommendation)) {
    return (
      <div className="p-12 bg-secondary/10 rounded-[3rem] border border-border/50 flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-4 bg-background rounded-2xl shadow-sm">
          <Info className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Không thể tải phân tích AI</h3>
          <p className="text-muted-foreground max-w-xs mx-auto text-sm">
            Dịch vụ AI đang tạm thời gián đoạn hoặc chưa có đủ dữ liệu cho sản phẩm này.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchRecommendation}
          className="rounded-xl px-8 h-12 gap-2 hover:bg-primary hover:text-white transition-all"
        >
          <RefreshCcw className="h-4 w-4" />
          Thử phân tích lại
        </Button>
      </div>
    );
  }

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
          {recommendation!}
        </ReactMarkdown>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Info className="h-4 w-4" />
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
