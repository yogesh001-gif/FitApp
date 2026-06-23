'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Dumbbell, Salad } from 'lucide-react';

const features = [
  {
    title: 'AI Food Analysis',
    description: 'Natural language nutrition logging with Gemini-backed parsing and validation.',
    icon: Sparkles,
    className: 'md:col-span-2 md:row-span-2',
    color: 'from-emerald-500/20 to-transparent',
    iconColor: 'text-emerald-400'
  },
  {
    title: 'Dynamic Targets',
    description: 'All calorie and macro targets derive from user profile data and goal logic.',
    icon: Flame,
    className: 'md:col-span-1 md:row-span-1',
    color: 'from-orange-500/20 to-transparent',
    iconColor: 'text-orange-400'
  },
  {
    title: 'Workout Generation',
    description: 'Personalized training plans are generated from current context.',
    icon: Dumbbell,
    className: 'md:col-span-1 md:row-span-1',
    color: 'from-purple-500/20 to-transparent',
    iconColor: 'text-purple-400'
  },
  {
    title: 'Coach + Insights',
    description: 'Context-aware coaching across nutrition, recovery, and progress.',
    icon: Salad,
    className: 'md:col-span-2 md:row-span-1',
    color: 'from-blue-500/20 to-transparent',
    iconColor: 'text-blue-400'
  }
];

function BentoCard({ feature }: { feature: typeof features[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 p-8 group cursor-default ${feature.className}`}
    >
      {/* Mouse Follow Glow */}
      <div 
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      
      {/* Fixed Gradient */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${feature.color} rounded-full blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 border border-white/5 group-hover:scale-110 transition-transform duration-500">
          <feature.icon className={feature.iconColor} size={24} />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-white tracking-tight">{feature.title}</h3>
        <p className="text-slate-400 leading-relaxed max-w-sm">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <section className="py-24 bg-black">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything you need. Nothing you don't.</h2>
          <p className="text-lg text-slate-400">A complete suite of AI tools designed for one purpose: your results.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 auto-rows-[250px]">
          {features.map((feature, i) => (
            <BentoCard key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
