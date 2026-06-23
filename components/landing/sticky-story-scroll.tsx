'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function StickyStoryScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a tall container to allow scrolling
  // Map scroll progress (0 to 1) to different stages
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Opacities for the text on the left
  const text1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const text4Opacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);

  // Phone Mockup Scaling and Position
  const phoneScale = useTransform(scrollYProgress, [0, 0.25, 1], [1, 0.85, 0.85]);
  const phoneY = useTransform(scrollYProgress, [0, 0.25], ['0%', '0%']);

  // UI States inside the phone
  const ui1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
  const ui2Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
  const ui3Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const ui4Opacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        
        <div className="mx-auto max-w-7xl px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Changing Story Text */}
          <div className="relative h-48 md:h-64 flex items-center text-center lg:text-left z-10">
            <motion.div style={{ opacity: text1Opacity }} className="absolute inset-0 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Tell us your goal.</h2>
              <p className="text-xl text-slate-400">Answer a few simple questions in natural language. We build your profile instantly.</p>
            </motion.div>
            
            <motion.div style={{ opacity: text2Opacity }} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get a dynamic diet plan.</h2>
              <p className="text-xl text-slate-400">Your macros and calories adapt automatically based on your daily feedback.</p>
            </motion.div>
            
            <motion.div style={{ opacity: text3Opacity }} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Train smarter.</h2>
              <p className="text-xl text-slate-400">Workouts generated specifically for your available equipment and recovery state.</p>
            </motion.div>

            <motion.div style={{ opacity: text4Opacity }} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Watch the progress.</h2>
              <p className="text-xl text-slate-400">See your body transform. Log photos and watch the metrics climb.</p>
            </motion.div>
          </div>

          {/* Right: Phone/Dashboard Mockup */}
          <div className="flex justify-center items-center h-full pb-20 lg:pb-0 scale-[0.8] md:scale-90 lg:scale-100 origin-top">
            <motion.div 
              style={{ scale: phoneScale, y: phoneY }}
              className="relative w-[320px] h-[650px] bg-slate-950 rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden"
            >
              {/* UI 1: Chat/Goal Input */}
              <motion.div style={{ opacity: ui1Opacity }} className="absolute inset-0 p-6 bg-slate-900 flex flex-col justify-end gap-4">
                <div className="bg-emerald-500/20 text-emerald-300 p-4 rounded-2xl rounded-tl-sm self-start max-w-[80%] text-sm">
                  What is your primary fitness goal?
                </div>
                <div className="bg-blue-500/20 text-blue-300 p-4 rounded-2xl rounded-tr-sm self-end max-w-[80%] text-sm">
                  I want to lose 5kg for my wedding in 3 months. I only have dumbbells at home.
                </div>
                <div className="h-12 bg-slate-800 rounded-full mt-4 flex items-center px-4 opacity-50">
                  <span className="w-1.5 h-4 bg-emerald-400 animate-pulse rounded-full"></span>
                </div>
              </motion.div>

              {/* UI 2: Diet Plan */}
              <motion.div style={{ opacity: ui2Opacity }} className="absolute inset-0 p-6 bg-slate-900 pointer-events-none flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white mb-2">Today's Nutrition</h3>
                <div className="h-32 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-white">1,850</span>
                  <span className="text-sm text-emerald-400">kcal target</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-20 rounded-xl bg-slate-800 p-2 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 uppercase">Protein</span>
                    <span className="text-white font-medium">160g</span>
                  </div>
                  <div className="h-20 rounded-xl bg-slate-800 p-2 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 uppercase">Carbs</span>
                    <span className="text-white font-medium">120g</span>
                  </div>
                  <div className="h-20 rounded-xl bg-slate-800 p-2 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 uppercase">Fats</span>
                    <span className="text-white font-medium">65g</span>
                  </div>
                </div>
              </motion.div>

              {/* UI 3: Workout */}
              <motion.div style={{ opacity: ui3Opacity }} className="absolute inset-0 p-6 bg-slate-900 pointer-events-none flex flex-col gap-3">
                <h3 className="text-lg font-bold text-white mb-2">Dumbbell Upper Body</h3>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-800 border border-white/5 flex items-center px-4 gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">{i}</div>
                    <div className="flex-1">
                      <div className="h-3 w-24 bg-slate-600 rounded-full mb-2"></div>
                      <div className="h-2 w-16 bg-slate-700 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* UI 4: Progress Charts */}
              <motion.div style={{ opacity: ui4Opacity }} className="absolute inset-0 p-6 bg-slate-900 pointer-events-none flex flex-col gap-4 justify-center">
                <h3 className="text-lg font-bold text-white">Weight Trend</h3>
                <div className="h-48 rounded-xl bg-slate-800 border border-white/5 relative flex items-end p-4 gap-2">
                  {[40, 35, 30, 25, 20, 15, 10].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-400/50 rounded-t-sm" style={{ height: `${80 - h}%` }}></div>
                  ))}
                  {/* Overlay a smooth line conceptually */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M 20,80 Q 80,60 140,50 T 260,20" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 font-bold">-4.2 kg this month!</span>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
