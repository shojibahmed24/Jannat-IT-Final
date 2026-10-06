import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export default function MagneticButton({ children, onClick, className = '', href }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Inner = () => (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="w-full h-full flex items-center justify-center"
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        className={`relative inline-flex group ${className}`}
      >
        <a href={href} className="w-full h-full block">
          <Inner />
        </a>
      </div>
    );
  }

  return (
    <button
      ref={ref as any}
      onMouseMove={handleMouse as any}
      onMouseLeave={reset}
      onClick={onClick}
      className={`relative inline-flex group ${className}`}
    >
      <Inner />
    </button>
  );
}
