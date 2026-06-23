'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const comparisonData = [
  { feature: "AI Coaching & Adjustments", fitapp: true, notes: false },
  { feature: "Personalized Workout Generation", fitapp: true, notes: false },
  { feature: "Natural Language Food Logging", fitapp: true, notes: false },
  { feature: "Visual Progress Tracking", fitapp: true, notes: false },
  { feature: "Free-form text entry", fitapp: true, notes: true },
];

export function ComparisonTable() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why upgrade your tracking?</h2>
          <p className="text-lg text-slate-400">Stop fighting with spreadsheets and basic notes.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur overflow-hidden"
        >
          <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-3 border-b border-white/10 bg-slate-900/80 p-4 md:p-6 text-sm md:text-base">
            <div className="text-slate-400 font-medium">Features</div>
            <div className="text-center font-bold text-emerald-400">FITAPP</div>
            <div className="text-center font-medium text-slate-500">Notes App</div>
          </div>

          <div className="divide-y divide-white/5">
            {comparisonData.map((row, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-3 p-4 md:p-6 items-center hover:bg-white/[0.02] transition-colors text-sm md:text-base">
                <div className="text-slate-300 font-medium">{row.feature}</div>
                <div className="flex justify-center">
                  {row.fitapp ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  ) : (
                    <X className="text-slate-600" size={20} />
                  )}
                </div>
                <div className="flex justify-center">
                  {row.notes ? (
                    <Check className="text-slate-500" size={20} />
                  ) : (
                    <X className="text-slate-600" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
