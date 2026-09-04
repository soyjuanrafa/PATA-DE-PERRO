/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Google Maps Platform - Developer Laboratory & Experimental Sandbox
 * Dedicated environment for developers to test, configure, and enhance
 * satellite cartography, custom markers, and Google Maps APIs.
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
import { CIUDADES_CREATIVAS, CiudadCreativa } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Experiencia } from '../types';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import {
  Globe,
  MapPin,
  Layers,
  Compass,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Code2,
  Sliders,
  Eye,
  Info,
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const NICARAGUA_CENTER = { lat: 12.8654, lng: -85.2072 };

// Internal controller component for programmatic smooth camera panning and zooming in Google Maps
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

export const GoogleMapsDevLab: React.FC = () => {
  const { experiences } = useApp();
  const [selectedCity, setSelectedCity] = useState<CiudadCreativa>(CIUDADES_CREATIVAS[0]);
  const [targetCoords, setTargetCoords] = useState<{ lat: number; lng: number } | null>({
    lat: CIUDADES_CREATIVAS[0].lat,
    lng: CIUDADES_CREATIVAS[0].lon,
  });
  const [zoomLevel, setZoomLevel] = useState<number>(11);
  const [mapType, setMapType] = useState<string>('roadmap');
  const [showExperiences, setShowExperiences] = useState<boolean>(true);
  const [activeMarker, setActiveMarker] = useState<
    | { type: 'city'; city: CiudadCreativa }
    | { type: 'exp'; exp: Experiencia }
    | null
  >({ type: 'city', city: CIUDADES_CREATIVAS[0] });

  const [gmpError, setGmpError] = useState<string | null>(null);

  // Monitor Google Maps activation errors
  useEffect(() => {
    const handleGmAuthFailure = () => {
      setGmpError(
        'ApiNotActivatedMapError: La "Maps JavaScript API" no está activada en tu proyecto de Google Cloud Console.'
      );
    };

    const prevAuthFailure = (window as unknown as { gm_authFailure?: () => void }).gm_authFailure;
    (window as unknown as { gm_authFailure: () => void }).gm_authFailure = handleGmAuthFailure;

    const handleErrorEvent = (event: ErrorEvent) => {
      if (
        event.message?.includes('ApiNotActivatedMapError') ||
        event.message?.includes('Google Maps JavaScript API')
      ) {
        setGmpError(
          'ApiNotActivatedMapError: La "Maps JavaScript API" debe activarse en Google Cloud Console para tu clave de API.'
        );
      }
    };

    window.addEventListener('error', handleErrorEvent);

    return () => {
      (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = prevAuthFailure;
      window.removeEventListener('error', handleErrorEvent);
    };
  }, []);

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

  const hasApiKey = Boolean(GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim().length > 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-4 h-4 text-orange-500" />
            Módulo Experimental • Google Maps Platform
          </div>
          <h2 className="text-slate-900 text-xl sm:text-2xl font-black font-outfit tracking-tight pt-1">
            Laboratorio de Cartografía Google Maps
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5 max-w-2xl">
            Ambiente reservado para desarrolladores. Permite probar capas satelitales, calibrar coordenadas WGS84, depurar cuotas de API y planificar futuras integraciones (Street View, rutas ecológicas y geocodificación) sin afectar el mapa autónomo público.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs">
            <Sliders className="w-3.5 h-3.5 text-orange-600" />
            Entorno de Pruebas Activo
          </span>
        </div>
      </div>

      {/* Diagnostics & Config Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: API Key Status */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-orange-500" />
              Estado de Clave de API
            </span>
            {hasApiKey ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Configurada
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Demo / No Clave
              </span>
            )}
          </div>
          <div className="font-mono text-xs text-slate-600 bg-white p-2 rounded-xl border border-slate-200 truncate">
            {hasApiKey
              ? `${GOOGLE_MAPS_API_KEY.slice(0, 8)}••••••••••••${GOOGLE_MAPS_API_KEY.slice(-4)}`
              : 'VITE_GOOGLE_MAPS_API_KEY (Vacía)'}
          </div>
          <p className="text-[11px] text-slate-500">
            Variable gestionada en el entorno seguro de la aplicación (.env).
          </p>
        </div>

        {/* Card 2: Maps JavaScript API Status */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Servicio Maps JavaScript API
            </span>
            {gmpError ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                Pendiente en GCP
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Activo / Listo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600">
            {gmpError ? 'Requiere habilitación en Google Cloud Console' : 'Respondiendo a peticiones de renderizado'}
          </p>
          <a
            href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline"
          >
            <span>Google Cloud Console</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Card 3: Telemetry & Active Center */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              Telemetría de Enfoque
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">
              Zoom {zoomLevel}x
            </span>
          </div>
          <div className="text-xs text-slate-700 font-mono">
            Lat: {targetCoords?.lat.toFixed(4) ?? '12.8654'} | Lon:{' '}
            {targetCoords?.lng.toFixed(4) ?? '-85.2072'}
          </div>
          <p className="text-[11px] text-slate-500">
            {activeMarker?.type === 'city'
              ? `Centrado en ${activeMarker.city.nombre}`
              : activeMarker?.type === 'exp'
              ? `Centrado en ${activeMarker.exp.titulo}`
              : 'Vista nacional (Nicaragua)'}
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Layer Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            Capa de Renderizado:
          </span>
          <div className="inline-flex rounded-xl bg-white p-0.5 text-xs border border-slate-200 shadow-2xs">
            {(['roadmap', 'satellite', 'terrain', 'hybrid'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setMapType(type)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  mapType === type
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'roadmap'
                  ? 'Mapa'
                  : type === 'satellite'
                  ? 'Satélite'
                  : type === 'terrain'
                  ? 'Relieve'
                  : 'Híbrido'}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showExperiences}
              onChange={e => setShowExperiences(e.target.checked)}
              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400 border-slate-300"
            />
            <span>Puntos de Experiencias ({experiences.length})</span>
          </label>

          <button
            onClick={handleResetToNicaragua}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            <Compass className="w-3.5 h-3.5 text-orange-500" />
            <span>Nicaragua Completa</span>
          </button>
        </div>
      </div>

      {/* Quick City Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Ciudades:</span>
        {CIUDADES_CREATIVAS.map(ciudad => {
          const isSelected = selectedCity.id === ciudad.id;
          return (
            <button
              key={ciudad.id}
              onClick={() => handleSelectCity(ciudad)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-xs ring-2 ring-orange-200'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
              <span>{ciudad.nombre}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="w-full h-[520px] rounded-3xl overflow-hidden relative border border-slate-200 bg-slate-100 shadow-inner">
        {gmpError ? (
          /* Informative Troubleshooting Card for Developers */
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/98 backdrop-blur-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="max-w-lg space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Aviso Técnico de Configuración GCP
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Maps JavaScript API no está activada en Google Cloud
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tu clave de API se encuentra inyectada correctamente, pero requiere que el servicio{' '}
                <strong>Maps JavaScript API</strong> esté habilitado en el proyecto asociado de Google Cloud Platform (código de excepción <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] text-red-600">ApiNotActivatedMapError</code>).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <span>Habilitar Maps JavaScript API en GCP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setGmpError(null)}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
                <span>Reintentar Conexión</span>
              </button>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl text-left max-w-md text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-500" />
                Arquitectura de Respaldo Garantizada:
              </div>
              <p className="text-[11px] text-slate-500">
                Los turistas que navegan en la aplicación utilizan el motor <strong>Vectorial WGS84 Nativo</strong>, el cual opera al 100% de rendimiento de forma autónoma sin depender de esta API comercial.
              </p>
            </div>
          </div>
        ) : (
          <APIProvider
            apiKey={GOOGLE_MAPS_API_KEY}
            libraries={['marker']}
            language="es"
            region="NI"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            <Map
              id="gmp-dev-lab-map"
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

              {/* Experiences Markers */}
              {showExperiences &&
                experiences.map(exp => (
                  <AdvancedMarker
                    key={`exp-${exp.id_exp}`}
                    position={{ lat: exp.ubicacion_lat, lng: exp.ubicacion_lon }}
                    title={exp.titulo}
                    onClick={() => handleSelectExperience(exp)}
                  >
                    <div className="group relative cursor-pointer transform hover:scale-110 transition-transform">
                      <div className="bg-white/95 text-slate-900 border border-orange-500/80 px-2 py-1 rounded-full shadow-md text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-orange-500" />
                        <span className="max-w-[90px] truncate">{exp.titulo}</span>
                        <span className="text-emerald-700 font-extrabold">${exp.precio}</span>
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}

              {/* City InfoWindow */}
              {activeMarker?.type === 'city' && (
                <InfoWindow
                  position={{ lat: activeMarker.city.lat, lng: activeMarker.city.lon }}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-1 max-w-[220px] text-slate-900 font-sans">
                    <img
                      src={resolveImageUrl(activeMarker.city.imagen)}
                      alt={activeMarker.city.nombre}
                      className="w-full h-20 object-cover rounded-lg mb-2"
                      onError={e => handleImageFallback(e, activeMarker.city.imagen)}
                    />
                    <div className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                      {activeMarker.city.departamento}
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {activeMarker.city.nombre}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      {activeMarker.city.descripcion}
                    </p>
                  </div>
                </InfoWindow>
              )}

              {/* Experience InfoWindow */}
              {activeMarker?.type === 'exp' && (
                <InfoWindow
                  position={{
                    lat: activeMarker.exp.ubicacion_lat,
                    lng: activeMarker.exp.ubicacion_lon,
                  }}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-1 max-w-[240px] text-slate-900 font-sans">
                    <img
                      src={resolveImageUrl(activeMarker.exp.imagen_url)}
                      alt={activeMarker.exp.titulo}
                      className="w-full h-20 object-cover rounded-lg mb-2"
                      onError={e => handleImageFallback(e, activeMarker.exp.imagen_url)}
                    />
                    <div className="flex items-center justify-between text-[10px] font-bold text-orange-600 uppercase">
                      <span>{activeMarker.exp.ciudad_creativa}</span>
                      <span className="text-emerald-600">${activeMarker.exp.precio}</span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">
                      {activeMarker.exp.titulo}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      {activeMarker.exp.descripcion}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        )}
      </div>

      {/* Future Development Plan & Technical Roadmap */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="text-slate-900 font-bold text-base flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-600" />
          Hoja de Ruta de Desarrollo Futuro (Google Maps Platform)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Para cuando el equipo técnico decida expandir esta integración en fases posteriores:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Agrupamiento de Marcadores
            </span>
            <p className="text-[11px] text-slate-500">
              Integrar <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">@googlemaps/markerclusterer</code> para agrupar cientos de puntos de artesanía y hospedaje comunitario en zoom nacional.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. Rutas Interurbanas Ecológicas
            </span>
            <p className="text-[11px] text-slate-500">
              Conectar la <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">Routes API</code> con cálculo de emisiones CO2 para traslados en autobús local y bicicletas comunitarias entre ciudades creativas.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. Panorámicas Street View
            </span>
            <p className="text-[11px] text-slate-500">
              Incrustar vistas panorámicas de 360° en las plazas coloniales de León, Granada y los talleres tradicionales de San Juan de Oriente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
