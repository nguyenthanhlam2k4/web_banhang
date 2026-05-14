'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2, MessageSquare, Image as ImageIcon, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useTranslations } from 'next-intl';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  orderId: string;
  onSuccess?: () => void;
}

export function ReviewModal({ isOpen, onClose, productId, productName, orderId, onSuccess }: ReviewModalProps) {
  const t = useTranslations('Product.reviews');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 3) {
      toast.error('You can only upload up to 3 images');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axios.post('/api/upload', formData);
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setImages([...images, ...urls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error(t('commentRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post(`/api/products/${productId}/reviews`, {
        rating,
        comment: comment.trim(),
        images,
        orderId,
      });

      if (data.success) {
        toast.success(t('submitSuccess'));
        if (onSuccess) onSuccess();
        onClose();
        setComment('');
        setRating(5);
        setImages([]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0">
        <div className="bg-primary/5 p-8 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              {t('writeReview')}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium pt-2">
              {productName}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          {/* Rating */}
          <div className="space-y-3 text-center sm:text-left">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              {t('rating')}
            </label>
            <div className="flex justify-center sm:justify-start gap-2">
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    className="transition-transform hover:scale-110 active:scale-95"
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starValue)}
                  >
                    <Star 
                      className={`h-10 w-10 transition-colors ${
                        (hoverRating || rating) >= starValue 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted-foreground/20'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              {t('comment')}
            </label>
            <Textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('commentPlaceholder')}
              className="rounded-[1.5rem] min-h-[120px] bg-secondary/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 resize-none p-5 text-sm font-medium leading-relaxed"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Images (Max 3)
            </label>
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative h-20 w-20 rounded-2xl overflow-hidden border border-border group">
                  <img src={url} alt="Review" className="h-full w-full object-cover" />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="h-20 w-20 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    <>
                      <ImageIcon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      <Plus className="h-3 w-3 text-muted-foreground mt-1 group-hover:text-primary" />
                    </>
                  )}
                </label>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 flex-col sm:flex-row gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="rounded-2xl h-12 font-bold px-8"
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || uploading} 
            className="rounded-2xl h-12 px-10 font-bold gap-2 shadow-xl shadow-primary/20 flex-1 sm:flex-none"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {t('submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
