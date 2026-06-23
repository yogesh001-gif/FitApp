'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, Apple, Dumbbell, Sparkles, Trophy } from 'lucide-react';

const steps = [
  { icon: Target, title: "1. Set Goal", desc: "Define your dream physique." },
  { icon: Apple, title: "2. Track Food", desc: "Log meals in plain English." },
  { icon: Dumbbell, title: "3. Train", desc: "Follow dynamic AI routines." },
  { icon: Sparkles, title: "4. Get Feedback", desc: "AI adjusts based on your data." },
  { icon: Trophy, title: "5. Achieve", desc: "Watch the results compound." },
];

export function HowItWorksTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const lineWidth = useTransform(scrollYProgress, [0.3, 0.7], ['0%', '100%']);

  return (
    <section ref={containerRef} className="py-32 bg-slate-950 overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl font-bold text-white mb-4">How it works</h2>
          <p className="text-lg text-slate-400">A seamless loop of tracking, adapting, and growing.</p>
        </div>

        <div className="relative">
          {/* Background Line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-white/5 rounded-full" />
          
          {/* Animated Fill Line */}
          <motion.div 
            style={{ width: lineWidth }}
            className="hidden md:block absolute top-8 left-0 h-1 bg-emerald-400 rounded-full origin-left"
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mb-6 group-hover:border-emerald-400/50 group-hover:bg-emerald-400/10 transition-colors shadow-xl">
                  <step.icon className="text-slate-400 group-hover:text-emerald-400 transition-colors" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
