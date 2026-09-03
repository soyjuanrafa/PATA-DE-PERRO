/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Interactive Google Maps & Location View Component using Google Maps Platform
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { useApp } from '../context/AppContext';
import { CIUDADES_CREATIVAS, CiudadCreativa } from '../data/mockData';
import { Experiencia } from '../types';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import {
  MapPin,
  Navigation,
  Camera,
  Star,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Compass,
  Maximize2,
  Info,
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const NICARAGUA_CENTER = { lat: 12.8654, lng: -85.2072 };

// Internal controller component for programmatic smooth camera panning and zooming
const MapCameraController: React.FC<{
  targetCoords: { lat: number; lng: number } | null;
  zoomLevel: number;
}> = ({ targetCoords, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !targetCoords) return;
    map.panTo(targetCoords);
    map.setZoom(zoomLevel);
  }, [map, targetCoords, zoomLevel]);

  return null;
};

export const MapView: React.FC = () => {
  const { experiences, setSelectedExperience, setActiveScreen } = useApp();
  const [selectedCity, setSelectedCity] = useState<CiudadCreativa>(CIUDADES_CREATIVAS[0]);
  const [targetCoords, setTargetCoords] = useState<{ lat: number; lng: number } | null>({
    lat: CIUDADES_CREATIVAS[0].lat,
    lng: CIUDADES_CREATIVAS[0].lon,
  });
  const [zoomLevel, setZoomLevel] = useState<number>(11);
  const [mapType, setMapType] = useState<string>('roadmap');
  const [showAllExperiences, setShowAllExperiences] = useState<boolean>(true);

  // Active popup info window marker
  const [activeMarker, setActiveMarker] = useState<
    | { type: 'city'; city: CiudadCreativa }
    | { type: 'exp'; exp: Experiencia }
    | null
  >({ type: 'city', city: CIUDADES_CREATIVAS[0] });

  const cityExperiences = experiences.filter(
    e => e.ciudad_creativa.toLowerCase() === selectedCity.nombre.toLowerCase()
  );

  const handleSelectCity = useCallback((ciudad: CiudadCreativa) => {
    setSelectedCity(ciudad);
    setTargetCoords({ lat: ciudad.lat, lng: ciudad.lon });
    setZoomLevel(12);
    setActiveMarker({ type: 'city', city: ciudad });
  }, []);

  const handleSelectExperience = useCallback((exp: Experiencia) => {
    setTargetCoords({ lat: exp.ubicacion_lat, lng: exp.ubicacion_lon });
    setZoomLevel(14);
    setActiveMarker({ type: 'exp', exp });
  }, []);

  const handleResetToNicaragua = useCallback(() => {
    setTargetCoords(NICARAGUA_CENTER);
    setZoomLevel(8);
    setActiveMarker(null);
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

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-stone-200 text-stone-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Google Maps Platform • WGS84
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Geolocalización & Google Maps
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
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-200'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
              <span>{ciudad.nombre}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Google Maps Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-sm relative space-y-4">
        {/* Map Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Vista:
            </span>
            <div className="inline-flex rounded-lg bg-stone-100 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMapType('roadmap')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  mapType === 'roadmap' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Mapa
              </button>
              <button
                type="button"
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  mapType === 'satellite' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Satélite
              </button>
              <button
                type="button"
                onClick={() => setMapType('terrain')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  mapType === 'terrain' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Relieve
              </button>
            </div>
          </div>

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
              <span className="hidden sm:inline">Restablecer Vista</span>
            </button>
          </div>
        </div>

        {/* Google Map Stage */}
        <div className="w-full h-[450px] sm:h-[540px] rounded-2xl overflow-hidden relative border border-stone-200 bg-stone-100">
          {!GOOGLE_MAPS_API_KEY && (
            <div className="absolute top-3 left-3 z-10 bg-amber-600/90 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-md backdrop-blur-xs flex items-center gap-1.5 pointer-events-none">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Modo demo: configura <code>VITE_GOOGLE_MAPS_API_KEY</code> en tu .env</span>
            </div>
          )}
          <APIProvider
            apiKey={GOOGLE_MAPS_API_KEY}
            libraries={['marker']}
            language="es"
            region="NI"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            <Map
              id="gmp-interactive-map"
              mapId="DEMO_MAP_ID"
              defaultCenter={NICARAGUA_CENTER}
              defaultZoom={8}
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapTypeId={mapType}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
            >
              <MapCameraController targetCoords={targetCoords} zoomLevel={zoomLevel} />

              {/* Creative Cities Markers */}
              {CIUDADES_CREATIVAS.map(ciudad => {
                const isSelected = selectedCity.id === ciudad.id;
                return (
                  <AdvancedMarker
                    key={`city-${ciudad.id}`}
                    position={{ lat: ciudad.lat, lng: ciudad.lon }}
                    title={ciudad.nombre}
                    onClick={() => handleSelectCity(ciudad)}
                  >
                    <Pin
                      background={isSelected ? '#FF5722' : '#2E9D62'}
                      borderColor="#FFFFFF"
                      glyphColor="#FFFFFF"
                      scale={isSelected ? 1.25 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}

              {/* Individual Experience POI Markers */}
              {showAllExperiences &&
                experiences.map(exp => (
                  <AdvancedMarker
                    key={`exp-${exp.id_exp}`}
                    position={{ lat: exp.ubicacion_lat, lng: exp.ubicacion_lon }}
                    title={exp.titulo}
                    onClick={() => handleSelectExperience(exp)}
                  >
                    <div className="group relative cursor-pointer transform hover:scale-110 transition-transform">
                      <div className="bg-white/95 text-stone-900 border border-orange-500/80 px-2 py-1 rounded-full shadow-md text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-orange-500" />
                        <span className="max-w-[90px] truncate">{exp.titulo}</span>
                        <span className="text-emerald-700 font-extrabold">${exp.precio}</span>
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}

              {/* Selected City InfoWindow */}
              {activeMarker?.type === 'city' && (
                <InfoWindow
                  position={{ lat: activeMarker.city.lat, lng: activeMarker.city.lon }}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-1 max-w-[220px] text-stone-900 font-sans">
                    <img
                      src={resolveImageUrl(activeMarker.city.imagen)}
                      alt={activeMarker.city.nombre}
                      className="w-full h-20 object-cover rounded-lg mb-2"
                      onError={e => handleImageFallback(e, activeMarker.city.imagen)}
                    />
                    <div className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                      {activeMarker.city.departamento}
                    </div>
                    <h3 className="font-extrabold text-sm text-stone-900 leading-tight">
                      {activeMarker.city.nombre}
                    </h3>
                    <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">
                      {activeMarker.city.descripcion}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedCity(activeMarker.city);
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1 px-2 rounded-md transition-colors text-center cursor-pointer"
                      >
                        Ver Experiencias
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCity(activeMarker.city);
                          setActiveScreen('ar_navigation');
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold py-1 px-2 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                        title="Simular en Realidad Aumentada"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}

              {/* Selected Experience InfoWindow */}
              {activeMarker?.type === 'exp' && (
                <InfoWindow
                  position={{ lat: activeMarker.exp.ubicacion_lat, lng: activeMarker.exp.ubicacion_lon }}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-1 max-w-[230px] text-stone-900 font-sans">
                    <img
                      src={resolveImageUrl(activeMarker.exp.imagen_url)}
                      alt={activeMarker.exp.titulo}
                      className="w-full h-20 object-cover rounded-lg mb-2"
                      onError={e => handleImageFallback(e, activeMarker.exp.imagen_url)}
                    />
                    <div className="flex items-center justify-between text-[10px] text-stone-500 mb-0.5">
                      <span className="font-bold text-emerald-700">{activeMarker.exp.categoria}</span>
                      <span className="font-bold text-stone-900">${activeMarker.exp.precio} {activeMarker.exp.moneda}</span>
                    </div>
                    <h3 className="font-extrabold text-xs text-stone-900 leading-snug line-clamp-2">
                      {activeMarker.exp.titulo}
                    </h3>
                    <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                      <span className="truncate">{activeMarker.exp.ubicacion_nombre}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedExperience(activeMarker.exp);
                      }}
                      className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold py-1.5 rounded-md transition-colors cursor-pointer"
                    >
                      Ver Detalle Completo
                    </button>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Floating Map Watermark Badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-stone-600 font-bold border border-stone-200 pointer-events-none shadow-2xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Google Maps Platform • Ciudades Creativas</span>
          </div>
        </div>
      </div>

      {/* Selected City Details & Experiences */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 space-y-4 shadow-2xs">
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
            className="self-start sm:self-center px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Navegar {selectedCity.nombre} en RA</span>
          </button>
        </div>

        {/* Experiences in selected city */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-stone-900 text-sm font-bold">
              Experiencias disponibles en {selectedCity.nombre}:
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              {cityExperiences.length} {cityExperiences.length === 1 ? 'experiencia' : 'experiencias'}
            </span>
          </div>

          {cityExperiences.length === 0 ? (
            <p className="text-stone-500 text-xs italic py-4">
              Próximamente más experiencias comunitarias para esta ciudad.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cityExperiences.map(exp => (
                <div
                  key={exp.id_exp}
                  onClick={() => {
                    handleSelectExperience(exp);
                    setSelectedExperience(exp);
                  }}
                  className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 hover:bg-amber-50/50 hover:border-amber-200 transition-all cursor-pointer flex gap-4"
                >
                  <img
                    src={resolveImageUrl(exp.imagen_url)}
                    onError={e => handleImageFallback(e, exp.imagen_url)}
                    alt={exp.titulo}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-500">
                      <span className="font-bold text-emerald-700">{exp.categoria}</span>
                      <span className="font-bold text-stone-900">${exp.precio} {exp.moneda}</span>
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
