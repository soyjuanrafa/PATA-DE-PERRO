/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Tactical 360° Proximity Radar Screen (LiDAR Sensor Sweep)
 * Zero external API dependencies, zero permissions required, highly interactive.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Experiencia } from '../types';
import { CIUDADES_CREATIVAS, CiudadCreativa } from '../data/mockData';
import { calculateHaversineDistance } from '../utils/security';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import {
  Compass,
  Navigation,
  Sparkles,
  MapPin,
  ChevronRight,
  Radio,
  CheckCircle2,
  Clock,
  Crosshair,
  Layers,
} from 'lucide-react';

interface ARRadarViewProps {
  activeExperience: Experiencia;
  allExperiences: Experiencia[];
  onSelectExperience: (exp: Experiencia) => void;
  onSwitchToVisor: () => void;
}

// Helper to compute initial azimuth bearing from point A to point B in degrees (0 - 360)
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaLambda = toRad(lon2 - lon1);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

export const ARRadarView: React.FC<ARRadarViewProps> = ({
  activeExperience,
  allExperiences,
  onSelectExperience,
  onSwitchToVisor,
}) => {
  // Simulated tourist GPS origin (Plaza Parque Central de León: 12.4350, -86.8790)
  const [userLat] = useState<number>(12.4350);
  const [userLon] = useState<number>(-86.8790);

  // Radar range filter in km
  const [radarRangeKm, setRadarRangeKm] = useState<number>(15);
  // Selected target on radar
  const [lockedExp, setLockedExp] = useState<Experiencia>(activeExperience);
  // Animated sweep angle (0 to 360 deg)
  const [sweepAngle, setSweepAngle] = useState<number>(0);

  // Continuous sweeping beam animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Compute calculated metrics for all points of interest
  const radarTargets = useMemo(() => {
    return allExperiences.map(exp => {
      const distMeters = calculateHaversineDistance(
        userLat,
        userLon,
        exp.ubicacion_lat,
        exp.ubicacion_lon
      );
      const distKm = distMeters / 1000;
      const bearing = calculateBearing(
        userLat,
        userLon,
        exp.ubicacion_lat,
        exp.ubicacion_lon
      );
      // Walking time at ~4.8 km/h
      const walkMins = Math.round((distKm / 4.8) * 60);

      return {
        exp,
        distMeters,
        distKm,
        bearing,
        walkMins,
      };
    });
  }, [allExperiences, userLat, userLon]);

  // Filter targets within selected range or sort
  const visibleTargets = useMemo(() => {
    return radarTargets
      .filter(t => t.distKm <= radarRangeKm)
      .sort((a, b) => a.distKm - b.distKm);
  }, [radarTargets, radarRangeKm]);

  // Radar circular coordinates helper (center: 200, 200; radius: 170)
  const RADAR_CENTER = 200;
  const RADAR_RADIUS = 160;

  const getTargetXY = (bearing: number, distKm: number) => {
    const normalizedDist = Math.min(distKm / radarRangeKm, 1);
    const r = normalizedDist * RADAR_RADIUS;
    // 0 deg is North (-Y), 90 deg is East (+X)
    const rad = ((bearing - 90) * Math.PI) / 180;
    return {
      x: RADAR_CENTER + r * Math.cos(rad),
      y: RADAR_CENTER + r * Math.sin(rad),
    };
  };

  const selectedTargetData = radarTargets.find(t => t.exp.id_exp === lockedExp.id_exp) || radarTargets[0];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">
      {/* Tactical Radar Display Canvas */}
      <div className="flex-1 bg-gradient-to-b from-[#0a1410] via-[#0d1a15] to-[#08100d] rounded-3xl p-4 sm:p-6 border border-emerald-900/60 shadow-2xl relative flex flex-col items-center justify-between min-h-[460px] select-none overflow-hidden">
        {/* Radar Header Telemetry */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
              Escaneo LiDAR 360° • Activo
            </span>
          </div>

          {/* Range selector */}
          <div className="inline-flex rounded-xl bg-black/60 p-1 border border-emerald-500/20 backdrop-blur-md text-xs">
            {[5, 15, 50, 150].map(range => (
              <button
                key={`range-${range}`}
                onClick={() => setRadarRangeKm(range)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  radarRangeKm === range
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {range} km
              </button>
            ))}
          </div>
        </div>

        {/* Circular Tactical Radar Screen */}
        <div className="w-full flex-1 flex items-center justify-center relative my-2">
          <svg viewBox="0 0 400 400" className="w-full max-w-[360px] h-[360px]">
            <defs>
              {/* Radar Sweep Gradient */}
              <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2E9D62" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#2E9D62" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#2E9D62" stopOpacity="0" />
              </linearGradient>

              {/* Glowing Ping Filter */}
              <filter id="blipGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FF5722" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Radar Background Circle */}
            <circle cx="200" cy="200" r={RADAR_RADIUS} fill="#06100c" stroke="#16382a" strokeWidth="2" />

            {/* Concentric Distance Rings */}
            {[0.25, 0.5, 0.75, 1].map((factor, idx) => (
              <circle
                key={`ring-${idx}`}
                cx="200"
                cy="200"
                r={RADAR_RADIUS * factor}
                fill="none"
                stroke="#174332"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.7"
              />
            ))}

            {/* Range Labels on Rings */}
            <text x="204" y={200 - RADAR_RADIUS * 0.25} fill="#3b7a5e" fontSize="8" fontWeight="bold">
              {(radarRangeKm * 0.25).toFixed(0)} km
            </text>
            <text x="204" y={200 - RADAR_RADIUS * 0.5} fill="#3b7a5e" fontSize="8" fontWeight="bold">
              {(radarRangeKm * 0.5).toFixed(0)} km
            </text>
            <text x="204" y={200 - RADAR_RADIUS * 0.75} fill="#3b7a5e" fontSize="8" fontWeight="bold">
              {(radarRangeKm * 0.75).toFixed(0)} km
            </text>
            <text x="204" y={200 - RADAR_RADIUS + 12} fill="#3b7a5e" fontSize="8" fontWeight="bold">
              {radarRangeKm} km
            </text>

            {/* Crosshairs & Compass Degrees */}
            <line x1="200" y1="40" x2="200" y2="360" stroke="#16382a" strokeWidth="1" />
            <line x1="40" y1="200" x2="360" y2="200" stroke="#16382a" strokeWidth="1" />

            {/* Cardinal Directions */}
            <text x="200" y="32" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="900">
              N
            </text>
            <text x="375" y="204" textAnchor="middle" fill="#3FAF6C" fontSize="10" fontWeight="bold">
              E
            </text>
            <text x="200" y="380" textAnchor="middle" fill="#3FAF6C" fontSize="10" fontWeight="bold">
              S
            </text>
            <text x="25" y="204" textAnchor="middle" fill="#3FAF6C" fontSize="10" fontWeight="bold">
              O
            </text>

            {/* Rotating LiDAR Sweeping Sector */}
            <g transform={`rotate(${sweepAngle}, 200, 200)`}>
              <path
                d={`M 200,200 L ${200 + RADAR_RADIUS * Math.cos(-Math.PI / 6)},${200 + RADAR_RADIUS * Math.sin(-Math.PI / 6)} A ${RADAR_RADIUS},${RADAR_RADIUS} 0 0,1 ${200 + RADAR_RADIUS},200 Z`}
                fill="url(#sweepGradient)"
              />
              <line x1="200" y1="200" x2={200 + RADAR_RADIUS} y2="200" stroke="#3FAF6C" strokeWidth="1.5" />
            </g>

            {/* Center Tourist Position Indicator */}
            <circle cx="200" cy="200" r="5" fill="#3FAF6C" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="12" fill="none" stroke="#3FAF6C" strokeWidth="1" opacity="0.5" className="animate-ping" />

            {/* Radar Target Blips */}
            {radarTargets.map(({ exp, distKm, bearing }) => {
              const { x, y } = getTargetXY(bearing, distKm);
              const isLocked = lockedExp.id_exp === exp.id_exp;
              const isWithinRadar = distKm <= radarRangeKm;

              if (!isWithinRadar) return null;

              return (
                <g
                  key={`radar-blip-${exp.id_exp}`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setLockedExp(exp);
                    onSelectExperience(exp);
                  }}
                >
                  {isLocked && (
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      fill="none"
                      stroke="#FF5722"
                      strokeWidth="1.8"
                      className="animate-ping"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isLocked ? 6.5 : 4.5}
                    fill={isLocked ? '#FF5722' : '#2E9D62'}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    filter={isLocked ? 'url(#blipGlow)' : undefined}
                  />
                  {/* Blip Label on hover or locked */}
                  {isLocked && (
                    <g transform={`translate(${x}, ${y - 12})`}>
                      <rect
                        x="-35"
                        y="-12"
                        width="70"
                        height="15"
                        rx="7"
                        fill="#1E293B"
                        stroke="#FF5722"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-1"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        {exp.ciudad_creativa}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Radar Metrics */}
        <div className="w-full flex items-center justify-between text-xs text-stone-400 z-10 pt-2 border-t border-emerald-900/40">
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>Objetivos en Rango: <strong className="text-white">{visibleTargets.length}</strong></span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Azimut Activo: {Math.round(selectedTargetData.bearing)}°
          </span>
        </div>
      </div>

      {/* Target Details & Navigation Action Panel */}
      <div className="w-full lg:w-96 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              Objetivo Radar Fijado
            </span>
            <span className="text-xs font-mono font-bold text-orange-600">
              Rumbo {Math.round(selectedTargetData.bearing)}°
            </span>
          </div>

          <div className="flex gap-3">
            <img
              src={resolveImageUrl(lockedExp.imagen_url)}
              onError={e => handleImageFallback(e, lockedExp.imagen_url)}
              alt={lockedExp.titulo}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-stone-100"
            />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">
                {lockedExp.ciudad_creativa} • {lockedExp.categoria}
              </span>
              <h3 className="text-stone-900 font-extrabold text-sm leading-snug line-clamp-2">
                {lockedExp.titulo}
              </h3>
              <p className="text-stone-500 text-xs flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                <span className="truncate">{lockedExp.ubicacion_nombre}</span>
              </p>
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
            <div>
              <span className="text-[10px] text-stone-500 block font-medium">Distancia Haversine:</span>
              <p className="text-base font-black text-stone-900">
                {selectedTargetData.distKm < 1
                  ? `${Math.round(selectedTargetData.distMeters)} m`
                  : `${selectedTargetData.distKm.toFixed(1)} km`}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block font-medium">Tiempo a pie est.:</span>
              <p className="text-base font-black text-emerald-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedTargetData.walkMins} min</span>
              </p>
            </div>
          </div>

          {/* Quick List of Nearby Targets */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-stone-700 block">Otros Puntos Cercanos:</span>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {visibleTargets.slice(0, 4).map(({ exp, distKm }) => (
                <button
                  key={`quick-${exp.id_exp}`}
                  onClick={() => {
                    setLockedExp(exp);
                    onSelectExperience(exp);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                    lockedExp.id_exp === exp.id_exp
                      ? 'bg-orange-50 text-orange-900 border border-orange-200 font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span className="truncate max-w-[180px]">{exp.titulo}</span>
                  <span className="text-[11px] font-mono text-stone-500 shrink-0">
                    {distKm.toFixed(1)} km
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button: Switch to Optical Field Visor */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <button
            onClick={() => {
              onSelectExperience(lockedExp);
              onSwitchToVisor();
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Navegar hacia este destino en Visor RA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
