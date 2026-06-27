'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Logo } from '../logo';
import { ThemeToggle } from '../theme-toggle';

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: "-150%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 lg:top-6 w-full z-50 flex justify-center pointer-events-none px-0 lg:px-6"
    >
      <nav className="pointer-events-auto w-full max-w-7xl bg-white/80 dark:bg-black/80 lg:bg-white/40 lg:dark:bg-white/[0.02] lg:hover:bg-white/60 lg:dark:hover:bg-white/[0.04] backdrop-blur-2xl border-b lg:border border-slate-200/50 dark:border-white/[0.04] lg:dark:border-white/[0.08] lg:rounded-full transition-all duration-500 shadow-xl dark:shadow-2xl">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20 lg:h-16">
          
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Logo />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-white/5 rounded-full border border-slate-200/50 dark:border-white/10">
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-slate-900 dark:text-white">EN</span>
            </div>

            <SignedOut>
              <Link className="rounded-full border border-slate-300 dark:border-white/20 bg-transparent px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm text-slate-900 dark:text-white font-medium transition hover:bg-slate-50 dark:hover:bg-white/5 hidden sm:block" href="/sign-in">Login</Link>
              <Link className="rounded-full bg-slate-900 dark:bg-white px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm text-white dark:text-black font-semibold transition hover:bg-slate-800 dark:hover:bg-slate-200" href="/sign-up">Download App</Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors mr-2 sm:mr-4 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 rounded-full">Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
