import React from 'react';
import { motion } from 'motion/react';

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export default function FloatingElement({ 
  children, 
  delay = 0, 
  duration = 4, 
  yOffset = 15,
  className = '' 
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{ y: [0, -yOffset, 0] }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
