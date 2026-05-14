'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import { Reply, Send, Trash2, ThumbsUp } from 'lucide-react';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  commentReply?: string;
  replyAt?: string;
  images?: string[];
  helpfulVotes?: string[];
  createdAt: string;
}

export function ReviewSection({ productId, initialRating, initialNumReviews }: { productId: string, initialRating: number, initialNumReviews: number }) {
  const t = useTranslations('Product.reviews');
  const commonT = useTranslations('Common');
  const { locale } = useParams();
  const { user } = useAuthStore();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [distribution, setDistribution] = useState<Record<number, number>>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      if (data.success) {
        setReviews(data.data);
        setDistribution(data.distribution);
      }
    } catch (error) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }
    setVotingId(reviewId);
    try {
      const { data } = await axios.post(`/api/products/${productId}/reviews/${reviewId}/helpful`);
      if (data.success) {
        fetchReviews();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to vote');
    } finally {
      setVotingId(null);
    }
  };

  const handleReply = async (reviewId: string) => {
    if (!replyContent.trim()) return;
    setSubmittingReply(true);
    try {
      const { data } = await axios.patch(`/api/admin/reviews/${reviewId}`, {
        commentReply: replyContent.trim(),
      });
      if (data.success) {
        toast.success('Reply sent successfully');
        setReplyingTo(null);
        setReplyContent('');
        fetchReviews();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const { data } = await axios.delete(`/api/admin/reviews/${reviewId}`);
      if (data.success) {
        toast.success('Review deleted successfully');
        fetchReviews();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete review');
    }
  };

  const dateLocale = locale === 'vi' ? vi : enUS;

  const totalReviews = reviews.length;

  return (
    <div className="space-y-16">
      <div className="space-y-4">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <MessageSquare className="h-7 w-7 text-primary" />
          {t('title')}
        </h2>
      </div>

      {/* Rating Summary Card */}
      {!loading && totalReviews > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-center bg-primary/5 p-8 md:p-12 rounded-[3rem] border border-primary/10 shadow-sm">
          <div className="text-center md:text-left space-y-4 border-b md:border-b-0 md:border-r border-primary/10 pb-8 md:pb-0 md:pr-8">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h3 className="text-6xl font-black text-primary tracking-tighter">
                  {initialRating.toFixed(1)}
                </h3>
                <div className="flex flex-col">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(initialRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 text-left">Average Rating</span>
                </div>
              </div>
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Based on {totalReviews} {t('label')}
            </p>
          </div>

          <div className="md:col-span-2 space-y-3.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-4 group">
                  <div className="flex items-center gap-1.5 w-10 shrink-0">
                    <span className="text-xs font-black">{star}</span>
                    <Star className="h-3 w-3 fill-primary text-primary" />
                  </div>
                  <div className="flex-1 h-3 bg-primary/10 rounded-full overflow-hidden ring-1 ring-primary/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.2, ease: "circOut" }}
                      className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    />
                  </div>
                  <span className="text-xs font-black text-muted-foreground w-12 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-12">
        {/* Review List */}
        <div className="space-y-6">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-3xl border border-border/50 animate-pulse h-32" />
            ))
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-secondary/10 rounded-[2.5rem] border-2 border-dashed border-border/50">
              <MessageSquare className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-bold">{t('noReviews')}</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-card p-8 rounded-[2rem] border border-border/50 hover:border-primary/30 transition-all duration-300 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">{review.name}</h4>
                      <p className="text-xs text-muted-foreground font-medium">
                        {format(new Date(review.createdAt), 'PPP', { locale: dateLocale })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'}`} 
                        />
                      ))}
                    </div>
                    {user?.role === 'admin' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10"
                          onClick={() => {
                            setReplyingTo(replyingTo === review._id ? null : review._id);
                            setReplyContent(review.commentReply || '');
                          }}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(review._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed font-medium">
                  {review.comment}
                </p>

                {/* Helpful Voting */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-xl h-9 gap-2 font-bold transition-all ${
                      review.helpfulVotes?.includes((user as any)?.id || '') 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => handleHelpful(review._id)}
                    disabled={votingId === review._id}
                  >
                    {votingId === review._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsUp className={`h-4 w-4 ${review.helpfulVotes?.includes((user as any)?.id || '') ? 'fill-primary' : ''}`} />
                    )}
                    {review.helpfulVotes?.length || 0} {t('helpful') || 'Helpful'}
                  </Button>
                </div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {review.images.map((url, i) => (
                      <div 
                        key={i} 
                        className="relative h-24 w-24 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
                        onClick={() => window.open(url, '_blank')}
                      >
                        <img 
                          src={url} 
                          alt={`Review ${i}`} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Admin Reply Display */}
                {review.commentReply && (
                  <div className="bg-primary/5 p-6 rounded-2xl border-l-4 border-primary mt-4 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                      <MessageSquare className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-white rounded-lg px-2 py-0.5 text-[10px] font-black uppercase">Admin Reply</Badge>
                      {review.replyAt && (
                        <span className="text-[10px] text-muted-foreground font-bold">
                          {format(new Date(review.replyAt), 'PPP', { locale: dateLocale })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground font-medium leading-relaxed italic">
                      "{review.commentReply}"
                    </p>
                  </div>
                )}

                {/* Admin Reply Form */}
                {replyingTo === review._id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 space-y-4"
                  >
                    <Textarea 
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your response..."
                      className="rounded-2xl min-h-[100px] bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary/30 p-4 text-sm font-medium"
                    />
                    <div className="flex justify-end gap-3">
                      <Button variant="ghost" size="sm" className="rounded-xl font-bold" onClick={() => setReplyingTo(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" className="rounded-xl font-bold gap-2 px-6" onClick={() => handleReply(review._id)} disabled={submittingReply}>
                        {submittingReply ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Send Reply
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
