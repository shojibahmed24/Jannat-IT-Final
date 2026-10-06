import React from 'react';

export default function SectionDivider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-1/4 h-full bg-gradient-to-r from-transparent via-orange-500/20 to-transparent blur-sm" />
    </div>
  );
}
