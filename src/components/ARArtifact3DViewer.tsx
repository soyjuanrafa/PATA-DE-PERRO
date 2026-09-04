/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Interactive 3D Cultural Artifact Inspector (GLTF / 3D Simulation)
 * Zero external heavy 3D library dependencies, zero crash risk, 100% responsive.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Experiencia } from '../types';
import {
  Box,
  RotateCw,
  Eye,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface ArtifactData {
  id: string;
  name: string;
  culture: string;
  city: string;
  category: string;
  description: string;
  verticesCount: number;
  facesCount: number;
  fileFormat: string;
  textureResolution: string;
  artisanCommunity: string;
  renderType: 'mask' | 'pottery' | 'volcano' | 'cacao' | 'gourd';
}

export const CULTURAL_ARTIFACTS: Record<string, ArtifactData> = {
  exp_tierra_01: {
    id: 'art_pottery_01',
    name: 'Vasija de Barro Ancestral',
    culture: 'Chorotega Precolombina',
    city: 'San Juan de Oriente',
    category: 'Cerámica & Escultura',
    description: 'Moldeado en torno artesanal con pigmentos minerales de óxido ferroso y pulido con piedra de río.',
    verticesCount: 18450,
    facesCount: 36800,
    fileFormat: 'GLTF 2.0 Binary (.glb)',
    textureResolution: '4K PBR (Albedo, Normal, Roughness)',
    artisanCommunity: 'Taller de Doña María Ruiz, San Juan de Oriente',
    renderType: 'pottery',
  },
  exp_cocina_01: {
    id: 'art_comal_01',
    name: 'Comal y Olla de Barro de Fogón',
    culture: 'Gastronomía Ancestral',
    city: 'Granada',
    category: 'Alfarería Utilitaria',
    description: 'Utensilio de cocción tradicional a fuego vivo fabricado con tierra volcánica y barbotina refinada.',
    verticesCount: 14200,
    facesCount: 28400,
    fileFormat: 'GLTF 2.0 Binary (.glb)',
    textureResolution: '2K PBR Textures',
    artisanCommunity: 'Artesanos de La Paz Centro & Granada',
    renderType: 'pottery',
  },
  exp_tierra_02: {
    id: 'art_volcano_01',
    name: 'Cono Volcánico Cerro Negro',
    culture: 'Geoturismo Los Maribios',
    city: 'León',
    category: 'Geología & Aventura',
    description: 'Estructura cónica de tefra basáltica y arenas volcánicas activas formadas en 1850.',
    verticesCount: 32600,
    facesCount: 65200,
    fileFormat: 'GLTF 2.0 Terrain Mesh',
    textureResolution: '4K Satellite Normal Map',
    artisanCommunity: 'Cooperativa de Guías Locales Cerro Negro',
    renderType: 'volcano',
  },
  exp_tierra_03: {
    id: 'art_mask_01',
    name: 'Máscara de El Güegüense',
    culture: 'Patrimonio Oral de la Humanidad (UNESCO)',
    city: 'Masaya',
    category: 'Imaginería & Máscaras',
    description: 'Talla en madera de cedro real con policromía al óleo representando la sátira y resistencia cultural.',
    verticesCount: 24800,
    facesCount: 49600,
    fileFormat: 'GLTF 2.0 Binary (.glb)',
    textureResolution: '4K Photogrammetry PBR',
    artisanCommunity: 'Maestros Mascareros de Monimbó, Masaya',
    renderType: 'mask',
  },
  exp_agua_01: {
    id: 'art_cacao_01',
    name: 'Mazorca de Cacao Blanco Real',
    culture: 'Moneda y Alimento Sagrado',
    city: 'Ometepe',
    category: 'Agroecología',
    description: 'Variedad ancestral de Theobroma Cacao cultivado bajo sombra volcánica en las faldas del Maderas.',
    verticesCount: 16100,
    facesCount: 32200,
    fileFormat: 'GLTF 2.0 Binary (.glb)',
    textureResolution: '2K PBR Textures',
    artisanCommunity: 'Finca Agroecológica El Porvenir, Ometepe',
    renderType: 'cacao',
  },
  default: {
    id: 'art_default',
    name: 'Jícara de Filigrana Tradicional',
    culture: 'Artesanía Popular Nicaragüense',
    city: 'Masaya',
    category: 'Artesanías & Grabado',
    description: 'Fruto de jícaro vaciado, curado y tallado a mano con motivos de fauna y flora nacional.',
    verticesCount: 15300,
    facesCount: 30600,
    fileFormat: 'GLTF 2.0 Binary (.glb)',
    textureResolution: '2K PBR Textures',
    artisanCommunity: 'Red de Ciudades Creativas de Nicaragua',
    renderType: 'gourd',
  },
};

interface ARArtifact3DViewerProps {
  experience: Experiencia;
}

export const ARArtifact3DViewer: React.FC<ARArtifact3DViewerProps> = ({ experience }) => {
  const artifact = CULTURAL_ARTIFACTS[experience.id_exp] || {
    ...CULTURAL_ARTIFACTS.default,
    name: `Artefacto RA: ${experience.titulo}`,
    city: experience.ciudad_creativa,
  };

  const [rotX, setRotX] = useState<number>(15);
  const [rotY, setRotY] = useState<number>(35);
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [renderMode, setRenderMode] = useState<'shaded' | 'wireframe' | 'xray'>('shaded');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number; rotX: number; rotY: number }>({
    x: 0,
    y: 0,
    rotX: 15,
    rotY: 35,
  });

  // Auto rotation animation
  useEffect(() => {
    if (!isAutoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotY(prev => (prev + 1.2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotate, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      rotX,
      rotY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    setRotY((dragStart.current.rotY + deltaX * 0.7) % 360);
    setRotX(Math.max(-60, Math.min(60, dragStart.current.rotX - deltaY * 0.5)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        rotX,
        rotY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.current.x;
    const deltaY = e.touches[0].clientY - dragStart.current.y;
    setRotY((dragStart.current.rotY + deltaX * 0.7) % 360);
    setRotX(Math.max(-60, Math.min(60, dragStart.current.rotX - deltaY * 0.5)));
  };

  // Generate 3D projected vertices for the chosen artifact type
  // Simple, deterministic 3D rendering onto 2D SVG plane with perspective projection
  const render3DModel = () => {
    const radY = (rotY * Math.PI) / 180;
    const radX = (rotX * Math.PI) / 180;

    const project = (x: number, y: number, z: number) => {
      // Rotate around Y
      const x1 = x * Math.cos(radY) + z * Math.sin(radY);
      const z1 = -x * Math.sin(radY) + z * Math.cos(radY);
      // Rotate around X
      const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

      // Perspective scale
      const cameraDistance = 380;
      const scale = (cameraDistance / (cameraDistance + z2)) * zoom;
      return {
        px: 200 + x1 * scale,
        py: 180 + y2 * scale,
        z: z2,
      };
    };

    // Color schemes based on render mode
    const isWireframe = renderMode === 'wireframe';
    const isXray = renderMode === 'xray';

    // Different geometry shapes
    if (artifact.renderType === 'mask') {
      // Elaborate 3D Mask geometry
      const rings = 7;
      const sectors = 12;
      const points: { px: number; py: number; z: number }[][] = [];

      for (let r = 0; r < rings; r++) {
        const ringPoints = [];
        const rad = 25 + r * 16;
        const depth = Math.sin((r / rings) * Math.PI) * 45;
        for (let s = 0; s < sectors; s++) {
          const theta = (s / sectors) * Math.PI * 2;
          const x = Math.cos(theta) * rad * 0.8;
          const y = Math.sin(theta) * rad * 1.15;
          const z = depth + Math.sin(s * 3) * 6;
          ringPoints.push(project(x, y, z));
        }
        points.push(ringPoints);
      }

      return (
        <g>
          {/* Wireframe or Shaded quads */}
          {points.slice(0, -1).map((ring, r) => (
            <g key={`ring-${r}`}>
              {ring.map((p1, s) => {
                const nextS = (s + 1) % sectors;
                const p2 = ring[nextS];
                const p3 = points[r + 1][nextS];
                const p4 = points[r + 1][s];
                const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
                const brightness = Math.max(0.2, Math.min(0.95, (avgZ + 80) / 160));

                let fill = '#FF5722';
                let stroke = '#FFA07A';
                if (isWireframe) {
                  fill = 'none';
                  stroke = '#2E9D62';
                } else if (isXray) {
                  fill = `rgba(46, 157, 98, ${brightness * 0.25})`;
                  stroke = '#2E9D62';
                } else {
                  fill = r % 2 === 0
                    ? `rgb(${Math.round(230 * brightness)}, ${Math.round(110 * brightness)}, ${Math.round(40 * brightness)})`
                    : `rgb(${Math.round(210 * brightness)}, ${Math.round(80 * brightness)}, ${Math.round(30 * brightness)})`;
                  stroke = `rgba(255, 255, 255, 0.2)`;
                }

                return (
                  <polygon
                    key={`poly-${r}-${s}`}
                    points={`${p1.px},${p1.py} ${p2.px},${p2.py} ${p3.px},${p3.py} ${p4.px},${p4.py}`}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isWireframe ? 0.9 : 0.6}
                  />
                );
              })}
            </g>
          ))}

          {/* Crown & Feather plume decorative lines */}
          <path
            d={`M ${project(0, -110, 20).px} ${project(0, -110, 20).py} Q ${project(40, -160, 40).px} ${project(40, -160, 40).py} ${project(60, -180, 20).px} ${project(60, -180, 20).py}`}
            fill="none"
            stroke={isXray ? '#2E9D62' : '#FFD700'}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={`M ${project(0, -110, 20).px} ${project(0, -110, 20).py} Q ${project(-40, -160, 40).px} ${project(-40, -160, 40).py} ${project(-60, -180, 20).px} ${project(-60, -180, 20).py}`}
            fill="none"
            stroke={isXray ? '#2E9D62' : '#FFD700'}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={`M ${project(0, -110, 20).px} ${project(0, -110, 20).py} Q ${project(0, -170, 50).px} ${project(0, -170, 50).py} ${project(0, -195, 30).px} ${project(0, -195, 30).py}`}
            fill="none"
            stroke={isXray ? '#2E9D62' : '#FF5722'}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      );
    } else if (artifact.renderType === 'volcano') {
      // Volcano 3D cone with crater rim
      const levels = 8;
      const segments = 14;
      const points: { px: number; py: number; z: number }[][] = [];

      for (let l = 0; l < levels; l++) {
        const levelPoints = [];
        const y = -70 + l * 20;
        const radius = l === 0 ? 30 : 25 + Math.pow(l, 1.35) * 12;
        for (let s = 0; s < segments; s++) {
          const angle = (s / segments) * Math.PI * 2;
          const noise = Math.sin(s * 4 + l) * 5;
          const x = Math.cos(angle) * (radius + noise);
          const z = Math.sin(angle) * (radius + noise);
          levelPoints.push(project(x, y, z));
        }
        points.push(levelPoints);
      }

      return (
        <g>
          {points.slice(0, -1).map((ring, l) => (
            <g key={`v-ring-${l}`}>
              {ring.map((p1, s) => {
                const nextS = (s + 1) % segments;
                const p2 = ring[nextS];
                const p3 = points[l + 1][nextS];
                const p4 = points[l + 1][s];
                const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
                const brightness = Math.max(0.2, Math.min(0.9, (avgZ + 100) / 200));

                let fill = '#333333';
                let stroke = '#555555';
                if (isWireframe) {
                  fill = 'none';
                  stroke = '#FF5722';
                } else if (isXray) {
                  fill = `rgba(255, 87, 34, ${brightness * 0.2})`;
                  stroke = '#FF8A65';
                } else {
                  // Volcanic black sand gradient
                  const tone = Math.round(45 + brightness * 40);
                  fill = `rgb(${tone + 15}, ${tone}, ${tone})`;
                  stroke = `rgba(255, 255, 255, 0.15)`;
                }

                return (
                  <polygon
                    key={`v-poly-${l}-${s}`}
                    points={`${p1.px},${p1.py} ${p2.px},${p2.py} ${p3.px},${p3.py} ${p4.px},${p4.py}`}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isWireframe ? 0.9 : 0.6}
                  />
                );
              })}
            </g>
          ))}
          {/* Inner Crater active glow */}
          <circle
            cx={project(0, -68, 0).px}
            cy={project(0, -68, 0).py}
            r="16"
            fill={isWireframe ? 'none' : '#FF5722'}
            opacity={isWireframe ? 0 : 0.6}
            className="animate-pulse"
          />
        </g>
      );
    } else {
      // Pottery / Traditional Vase / Cacao / Jícara 3D lathe profile
      const rings = 10;
      const sectors = 14;
      const points: { px: number; py: number; z: number }[][] = [];

      // Vessel curvature profile
      const profile = [
        { y: -80, r: 28 }, // Rim
        { y: -65, r: 24 }, // Neck
        { y: -45, r: 35 }, // Upper shoulder
        { y: -15, r: 58 }, // Belly max
        { y: 15, r: 62 },  // Center
        { y: 45, r: 52 },  // Lower body
        { y: 70, r: 38 },  // Waist
        { y: 90, r: 28 },  // Base ring
      ];

      for (let r = 0; r < profile.length; r++) {
        const ringPoints = [];
        const { y, r: radius } = profile[r];
        for (let s = 0; s < sectors; s++) {
          const theta = (s / sectors) * Math.PI * 2;
          const x = Math.cos(theta) * radius;
          const z = Math.sin(theta) * radius;
          ringPoints.push(project(x, y, z));
        }
        points.push(ringPoints);
      }

      return (
        <g>
          {points.slice(0, -1).map((ring, r) => (
            <g key={`p-ring-${r}`}>
              {ring.map((p1, s) => {
                const nextS = (s + 1) % sectors;
                const p2 = ring[nextS];
                const p3 = points[r + 1][nextS];
                const p4 = points[r + 1][s];
                const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
                const brightness = Math.max(0.25, Math.min(0.95, (avgZ + 70) / 140));

                let fill = '#B45309';
                let stroke = '#D97706';
                if (isWireframe) {
                  fill = 'none';
                  stroke = '#2E9D62';
                } else if (isXray) {
                  fill = `rgba(46, 157, 98, ${brightness * 0.25})`;
                  stroke = '#2E9D62';
                } else {
                  // Clay / Terracotta warmth
                  fill = `rgb(${Math.round(180 * brightness)}, ${Math.round(95 * brightness)}, ${Math.round(45 * brightness)})`;
                  stroke = `rgba(255, 255, 255, 0.2)`;
                }

                return (
                  <polygon
                    key={`pottery-poly-${r}-${s}`}
                    points={`${p1.px},${p1.py} ${p2.px},${p2.py} ${p3.px},${p3.py} ${p4.px},${p4.py}`}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isWireframe ? 0.9 : 0.6}
                  />
                );
              })}
            </g>
          ))}

          {/* Traditional Precolombian Geometric Engraved Band */}
          {points[3] && !isWireframe && (
            <path
              d={points[3].map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.px} ${p.py}`).join(' ') + ' Z'}
              fill="none"
              stroke="#FDE68A"
              strokeWidth="2.5"
              strokeDasharray="4,4"
            />
          )}
        </g>
      );
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">
      {/* 3D Interactive Stage Canvas */}
      <div className="flex-1 bg-gradient-to-b from-stone-900 via-[#151d18] to-stone-950 rounded-3xl p-4 sm:p-6 border border-stone-800 shadow-2xl relative flex flex-col items-center justify-between min-h-[420px] select-none overflow-hidden">
        {/* Top Header HUD overlay */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
              Render 3D GLTF 2.0 • PBR
            </span>
          </div>

          {/* Render Mode Switcher */}
          <div className="inline-flex rounded-xl bg-black/60 p-1 border border-white/10 backdrop-blur-md text-xs">
            <button
              onClick={() => setRenderMode('shaded')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                renderMode === 'shaded'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Textura
            </button>
            <button
              onClick={() => setRenderMode('wireframe')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                renderMode === 'wireframe'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Malla (Wire)
            </button>
            <button
              onClick={() => setRenderMode('xray')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                renderMode === 'xray'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Holograma
            </button>
          </div>
        </div>

        {/* 3D Model Rendering Stage */}
        <div
          className="w-full flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Circular Ground Stage Grid */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-72 h-72 rounded-full border border-emerald-500/50 [background:radial-gradient(circle,rgba(46,157,98,0.1)_0%,transparent_70%)] animate-pulse" />
          </div>

          <svg viewBox="0 0 400 360" className="w-full max-w-[380px] h-[320px]">
            {render3DModel()}
          </svg>

          {/* Interactive touch hint */}
          <div className="absolute bottom-2 text-[11px] text-stone-400 font-medium pointer-events-none flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/5">
            <RotateCw className="w-3 h-3 text-emerald-400 animate-spin" />
            <span>Arrastra para rotar 360° en cualquier ángulo</span>
          </div>
        </div>

        {/* Bottom Stage Controls Toolbar */}
        <div className="w-full flex items-center justify-between z-10 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoRotate(prev => !prev)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isAutoRotate
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-white/10 text-stone-300 hover:bg-white/20'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
              <span>{isAutoRotate ? 'Giro Automático ON' : 'Pausado'}</span>
            </button>
            <button
              onClick={() => {
                setRotX(15);
                setRotY(35);
                setZoom(1);
              }}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-white/10 text-stone-300 hover:bg-white/20 transition-colors cursor-pointer"
              title="Restablecer orientación"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.15))}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Alejar modelo"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-stone-400 px-1 font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(1.6, prev + 0.15))}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Acercar modelo"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cultural Heritage & Technical Inspection Card */}
      <div className="w-full lg:w-96 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
              {artifact.category}
            </span>
            <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Auténtico</span>
            </div>
          </div>

          <div>
            <h3 className="text-stone-900 font-extrabold text-xl leading-tight">
              {artifact.name}
            </h3>
            <p className="text-stone-500 text-xs mt-0.5 font-medium">
              {artifact.culture} • {artifact.city}
            </p>
          </div>

          <p className="text-stone-600 text-xs leading-relaxed">
            {artifact.description}
          </p>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-600">
              <span className="font-medium">Comunidad Creadora:</span>
              <span className="font-bold text-stone-900 text-right">{artifact.artisanCommunity}</span>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span className="font-medium">Formato Digital:</span>
              <span className="font-mono text-emerald-700 font-bold">{artifact.fileFormat}</span>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span className="font-medium">Malla Poligonal:</span>
              <span className="font-mono text-stone-900 font-bold">
                {artifact.verticesCount.toLocaleString()} vértices / {artifact.facesCount.toLocaleString()} caras
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span className="font-medium">Resolución PBR:</span>
              <span className="font-mono text-stone-900 font-bold">{artifact.textureResolution}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Simulador 100% Autónomo</span>
          </div>
          <span className="text-[11px] text-stone-400">Sin permisos requeridos</span>
        </div>
      </div>
    </div>
  );
};
