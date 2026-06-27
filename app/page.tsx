import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Logo } from '../components/logo';
import { Navbar } from '../components/landing/navbar';
import { SmoothScroll } from '../components/landing/smooth-scroll';
import { HeroSection } from '../components/landing/hero-section';
import { TrustSection } from '../components/landing/trust-section';
import { StickyStoryScroll } from '../components/landing/sticky-story-scroll';
import { HowItWorksTimeline } from '../components/landing/how-it-works-timeline';
import { AiThinkingDemo } from '../components/landing/ai-thinking-demo';
import { BentoGrid } from '../components/landing/bento-grid';
import { ComparisonTable } from '../components/landing/comparison-table';
import { Testimonials } from '../components/landing/testimonials';
import { FAQSection } from '../components/landing/faq';
import { Footer } from '../components/landing/footer';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-50 selection:bg-emerald-500/30 font-sans transition-colors duration-500">
        {/* Navigation */}
        <Navbar />

        {/* Assembly (Add padding to account for fixed navbar) */}
        <div className="pt-16 sm:pt-20">
          <HeroSection />
        <TrustSection />
        <StickyStoryScroll />
        <HowItWorksTimeline />
        <AiThinkingDemo />
        <BentoGrid />
        <ComparisonTable />
        <Testimonials />
        </div>

        {/* Final CTA */}
        <section className="py-32 bg-white dark:bg-black border-t border-slate-200 dark:border-white/[0.04] text-center transition-colors duration-500">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Ready to transform?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
              Join the thousands of users achieving their fitness goals with AI-powered precision.
            </p>
            <SignedOut>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-8 py-4 text-lg font-semibold hover:bg-emerald-500 transition-colors shadow-lg hover:shadow-emerald-500/25"
              >
                Get Started Free
                <ArrowUpRight size={20} />
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-emerald-400 text-black px-10 py-4 text-lg font-semibold hover:bg-emerald-300 transition-colors duration-200">
                Go to your Dashboard <ArrowRight size={20} />
              </Link>
            </SignedIn>
          </div>
        </section>
        
        <FAQSection />
        <Footer />


      </main>
    </SmoothScroll>
  );
}
