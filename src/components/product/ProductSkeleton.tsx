'use client';

import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 animate-pulse">
      <div className="aspect-[4/5] bg-secondary/30" />
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-secondary rounded" />
          <div className="h-5 w-full bg-secondary rounded" />
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 bg-secondary rounded-full" />
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-2">
            <div className="h-6 w-16 bg-secondary rounded" />
            <div className="h-4 w-12 bg-secondary rounded" />
          </div>
          <div className="h-11 w-11 bg-secondary rounded-xl" />
        </div>
      </div>
    </div>
  );
}
