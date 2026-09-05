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
    return cities.map(city => {
      const pos = projectWGS84(city.lat, city.lon);
      const name = city.nombre.toLowerCase();
      let labelOffset = { dx: 0, dy: -22 };
      if (name.includes('masaya')) {
        labelOffset = { dx: -30, dy: -24 }; // Prevent collision with Granada
      } else if (name.includes('granada')) {
        labelOffset = { dx: 30, dy: -24 };  // Prevent collision with Masaya
      } else if (name.includes('ometepe')) {
        labelOffset = { dx: 18, dy: 24 };   // Below the island
      } else if (name.includes('matagalpa')) {
        labelOffset = { dx: 14, dy: -23 };
      } else if (name.includes('san juan del sur')) {
        labelOffset = { dx: -14, dy: 24 };
      }

      return {
        city,
        ...pos,
        labelOffset,
        count: experiences.filter(
          e => e.ciudad_creativa.toLowerCase() === city.nombre.toLowerCase()
        ).length,
      };
    });
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
            <stop offset="0%" stopColor="#fdfbf7" />
            <stop offset="30%" stopColor="#f5ede2" />
            <stop offset="65%" stopColor="#eaf3ea" />
            <stop offset="100%" stopColor="#dceade" />
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
        <g id="neighbor-countries">
          {/* Honduras (North) */}
          <path
            d="M 0,0 L 920,0 L 920,14 L 891.8,14.8 L 826.1,11.9 L 799.5,31.3 L 733.0,49.9 L 684.6,50.0 L 642.2,68.0 L 603.8,61.6 L 571.2,39.9 L 551.1,44.0 L 526.5,78.0 L 505.0,106.0 L 438.1,145.2 L 402.8,162.1 L 383.1,179.8 L 326.5,151.0 L 285.2,189.0 L 245.2,187.9 L 200.3,191.3 L 204.4,261.2 L 176.2,262.5 L 152.2,295.0 L 92.6,300.8 L 78.1,310.9 L 46.5,289.5 L 25.2,311.5 L 0,260 Z"
            fill="#eae6dc"
            stroke="#cfc7b8"
            strokeWidth="1.2"
            opacity="0.85"
          />
          <text x="320" y="65" fill="#999182" fontSize="12" fontWeight="800" letterSpacing="5">
            HONDURAS
          </text>

          {/* Costa Rica (South) */}
          <path
            d="M 400.1,570.5 L 429.0,552.2 L 555.3,589.9 L 599.3,571.4 L 660.1,583.2 L 691.9,612.5 L 748.4,622.0 L 794.3,591.8 L 920,591.8 L 920,640 L 0,640 L 0,570.5 Z"
            fill="#eae6dc"
            stroke="#cfc7b8"
            strokeWidth="1.2"
            opacity="0.85"
          />
          <text x="460" y="625" fill="#999182" fontSize="12" fontWeight="800" letterSpacing="5">
            COSTA RICA
          </text>
        </g>

        {/* Coastal Surf Buffer / Shallow Shelf */}
        <path
          d="M 400.1,570.5 L 370.0,547.1 L 333.8,525.7 L 280.0,495.0 L 244.2,468.4 L 202.0,420.4 L 150.0,395.0 L 121.2,375.7 L 75.0,345.0 L 25.2,311.5 L 46.5,289.5 L 78.1,310.9 L 92.6,300.8 L 152.2,295.0 L 176.2,262.5 L 204.4,261.2 L 200.3,191.3 L 245.2,187.9 L 285.2,189.0 L 326.5,151.0 L 383.1,179.8 L 402.8,162.1 L 438.1,145.2 L 505.0,106.0 L 526.5,78.0 L 551.1,44.0 L 571.2,39.9 L 603.8,61.6 L 642.2,68.0 L 684.6,50.0 L 733.0,49.9 L 799.5,31.3 L 826.1,11.9 L 891.8,14.8 L 875.3,28.5 L 865.5,60.2 L 885.1,112.3 L 840.9,160.7 L 820.4,217.9 L 814.2,280.6 L 824.5,317.3 L 829.3,381.3 L 800.0,395.3 L 782.1,456.1 L 795.3,493.6 L 756.0,530.0 L 765.0,568.5 L 794.3,591.8 L 748.4,622.0 L 691.9,612.5 L 660.1,583.2 L 599.3,571.4 L 555.3,589.9 L 429.0,552.2 Z"
          fill="none"
          stroke="#b8e1f0"
          strokeWidth="8"
          strokeLinejoin="round"
          opacity="0.6"
        />

        {/* Territorial Contour of Nicaragua (Geographically Accurate WGS84 Base) */}
        <path
          id="nicaragua-mainland"
          d="M 400.1,570.5 L 370.0,547.1 L 333.8,525.7 L 280.0,495.0 L 244.2,468.4 L 202.0,420.4 L 150.0,395.0 L 121.2,375.7 L 75.0,345.0 L 25.2,311.5 L 46.5,289.5 L 78.1,310.9 L 92.6,300.8 L 152.2,295.0 L 176.2,262.5 L 204.4,261.2 L 200.3,191.3 L 245.2,187.9 L 285.2,189.0 L 326.5,151.0 L 383.1,179.8 L 402.8,162.1 L 438.1,145.2 L 505.0,106.0 L 526.5,78.0 L 551.1,44.0 L 571.2,39.9 L 603.8,61.6 L 642.2,68.0 L 684.6,50.0 L 733.0,49.9 L 799.5,31.3 L 826.1,11.9 L 891.8,14.8 L 875.3,28.5 L 865.5,60.2 L 885.1,112.3 L 840.9,160.7 L 820.4,217.9 L 814.2,280.6 L 824.5,317.3 L 829.3,381.3 L 800.0,395.3 L 782.1,456.1 L 795.3,493.6 L 756.0,530.0 L 765.0,568.5 L 794.3,591.8 L 748.4,622.0 L 691.9,612.5 L 660.1,583.2 L 599.3,571.4 L 555.3,589.9 L 429.0,552.2 Z"
          fill="url(#nicaraguaLandGrad)"
          stroke="#2E7D4D"
          strokeWidth="2.2"
          strokeLinejoin="round"
          filter="url(#mapShadow)"
        />

        {/* Regional Boundaries (Subtle Cartographic Lines) */}
        <g stroke="#9C8B74" strokeWidth="0.9" strokeDasharray="3,3" opacity="0.35">
          {/* Occidente divider */}
          <path d="M 152.2,295.0 Q 185,340 202.0,420.4" fill="none" />
          {/* Las Segovias / North divider */}
          <path d="M 285.2,189.0 Q 295,240 310,290 Q 320,330 334,405" fill="none" />
          {/* Central / Chontales divider */}
          <path d="M 438.1,145.2 Q 430,220 440,300 Q 450,380 465,430" fill="none" />
          {/* Río San Juan border */}
          <path d="M 576,566 Q 640,550 748.4,622.0" fill="none" />
        </g>

        {/* Major Rivers */}
        <g stroke="#7FBED9" strokeWidth="1.2" fill="none" opacity="0.8">
          {/* Río San Juan (outlet from Lake Cocibolca to Caribbean) */}
          <path d="M 576,566 Q 630,578 660.1,583.2 Q 691.9,612.5 748.4,622.0 Q 770,610 794.3,591.8" />
          {/* Río Coco / Wangki (northern border) */}
          <path d="M 326.5,151.0 Q 383.1,179.8 438.1,145.2 Q 505.0,106.0 603.8,61.6 Q 733.0,49.9 891.8,14.8" />
        </g>

        {/* Major Water Bodies: Lago Xolotlán and Lago Cocibolca */}
        <g id="lakes-and-islands">
          {/* Lago Xolotlán (Lake Managua) */}
          <g id="lago-xolotlan">
            <path
              d="M 230,392 C 235,372 258,358 290,362 C 318,366 338,382 334,405 C 330,418 312,422 288,420 C 266,418 260,405 250,407 C 238,410 226,402 230,392 Z"
              fill="url(#lakeGrad)"
              stroke="#5E9DB6"
              strokeWidth="1.4"
            />
            <text x="282" y="394" textAnchor="middle" fill="#2C6D86" fontSize="8" fontWeight="800" opacity="0.9">
              Lago Xolotlán
            </text>
          </g>

          {/* Lago Cocibolca (Lake Nicaragua) */}
          <g id="lago-cocibolca">
            <path
              d="M 353,450 C 370,432 415,418 460,430 C 505,442 552,475 572,515 C 588,545 585,564 576,566 C 555,568 515,565 465,560 C 425,555 395,542 376,518 C 360,496 352,472 353,450 Z"
              fill="url(#lakeGrad)"
              stroke="#5E9DB6"
              strokeWidth="1.8"
            />
            <text x="475" y="495" textAnchor="middle" fill="#235D75" fontSize="11" fontWeight="800" letterSpacing="1" opacity="0.95">
              Lago Cocibolca
            </text>

            {/* Isla Zapatera */}
            <ellipse cx="375" cy="466" rx="6" ry="4" fill="#5B8662" stroke="#37553D" strokeWidth="0.8" />

            {/* Archipiélago de Solentiname */}
            <g opacity="0.9">
              <ellipse cx="542" cy="552" rx="5" ry="2.5" fill="#5B8662" />
              <ellipse cx="550" cy="554" rx="3.5" ry="2" fill="#5B8662" />
              <ellipse cx="536" cy="555" rx="3" ry="2" fill="#5B8662" />
            </g>

            {/* Isla de Ometepe (Hourglass Twin Volcano Island) */}
            <g id="isla-ometepe" filter="url(#pinShadow)">
              <path
                d="M 420,500 C 426,494 435,496 433,504 C 431,509 426,507 428,512 C 432,518 424,524 419,520 C 415,516 418,510 415,507 C 412,504 416,498 420,500 Z"
                fill="#3B6F45"
                stroke="#24482B"
                strokeWidth="1.2"
              />
              {/* Concepción & Maderas peaks */}
              <circle cx="423" cy="502" r="1.6" fill="#F1F5F9" />
              <circle cx="425" cy="514" r="1.3" fill="#E2E8F0" />
              <text x="444" y="513" fill="#1C3822" fontSize="7.5" fontWeight="900">
                Ometepe
              </text>
            </g>
          </g>
        </g>

        {/* Volcanic Chain of the Pacific (Cinturón Volcánico de Nicaragua) */}
        {(mapMode === 'illustrated' || mapMode === 'hybrid') && (
          <g id="volcanic-arc" opacity="0.85">
            {/* Cerro Negro */}
            <g transform="translate(185, 365)">
              <polygon points="0,-6 5,3 -5,3" fill="#5A4738" stroke="#3A2D23" strokeWidth="0.8" />
              <circle cx="0" cy="-6" r="1.2" fill="#FF5722" />
              <text x="0" y="9" textAnchor="middle" fill="#6B5B4D" fontSize="6" fontWeight="700">
                V. Cerro Negro
              </text>
            </g>

            {/* Momotombo */}
            <g transform="translate(232, 382)">
              <polygon points="0,-7 6,3 -6,3" fill="#5A4738" stroke="#3A2D23" strokeWidth="0.8" />
              <circle cx="0" cy="-7" r="1.2" fill="#FF5722" />
              <text x="0" y="9" textAnchor="middle" fill="#6B5B4D" fontSize="6" fontWeight="700">
                V. Momotombo
              </text>
            </g>

            {/* Masaya */}
            <g transform="translate(320, 448)">
              <polygon points="0,-6 5,3 -5,3" fill="#5A4738" stroke="#3A2D23" strokeWidth="0.8" />
              <circle cx="0" cy="-6" r="1.2" fill="#FF5722" />
            </g>

            {/* Mombacho */}
            <g transform="translate(358, 462)">
              <polygon points="0,-6 5,3 -5,3" fill="#3D5C43" stroke="#253D2A" strokeWidth="0.8" />
            </g>
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

        {/* Cultural Heritage Route Links */}
        <g stroke="#E07A5F" strokeWidth="1.6" strokeDasharray="3,3" opacity="0.75">
          <line x1="177" y1="379" x2="327" y2="445" /> {/* León -> Masaya */}
          <line x1="327" y1="445" x2="353" y2="451" /> {/* Masaya -> Granada */}
          <line x1="353" y1="451" x2="426" y2="508" stroke="#3D708F" strokeDasharray="4,4" /> {/* Granada -> Ometepe ferry */}
          <line x1="177" y1="379" x2="277" y2="286" /> {/* León -> Estelí */}
          <line x1="277" y1="286" x2="361" y2="309" /> {/* Estelí -> Matagalpa */}
          <line x1="353" y1="451" x2="370" y2="547" /> {/* Granada -> San Juan del Sur */}
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
        {cityPositions.map(({ city, x, y, count, labelOffset }) => {
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

              {/* City Label Badge with Smart Anti-Overlap Offsets */}
              <g transform={`translate(${x + (labelOffset?.dx || 0)}, ${y + (labelOffset?.dy || -22) + (isSelected ? ((labelOffset?.dy || -22) < 0 ? -3 : 3) : 0)})`}>
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
