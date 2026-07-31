/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro Logo Component - Recreates the official branding faithfully
 */

import React from 'react';

interface LogoProps {
  variant?: 'color' | 'mono' | 'white' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'color', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: { height: 32, width: variant === 'icon' ? 32 : 140 },
    md: { height: 44, width: variant === 'icon' ? 44 : 180 },
    lg: { height: 56, width: variant === 'icon' ? 56 : 220 },
    xl: { height: 72, width: variant === 'icon' ? 72 : 280 },
  };

  const dim = sizeMap[size];

  // Colors based on brand guidelines:
  // Green: #2E9D62
  // Orange: #FF5722
  // Dark text: #1E293B
  // White: #FFFFFF

  let mainColor = '#2E9D62';
  let pinColor = '#FF5722';
  let textColor = '#1E293B';

  if (variant === 'mono') {
    mainColor = '#1E293B';
    pinColor = '#1E293B';
    textColor = '#1E293B';
  } else if (variant === 'white') {
    mainColor = '#FFFFFF';
    pinColor = '#FF5722';
    textColor = '#FFFFFF';
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Paw + Mountains + Trail + Pin SVG Icon */}
      <svg
        width={dim.height}
        height={dim.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Top Paw Toes */}
        <ellipse cx="45" cy="85" rx="16" ry="24" fill={mainColor} transform="rotate(-15 45 85)" />
        <ellipse cx="85" cy="55" rx="18" ry="28" fill={mainColor} transform="rotate(-5 85 55)" />
        <ellipse cx="130" cy="60" rx="18" ry="28" fill={mainColor} transform="rotate(8 130 60)" />

        {/* Main Pad with Mountain Silhouette */}
        <path
          d="M40 120 C 35 150, 60 165, 95 165 C 130 165, 155 150, 150 120 C 145 100, 120 90, 95 100 C 70 90, 45 100, 40 120 Z"
          fill={mainColor}
        />
        {/* Mountain Peaks Cutout */}
        <path
          d="M 50 135 L 75 105 L 95 125 L 125 95 L 145 135 Z"
          fill={mainColor}
        />

        {/* Trail Curve (River/Path) */}
        <path
          d="M 55 155 C 75 140, 85 160, 105 140 C 125 120, 140 130, 145 125"
          stroke={variant === 'white' ? '#FFFFFF' : '#FFFFFF'}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Dashed Route line around paw */}
        <path
          d="M 40 150 C 40 175, 75 185, 110 185 C 140 185, 160 170, 155 150"
          stroke={pinColor}
          strokeWidth="5"
          strokeDasharray="8 6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Map Location Pin */}
        <g transform="translate(135, 75)">
          <path
            d="M 16 0 C 7.16 0 0 7.16 0 16 C 0 28 16 42 16 42 C 16 42 32 28 32 16 C 32 7.16 24.84 0 16 0 Z"
            fill={pinColor}
          />
          <circle cx="16" cy="14" r="6" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Typography "Pata de perro" */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-none tracking-tight">
          <span
            className="font-extrabold tracking-tighter uppercase"
            style={{
              fontSize: `${dim.height * 0.42}px`,
              color: textColor,
              fontFamily: 'Outfit, Plus Jakarta Sans, sans-serif',
            }}
          >
            Pata
          </span>
          <span
            className="font-extrabold tracking-tighter uppercase"
            style={{
              fontSize: `${dim.height * 0.38}px`,
              color: textColor,
              fontFamily: 'Outfit, Plus Jakarta Sans, sans-serif',
              marginTop: '-2px',
            }}
          >
            de perro
          </span>
        </div>
      )}
    </div>
  );
};
