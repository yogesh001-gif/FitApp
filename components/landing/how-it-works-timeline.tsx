'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, Apple, Dumbbell, Sparkles, Trophy } from 'lucide-react';

const steps = [
  { icon: Target,   title: 'Set Your Goal',  desc: 'Define your dream physique in plain English.',      num: '01' },
  { icon: Apple,    title: 'Track Food',      desc: 'Log meals naturally — no barcode scanner needed.',  num: '02' },
  { icon: Dumbbell, title: 'Train',           desc: 'Follow AI-generated routines built for you.',       num: '03' },
  { icon: Sparkles, title: 'Get Feedback',    desc: 'AI adapts every plan based on your real data.',     num: '04' },
  { icon: Trophy,   title: 'Achieve',         desc: 'Watch your results compound week over week.',       num: '05' },
];

export function HowItWorksTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineWidth = useTransform(scrollYProgress, [0.25, 0.7], ['0%', '100%']);

  return (
    <section ref={containerRef} className="py-32 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">How FitMitra works</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">A seamless loop of tracking, adapting, and growing.</p>
        </motion.div>

        <div className="relative">
          {/* Background line */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-slate-200 dark:bg-white/5" />

          {/* Animated fill */}
          <motion.div
            style={{ width: lineWidth }}
            className="hidden md:block absolute top-8 left-[10%] h-px bg-yellow-500 dark:bg-emerald-400/60 origin-left"
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-4 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                className="flex flex-col items-center text-center group"
              >
                <div className="text-[10px] font-medium tracking-widest text-slate-500 mb-3">{step.num}</div>

                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] flex items-center justify-center mb-5 group-hover:border-slate-300 dark:group-hover:border-white/15 transition-colors duration-300">
                  <step.icon className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300" size={22} />
                </div>

                <h3 className="text-slate-900 dark:text-white font-semibold mb-2 text-sm sm:text-base">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
