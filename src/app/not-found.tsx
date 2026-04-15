// src/app/not-found.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <div className="relative mb-8">
          <p
            className="font-display text-[10rem] leading-none text-neutral-800 select-none"
            aria-hidden="true"
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-600/20 border border-brand-600/30 flex items-center justify-center">
              <span className="font-display text-3xl text-brand-400 italic">O</span>
            </div>
          </div>
        </div>

        <h1 className="font-display text-3xl text-white mb-4">Page not found</h1>
        <p className="text-neutral-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/contact" className="btn-secondary border-neutral-700 text-neutral-300 hover:border-neutral-500">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}


