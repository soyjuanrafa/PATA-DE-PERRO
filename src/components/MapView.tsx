/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Interactive Map & Location View Component
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CIUDADES_CREATIVAS, CiudadCreativa } from '../data/mockData';
import { MapPin, Navigation, Camera, Compass, Star, ChevronRight } from 'lucide-react';

export const MapView: React.FC = () => {
  const { experiences, setSelectedExperience, setActiveScreen } = useApp();
  const [selectedCity, setSelectedCity] = useState<CiudadCreativa>(CIUDADES_CREATIVAS[0]);

  const cityExperiences = experiences.filter(
    e => e.ciudad_creativa.toLowerCase() === selectedCity.nombre.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#faf6f0] pb-20 pt-4 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Geolocalización & RA
          </span>
          <h1 className="text-stone-900 text-2xl sm:text-3xl font-black tracking-tight pt-1">
            Mapa de Ciudades Creativas
          </h1>
        </div>

        <button
          id="btn-launch-ar-simulator"
          onClick={() => setActiveScreen('ar_navigation')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-all"
        >
          <Camera className="w-4 h-4" />
          <span>Navegar con RA</span>
        </button>
      </div>

      {/* SVG Interactive Map Canvas */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <p className="text-stone-600 text-xs font-semibold">
            Selecciona una Ciudad Creativa para explorar sus puntos de interés:
          </p>
          <span className="text-xs text-stone-400 font-medium">Coordenadas WGS84</span>
        </div>

        {/* Simplified Map Visualization */}
        <div className="relative w-full h-[320px] bg-stone-50 rounded-2xl border border-stone-200/80 p-4 flex items-center justify-center overflow-hidden">
          {/* Background Map Graphic Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 500 300">
            <path
              d="M 50 100 Q 150 50, 250 120 T 450 100"
              stroke="#2E9D62"
              strokeWidth="4"
              fill="none"
              strokeDasharray="6 6"
            />
            <path
              d="M 100 200 Q 200 250, 350 180"
              stroke="#FF5722"
              strokeWidth="4"
              fill="none"
              strokeDasharray="6 6"
            />
            <circle cx="280" cy="180" r="40" fill="#2E9D62" opacity="0.2" />
          </svg>

          {/* Interactive City Pins on Map */}
          <div className="absolute inset-0 p-6 flex flex-wrap items-center justify-around gap-4 z-10">
            {CIUDADES_CREATIVAS.map(ciudad => {
              const isSelected = selectedCity.id === ciudad.id;
              return (
                <button
                  key={ciudad.id}
                  id={`pin-city-${ciudad.id}`}
                  onClick={() => setSelectedCity(ciudad)}
                  className={`group relative transition-all transform ${
                    isSelected ? 'scale-110 z-20' : 'hover:scale-105 opacity-80'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white ring-4 ring-orange-200'
                        : 'bg-white text-stone-800 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
                    <span>{ciudad.nombre}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-stone-500 font-bold border border-stone-200">
            Nicaragua • Red de Ciudades Creativas
          </div>
        </div>
      </div>

      {/* Selected City Details & Experiences */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs text-orange-600 font-bold uppercase tracking-wider">
              {selectedCity.departamento}
            </span>
            <h2 className="text-stone-900 text-2xl font-black">{selectedCity.nombre}</h2>
            <p className="text-stone-600 text-xs mt-0.5">{selectedCity.descripcion}</p>
          </div>

          <button
            onClick={() => setActiveScreen('ar_navigation')}
            className="self-start sm:self-center px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-2"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Navegar {selectedCity.nombre} en RA</span>
          </button>
        </div>

        {/* Experiences in selected city */}
        <div className="space-y-3">
          <h3 className="text-stone-900 text-sm font-bold">
            Experiencias disponibles en {selectedCity.nombre}:
          </h3>

          {cityExperiences.length === 0 ? (
            <p className="text-stone-500 text-xs italic py-4">
              Próximamente más experiencias comunitarias para esta ciudad.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cityExperiences.map(exp => (
                <div
                  key={exp.id_exp}
                  onClick={() => setSelectedExperience(exp)}
                  className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 hover:bg-amber-50/50 hover:border-amber-200 transition-all cursor-pointer flex gap-4"
                >
                  <img
                    src={exp.imagen_url}
                    alt={exp.titulo}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-500">
                      <span className="font-bold text-emerald-700">{exp.categoria}</span>
                      <span className="font-bold text-stone-900">${exp.precio} USD</span>
                    </div>
                    <h4 className="text-stone-900 text-xs font-bold line-clamp-1">{exp.titulo}</h4>
                    <p className="text-stone-500 text-[11px] line-clamp-1">{exp.ubicacion_nombre}</p>

                    <div className="pt-1 flex items-center justify-between text-[10px]">
                      <span className="text-amber-600 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" /> {exp.rating}
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        Ver Detalle <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
