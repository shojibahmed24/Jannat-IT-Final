import React from 'react';

/**
 * Full-page loading spinner shown while lazy-loaded route chunks are downloading.
 * Uses pure CSS animation (GPU-accelerated) — no JS overhead.
 */
export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050506]">
      {/* Animated gradient orb background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[120px] animate-slow-pulse" />
      </div>

      {/* Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 rounded-full border-2 border-white/5" />
        {/* Spinning arc */}
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-orange-500 animate-spin" />
        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        </div>
      </div>

      {/* Brand text */}
      <p className="mt-6 text-sm font-medium text-slate-500 tracking-wider uppercase">
        Loading...
      </p>
    </div>
  );
}
