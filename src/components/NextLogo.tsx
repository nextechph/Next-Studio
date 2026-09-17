import React, { useState } from 'react';
import logoUrl from '../../assets/logo.png';

/**
 * Uses the actual brand logo PNG directly — with fallback support.
 */
export default function NextLogo({ className = "h-8 w-8" }: { className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Next Studio Logo"
      >
        <rect width="100" height="100" rx="20" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <path d="M25 22V78H35V42L65 78H75V22H65V58L35 22H25Z" fill="white" />
      </svg>
    );
  }

  return (
    <img
      src={logoUrl}
      alt="Next Studio Logo"
      className={className}
      style={{ objectFit: 'contain' }}
      onError={() => setHasError(true)}
    />
  );
}

