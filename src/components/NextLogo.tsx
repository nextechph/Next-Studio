import React from 'react';
// @ts-ignore — Vite handles PNG imports at build time
const logoUrl = '/assets/logo.png';

/**
 * Uses the actual brand logo PNG directly — no recreation.
 */
export default function NextLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="Next Studio Logo"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}

