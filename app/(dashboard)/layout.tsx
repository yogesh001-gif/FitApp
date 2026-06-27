'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Logo } from '../../components/logo';
import { Activity } from 'lucide-react';
import { navItems } from '../../config/navigation';
import { ThemeToggle } from '../../components/theme-toggle';

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen px-4 py-4 lg:px-8 relative bg-slate-50 dark:bg-black selection:bg-emerald-500/30 font-sans transition-colors duration-500">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Floating Glass Dock */}
        <header className="sticky top-4 sm:top-6 z-50 flex flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/50 dark:border-white/[0.08] bg-white/60 dark:bg-slate-950/60 px-4 sm:px-5 py-3 sm:py-4 backdrop-blur-xl transition-all duration-300 shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo />
            <span className="hidden sm:inline-block w-px h-6 bg-slate-200 dark:bg-white/[0.08] mx-2 transition-colors"></span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-tight hidden sm:block">Workspace</span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex flex-wrap items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 transition-colors">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 transition-colors duration-200 ${isActive ? 'text-slate-900 dark:text-white' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 z-0 rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/[0.08]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="pl-3 border-l border-slate-200 dark:border-white/10 flex items-center gap-3">
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9 border border-slate-200 dark:border-white/10" } }} />
            </div>
          </div>
        </header>

        <main className="pb-32 lg:pb-20 relative z-10">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.08] pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-colors duration-500">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
