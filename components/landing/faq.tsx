'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'How does FitMitra AI generate my workout?',
    answer:
      'FitMitra uses an advanced AI model to analyze your goals, current stats, available equipment, and past performance. It generates a dynamic day-by-day plan that adapts instantly if you miss a day or feel too sore.'
  },
  {
    question: 'Is natural language food logging accurate?',
    answer:
      'Yes! You can simply type or say "I had a bowl of rice and 2 eggs" and our AI cross-references it with a massive nutritional database to extract the exact macros (Protein, Carbs, Fats) and calories with high precision.'
  },
  {
    question: 'Do I need a gym membership to use FitMitra?',
    answer:
      'Not at all. When you set up your profile, you can select "Home", "No Equipment", or "Dumbbells Only". The AI will generate effective bodyweight or minimal-equipment workouts tailored to what you actually have.'
  },
  {
    question: 'Is my personal health data secure?',
    answer:
      'Absolutely. Your health and fitness data is encrypted and securely stored. We do not sell your personal data to third parties, and the AI models process your logs securely to provide personalized insights.'
  },
  {
    question: 'What happens if my goals change?',
    answer:
      'You can update your goal (e.g., from Weight Loss to Muscle Gain) at any time in the dashboard. The AI will immediately recalculate your daily calorie targets, macros, and adjust your workout volume to match your new objective.'
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50 dark:bg-black transition-colors duration-500 border-t border-slate-200 dark:border-white/[0.04]">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Got Questions?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Everything you need to know about the FitMitra AI platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                  isOpen
                    ? 'bg-white dark:bg-slate-900/50 border-emerald-500/30 dark:border-emerald-500/30'
                    : 'bg-white dark:bg-slate-900/20 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-6 text-left"
                >
                  <span className={`text-lg font-semibold transition-colors ${
                    isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 ml-4 p-2 rounded-full transition-colors ${
                    isOpen ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
