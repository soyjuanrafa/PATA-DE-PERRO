/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - High Performance Dynamic SVG Vector Map (WGS84 Projection)
 * Integrates authentic cartographic maps of Nicaragua and Creative Cities (Estelí, Granada, León, Masaya, Ometepe).
 */

import React, { useState, useRef, useMemo } from 'react';
import { CiudadCreativa, MAPA_NICARAGUA_URL } from '../data/mockData';
import { Experiencia } from '../types';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import { MapLightboxModal } from './MapLightboxModal';
import {
  MapPin,
  Sparkles,
  Camera,
  Navigation,
  Plus,
  Minus,
  Maximize2,
  Compass,
  Layers,
  ChevronRight,
  Info,
  ZoomIn,
  Eye,
} from 'lucide-react';

export interface VectorMapProps {
  cities: CiudadCreativa[];
  selectedCity: CiudadCreativa;
  onSelectCity: (city: CiudadCreativa) => void;
  experiences: Experiencia[];
  selectedExperience: Experiencia | null;
  onSelectExperience: (exp: Experiencia) => void;
  showAllExperiences: boolean;
  onLaunchAR: () => void;
  onViewExperienceDetails: (exp: Experiencia) => void;
}

// Projection bounds for Nicaragua (WGS84)
const MIN_LON = -87.8;
const MAX_LON = -83.0;
const MIN_LAT = 10.6;
const MAX_LAT = 15.1;
const SVG_WIDTH = 920;
const SVG_HEIGHT = 640;

export function projectWGS84(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * SVG_WIDTH;
  const y = SVG_HEIGHT - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * SVG_HEIGHT;
  return {
    x: Math.max(10, Math.min(SVG_WIDTH - 10, x)),
    y: Math.max(10, Math.min(SVG_HEIGHT - 10, y)),
  };
}

export const VectorMapStage: React.FC<VectorMapProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  experiences,
  selectedExperience,
  onSelectExperience,
  showAllExperiences,
  onLaunchAR,
  onViewExperienceDetails,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [, setHoveredCity] = useState<CiudadCreativa | null>(null);
  const [, setHoveredExp] = useState<Experiencia | null>(null);
  const [mapMode, setMapMode] = useState<'illustrated' | 'hybrid' | 'vector'>('illustrated');
  const [lightboxTarget, setLightboxTarget] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<
    { type: 'city'; city: CiudadCreativa } | { type: 'exp'; exp: Experiencia } | null
  >({ type: 'city', city: selectedCity });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter experiences for selected city
  const cityExperiences = useMemo(() => {
    return experiences.filter(
      e => e.ciudad_creativa.toLowerCase() === selectedCity.nombre.toLowerCase()
    );
  }, [experiences, selectedCity]);

  // Center on a city
  const centerOnPoint = (lat: number, lon: number, targetZoom = 1.6) => {
    const pt = projectWGS84(lat, lon);
    const centerX = SVG_WIDTH / 2;
    const centerY = SVG_HEIGHT / 2;
    setZoom(targetZoom);
    setPan({
      x: centerX - pt.x * targetZoom,
      y: centerY - pt.y * targetZoom,
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActivePopup(null);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.3, 3.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const next = Math.max(prev - 0.3, 0.9);
      if (next === 0.9) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, .interactive-pin, .popup-card')) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Coordinated positions for cities
  const cityPositions = useMemo(() => {
    return cities.map(city => ({
      city,
      ...projectWGS84(city.lat, city.lon),
      count: experiences.filter(
        e => e.ciudad_creativa.toLowerCase() === city.nombre.toLowerCase()
      ).length,
    }));
  }, [cities, experiences]);

  // Coordinated positions for experiences
  const expPositions = useMemo(() => {
    return experiences.map(exp => ({
      exp,
      ...projectWGS84(exp.ubicacion_lat, exp.ubicacion_lon),
    }));
  }, [experiences]);

  return (
    <div
      ref={containerRef}
      id="wgs84-vector-map-container"
      className="w-full h-[480px] sm:h-[600px] rounded-2xl overflow-hidden relative border border-stone-200 bg-linear-to-b from-[#eaf4f7] via-[#f4f7f6] to-[#e8f1ec] select-none cursor-grab active:cursor-grabbing shadow-inner"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Map Layer Selector & Quick Inspection Toolbar */}
      <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center gap-2">
        {/* Layer Mode Switcher */}
        <div className="bg-white/90 backdrop-blur-md p-0.5 rounded-xl border border-stone-200/90 shadow-sm flex items-center text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setMapMode('illustrated')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              mapMode === 'illustrated'
                ? 'bg-orange-500 text-white shadow-2xs font-extrabold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Mapa Cartográfico Oficial de Nicaragua"
          >
            <span>Mapa Oficial</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode('hybrid')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              mapMode === 'hybrid'
                ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Superposición de relieve y vectores"
          >
            <span>Híbrido</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode('vector')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              mapMode === 'vector'
                ? 'bg-stone-800 text-white shadow-2xs font-extrabold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Cartografía vectorial pura WGS84"
          >
            <span>Vector WGS84</span>
          </button>
        </div>

        {/* View Full Nicaragua Map Button */}
        <button
          onClick={() => setLightboxTarget('nicaragua')}
          className="bg-white/90 backdrop-blur-md hover:bg-orange-50 text-stone-800 hover:text-orange-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-stone-200/90 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Abrir mapa de Nicaragua en alta definición"
        >
          <Eye className="w-3.5 h-3.5 text-orange-500" />
          <span className="hidden sm:inline">Ver Mapa Nicaragua HD</span>
          <span className="sm:hidden">Mapa HD</span>
        </button>
      </div>

      {/* SVG Map Canvas */}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-full transform transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9ecf2" />
            <stop offset="100%" stopColor="#c5e2ec" />
          </linearGradient>

          <linearGradient id="nicaraguaLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7f3e8" />
            <stop offset="50%" stopColor="#edf3ec" />
            <stop offset="100%" stopColor="#e4eee4" />
          </linearGradient>

          <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b6ddec" />
            <stop offset="100%" stopColor="#98cce0" />
          </linearGradient>

          <filter id="mapShadow" x="-5%" y="-5%" width="115%" height="115%">
            <feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity="0.16" />
          </filter>

          <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>

          {/* SVG Patterns for City Map Avatars inside the pins */}
          {cities.map(c => (
            <pattern
              key={`pat-${c.id}`}
              id={`pat-city-${c.id}`}
              patternUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <image
                href={c.mapa_imagen || c.imagen}
                x="0"
                y="0"
                width="34"
                height="34"
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          ))}
        </defs>

        {/* Ocean Background */}
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#oceanGrad)" opacity="0.6" />

        {/* WGS84 Geographic Graticule Grid Lines */}
        <g stroke="#9bb6c4" strokeWidth="0.7" strokeDasharray="3,4" opacity="0.45">
          <line x1="0" y1="128" x2={SVG_WIDTH} y2="128" /> {/* 14°N */}
          <line x1="0" y1="270" x2={SVG_WIDTH} y2="270" /> {/* 13°N */}
          <line x1="0" y1="412" x2={SVG_WIDTH} y2="412" /> {/* 12°N */}
          <line x1="0" y1="554" x2={SVG_WIDTH} y2="554" /> {/* 11°N */}
          <line x1="150" y1="0" x2="150" y2={SVG_HEIGHT} /> {/* 87°W */}
          <line x1="337" y1="0" x2="337" y2={SVG_HEIGHT} /> {/* 86°W */}
          <line x1="525" y1="0" x2="525" y2={SVG_HEIGHT} /> {/* 85°W */}
          <line x1="712" y1="0" x2="712" y2={SVG_HEIGHT} /> {/* 84°W */}
        </g>

        {/* Graticule Labels */}
        <g fill="#7694a4" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" opacity="0.8">
          <text x="14" y="124">14°00' N</text>
          <text x="14" y="266">13°00' N</text>
          <text x="14" y="408">12°00' N</text>
          <text x="14" y="550">11°00' N</text>
          <text x="154" y={SVG_HEIGHT - 12}>87°00' W</text>
          <text x="341" y={SVG_HEIGHT - 12}>86°00' W</text>
          <text x="529" y={SVG_HEIGHT - 12}>85°00' W</text>
          <text x="716" y={SVG_HEIGHT - 12}>84°00' W</text>
        </g>

        {/* Neighboring Country Silhouettes */}
        <path
          d="M 0,0 L 920,0 L 920,95 Q 750,90 600,105 Q 450,140 300,120 Q 180,110 90,190 L 0,210 Z"
          fill="#e2dfd7"
          opacity="0.4"
        />
        <text x="240" y="70" fill="#a49f93" fontSize="11" fontWeight="700" letterSpacing="4">
          HONDURAS
        </text>

        <path
          d="M 280,640 Q 360,590 480,595 Q 600,600 700,640 Z"
          fill="#e2dfd7"
          opacity="0.4"
        />
        <text x="440" y="630" fill="#a49f93" fontSize="11" fontWeight="700" letterSpacing="4">
          COSTA RICA
        </text>

        {/* Territorial Contour of Nicaragua (Vector Base) */}
        <path
          id="nicaragua-mainland"
          d="
            M 80,245
            C 110,210 160,180 230,160
            C 280,145 350,135 430,115
            C 490,100 580,85 660,80
            C 740,75 800,80 840,90
            C 880,100 895,140 885,190
            C 875,240 870,290 855,350
            C 845,390 830,440 820,490
            C 810,540 760,570 710,580
            C 650,590 570,585 520,575
            C 470,565 420,580 370,570
            C 340,560 330,535 315,505
            C 300,470 280,455 250,440
            C 210,420 180,390 140,360
            C 105,335 70,300 55,275
            C 50,265 65,250 80,245
            Z
          "
          fill="url(#nicaraguaLandGrad)"
          stroke="#417056"
          strokeWidth="2.2"
          strokeLinejoin="round"
          filter="url(#mapShadow)"
        />

        {/* Authentic Illustrated Map of Nicaragua Layer */}
        {(mapMode === 'illustrated' || mapMode === 'hybrid') && (
          <g id="nicaragua-cartographic-layer" className="transition-opacity duration-300">
            <image
              href={MAPA_NICARAGUA_URL}
              x="45"
              y="35"
              width="830"
              height="570"
              preserveAspectRatio="xMidYMid meet"
              opacity={mapMode === 'illustrated' ? 0.98 : 0.72}
              filter="url(#mapShadow)"
              className="pointer-events-none"
            />
          </g>
        )}

        {/* Pacific Coast Ocean Label */}
        <text
          x="70"
          y="480"
          transform="rotate(-40, 70, 480)"
          fill="#6d9bb0"
          fontSize="11"
          fontWeight="800"
          letterSpacing="4"
          opacity="0.8"
        >
          OCÉANO PACÍFICO
        </text>

        {/* Caribbean Sea Label */}
        <text
          x="770"
          y="280"
          transform="rotate(85, 770, 280)"
          fill="#6d9bb0"
          fontSize="11"
          fontWeight="800"
          letterSpacing="4"
          opacity="0.8"
        >
          MAR CARIBE
        </text>

        {/* Golfo de Fonseca */}
        <path
          d="M 50,240 Q 90,260 110,230 Q 90,200 50,220 Z"
          fill="url(#oceanGrad)"
          stroke="#94b8c9"
          strokeWidth="1"
        />

        {/* Major Water Bodies (Active in vector/hybrid modes) */}
        {mapMode !== 'illustrated' && (
          <>
            {/* Lago Xolotlán */}
            <g id="lago-xolotlan">
              <path
                d="
                  M 240,360
                  C 260,345 295,350 315,365
                  C 330,378 325,395 305,405
                  C 285,415 255,410 240,395
                  C 225,380 225,370 240,360
                  Z
                "
                fill="url(#lakeGrad)"
                stroke="#68a9c2"
                strokeWidth="1.4"
              />
              <text x="250" y="385" fill="#3b7b95" fontSize="8" fontWeight="700" opacity="0.9">
                Lago Xolotlán
              </text>
            </g>

            {/* Lago Cocibolca */}
            <g id="lago-cocibolca">
              <path
                d="
                  M 350,440
                  C 380,410 430,410 480,430
                  C 530,450 565,480 575,525
                  C 585,565 550,585 500,580
                  C 450,575 400,550 370,520
                  C 345,495 335,465 350,440
                  Z
                "
                fill="url(#lakeGrad)"
                stroke="#68a9c2"
                strokeWidth="1.6"
              />
              <text x="440" y="475" fill="#2c6d86" fontSize="10" fontWeight="800" opacity="0.9">
                Lago Cocibolca
              </text>

              {/* Isla Ometepe */}
              <path
                d="
                  M 445,495
                  C 455,488 468,492 468,502
                  C 468,510 458,518 450,518
                  C 440,518 438,505 445,495
                  Z
                "
                fill="#e4d7bf"
                stroke="#6c5836"
                strokeWidth="1.2"
              />
            </g>
          </>
        )}

        {/* Cultural Heritage Route Links */}
        <g stroke="#e2885c" strokeWidth="1.4" strokeDasharray="3,3" opacity="0.65">
          <line x1="172" y1="367" x2="320" y2="431" /> {/* León -> Masaya */}
          <line x1="320" y1="431" x2="346" y2="436" /> {/* Masaya -> Granada */}
          <line x1="346" y1="436" x2="452" y2="498" /> {/* Granada -> Ometepe */}
          <line x1="172" y1="367" x2="271" y2="277" /> {/* León -> Estelí */}
          <line x1="271" y1="277" x2="353" y2="300" /> {/* Estelí -> Matagalpa */}
        </g>

        {/* Experience Points of Interest (POIs) */}
        {showAllExperiences &&
          expPositions.map(({ exp, x, y }) => {
            const isSelected = selectedExperience?.id_exp === exp.id_exp;
            return (
              <g
                key={`poi-${exp.id_exp}`}
                className="interactive-pin cursor-pointer group"
                onClick={() => {
                  onSelectExperience(exp);
                  setActivePopup({ type: 'exp', exp });
                }}
                onMouseEnter={() => setHoveredExp(exp)}
                onMouseLeave={() => setHoveredExp(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 7.5 : 4.5}
                  fill={isSelected ? '#FF5722' : '#2E9D62'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  filter="url(#pinShadow)"
                  className="transition-all duration-200"
                />
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke="#FF5722"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}

        {/* Creative Cities Primary Pins with Authentic Map Photo Badges */}
        {cityPositions.map(({ city, x, y, count }) => {
          const isSelected = selectedCity.id === city.id;
          return (
            <g
              key={`city-pin-${city.id}`}
              className="interactive-pin cursor-pointer"
              onClick={() => {
                onSelectCity(city);
                centerOnPoint(city.lat, city.lon, 1.7);
                setActivePopup({ type: 'city', city });
              }}
              onMouseEnter={() => setHoveredCity(city)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              {/* Outer pulsing beacon ring for selected city */}
              {isSelected && (
                <circle
                  cx={x}
                  cy={y}
                  r="26"
                  fill="#FF5722"
                  opacity="0.22"
                  className="animate-pulse"
                />
              )}

              {/* Pin Base Halo with Location Map Image */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 16 : 13}
                fill={`url(#pat-city-${city.id})`}
                stroke={isSelected ? '#FF5722' : '#2E9D62'}
                strokeWidth={isSelected ? 3.2 : 2.2}
                filter="url(#pinShadow)"
                className="transition-transform duration-200 hover:scale-125"
              />

              {/* Mini indicator badge */}
              <circle
                cx={x + 10}
                cy={y - 10}
                r="6.5"
                fill={isSelected ? '#FF5722' : '#1E293B'}
                stroke="#FFFFFF"
                strokeWidth="1.2"
              />
              <text
                x={x + 10}
                y={y - 7}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="6.5"
                fontWeight="900"
              >
                🗺️
              </text>

              {/* City Label Badge */}
              <g transform={`translate(${x}, ${y - (isSelected ? 24 : 20)})`}>
                <rect
                  x="-42"
                  y="-14"
                  width="84"
                  height="18"
                  rx="9"
                  fill={isSelected ? '#1E293B' : '#FFFFFF'}
                  stroke={isSelected ? '#FF5722' : '#CBD5E1'}
                  strokeWidth="1.2"
                  filter="url(#pinShadow)"
                />
                <text
                  x="0"
                  y="-1"
                  textAnchor="middle"
                  fill={isSelected ? '#FFFFFF' : '#1E293B'}
                  fontSize="9.5"
                  fontWeight="800"
                  fontFamily="Outfit, Plus Jakarta Sans, sans-serif"
                >
                  {city.nombre}
                </text>
              </g>

              {/* Activity count pill */}
              {count > 0 && (
                <g transform={`translate(${x + 12}, ${y + 2})`}>
                  <rect
                    x="0"
                    y="-7"
                    width="14"
                    height="14"
                    rx="7"
                    fill={isSelected ? '#FF5722' : '#2E9D62'}
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                  />
                  <text
                    x="7"
                    y="3"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="8"
                    fontWeight="800"
                  >
                    {count}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Map Cartographic Elements: Compass Rose */}
        <g transform={`translate(${SVG_WIDTH - 65}, 80)`} opacity="0.85">
          <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" filter="url(#pinShadow)" />
          <polygon points="0,-18 5,-3 0,0" fill="#DC2626" />
          <polygon points="0,-18 -5,-3 0,0" fill="#EF4444" />
          <polygon points="0,18 5,3 0,0" fill="#64748B" />
          <polygon points="0,18 -5,3 0,0" fill="#94A3B8" />
          <polygon points="18,0 3,-5 0,0" fill="#64748B" />
          <polygon points="18,0 3,5 0,0" fill="#94A3B8" />
          <polygon points="-18,0 -3,-5 0,0" fill="#64748B" />
          <polygon points="-18,0 -3,5 0,0" fill="#94A3B8" />
          <text x="0" y="-7" textAnchor="middle" fill="#DC2626" fontSize="7" fontWeight="900">
            N
          </text>
        </g>

        {/* Metric Scale Bar */}
        <g transform={`translate(30, ${SVG_HEIGHT - 35})`} opacity="0.9">
          <rect x="0" y="-12" width="130" height="22" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          <line x1="12" y1="0" x2="118" y2="0" stroke="#1E293B" strokeWidth="2" />
          <line x1="12" y1="-3" x2="12" y2="3" stroke="#1E293B" strokeWidth="2" />
          <line x1="65" y1="-3" x2="65" y2="3" stroke="#1E293B" strokeWidth="2" />
          <line x1="118" y1="-3" x2="118" y2="3" stroke="#1E293B" strokeWidth="2" />
          <text x="12" y="-5" fill="#475569" fontSize="7" fontWeight="700">0</text>
          <text x="65" y="-5" fill="#475569" fontSize="7" fontWeight="700">50 km</text>
          <text x="110" y="-5" fill="#475569" fontSize="7" fontWeight="700">100 km</text>
        </g>
      </svg>

      {/* Floating Interactive Popup Card with Authentic Location Map */}
      {activePopup && (
        <div className="absolute top-4 left-4 z-20 max-w-[290px] bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-stone-200/90 shadow-xl popup-card transition-all">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                {activePopup.type === 'city'
                  ? `Ciudad Creativa • ${activePopup.city.departamento}`
                  : `Experiencia • ${activePopup.exp.categoria}`}
              </span>
              <h4 className="text-stone-900 font-extrabold text-sm leading-snug">
                {activePopup.type === 'city' ? activePopup.city.nombre : activePopup.exp.titulo}
              </h4>
            </div>
            <button
              onClick={() => setActivePopup(null)}
              className="text-stone-400 hover:text-stone-700 text-xs p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="relative h-28 rounded-xl overflow-hidden mb-2.5 bg-stone-100 group">
            <img
              src={resolveImageUrl(
                activePopup.type === 'city'
                  ? activePopup.city.mapa_imagen || activePopup.city.imagen
                  : activePopup.exp.imagen_url
              )}
              alt="Destino o Plano"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e =>
                handleImageFallback(
                  e,
                  activePopup.type === 'city' ? activePopup.city.imagen : activePopup.exp.imagen_url
                )
              }
            />
            {activePopup.type === 'city' && (
              <>
                <div className="absolute top-1.5 left-1.5 bg-stone-900/80 text-white font-bold text-[9px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                  🗺️ Plano Cartográfico
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxTarget(activePopup.city.id)}
                  className="absolute bottom-1.5 right-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] px-2 py-1 rounded-lg shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Ampliar mapa cartográfico en alta definición"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Ampliar</span>
                </button>
              </>
            )}
            {activePopup.type === 'exp' && (
              <div className="absolute bottom-1.5 right-1.5 bg-emerald-700 text-white font-black text-xs px-2 py-0.5 rounded-full shadow-xs">
                ${activePopup.exp.precio} {activePopup.exp.moneda}
              </div>
            )}
          </div>

          <p className="text-stone-600 text-xs line-clamp-2 mb-3">
            {activePopup.type === 'city'
              ? activePopup.city.descripcion
              : activePopup.exp.descripcion}
          </p>

          <div className="flex items-center gap-2">
            {activePopup.type === 'city' ? (
              <>
                <button
                  onClick={() => {
                    onSelectCity(activePopup.city);
                    centerOnPoint(activePopup.city.lat, activePopup.city.lon, 1.8);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-2.5 rounded-xl transition-colors text-center cursor-pointer shadow-2xs"
                >
                  Ver Actividades
                </button>
                <button
                  onClick={onLaunchAR}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Simular en Realidad Aumentada"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>RA</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onViewExperienceDetails(activePopup.exp)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Ver Detalle y Reservar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Map Navigation & Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200 shadow-md">
        <button
          onClick={handleZoomIn}
          className="p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          title="Acercar mapa"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          title="Alejar mapa"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer border-t border-stone-100"
          title="Restablecer vista a Nicaragua"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Cartographic Badge */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-stone-700 font-bold border border-stone-200 pointer-events-none shadow-2xs flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Cartografía Oficial & Ciudades Creativas de Nicaragua</span>
      </div>

      {/* High-Resolution Map Lightbox Modal */}
      <MapLightboxModal
        isOpen={lightboxTarget !== null}
        onClose={() => setLightboxTarget(null)}
        initialTarget={lightboxTarget || 'nicaragua'}
        cities={cities}
      />
    </div>
  );
};
