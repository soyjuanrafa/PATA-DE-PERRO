/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - High-Resolution Cartographic Map Lightbox Modal
 * Displays authentic maps of Nicaragua and Creative Cities (Estelí, Granada, León, Masaya, Ometepe).
 */

import React, { useState, useEffect } from 'react';
import { CiudadCreativa, MAPA_NICARAGUA_URL } from '../data/mockData';
import { MAPS_ASSETS } from '../utils/imageHelper';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Compass,
  Download,
  Maximize2,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface MapLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTarget?: string; // 'nicaragua' or city.id
  cities: CiudadCreativa[];
}

interface MapItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  badge: string;
  description: string;
}

export const MapLightboxModal: React.FC<MapLightboxModalProps> = ({
  isOpen,
  onClose,
  initialTarget = 'nicaragua',
  cities,
}) => {
  const mapItems: MapItem[] = [
    {
      id: 'nicaragua',
      title: 'República de Nicaragua',
      subtitle: 'Mapa General del Territorio & Red de Ciudades Creativas',
      url: MAPA_NICARAGUA_URL,
      badge: 'Cartografía Nacional Oficial',
      description:
        'Mapa ilustrado y cartográfico de Nicaragua con sus costas pacífica y caribeña, lagos Xolotlán y Cocibolca, cadenas volcánicas y corredores culturales.',
    },
    ...cities.map(c => ({
      id: c.id,
      title: `Ciudad Creativa de ${c.nombre}`,
      subtitle: `Departamento de ${c.departamento}`,
      url: c.mapa_imagen || c.imagen,
      badge: 'Plano Cartográfico Local',
      description: c.descripcion,
    })),
  ];

  const [selectedId, setSelectedId] = useState<string>(initialTarget);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setSelectedId(initialTarget || 'nicaragua');
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, initialTarget]);

  if (!isOpen) return null;

  const currentItem = mapItems.find(m => m.id === selectedId) || mapItems[0];
  const currentIndex = mapItems.findIndex(m => m.id === selectedId);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % mapItems.length;
    setSelectedId(mapItems[nextIdx].id);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + mapItems.length) % mapItems.length;
    setSelectedId(mapItems[prevIdx].id);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.35, 3.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.35, 0.7));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      id="map-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-stone-950/80 border-b border-stone-800 text-white z-20">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-950/60 text-orange-400 border border-orange-800/40 px-2 py-0.5 rounded-md">
                  {currentItem.badge}
                </span>
                <span className="text-xs text-stone-400 hidden sm:inline">
                  • {currentIndex + 1} de {mapItems.length}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-stone-100 font-outfit truncate max-w-[280px] sm:max-w-md">
                {currentItem.title}
              </h2>
            </div>
          </div>

          {/* Quick Actions & Close */}
          <div className="flex items-center gap-2">
            <a
              href={currentItem.url}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Abrir imagen original en pestaña nueva"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Descargar</span>
            </a>

            <button
              id="btn-close-map-lightbox"
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-red-600/80 text-stone-200 hover:text-white transition-colors cursor-pointer"
              title="Cerrar visor de mapas"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Viewport Area */}
        <div
          className="relative flex-1 bg-stone-950 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Main Map Image with Transform */}
          <div
            className="transition-transform duration-100 ease-out max-w-full max-h-full flex items-center justify-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={currentItem.url}
              alt={currentItem.title}
              className="max-h-[64vh] max-w-[90vw] object-contain rounded-xl shadow-2xl pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Previous / Next Arrow Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg transition-colors border border-stone-700 cursor-pointer z-20"
            title="Mapa anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg transition-colors border border-stone-700 cursor-pointer z-20"
            title="Siguiente mapa"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Floating Zoom & Pan Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-stone-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-stone-700 text-white shadow-lg">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
              title="Acercar mapa"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
              title="Alejar mapa"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer border-t border-stone-800"
              title="Restablecer tamaño (100%)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Level Pill */}
          <div className="absolute bottom-4 left-4 z-20 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-stone-300 border border-stone-700 pointer-events-none">
            Zoom: {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Bottom Thumbnail Strip & Location Selector */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
          <p className="text-xs text-stone-400 max-w-md line-clamp-1 text-center sm:text-left">
            <span className="font-bold text-stone-200">{currentItem.subtitle}:</span>{' '}
            {currentItem.description}
          </p>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {mapItems.map(item => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white border-orange-500 shadow-xs'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800 hover:text-stone-200'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md overflow-hidden bg-stone-800 shrink-0 border border-white/20">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{item.id === 'nicaragua' ? 'Nicaragua' : item.title.replace('Ciudad Creativa de ', '')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
