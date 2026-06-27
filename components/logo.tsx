import Image from 'next/image';
import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      {/* 
        This Image component looks for a file named "logo.png" in your public folder.
        If your logo is an SVG or JPG, update the src below to "/logo.svg" or "/logo.jpg".
      */}
      <div className="relative w-8 h-8">
        <Image
          src="/logofit.png"
          alt="FitMitra Logo"
          fill
          className="object-contain"
        />
      </div>
      <p className="text-sm uppercase tracking-[0.35em] text-slate-900 dark:text-white font-semibold">FitMitra</p>
    </Link>
  );
}
