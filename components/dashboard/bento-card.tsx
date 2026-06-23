'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  gradient?: 'primary' | 'secondary' | 'none';
}

export function BentoCard({ children, className, delay = 0, gradient = 'none' }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.01, y: -2 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-6 backdrop-blur-xl transition-all duration-500 hover:shadow-glow hover:border-white/20",
        className
      )}
    >
      {/* Background ambient glow based on type */}
      {gradient === 'primary' && (
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl transition-all duration-500 group-hover:bg-primary/30 group-hover:blur-2xl" />
      )}
      {gradient === 'secondary' && (
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-secondary/20 blur-3xl transition-all duration-500 group-hover:bg-secondary/30 group-hover:blur-2xl" />
      )}

      {/* Shine effect overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
