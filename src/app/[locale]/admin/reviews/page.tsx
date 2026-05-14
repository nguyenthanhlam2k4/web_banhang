'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, 
  Star, 
  User, 
  Trash2, 
  Reply, 
  Search, 
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

export default function AdminReviewsPage() {
  const { locale } = useParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [pagination.page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/reviews?page=${pagination.page}&limit=10`);
      if (data.success) {
        setReviews(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const { data } = await axios.delete(`/api/admin/reviews/${id}`);
      if (data.success) {
        toast.success('Review deleted');
        fetchReviews();
      }
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const dateLocale = locale === 'vi' ? vi : enUS;

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
            <MessageSquare className="h-10 w-10 text-primary" />
            Product Reviews
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Manage and moderate all customer reviews across your store.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Reviews</p>
          <p className="text-4xl font-black text-primary">{pagination.total}</p>
        </div>
      </div>

      {/* Review List */}
      <div className="bg-card rounded-[2.5rem] border border-border/50 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-border/50 bg-secondary/5">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by user or product..." 
              className="pl-12 rounded-2xl bg-background border-border/50 h-12 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="p-8 animate-pulse flex gap-6">
                <div className="w-16 h-16 bg-secondary/30 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-1/4 bg-secondary/30 rounded" />
                  <div className="h-8 w-full bg-secondary/30 rounded" />
                </div>
              </div>
            ))
          ) : reviews.length === 0 ? (
            <div className="p-20 text-center text-muted-foreground font-bold">
              No reviews found.
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="p-8 hover:bg-secondary/5 transition-colors group">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Product Info */}
                  <div className="lg:w-64 shrink-0 space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden border border-border/50 bg-secondary/20">
                      <img 
                        src={review.product?.images?.[0]} 
                        alt={review.product?.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm line-clamp-1">{review.product?.name}</h4>
                      <Link 
                        href={`/shop/${review.product?.slug}`}
                        className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1"
                        target="_blank"
                      >
                        View Product <ExternalLink className="h-2 w-2" />
                      </Link>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm">{review.name}</h5>
                          <p className="text-[10px] text-muted-foreground font-bold">
                            {format(new Date(review.createdAt), 'PPP', { locale: dateLocale })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-secondary/10 p-5 rounded-2xl border border-border/30">
                      <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                        "{review.comment}"
                      </p>
                    </div>

                    {review.commentReply && (
                      <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary space-y-1">
                        <p className="text-[10px] font-black uppercase text-primary">Admin Response</p>
                        <p className="text-xs font-medium italic">"{review.commentReply}"</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="rounded-lg h-6 px-2 font-bold bg-emerald-50 text-emerald-600 border-emerald-100">
                          Verified Purchase
                        </Badge>
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/shop/${review.product?.slug}`}>
                          <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 font-bold gap-2">
                            <Reply className="h-4 w-4" />
                            Reply on Page
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-xl h-10 px-4 font-bold text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(review._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-8 bg-secondary/5 flex justify-center items-center gap-4">
            <Button 
              variant="outline" 
              className="rounded-xl h-10 w-10 p-0"
              disabled={pagination.page === 1}
              onClick={() => setPagination({...pagination, page: pagination.page - 1})}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-black">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button 
              variant="outline" 
              className="rounded-xl h-10 w-10 p-0"
              disabled={pagination.page === pagination.pages}
              onClick={() => setPagination({...pagination, page: pagination.page + 1})}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
