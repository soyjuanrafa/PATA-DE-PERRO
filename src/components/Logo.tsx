/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro Logo Component - Uses official brand assets mapped to screen & palette
 */

import React, { useState } from 'react';
import { BRAND_LOGOS } from '../utils/imageHelper';

export type LogoVariant =
  | 'color'
  | 'white'
  | 'colorAlt'
  | 'symbol'
  | 'mono'
  | 'black'
  | 'blackAndWhite'
  | 'impresiones'
  | 'horizontal'
  | 'icon'
  | 'lgpdp1'
  | 'lgpdp2'
  | 'lgpdp3';

interface LogoProps {
  variant?: LogoVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'color',
  size = 'md',
  className = '',
  imgClassName = '',
  imgStyle,
  showText = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Height configurations
  const heightMap = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  // Map variant to official brand asset URL
  const getLogoUrl = (): string => {
    switch (variant) {
      case 'white':
        return BRAND_LOGOS.white;
      case 'colorAlt':
        return BRAND_LOGOS.colorAlt;
      case 'symbol':
      case 'icon':
        return BRAND_LOGOS.symbol;
      case 'mono':
      case 'black':
        return BRAND_LOGOS.black;
      case 'blackAndWhite':
        return BRAND_LOGOS.blackAndWhite;
      case 'impresiones':
        return BRAND_LOGOS.impresiones;
      case 'lgpdp1':
        return BRAND_LOGOS.lgpdp1;
      case 'lgpdp2':
        return BRAND_LOGOS.lgpdp2;
      case 'lgpdp3':
        return BRAND_LOGOS.lgpdp3;
      case 'color':
      case 'horizontal':
      default:
        return BRAND_LOGOS.color;
    }
  };

  const logoUrl = getLogoUrl();

  // If image loads successfully, render authentic brand asset
  if (!imageError) {
    return (
      <div className={`inline-flex items-center gap-2 select-none shrink-0 ${className}`}>
        <img
          src={logoUrl}
          alt="Pata de Perro - Turismo Auténtico y Sostenible"
          style={imgStyle}
          className={`${heightMap[size]} w-auto object-contain rounded-md transition-transform duration-200 ${imgClassName}`}
          onError={() => setImageError(true)}
          loading="eager"
        />
        {showText && (
          <div className="flex flex-col leading-none tracking-tight">
            <span
              className={`font-black uppercase tracking-tight font-outfit text-sm ${
                variant === 'white' ? 'text-white' : 'text-[#23404A]'
              }`}
            >
              Pata de Perro
            </span>
            <span
              className={`text-[10px] font-bold font-ibm-plex ${
                variant === 'white' ? 'text-[#FFC83D]' : 'text-[#FF6B35]'
              }`}
            >
              Ciudades Creativas
            </span>
          </div>
        )}
      </div>
    );
  }

  // High-fidelity vector fallback in official brand colors
  // Verde Tropical: #3FAF6C, Naranja Atardecer: #FF6B35, Azul Petróleo: #23404A, Marfil: #FFF8F1
  const isWhite = variant === 'white';
  const isDarkMono = variant === 'mono' || variant === 'black' || variant === 'blackAndWhite';
  const mainColor = isDarkMono ? '#23404A' : '#3FAF6C';
  const pinColor = isDarkMono ? '#23404A' : '#FF6B35';
  const textColor = isWhite ? '#FFFFFF' : '#23404A';

  return (
    <div className={`inline-flex items-center gap-2 select-none shrink-0 ${className}`}>
      <svg
        className={`${heightMap[size]} w-auto aspect-square`}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="45" cy="85" rx="16" ry="24" fill={mainColor} transform="rotate(-15 45 85)" />
        <ellipse cx="85" cy="55" rx="18" ry="28" fill={mainColor} transform="rotate(-5 85 55)" />
        <ellipse cx="130" cy="60" rx="18" ry="28" fill={mainColor} transform="rotate(8 130 60)" />
        <path
          d="M40 120 C 35 150, 60 165, 95 165 C 130 165, 155 150, 150 120 C 145 100, 120 90, 95 100 C 70 90, 45 100, 40 120 Z"
          fill={mainColor}
        />
        <path
          d="M 50 135 L 75 105 L 95 125 L 125 95 L 145 135 Z"
          fill={mainColor}
        />
        <path
          d="M 55 155 C 75 140, 85 160, 105 140 C 125 120, 140 130, 145 125"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 40 150 C 40 175, 75 185, 110 185 C 140 185, 160 170, 155 150"
          stroke={pinColor}
          strokeWidth="5"
          strokeDasharray="8 6"
          strokeLinecap="round"
          fill="none"
        />
        <g transform="translate(135, 75)">
          <path
            d="M 16 0 C 7.16 0 0 7.16 0 16 C 0 28 16 42 16 42 C 16 42 32 28 32 16 C 32 7.16 24.84 0 16 0 Z"
            fill={pinColor}
          />
          <circle cx="16" cy="14" r="6" fill="#FFFFFF" />
        </g>
      </svg>
      <div className="flex flex-col leading-none tracking-tight">
        <span
          className="font-black uppercase tracking-tight font-outfit text-sm"
          style={{ color: textColor }}
        >
          Pata de Perro
        </span>
        <span className="text-[10px] font-bold font-ibm-plex text-[#FF6B35]">
          Nicaragua
        </span>
      </div>
    </div>
  );
};

