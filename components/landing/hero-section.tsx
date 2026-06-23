'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Droplets, Dumbbell } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
      {/* Subtle Floating Data Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        
        <motion.div 
          className="absolute top-1/3 left-[5%] text-emerald-400/20 font-bold text-4xl blur-[2px]"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          +2kg Muscle
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/3 right-[5%] text-blue-400/20 font-bold text-5xl blur-[3px]"
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          150g Protein
        </motion.div>
        
        <motion.div 
          className="absolute top-1/2 right-[15%] text-purple-400/20 font-bold text-3xl blur-[1px]"
          animate={{ x: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          87% Recovery
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >

          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl leading-tight">
            Fitness guidance that gets <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-400">smarter</span> every day.
          </h1>
          
          <p className="max-w-xl text-lg leading-8 text-slate-300">
            Personalized workouts, nutrition insights, progress tracking, and AI coaching built strictly around your actual habits and daily data.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <SignedOut>
              <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-full bg-white text-black px-8 py-4 font-medium hover:bg-slate-200 transition-colors">
                Start for free <ArrowRight size={18} />
              </Link>
              <Link href="/sign-in" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 backdrop-blur px-8 py-4 font-medium text-white hover:bg-white/10 transition-colors">
                View live demo
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-emerald-400 text-black px-8 py-4 font-medium hover:bg-emerald-300 transition-colors shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            </SignedIn>
          </div>
        </motion.div>

        {/* Right: Interactive Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Main Dashboard Card */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 shadow-2xl relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-white font-medium text-lg">Daily Summary</h3>
                <p className="text-slate-400 text-sm">Today's live metrics</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Activity size={16} />
              </div>
            </div>

            <div className="space-y-6">
              {/* Calories */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Calories</span>
                  <span className="text-white font-medium">2,450 / 2,600 kcal</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
                  />
                </div>
              </div>

              {/* Protein */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Protein</span>
                  <span className="text-white font-medium">142 / 150 g</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '90%' }}
                    transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {/* Workout Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="rounded-xl border border-white/5 bg-white/5 p-4"
                >
                  <Dumbbell className="text-purple-400 mb-2" size={20} />
                  <p className="text-sm text-slate-400">Workout</p>
                  <p className="text-white font-medium">Push Day</p>
                  <p className="text-xs text-emerald-400 mt-1">Completed</p>
                </motion.div>

                {/* Water Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="rounded-xl border border-white/5 bg-white/5 p-4"
                >
                  <Droplets className="text-blue-400 mb-2" size={20} />
                  <p className="text-sm text-slate-400">Water</p>
                  <p className="text-white font-medium">3.2L</p>
                  <p className="text-xs text-blue-400 mt-1">On track</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Decorative Elements behind dashboard */}
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50 z-0 animate-pulse"></div>
        </motion.div>
      </div>
    </section>
  );
}
