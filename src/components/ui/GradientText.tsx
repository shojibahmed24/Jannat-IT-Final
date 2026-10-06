import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function GradientText({ children, className = '', as: Component = 'span' }: GradientTextProps) {
  return (
    <Component className={`shimmer-text ${className}`}>
      {children}
    </Component>
  );
}
