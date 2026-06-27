'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Database, Brain } from 'lucide-react';

export function TrustSection() {
  return (
    <section className="border-y border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-950/50 backdrop-blur transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center pt-4 md:pt-0"
          >
            <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-slate-300">
              <Database size={16} className="text-emerald-500 dark:text-emerald-400" />
              <span className="text-sm font-medium uppercase tracking-wider">Scale</span>
            </div>
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">10,000+</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Workouts Logged</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center pt-8 md:pt-0"
          >
            <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-slate-300">
              <Brain size={16} className="text-blue-500 dark:text-blue-400" />
              <span className="text-sm font-medium uppercase tracking-wider">Intelligence</span>
            </div>
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">Gemini AI</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Powered by Google</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center pt-8 md:pt-0"
          >
            <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-slate-300">
              <ShieldCheck size={16} className="text-purple-500 dark:text-purple-400" />
              <span className="text-sm font-medium uppercase tracking-wider">Security</span>
            </div>
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">99.9%</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Secure Cloud Uptime</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
