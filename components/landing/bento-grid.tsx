'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Dumbbell, Salad } from 'lucide-react';

const features = [
  {
    title: 'AI Food Analysis',
    description: 'Natural language nutrition logging with Gemini-backed parsing and instant macro breakdown.',
    icon: Sparkles,
    className: 'md:col-span-2 md:row-span-2',
    iconColor: 'text-emerald-400',
    delay: 0,
  },
  {
    title: 'Dynamic Targets',
    description: 'Calorie and macro targets that auto-adjust from your profile and goal progress.',
    icon: Flame,
    className: 'md:col-span-1 md:row-span-1',
    iconColor: 'text-orange-400',
    delay: 0.08,
  },
  {
    title: 'Workout Generation',
    description: 'Personalised training from your current context and recovery state.',
    icon: Dumbbell,
    className: 'md:col-span-1 md:row-span-1',
    iconColor: 'text-purple-400',
    delay: 0.16,
  },
  {
    title: 'Coach + Insights',
    description: 'Context-aware coaching across nutrition, recovery, and long-term progress.',
    icon: Salad,
    className: 'md:col-span-2 md:row-span-1',
    iconColor: 'text-blue-400',
    delay: 0.12,
  },
];

function BentoCard({ feature }: { feature: typeof features[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: feature.delay, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] p-8 group cursor-default hover:border-slate-300 dark:hover:border-white/[0.12] shadow-sm dark:shadow-none transition-colors duration-300 ${feature.className}`}
    >
      {/* Subtle mouse follow — very dim */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.03), transparent 40%)`,
        }}
      />

      <div className="relative z-10 h-full flex flex-col">
        <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
          <feature.icon className={feature.iconColor} size={20} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white tracking-tight">{feature.title}</h3>
        <p className="text-slate-600 dark:text-slate-500 leading-relaxed text-sm max-w-sm">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-black transition-colors duration-500">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Everything you need.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">A complete suite of AI tools designed for one purpose: your results.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-3 auto-rows-[220px]">
          {features.map((feature, i) => (
            <BentoCard key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
