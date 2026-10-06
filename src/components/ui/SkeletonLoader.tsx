import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
}

export default function SkeletonLoader({ className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
}
