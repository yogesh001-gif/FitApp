'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { navItems } from '../../config/navigation';

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen px-4 py-4 lg:px-6 relative">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Floating Glass Dock */}
        <header className="sticky top-6 z-50 flex flex-col gap-4 rounded-3xl border border-white/10 bg-card/60 px-5 py-4 backdrop-blur-xl shadow-glow lg:flex-row lg:items-center lg:justify-between transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-neon-primary">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Fitapp</p>
              <h1 className="font-display text-lg font-semibold text-white tracking-tight">Workspace</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex flex-wrap items-center gap-1 text-sm font-medium text-muted-foreground p-1 rounded-2xl bg-black/20 border border-white/5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={`relative flex items-center gap-2 rounded-xl px-4 py-2 transition-colors duration-300 ${isActive ? 'text-white' : 'hover:text-white hover:bg-white/5'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 z-0 rounded-xl bg-white/10 shadow-sm border border-white/10"
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
            <div className="pl-2 border-l border-white/10 flex items-center">
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9 shadow-glow" } }} />
            </div>
          </div>
        </header>

        <main className="pb-28 lg:pb-20 relative z-10">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'fill-primary/20' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
