import React from 'react';

// Cute 3D style checklist clipboard matching the sidebar and banner
export const Clipboard3DIcon = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="boardGrad" x1="20" y1="20" x2="100" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EDE9FE" />
        <stop offset="1" stopColor="#DDD6FE" />
      </linearGradient>
      <linearGradient id="clipGrad" x1="45" y1="10" x2="75" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#6D28D9" />
      </linearGradient>
      <filter id="softShadow" x="10" y="10" width="100" height="105" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#7C3AED" floodOpacity="0.18" />
      </filter>
    </defs>
    <g filter="url(#softShadow)">
      {/* Board Base */}
      <rect x="22" y="24" width="76" height="84" rx="14" fill="url(#boardGrad)" />
      <rect x="26" y="28" width="68" height="76" rx="10" fill="#FFFFFF" fillOpacity="0.9" />

      {/* Top Clip */}
      <rect x="42" y="16" width="36" height="16" rx="8" fill="url(#clipGrad)" />
      <circle cx="60" cy="24" r="3" fill="#FFFFFF" />

      {/* Check list rows */}
      <path d="M36 46L41 51L49 42" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="54" y="45" width="30" height="4" rx="2" fill="#E2E8F0" />

      <path d="M36 62L41 67L49 58" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="54" y="61" width="24" height="4" rx="2" fill="#E2E8F0" />

      <path d="M36 78L41 83L49 74" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="54" y="77" width="28" height="4" rx="2" fill="#E2E8F0" />

      {/* Pen */}
      <g transform="rotate(25 90 75)">
        <rect x="86" y="35" width="8" height="44" rx="4" fill="#6366F1" />
        <polygon points="86,79 94,79 90,89" fill="#F43F5E" />
      </g>
    </g>
  </svg>
);

// Sparkline wave paths for the 4 stat cards
export const Sparkline = ({ color = '#8b5cf6', className = 'w-24 h-8' }) => {
  return (
    <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 20C18 20 25 10 38 15C51 20 62 6 75 14C88 22 92 8 98 10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
