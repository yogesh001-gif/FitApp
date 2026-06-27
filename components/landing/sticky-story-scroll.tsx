'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Bell, Menu, ArrowUpRight, Heart, Home, BarChart2, Sparkles, Map, Settings } from 'lucide-react';

const macros = [
  { label: 'Protein', val: '160g', color: 'text-blue-500 dark:text-blue-400' },
  { label: 'Carbs', val: '120g', color: 'text-orange-500 dark:text-orange-400' },
  { label: 'Fats', val: '65g', color: 'text-yellow-500 dark:text-yellow-400' },
];

const meals = [
  { name: '🥚 Breakfast', cal: '480 kcal', pct: '74%' },
  { name: '🥗 Lunch', cal: '620 kcal', pct: '96%' },
];

const exercises = [
  { name: 'Dumbbell Press', sets: '4 × 10', done: false },
  { name: 'Bent Over Row', sets: '3 × 12', done: false },
  { name: 'Lateral Raises', sets: '3 × 15', done: true },
];

export function StickyStoryScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Text panel opacity + Y slide
  const t1o = useTransform(scrollYProgress, [0, 0.08, 0.21, 0.25], [0, 1, 1, 0]);
  const t1y = useTransform(scrollYProgress, [0, 0.08, 0.21, 0.25], [14, 0, 0, -14]);

  const t2o = useTransform(scrollYProgress, [0.24, 0.33, 0.46, 0.5], [0, 1, 1, 0]);
  const t2y = useTransform(scrollYProgress, [0.24, 0.33, 0.46, 0.5], [14, 0, 0, -14]);

  const t3o = useTransform(scrollYProgress, [0.49, 0.58, 0.71, 0.75], [0, 1, 1, 0]);
  const t3y = useTransform(scrollYProgress, [0.49, 0.58, 0.71, 0.75], [14, 0, 0, -14]);

  const t4o = useTransform(scrollYProgress, [0.74, 0.83, 1], [0, 1, 1]);
  const t4y = useTransform(scrollYProgress, [0.74, 0.83], [14, 0]);

  // Phone UI states opacity
  const u1o = useTransform(scrollYProgress, [0, 0.06, 0.21, 0.25], [0, 1, 1, 0]);
  const u2o = useTransform(scrollYProgress, [0.24, 0.33, 0.46, 0.5], [0, 1, 1, 0]);
  const u3o = useTransform(scrollYProgress, [0.49, 0.58, 0.71, 0.75], [0, 1, 1, 0]);
  const u4o = useTransform(scrollYProgress, [0.74, 0.83, 1], [0, 1, 1]);

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const d1o = useTransform(scrollYProgress, [0, 0.04, 0.22, 0.25], [0.4, 1, 1, 0.4]);
  const d2o = useTransform(scrollYProgress, [0.24, 0.3, 0.47, 0.5], [0.4, 1, 1, 0.4]);
  const d3o = useTransform(scrollYProgress, [0.49, 0.55, 0.72, 0.75], [0.4, 1, 1, 0.4]);
  const d4o = useTransform(scrollYProgress, [0.74, 0.8, 1], [0.4, 1, 1]);
  const d1s = useTransform(scrollYProgress, [0, 0.04, 0.22, 0.25], [1, 1.6, 1.6, 1]);
  const d2s = useTransform(scrollYProgress, [0.24, 0.3, 0.47, 0.5], [1, 1.6, 1.6, 1]);
  const d3s = useTransform(scrollYProgress, [0.49, 0.55, 0.72, 0.75], [1, 1.6, 1.6, 1]);
  const d4s = useTransform(scrollYProgress, [0.74, 0.8, 1], [1, 1.6, 1.6]);

  const dots = [
    { o: d1o, s: d1s },
    { o: d2o, s: d2s },
    { o: d3o, s: d3s },
    { o: d4o, s: d4s },
  ];

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-slate-50 dark:bg-black transition-colors duration-500">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">

        {/* Progress bar */}
        <div className="w-full h-0.5 bg-slate-200 dark:bg-white/5 flex-shrink-0">
          <motion.div
            style={{ width: progressWidth }}
            className="h-full bg-emerald-500 dark:bg-emerald-400/60"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 w-full">
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:gap-16 items-center gap-5">

              {/* ── Text panels (Hidden on mobile) ────────────────────────────────────── */}
              <div className="relative hidden lg:flex h-40 sm:h-48 lg:h-72 items-center text-center lg:text-left z-10">
                <motion.div style={{ opacity: t1o, y: t1y }} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                  <div className="inline-flex items-center gap-2 mb-3 justify-center lg:justify-start">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/60 text-[9px] flex items-center justify-center font-medium">1</span>
                    <span className="text-[10px] text-slate-500 tracking-widest uppercase">FitMitra AI Setup</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Tell us your goal.</h2>
                  <p className="text-sm sm:text-base lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">Answer a few simple questions in natural language. Our AI builds your profile instantly.</p>
                </motion.div>

                <motion.div style={{ opacity: t2o, y: t2y }} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                  <div className="inline-flex items-center gap-2 mb-3 justify-center lg:justify-start">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/60 text-[9px] flex items-center justify-center font-medium">2</span>
                    <span className="text-[10px] text-slate-500 tracking-widest uppercase">Smart Nutrition</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Get a dynamic diet plan.</h2>
                  <p className="text-sm sm:text-base lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">Your macros and calories adapt automatically based on your daily feedback and logged meals.</p>
                </motion.div>

                <motion.div style={{ opacity: t3o, y: t3y }} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                  <div className="inline-flex items-center gap-2 mb-3 justify-center lg:justify-start">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/60 text-[9px] flex items-center justify-center font-medium">3</span>
                    <span className="text-[10px] text-slate-500 tracking-widest uppercase">Adaptive Training</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Train smarter with AI.</h2>
                  <p className="text-sm sm:text-base lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">Workouts are generated specifically for your available equipment, current strength, and recovery state.</p>
                </motion.div>

                <motion.div style={{ opacity: t4o, y: t4y }} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                  <div className="inline-flex items-center gap-2 mb-3 justify-center lg:justify-start">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/60 text-[9px] flex items-center justify-center font-medium">4</span>
                    <span className="text-[10px] text-slate-500 tracking-widest uppercase">Live Progress</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Watch the transformation.</h2>
                  <p className="text-sm sm:text-base lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">See your body transform. Log your daily stats and watch the metrics climb on your dashboard.</p>
                </motion.div>
              </div>

              {/* ── Phone mockup (Redesigned) ────────────────────────────── */}
              <div className="flex justify-center items-center relative h-[380px] sm:h-[480px] lg:h-[600px] w-full mx-auto">
                {/* Fixed internal size, scaled down visually for small screens to prevent layout bugs */}
                <div className="relative w-[300px] h-[600px] scale-[0.62] sm:scale-75 lg:scale-100 origin-center flex-shrink-0 transition-transform duration-300">
                  <div className="absolute inset-0
                    bg-gradient-to-br from-[#e0f2fe] via-[#f0fdf4] to-[#fef3c7] dark:from-slate-900 dark:via-slate-800 dark:to-slate-950
                    rounded-[40px]
                    border-[8px] border-white dark:border-slate-800
                    shadow-2xl overflow-hidden flex flex-col"
                  >
                  {/* Status Bar */}
                  <div className="h-6 flex items-center justify-between px-4 pt-1 flex-shrink-0 z-50 relative">
                    <span className="text-[8px] font-semibold text-slate-800 dark:text-slate-300">9:40 PM</span>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-white dark:bg-slate-800 rounded-b-2xl shadow-sm z-50" />
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-2 rounded-sm border border-slate-800 dark:border-slate-400 p-[1px]">
                        <div className="w-full h-full bg-slate-800 dark:bg-slate-400 rounded-[1px]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Header */}
                  <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-blue-100 overflow-hidden relative border border-white shadow-sm">
                        <Image src="/fit_boy_avatar_1782557557031.png" alt="Avatar" fill className="object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-medium">Hello 👋</span>
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white">Rahul Sharma</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <Bell size={12} />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <Menu size={12} />
                      </button>
                    </div>
                  </div>

                  {/* AI Banner */}
                  <div className="px-4 py-2 flex-shrink-0 relative z-10">
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 rounded-2xl p-2.5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-emerald-400 flex items-center justify-center shadow-inner blur-[1px] relative">
                          <div className="absolute inset-[2px] bg-gradient-to-tl from-white/40 to-transparent rounded-full mix-blend-overlay"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-900 dark:text-white">AI Fitness Assistant</span>
                          <span className="text-[8px] text-slate-500 dark:text-slate-400">Smarter daily workouts.</span>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-white/5">
                        <ArrowUpRight size={12} />
                      </div>
                    </div>
                  </div>

                  {/* Calendar (Static decoration) */}
                  <div className="px-2 py-1 flex justify-between flex-shrink-0 overflow-hidden relative z-10">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map((day, i) => (
                      <div key={day} className={`flex flex-col items-center justify-center w-[42px] h-[52px] rounded-full border ${i === 3 ? 'border-purple-400 bg-white dark:bg-slate-800 shadow-md ring-2 ring-purple-100 dark:ring-purple-900/30' : 'border-white/50 dark:border-white/5 bg-white/30 dark:bg-white/5'}`}>
                        <span className="text-[7px] text-slate-500 mb-1">{day}</span>
                        <span className={`text-[10px] font-bold ${i === 3 ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{13 + i}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Dark Card Area */}
                  <div className="flex-1 mt-3 relative z-10 bg-[#1A1C23] rounded-t-[32px] overflow-hidden shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                    
                    {/* Layer 1: Setup/Chat */}
                    <motion.div style={{ opacity: u1o }} className="absolute inset-0 p-4 flex flex-col justify-end gap-2.5 bg-[#1A1C23] z-40">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-[8px] font-bold">AI</div>
                        <span className="text-[8px] text-slate-400">FitMitra Coach</span>
                      </div>
                      <div className="bg-slate-800 text-white p-2.5 rounded-2xl rounded-tl-sm self-start max-w-[85%] text-[9px] leading-relaxed">
                        What is your primary fitness goal?
                      </div>
                      <div className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 p-2.5 rounded-2xl rounded-tr-sm self-end max-w-[85%] text-[9px] leading-relaxed">
                        Lose 5kg for my wedding in 3 months. Only have dumbbells at home.
                      </div>
                      <div className="bg-slate-800 text-white p-2.5 rounded-2xl rounded-tl-sm self-start max-w-[75%] text-[9px] leading-relaxed">
                        Perfect! Building your plan… ✨
                      </div>
                      <div className="h-8 bg-slate-800/50 rounded-full mt-1 flex items-center px-3">
                        <span className="w-1 h-1 bg-purple-400 animate-pulse rounded-full" />
                        <span className="w-1 h-1 bg-purple-400 animate-pulse rounded-full mx-1 delay-75" />
                        <span className="w-1 h-1 bg-purple-400 animate-pulse rounded-full delay-150" />
                      </div>
                    </motion.div>

                    {/* Layer 2: Nutrition */}
                    <motion.div style={{ opacity: u2o }} className="absolute inset-0 p-4 bg-[#1A1C23] z-30 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[12px] font-bold text-white">Today's Nutrition</h3>
                        <span className="text-[8px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">On track ✓</span>
                      </div>
                      <div className="h-[60px] rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center flex-col gap-0.5 shadow-inner">
                        <span className="text-xl font-bold text-white">1,850</span>
                        <span className="text-[8px] text-slate-400">kcal target</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {macros.map((m) => (
                          <div key={m.label} className="h-14 rounded-xl bg-slate-800/80 p-1.5 flex flex-col justify-between">
                            <span className="text-[8px] text-slate-400 uppercase tracking-wide">{m.label}</span>
                            <span className={`text-[12px] font-bold ${m.color}`}>{m.val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1.5 mt-1">
                        {meals.map((meal) => (
                          <div key={meal.name} className="h-10 rounded-xl bg-slate-800/40 flex items-center justify-between px-3 gap-2">
                            <span className="text-[9px] text-slate-300 font-medium">{meal.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-1 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full" style={{ width: meal.pct }} />
                              </div>
                              <span className="text-[8px] text-slate-400 font-mono">{meal.cal}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Layer 3: Workout (Uses generated boy image) */}
                    <motion.div style={{ opacity: u3o }} className="absolute inset-0 z-20">
                      <Image src="/fit_boy_workout_1782557575427.png" alt="Workout" fill className="object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C23] via-[#1A1C23]/80 to-transparent"></div>
                      
                      <div className="absolute inset-0 p-4 flex flex-col justify-end gap-2 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-[8px] text-white font-medium">25 min</span>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                            <Heart size={12} />
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white leading-tight">AI Powers Your<br/>Muscle Growth</h2>
                        <p className="text-[10px] text-slate-300 mb-2">Smarter Muscle Growth.</p>
                        
                        <div className="space-y-1.5">
                          {exercises.map((ex, i) => (
                            <div key={i} className="h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center px-2.5 gap-2">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${ex.done ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300'}`}>
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-[9px] font-medium truncate ${ex.done ? 'text-slate-400 line-through' : 'text-white'}`}>{ex.name}</div>
                                <div className="text-[7px] text-slate-400">{ex.sets}</div>
                              </div>
                              {ex.done && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Layer 4: Progress */}
                    <motion.div style={{ opacity: u4o }} className="absolute inset-0 p-4 bg-[#1A1C23] z-10 flex flex-col gap-2">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-[12px] font-bold text-white">Weight Trend</h3>
                        <span className="text-[8px] text-purple-400 font-medium">This Month</span>
                      </div>
                      <div className="h-28 rounded-2xl bg-slate-800/50 border border-white/5 relative overflow-hidden flex items-end p-2 gap-1">
                        {[68, 64, 59, 53, 47, 40, 33].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm"
                            style={{ height: `${100 - h}%`, background: `rgba(168,85,247,${0.2 + (i / 7) * 0.8})` }}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center gap-1">
                          <span className="text-emerald-400 font-bold text-lg">-4.2kg</span>
                          <span className="text-[8px] text-slate-400">Total Lost</span>
                        </div>
                        <div className="h-16 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center gap-1">
                          <span className="text-purple-400 font-bold text-lg">94%</span>
                          <span className="text-[8px] text-slate-400">Goal Accuracy</span>
                        </div>
                      </div>
                      <div className="h-10 mt-1 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center px-3 gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse flex-shrink-0" />
                        <span className="text-[9px] text-purple-100 font-medium">On track for wedding goal 🎯</span>
                      </div>
                    </motion.div>

                  </div>

                  {/* Bottom Navigation */}
                  <div className="h-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex items-center justify-around px-2 flex-shrink-0 z-50 rounded-b-[32px]">
                    <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400"><Home size={14} /></div>
                    <div className="w-8 h-8 flex items-center justify-center text-slate-400"><BarChart2 size={14} /></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white shadow-lg -mt-4 ring-4 ring-slate-50 dark:ring-slate-950"><Sparkles size={16} /></div>
                    <div className="w-8 h-8 flex items-center justify-center text-slate-400"><Map size={14} /></div>
                    <div className="w-8 h-8 flex items-center justify-center text-slate-400"><Settings size={14} /></div>
                  </div>
                  
                  {/* Home Indicator */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-300 dark:bg-slate-600 rounded-full z-50" />

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex-shrink-0 flex justify-center items-center gap-2.5 pb-6">
          {dots.map(({ o, s }, i) => (
            <motion.div
              key={i}
              style={{ opacity: o, scale: s }}
              className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/40 origin-center"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
