/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Augmented Reality (RA) Navigation Simulator Component
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { calculateHaversineDistance } from '../utils/security';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import { Camera, Compass, Navigation, ArrowLeft, RefreshCw, Layers, MapPin, CheckCircle, ExternalLink } from 'lucide-react';

export const ARNavigationSim: React.FC = () => {
  const { selectedExperience, experiences, setActiveScreen, setSelectedExperience } = useApp();

  const activeExp = selectedExperience || experiences[0];

  const [heading, setHeading] = useState(45);
  const [distance, setDistance] = useState(320); // meters
  const [cameraActive, setCameraActive] = useState(false);
  const [arOverlayMode, setArOverlayMode] = useState<'compass' | '3d_model' | 'radar'>('compass');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Attempt to initialize camera if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setCameraActive(true);
        }
      })
      .catch(err => {
        console.warn('Camera stream not active, running in simulated AR mode:', err);
        setCameraActive(false);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Calculate Haversine distance from simulated tourist GPS to destination
  useEffect(() => {
    // Tourist simulated position in León: 12.4350, -86.8790
    const currentLat = 12.4350;
    const currentLon = -86.8790;
    const dist = calculateHaversineDistance(
      currentLat,
      currentLon,
      activeExp.ubicacion_lat,
      activeExp.ubicacion_lon
    );
    setDistance(dist > 0 ? dist : 280);
  }, [activeExp]);

  // Heading animation simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setHeading(prev => (prev + 1) % 360);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-stone-950 text-white overflow-hidden flex flex-col justify-between">
      {/* Background Camera Feed or Simulated AR Environment */}
      <div className="absolute inset-0 z-0 bg-stone-900">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full bg-gradient-to-b from-stone-900 via-stone-800 to-black flex items-center justify-center overflow-hidden">
            {/* Simulated AR Camera Grid Lines */}
            <img
              src={resolveImageUrl(activeExp.imagen_url)}
              onError={e => handleImageFallback(e, activeExp.imagen_url)}
              alt="Fondo AR"
              className="w-full h-full object-cover opacity-40 filter blur-xs"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#2e9d62_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          </div>
        )}
      </div>

      {/* Top AR HUD Controls */}
      <div className="relative z-10 p-4 flex items-center justify-between bg-black/60 backdrop-blur-md border-b border-white/10">
        <button
          onClick={() => setActiveScreen('map')}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Volver al mapa"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center gap-1.5 justify-center text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin" />
            <span>Navegador RA Activo • {heading}° NNE</span>
          </div>
          <p className="text-white font-bold text-sm truncate max-w-[200px]">
            {activeExp.titulo}
          </p>
        </div>

        <button
          onClick={() =>
            setArOverlayMode(prev => (prev === 'compass' ? '3d_model' : 'compass'))
          }
          className="px-3 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-md"
        >
          <Layers className="w-3.5 h-3.5" /> Modo RA
        </button>
      </div>

      {/* Center Floating 3D AR POI Target Pin */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pointer-events-none">
        <div className="relative pointer-events-auto transform transition-all duration-300 hover:scale-105">
          {/* Pulsing Target Ring */}
          <div className="absolute -inset-6 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="absolute -inset-12 rounded-full border border-emerald-500/30" />

          {/* AR Callout Card floating in camera space */}
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/50 text-center shadow-2xl space-y-2 max-w-xs">
            <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block">
              Punto RA Encontrado
            </span>
            <h3 className="text-white text-sm font-bold leading-tight">{activeExp.titulo}</h3>
            <p className="text-emerald-400 text-xl font-black">{distance} m</p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-stone-300">
              <span>Recurso 3D GLTF:</span>
              <span className="text-emerald-300 font-mono truncate max-w-[120px]">
                {activeExp.recurso_ra_url.split('/').pop()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Guidance Dashboard */}
      <div className="relative z-10 p-4 bg-black/80 backdrop-blur-md border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>{activeExp.ubicacion_nombre}</span>
          </div>
          <span className="text-emerald-400 font-bold">Precisión GPS ±3m</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('explore')}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Ver Ficha Completa</span>
          </button>

          <button
            onClick={() => {
              const nextIndex = (experiences.indexOf(activeExp) + 1) % experiences.length;
              setSelectedExperience(experiences[nextIndex]);
            }}
            className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            title="Siguiente POI"
          >
            <RefreshCw className="w-4 h-4" /> Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
