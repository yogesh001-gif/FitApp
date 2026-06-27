'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Helped me gain 6kg of lean mass in 3 months. The dynamic workouts adjusted perfectly when I only had dumbbells available.",
    author: "Rahul S.",
    role: "Muscle Gain Goal",
    avatar: "R",
  },
  {
    quote: "The best fitness tracking app I've used. Logging food in plain English instead of searching a huge database saves me 15 minutes a day.",
    author: "Aman K.",
    role: "Weight Loss Goal",
    avatar: "A",
  },
  {
    quote: "It feels like having a real coach. When I missed my calorie target, it didn't guilt me, it just adjusted my macros for the rest of the week.",
    author: "Priya M.",
    role: "Body Recomposition",
    avatar: "P",
  },
  {
    quote: "I lost 8kg in 4 months without ever feeling like I was on a diet. The AI just made the right adjustments every single week.",
    author: "Vikram T.",
    role: "Fat Loss Goal",
    avatar: "V",
  },
  {
    quote: "Finally an app that understands I have a busy schedule. It adapted my workout plan when I told it I only had 20 minutes.",
    author: "Sneha R.",
    role: "Busy Professional",
    avatar: "S",
  },
  {
    quote: "The progress charts are incredibly motivating. Seeing the weekly trend lines move is addictive in the best possible way.",
    author: "Aditya P.",
    role: "Strength Building",
    avatar: "A",
  },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[320px] sm:w-[360px] rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-900/50 p-6 flex flex-col justify-between mx-2.5 shadow-sm dark:shadow-none transition-colors">
      <div>
        <div className="flex gap-0.5 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={12} className="text-yellow-500/80 fill-yellow-500/80" />
          ))}
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">"{t.quote}"</p>
      </div>
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs font-medium flex-shrink-0">
          {t.avatar}
        </div>
        <div>
          <p className="text-slate-900 dark:text-white text-sm font-medium">{t.author}</p>
          <p className="text-xs text-slate-500">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

const allTestimonials = [...testimonials, ...testimonials];

export function Testimonials() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-black overflow-hidden transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Don't just take our word for it.</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">Join thousands of users transforming their approach to fitness.</p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-black to-transparent z-10 pointer-events-none transition-colors" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-black to-transparent z-10 pointer-events-none transition-colors" />

        <div className="flex animate-marquee hover:pause-marquee">
          {allTestimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
