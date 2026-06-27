'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const steps = [
  "Analyzing profile...",
  "Calculating basal metabolic rate...",
  "Adjusting for 'gain muscle' goal (+400 kcal)...",
  "Target: 2,800 kcal (160g P / 340g C / 85g F)",
  "Scanning available equipment: Dumbbells, Bench",
  "Generating 4-day split workout plan...",
  "Done. Ready to begin."
];

export function AiThinkingDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (!isInView) return;

    let delay = 1000; // Initial delay before AI starts
    
    const timeouts: NodeJS.Timeout[] = [];
    
    steps.forEach((_, i) => {
      const t = setTimeout(() => {
        setCurrentStep(i);
      }, delay);
      timeouts.push(t);
      delay += 800 + Math.random() * 800; // Random delay between 800ms and 1600ms
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Real AI. Not just wrappers.</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">See how FITMITRA processes your context to build your custom path.</p>
        </div>

        <div ref={containerRef} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-4 md:p-8 shadow-xl dark:shadow-2xl backdrop-blur max-w-3xl mx-auto transition-colors duration-500">
          
          {/* User Input */}
          <div className="flex gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5 transition-colors">
              <User size={18} className="text-slate-500 dark:text-slate-400" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-white/5 transition-colors">
              I want to gain muscle. I'm 180cm, 75kg. I only have dumbbells.
            </div>
          </div>

          {/* AI Response Box */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/30 transition-colors">
              <Bot size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 bg-slate-900 dark:bg-slate-950 text-emerald-400 p-4 rounded-2xl rounded-tr-sm border border-slate-800 dark:border-emerald-500/20 font-mono text-sm leading-relaxed min-h-[200px] shadow-inner transition-colors">
              
              {currentStep === -1 && isInView && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="animate-pulse"
                >
                  ▋
                </motion.span>
              )}

              <div className="flex flex-col gap-2">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: i <= currentStep ? 1 : 0, 
                      height: i <= currentStep ? 'auto' : 0 
                    }}
                    className="overflow-hidden"
                  >
                    <span className="text-emerald-500 mr-2">{'>'}</span> {step}
                  </motion.div>
                ))}
                
                {currentStep >= 0 && currentStep < steps.length - 1 && (
                  <motion.span 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="mt-2"
                  >
                    ▋
                  </motion.span>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
