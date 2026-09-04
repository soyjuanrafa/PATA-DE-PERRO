/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Interactive Map of Creative Cities of Nicaragua
 * Uses High-Performance Autonomous WGS84 Vector Map (zero-cost, immediate loading)
 * Advanced Google Maps Platform testing is available in Developer Options.
 */

import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { CIUDADES_CREATIVAS, CiudadCreativa } from '../data/mockData';
import { Experiencia } from '../types';
import { VectorMapStage } from './VectorMapStage';
import {
  MapPin,
  Camera,
  ArrowLeft,
  Compass,
  Maximize2,
  Globe,
  ChevronRight,
} from 'lucide-react';

const NICARAGUA_CENTER = { lat: 12.8654, lng: -85.2072 };

export const MapView: React.FC = () => {
  const { experiences, setSelectedExperience, setActiveScreen } = useApp();
  const [selectedCity, setSelectedCity] = useState<CiudadCreativa>(CIUDADES_CREATIVAS[0]);
  const [, setTargetCoords] = useState<{ lat: number; lng: number } | null>({
    lat: CIUDADES_CREATIVAS[0].lat,
    lng: CIUDADES_CREATIVAS[0].lon,
  });
  const [showAllExperiences, setShowAllExperiences] = useState<boolean>(true);
  const [selectedExp, setSelectedExp] = useState<Experiencia | null>(null);

  const handleSelectCity = useCallback((ciudad: CiudadCreativa) => {
    setSelectedCity(ciudad);
    setTargetCoords({ lat: ciudad.lat, lng: ciudad.lon });
    setSelectedExp(null);
  }, []);

  const handleSelectExperience = useCallback((exp: Experiencia) => {
    setTargetCoords({ lat: exp.ubicacion_lat, lng: exp.ubicacion_lon });
    setSelectedExp(exp);
  }, []);

  const handleResetToNicaragua = useCallback(() => {
    setTargetCoords(NICARAGUA_CENTER);
    setSelectedExp(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf6f0] pb-20 pt-4 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="btn-map-back"
          onClick={() => setActiveScreen('explore')}
          className="flex items-center gap-2 text-xs font-bold text-[#23404A] hover:text-[#FF6B35] bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs transition-all font-manrope cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Motor Vectorial WGS84 • Autónomo
          </span>

          <button
            id="btn-goto-dev-maps"
            onClick={() => setActiveScreen('dev_options')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-stone-200 text-stone-600 hover:text-orange-600 hover:border-orange-200 shadow-2xs transition-colors cursor-pointer"
            title="Abrir laboratorio experimental de Google Maps Platform en Opciones de Desarrollador"
          >
            <Globe className="w-3.5 h-3.5 text-orange-500" />
            <span>Laboratorio Google Maps (Dev)</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Geolocalización & Cartografía
          </span>
          <h1 className="text-stone-900 text-2xl sm:text-3xl font-black tracking-tight pt-1">
            Mapa de Ciudades Creativas de Nicaragua
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
            Explora las joyas culturales, senderos naturales y anfitriones comunitarios en el mapa interactivo.
          </p>
        </div>

        <button
          id="btn-launch-ar-simulator"
          onClick={() => setActiveScreen('ar_navigation')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Navegar con RA</span>
        </button>
      </div>

      {/* Quick City Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          id="btn-center-nicaragua"
          onClick={handleResetToNicaragua}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 cursor-pointer shadow-2xs"
        >
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>Todo el País</span>
        </button>
        {CIUDADES_CREATIVAS.map(ciudad => {
          const isSelected = selectedCity.id === ciudad.id;
          return (
            <button
              key={ciudad.id}
              id={`pill-city-${ciudad.id}`}
              onClick={() => handleSelectCity(ciudad)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-200'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-white/60 bg-stone-100">
                <img
                  src={ciudad.mapa_imagen || ciudad.imagen}
                  alt={ciudad.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <span>{ciudad.nombre}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Map Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-sm relative space-y-4">
        {/* Map Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-stone-800">
              Cartografía Oficial de Nicaragua & Ciudades Creativas
            </span>
            <span className="text-[11px] text-stone-400 hidden md:inline">
              • Planos de León, Granada, Masaya, Ometepe y Estelí
            </span>
          </div>

          {/* Options */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showAllExperiences}
                onChange={e => setShowAllExperiences(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400 border-stone-300"
              />
              <span>Mostrar Experiencias ({experiences.length})</span>
            </label>

            <button
              onClick={handleResetToNicaragua}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Restablecer vista a Nicaragua"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>
          </div>
        </div>

        {/* High-Performance WGS84 SVG Vector Stage */}
        <VectorMapStage
          cities={CIUDADES_CREATIVAS}
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
          experiences={experiences}
          selectedExperience={selectedExp}
          onSelectExperience={handleSelectExperience}
          showAllExperiences={showAllExperiences}
          onLaunchAR={() => setActiveScreen('ar_navigation')}
          onViewExperienceDetails={exp => {
            setSelectedExperience(exp);
          }}
        />
      </div>
    </div>
  );
};
