'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-white dark:bg-none dark:bg-black transition-colors duration-500">
      
      {/* Dark mode subtle ambient */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 flex flex-col justify-between h-full py-10"
        >
          <div>
            <h1 className="hidden lg:block text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
              <motion.span variants={lineVariants} className="block">The Future of AI</motion.span>
              <motion.span variants={lineVariants} className="block text-slate-500 dark:text-emerald-400">Powered Workout</motion.span>
            </h1>

            <motion.p variants={lineVariants} className="hidden lg:block max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-10">
              Get personalized workouts, real-time performance tracking, and smarter training plans powered by AI. Build strength, burn calories, and reach your fitness goals faster.
            </motion.p>

            <motion.div variants={lineVariants} className="flex flex-wrap items-center gap-6">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white dark:from-emerald-500 dark:to-teal-500 px-8 py-4 text-lg font-semibold shadow-[0_0_20px_rgba(245,158,11,0.4)] dark:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all duration-200"
              >
                Start Training
                <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                Download the App
              </Link>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div variants={lineVariants} className="grid grid-cols-3 gap-8 pt-12 mt-12 border-t border-slate-200 dark:border-white/10">
            <div>
              <div className="text-3xl sm:text-4xl font-light text-slate-900 dark:text-white mb-1">24/7</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">AI Coach</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-light text-slate-900 dark:text-white mb-1">250+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Smart Workouts</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-light text-slate-900 dark:text-white mb-1">100%</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Personalized</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content: Mobile Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 20, rotate: -2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="relative lg:ml-auto w-full max-w-[340px] aspect-[1/2.1] mx-auto"
        >
          {/* Phone Frame */}
          <div className="absolute inset-0 rounded-[3rem] border-[12px] border-slate-900 dark:border-slate-800 bg-white shadow-2xl overflow-hidden z-10">
            <Image
              src="/fit_boy_hero_1782557800356.png"
              alt="Mobile App Interface"
              fill
              className="object-cover"
              priority
            />
            
            {/* Top Status Bar Mock */}
            <div className="absolute top-0 w-full h-12 bg-gradient-to-b from-black/20 to-transparent z-20 flex items-start justify-between px-6 pt-3">
              <span className="text-[10px] font-medium text-slate-800">8:00</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2.5 bg-slate-800 rounded-sm" />
                <div className="w-3 h-2.5 bg-slate-800 rounded-sm" />
              </div>
            </div>

            {/* UI Overlays */}
            <div className="absolute inset-0 z-30 pointer-events-none p-5 flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-center justify-between mt-8">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-white rotate-180" />
                </div>
                <span className="font-semibold text-slate-800">Workout</span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" /><div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" /><div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating Tags */}
              <div className="absolute top-[35%] left-[-10px]">
                <div className="relative">
                  <div className="px-3 py-1.5 bg-white/30 backdrop-blur-md rounded-full border border-white/40 shadow-lg flex items-center gap-2">
                    <span className="text-[9px] font-bold text-white tracking-wider">210 CALS BURN</span>
                  </div>
                  <div className="absolute -right-2 top-1/2 w-8 h-px bg-white/50" />
                  <div className="absolute -right-3 top-1/2 w-2 h-2 rounded-full bg-white -translate-y-1/2" />
                </div>
              </div>

              <div className="absolute top-[55%] right-[20px]">
                <div className="relative">
                  <div className="absolute -left-12 top-1/2 w-12 h-px bg-white/50" />
                  <div className="absolute -left-13 top-1/2 w-2 h-2 rounded-full bg-white -translate-y-1/2" />
                  <div className="px-3 py-1.5 bg-white/30 backdrop-blur-md rounded-full border border-white/40 shadow-lg ml-2">
                    <span className="text-[9px] font-bold text-white tracking-wider">580 CALS BURN</span>
                  </div>
                </div>
              </div>

              {/* Bottom Player Card */}
              <div className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/50 dark:border-white/10 mb-2 pointer-events-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-medium text-slate-800 dark:text-slate-300 w-4">0</span>
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div className="h-full bg-yellow-500 dark:bg-emerald-500 w-[30%]" />
                    <div className="h-full bg-yellow-300 dark:bg-emerald-300 w-[15%]" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center shrink-0">
                    <Play className="w-2.5 h-2.5 text-white dark:text-black ml-0.5" />
                  </div>
                </div>
                
                <div className="flex justify-between items-end gap-2">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-2.5 flex-1">
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 mb-1">12 of 26</div>
                    <div className="w-6 h-1.5 bg-yellow-500 dark:bg-emerald-500 rounded-full" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-2.5 flex-[1.5] flex flex-col items-center justify-center">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">28</div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400">Dumbbell</div>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-2.5 flex-1 flex flex-col items-end">
                    <div className="text-[10px] font-bold text-slate-900 dark:text-white mb-1">01: 49</div>
                    <div className="w-6 h-1.5 bg-yellow-500 dark:bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Decorative blur behind phone */}
          <div className="absolute -inset-10 bg-yellow-500/20 dark:bg-emerald-500/20 blur-3xl -z-10 rounded-full" />
        </motion.div>

      </div>
    </section>
  );
}
