/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Augmented Reality (RA) Navigation Simulation Suite
 * Robust, zero-permission, high-fidelity simulation with optional physical camera test mode.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Experiencia } from '../types';
import { calculateHaversineDistance } from '../utils/security';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import { ARArtifact3DViewer } from './ARArtifact3DViewer';
import { ARRadarView } from './ARRadarView';
import {
  ArrowLeft,
  Compass,
  Navigation,
  Layers,
  Radio,
  Box,
  Camera,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Footprints,
  RotateCcw,
  Sun,
  Sunset,
  Moon,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  ChevronDown,
  Info,
} from 'lucide-react';

export type ARSimulationScreen = 'visor' | 'radar' | 'model3d' | 'hardware_camera';

export const ARNavigationSim: React.FC = () => {
  const { selectedExperience, experiences, setActiveScreen, setSelectedExperience, showToast } = useApp();

  const activeExp: Experiencia = selectedExperience || experiences[0];

  // Active Screen within the AR Navigation Suite
  const [activeScreenTab, setActiveScreenTab] = useState<ARSimulationScreen>('visor');

  // Simulated optical field environment filter
  const [lightingFilter, setLightingFilter] = useState<'day' | 'sunset' | 'night'>('sunset');

  // Simulated tourist GPS origin (Parque Central de León: 12.4350, -86.8790)
  const [simulatedLat] = useState<number>(12.4350);
  const [simulatedLon] = useState<number>(-86.8790);

  // Dynamic distance simulation (allows user to walk closer or farther)
  const initialDistance = useMemo(() => {
    const d = calculateHaversineDistance(
      simulatedLat,
      simulatedLon,
      activeExp.ubicacion_lat,
      activeExp.ubicacion_lon
    );
    // Normalized to a walkable proximity for immersive simulation (e.g. 280m - 420m)
    return Math.max(120, Math.min(650, Math.round(d / 180)));
  }, [activeExp, simulatedLat, simulatedLon]);

  const [currentDistance, setCurrentDistance] = useState<number>(initialDistance);
  const [isAutoWalking, setIsAutoWalking] = useState<boolean>(false);
  const [isDestinationReached, setIsDestinationReached] = useState<boolean>(false);

  // Gyroscopic attitude & compass angles
  const [compassHeading, setCompassHeading] = useState<number>(42);
  const [gyroPitch, setGyroPitch] = useState<number>(2); // horizon tilt
  const [gyroRoll, setGyroRoll] = useState<number>(-1);

  // Physical camera state (Strictly user-opt-in, never automatically triggered)
  const [physicalCameraActive, setPhysicalCameraActive] = useState<boolean>(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [isRequestingCamera, setIsRequestingCamera] = useState<boolean>(false);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  // Update initial distance when active experience changes
  useEffect(() => {
    setCurrentDistance(initialDistance);
    setIsDestinationReached(false);
    setIsAutoWalking(false);
  }, [initialDistance]);

  // Smooth compass and gyro drift simulation (replicates realistic IMU sensor response)
  useEffect(() => {
    const interval = setInterval(() => {
      setCompassHeading(prev => (prev + 0.35) % 360);
      setGyroPitch(prev => Math.sin(Date.now() / 1200) * 4);
      setGyroRoll(prev => Math.cos(Date.now() / 1500) * 3);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Automatic walking simulation interval
  useEffect(() => {
    if (!isAutoWalking || isDestinationReached) return;
    const walkTimer = setInterval(() => {
      setCurrentDistance(prev => {
        const nextDist = Math.max(0, prev - 8);
        if (nextDist <= 12) {
          setIsDestinationReached(true);
          setIsAutoWalking(false);
          showToast(`🎯 ¡Has llegado al destino: ${activeExp.titulo}!`);
          return 0;
        }
        return nextDist;
      });
    }, 450);
    return () => clearInterval(walkTimer);
  }, [isAutoWalking, isDestinationReached, activeExp.titulo, showToast]);

  // Clean up physical camera tracks on unmount or when leaving hardware tab
  useEffect(() => {
    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
        videoStreamRef.current = null;
      }
    };
  }, []);

  // Handler to request physical camera explicitly upon user button click
  const handleActivatePhysicalCamera = async () => {
    setIsRequestingCamera(true);
    setCameraPermissionError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('API de cámara no disponible en este navegador o entorno.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      videoStreamRef.current = stream;
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
      }
      setPhysicalCameraActive(true);
      showToast('Cámara física conectada exitosamente');
    } catch (err: any) {
      console.warn('Physical camera activation rejected or unsupported:', err);
      setPhysicalCameraActive(false);
      const errorMsg =
        err?.name === 'NotAllowedError'
          ? 'Permiso de cámara denegado por el usuario o bloqueado por las políticas del navegador.'
          : err?.name === 'NotFoundError'
          ? 'No se detectó ningún dispositivo de cámara física en este equipo.'
          : err?.name === 'SecurityError'
          ? 'Entorno con restricciones de seguridad o permisos en iframe.'
          : 'No fue posible acceder a la cámara en este entorno.';
      setCameraPermissionError(errorMsg);
    } finally {
      setIsRequestingCamera(false);
    }
  };

  const handleDisconnectPhysicalCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    setPhysicalCameraActive(false);
    setCameraPermissionError(null);
  };

  // Approach simulation controls
  const handleManualStep = (deltaMeters: number) => {
    setCurrentDistance(prev => {
      const nextDist = Math.max(0, prev - deltaMeters);
      if (nextDist <= 12 && !isDestinationReached) {
        setIsDestinationReached(true);
        showToast(`🎯 ¡Has llegado al destino: ${activeExp.titulo}!`);
      }
      return nextDist;
    });
  };

  const handleResetApproach = () => {
    setCurrentDistance(initialDistance);
    setIsDestinationReached(false);
    setIsAutoWalking(false);
  };

  // Lighting overlay styling
  const lightingStyles = {
    day: 'bg-sky-900/20 mix-blend-overlay',
    sunset: 'bg-amber-900/30 mix-blend-color-burn',
    night: 'bg-indigo-950/60 mix-blend-multiply',
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-stone-950 text-white flex flex-col justify-between overflow-x-hidden select-none">
      {/* 1. TOP AR NAVIGATION TOOLBAR */}
      <header className="relative z-30 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Return & Destination Details */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('map')}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white transition-colors cursor-pointer border border-stone-700"
            title="Volver al mapa"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                Simulador RA Autónomo • Ciudades Creativas
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-sm sm:text-base font-black text-white truncate max-w-[200px] sm:max-w-xs font-outfit">
                {activeExp.titulo}
              </h1>
              <span className="text-[11px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30 shrink-0">
                {activeExp.ciudad_creativa}
              </span>
            </div>
          </div>
        </div>

        {/* Destination Quick Selector */}
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <select
              value={activeExp.id_exp}
              onChange={e => {
                const target = experiences.find(exp => exp.id_exp === e.target.value);
                if (target) setSelectedExperience(target);
              }}
              className="bg-stone-800 text-white text-xs font-bold py-1.5 pl-3 pr-8 rounded-xl border border-stone-700 appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {experiences.map(exp => (
                <option key={exp.id_exp} value={exp.id_exp} className="bg-stone-900 text-white">
                  {exp.ciudad_creativa} • {exp.titulo}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Screen Tab Switcher */}
          <div className="inline-flex rounded-xl bg-stone-800/90 p-1 border border-stone-700 text-xs">
            <button
              onClick={() => setActiveScreenTab('visor')}
              className={`px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeScreenTab === 'visor'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Visor Holográfico</span>
            </button>

            <button
              onClick={() => setActiveScreenTab('radar')}
              className={`px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeScreenTab === 'radar'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Radar 360°</span>
            </button>

            <button
              onClick={() => setActiveScreenTab('model3d')}
              className={`px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeScreenTab === 'model3d'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Modelo 3D</span>
            </button>

            <button
              onClick={() => setActiveScreenTab('hardware_camera')}
              className={`px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeScreenTab === 'hardware_camera'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-orange-400'
              }`}
              title="Modo experimental con cámara física"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cámara Real (Opcional)</span>
              <span className="sm:hidden">Cámara</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN ACTIVE SIMULATION VIEWPORT */}
      <main className="relative flex-1 flex flex-col justify-between overflow-hidden">
        {/* ========================================================================= */}
        {/* TAB 1: VISOR HOLOGRÁFICO RA (SIMULADOR ÓPTICO AUTÓNOMO) */}
        {/* ========================================================================= */}
        {activeScreenTab === 'visor' && (
          <div className="relative w-full h-full flex-1 flex flex-col justify-between">
            {/* Background Simulated Nicaragua Environment */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-stone-900">
              <img
                src={resolveImageUrl(activeExp.imagen_url)}
                onError={e => handleImageFallback(e, activeExp.imagen_url)}
                alt="Escenario Óptico de Campo"
                className="w-full h-full object-cover filter saturate-110 brightness-90 transition-all duration-700 scale-105"
              />
              {/* Atmosphere Lighting Filter */}
              <div className={`absolute inset-0 ${lightingStyles[lightingFilter]} transition-colors duration-700`} />

              {/* Optical HUD Mesh Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#2e9d6215_1px,transparent_1px),linear-gradient(to_bottom,#2e9d6215_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

              {/* Lens Vignette & Scanlines */}
              <div className="absolute inset-0 [background:radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
            </div>

            {/* Top Telemetry & Horizon HUD Header */}
            <div className="relative z-10 px-4 pt-3 flex flex-col items-center pointer-events-none space-y-2">
              {/* Dynamic Compass Ticker */}
              <div className="pointer-events-auto bg-black/70 backdrop-blur-md px-5 py-2 rounded-full border border-emerald-500/40 flex items-center gap-4 text-xs font-mono shadow-xl">
                <span className="text-emerald-400 font-bold">RUMBO:</span>
                <span className="text-white font-extrabold text-sm">{Math.round(compassHeading)}° NNE</span>
                <span className="text-stone-400">|</span>
                <span className="text-orange-400 font-bold">GPS:</span>
                <span className="text-white">16 SAT • 99.8%</span>
                <span className="text-stone-400">|</span>
                <span className="text-emerald-400 font-bold">FPS:</span>
                <span className="text-white">60.0 ESTABLE</span>
              </div>

              {/* Artificial Horizon Gyro Line */}
              <div
                className="w-56 h-0.5 bg-emerald-400/40 relative flex items-center justify-between transition-transform duration-100"
                style={{
                  transform: `translateY(${gyroPitch * 2}px) rotate(${gyroRoll}deg)`,
                }}
              >
                <div className="w-4 h-2 border-l-2 border-t-2 border-emerald-400" />
                <div className="w-3 h-3 rounded-full border border-emerald-400/80 flex items-center justify-center">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                </div>
                <div className="w-4 h-2 border-r-2 border-t-2 border-emerald-400" />
              </div>
            </div>

            {/* Center Field: Floating Holographic 3D Beacon */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 pointer-events-none">
              {!isDestinationReached ? (
                <div className="relative pointer-events-auto flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
                  {/* Outer Concentric Optical Rings */}
                  <div className="w-36 h-36 rounded-full border-2 border-emerald-500/30 flex items-center justify-center animate-pulse">
                    <div className="w-24 h-24 rounded-full border border-orange-500/50 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 animate-ping" />
                    </div>
                  </div>

                  {/* Optical Reticle Crosshairs */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-0.5 bg-emerald-400/20" />
                    <div className="h-48 w-0.5 bg-emerald-400/20 absolute" />
                  </div>

                  {/* Floating Holographic Beacon Box */}
                  <div className="mt-2 bg-black/85 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/60 shadow-2xl text-center space-y-2 max-w-xs transition-all">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        {activeExp.categoria}
                      </span>
                      <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                        RA-LOC: {activeExp.ciudad_creativa}
                      </span>
                    </div>

                    <h3 className="text-white font-extrabold text-sm leading-snug font-outfit">
                      {activeExp.titulo}
                    </h3>

                    {/* Dynamic Distance Counter */}
                    <div className="py-1 bg-stone-900/90 rounded-xl border border-stone-800">
                      <span className="text-[10px] text-stone-400 block font-semibold uppercase tracking-wider">
                        Distancia al Destino
                      </span>
                      <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                        {currentDistance} m
                      </p>
                    </div>

                    <p className="text-stone-300 text-[11px] font-medium flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                      <span className="truncate">{activeExp.ubicacion_nombre}</span>
                    </p>
                  </div>
                </div>
              ) : (
                /* Celebratory Destination Reached Card */
                <div className="relative pointer-events-auto bg-black/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-emerald-500 shadow-2xl text-center space-y-4 max-w-sm animate-bounce">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest block">
                      ¡Punto de Interés Desbloqueado!
                    </span>
                    <h3 className="text-xl font-black text-white font-outfit mt-1">
                      {activeExp.titulo}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Has llegado exitosamente a la ubicación comunitaria guiado por el Simulador de Realidad Aumentada.
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setActiveScreen('explore')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      Ver Ficha de Experiencia
                    </button>
                    <button
                      onClick={handleResetApproach}
                      className="bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold px-3 py-2.5 rounded-xl border border-stone-700 transition-all cursor-pointer"
                    >
                      Reiniciar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Visor Interactive Dashboard & Step Controls */}
            <div className="relative z-10 p-4 bg-stone-950/85 backdrop-blur-xl border-t border-stone-800 flex flex-col gap-3">
              {/* Telemetry Bar & Lighting Filter Controls */}
              <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 text-stone-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Simulación Óptica de Alta Precisión (Sin permisos de hardware requeridos)</span>
                </div>

                {/* Lighting ambience switch */}
                <div className="flex items-center gap-1 bg-stone-900 px-2 py-1 rounded-xl border border-stone-800 text-stone-300">
                  <span className="text-[11px] text-stone-400 mr-1">Filtro Óptico:</span>
                  <button
                    onClick={() => setLightingFilter('day')}
                    className={`p-1.5 rounded-lg cursor-pointer ${lightingFilter === 'day' ? 'bg-emerald-600 text-white' : 'hover:text-white'}`}
                    title="Luz Diurna"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLightingFilter('sunset')}
                    className={`p-1.5 rounded-lg cursor-pointer ${lightingFilter === 'sunset' ? 'bg-orange-600 text-white' : 'hover:text-white'}`}
                    title="Atardecer Dorado"
                  >
                    <Sunset className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLightingFilter('night')}
                    className={`p-1.5 rounded-lg cursor-pointer ${lightingFilter === 'night' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
                    title="Visión Nocturna"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Interactive Approach Simulation Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleManualStep(25)}
                  disabled={isDestinationReached}
                  className="flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-outfit"
                >
                  <Footprints className="w-4 h-4" />
                  <span>Avanzar 25 metros</span>
                </button>

                <button
                  onClick={() => setIsAutoWalking(prev => !prev)}
                  disabled={isDestinationReached}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer font-outfit ${
                    isAutoWalking
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                  }`}
                >
                  {isAutoWalking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isAutoWalking ? 'Pausar Caminata' : 'Caminata Automática'}</span>
                </button>

                <button
                  onClick={handleResetApproach}
                  className="py-3 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700 transition-colors cursor-pointer"
                  title="Restablecer distancia original"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Restablecer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: RADAR TÁCTICO DE PROXIMIDAD 360° */}
        {/* ========================================================================= */}
        {activeScreenTab === 'radar' && (
          <div className="p-4 sm:p-6 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center">
            <ARRadarView
              activeExperience={activeExp}
              allExperiences={experiences}
              onSelectExperience={exp => setSelectedExperience(exp)}
              onSwitchToVisor={() => setActiveScreenTab('visor')}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INSPECCIÓN 3D DE MODELOS Y PATRIMONIO CULTURAL */}
        {/* ========================================================================= */}
        {activeScreenTab === 'model3d' && (
          <div className="p-4 sm:p-6 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center">
            <ARArtifact3DViewer experience={activeExp} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MODO HARDWARE REAL / CÁMARA FÍSICA (OPCIONAL / EN DESARROLLO FUTURO) */}
        {/* ========================================================================= */}
        {activeScreenTab === 'hardware_camera' && (
          <div className="p-4 sm:p-6 w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center">
            {!physicalCameraActive ? (
              <div className="w-full bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mx-auto text-orange-400">
                  <Camera className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-xl mx-auto">
                  <span className="text-xs font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    Módulo de Hardware Físico • Experimental
                  </span>
                  <h2 className="text-2xl font-black text-white font-outfit">
                    Conexión con Cámara Web o Trasera
                  </h2>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                    Esta modalidad permite superponer los marcadores holográficos sobre la transmisión en vivo de la cámara física del dispositivo. <strong>No es requerida para el funcionamiento de la aplicación</strong>; el resto del sistema cuenta con el Simulador Óptico autónomo de alto rendimiento.
                  </p>
                </div>

                {/* Error notice if permission was previously denied or unavailable */}
                {cameraPermissionError && (
                  <div className="max-w-md mx-auto p-4 bg-red-950/40 border border-red-800/60 rounded-2xl text-left flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-red-200 space-y-1">
                      <p className="font-bold">Aviso de permisos de dispositivo:</p>
                      <p className="text-red-300/90">{cameraPermissionError}</p>
                      <p className="text-stone-400 pt-1">
                        Puedes regresar al <strong>Visor Holográfico</strong> o al <strong>Radar 360°</strong> sin ningún tipo de interrupción ni fallo.
                      </p>
                    </div>
                  </div>
                )}

                {/* Activation Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleActivatePhysicalCamera}
                    disabled={isRequestingCamera}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer font-outfit"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{isRequestingCamera ? 'Solicitando permiso...' : 'Solicitar Permiso y Activar Cámara'}</span>
                  </button>

                  <button
                    onClick={() => setActiveScreenTab('visor')}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs border border-stone-700 transition-colors cursor-pointer"
                  >
                    Volver al Simulador Óptico
                  </button>
                </div>

                <div className="pt-4 border-t border-stone-800/60 text-[11px] text-stone-500 flex items-center justify-center gap-2">
                  <Info className="w-3.5 h-3.5" />
                  <span>Requiere permisos explícitos del navegador para getUserMedia (WebRTC).</span>
                </div>
              </div>
            ) : (
              /* Physical Camera Active Live Feed View */
              <div className="relative w-full h-full min-h-[460px] bg-black rounded-3xl overflow-hidden border border-emerald-500/50 shadow-2xl flex flex-col justify-between">
                <video
                  ref={videoElementRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlaid AR HUD on Physical Feed */}
                <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Cámara Real Conectada • {Math.round(compassHeading)}° NNE
                    </span>
                  </div>

                  <button
                    onClick={handleDisconnectPhysicalCamera}
                    className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
                  >
                    Desconectar Cámara
                  </button>
                </div>

                {/* Overlaid Target Callout */}
                <div className="relative z-10 p-6 flex items-center justify-center">
                  <div className="bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-400 text-center shadow-2xl max-w-xs space-y-1">
                    <span className="text-[10px] font-bold bg-orange-600 px-2 py-0.5 rounded-full text-white">
                      Objetivo Encontrado
                    </span>
                    <h3 className="text-sm font-bold text-white">{activeExp.titulo}</h3>
                    <p className="text-emerald-400 font-mono text-xl font-black">{currentDistance} m</p>
                  </div>
                </div>

                <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 to-transparent text-center">
                  <p className="text-xs text-stone-300">
                    Transmisión en vivo desde la cámara física del terminal.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
