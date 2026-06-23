import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Logo } from '../components/logo';
import { SmoothScroll } from '../components/landing/smooth-scroll';
import { HeroSection } from '../components/landing/hero-section';
import { TrustSection } from '../components/landing/trust-section';
import { StickyStoryScroll } from '../components/landing/sticky-story-scroll';
import { HowItWorksTimeline } from '../components/landing/how-it-works-timeline';
import { AiThinkingDemo } from '../components/landing/ai-thinking-demo';
import { BentoGrid } from '../components/landing/bento-grid';
import { ComparisonTable } from '../components/landing/comparison-table';
import { Testimonials } from '../components/landing/testimonials';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-black text-slate-50 selection:bg-emerald-500/30 font-sans">
        
        {/* Navigation */}
        <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 lg:px-10 py-6">
          <Logo />
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link className="text-sm text-slate-300 hover:text-white transition-colors" href="/sign-in">Login</Link>
              <Link className="rounded-full bg-white px-4 py-2 text-sm text-black font-medium transition hover:bg-slate-200" href="/sign-up">Get Started</Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors mr-4">Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>

        {/* Assembly */}
        <HeroSection />
        <TrustSection />
        <StickyStoryScroll />
        <HowItWorksTimeline />
        <AiThinkingDemo />
        <BentoGrid />
        <ComparisonTable />
        <Testimonials />

        {/* Final CTA */}
        <section className="py-32 bg-gradient-to-b from-black to-slate-950 border-t border-white/5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 blur-[150px] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-3xl px-6">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              Ready to transform?
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Join the thousands of users achieving their fitness goals with AI-powered precision.
            </p>
            <SignedOut>
              <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-full bg-emerald-400 text-black px-10 py-5 text-lg font-bold hover:bg-emerald-300 transition-colors shadow-[0_0_40px_rgba(52,211,153,0.3)] hover:shadow-[0_0_60px_rgba(52,211,153,0.5)]">
                Start your journey today <ArrowRight size={20} />
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-emerald-400 text-black px-10 py-5 text-lg font-bold hover:bg-emerald-300 transition-colors shadow-[0_0_40px_rgba(52,211,153,0.3)] hover:shadow-[0_0_60px_rgba(52,211,153,0.5)]">
                Go to your Dashboard <ArrowRight size={20} />
              </Link>
            </SignedIn>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
