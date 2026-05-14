'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
  maxFiles?: number;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  maxFiles = 5
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`);
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const { data } = await axios.post('/api/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (data.success) {
          uploadedUrls.push(data.url);
        }
      }
      onChange([...value, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AnimatePresence>
          {value.map((url) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-border/50 bg-secondary/20 group"
            >
              <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {value.length < maxFiles && (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="relative aspect-square rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <>
                <div className="p-3 bg-secondary/50 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">Upload Image</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        multiple
        accept="image/*"
      />
      <p className="text-xs text-muted-foreground font-medium">
        Max {maxFiles} images. Recommended size: 1000x1000px.
      </p>
    </div>
  );
}
