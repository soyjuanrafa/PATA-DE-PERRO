/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Onboarding Flow Component - Uses randomized start screen images (Pantallas de inicio) on each entry
 */

import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronsUp, ChevronUp, RotateCw } from 'lucide-react';
import { getShuffledPantallasInicio, PANTALLAS_INICIO_URLS } from '../utils/imageHelper';

interface SlideContent {
  eyebrow: string;
  headline: string;
  description: string;
}

const SLIDE_TEXTS: SlideContent[] = [
  {
    eyebrow: 'DESCUBRE EXPERIENCIAS AUTÉNTICAS',
    headline: 'Conoce lugares que no aparecen en las rutas de siempre',
    description: 'Rutas vivas diseñadas por artesanos, guías comunitarios y cocineras tradicionales.',
  },
  {
    eyebrow: 'CONECTA CON LAS COMUNIDADES',
    headline: 'Cada experiencia es compartida por quienes preservan su cultura',
    description: 'Impacto positivo directo en la economía de las familias locales de Nicaragua.',
  },
  {
    eyebrow: 'VIAJA DEJANDO HUELLAS POSITIVAS',
    headline: 'Explora de forma responsable y apoya el turismo sostenible',
    description: 'Talleres de barro, senderos volcánicos, kayak en humedales y cacao sagrado.',
  },
  {
    eyebrow: 'RED DE CIUDADES CREATIVAS',
    headline: 'León, Granada, Masaya, Matagalpa, Ometepe y Estelí',
    description: 'Navegación interactiva en Realidad Aumentada y reservas directas sin intermediarios.',
  },
];

export const OnboardingFlow: React.FC = () => {
  const { setActiveScreen } = useApp();
  
  // Randomize start screens order each time the user enters the app
  const [shuffledImages, setShuffledImages] = useState<string[]>(() => getShuffledPantallasInicio());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const touchStartYRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  // Construct slides combining randomized images with curated slide texts
  const slides = useMemo(() => {
    return SLIDE_TEXTS.map((text, idx) => ({
      id: idx + 1,
      ...text,
      image: shuffledImages[idx % shuffledImages.length] || PANTALLAS_INICIO_URLS[0],
      alt: `Pantalla de inicio ${idx + 1} - Pata de Perro Nicaragua`,
    }));
  }, [shuffledImages]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const triggerNext = () => {
    if (isAdvancing) return;
    setIsAdvancing(true);

    setTimeout(() => {
      if (currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex(prev => prev + 1);
      } else {
        setActiveScreen('welcome');
      }
      setIsAdvancing(false);
    }, 240);
  };

  const handleShuffleAgain = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShuffledImages(getShuffledPantallasInicio());
    setCurrentSlideIndex(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current !== null && !isAdvancing) {
      const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
      // If swiped up by more than 30px
      if (diffY > 30) {
        triggerNext();
      }
      touchStartYRef.current = null;
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#162A31] overflow-hidden flex flex-col justify-between select-none">
      {/* Background Fullscreen Image with Motion & Dark Vignette */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentSlide.id}-${currentSlide.image}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.alt}
            className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.05]"
          />
          {/* Authentic gradient overlay matching brand palette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#162A31]/95 via-black/45 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Top Header Controls */}
      <div className="relative z-10 p-4 sm:p-6 flex justify-end items-center">
        <div className="flex items-center gap-2">
          {/* Quick shuffle button to reshuffle start screens randomly */}
          <button
            onClick={handleShuffleAgain}
            className="text-white/80 hover:text-white p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all cursor-pointer"
            title="Rotar orden al azar de pantallas de inicio"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-skip-onboarding"
            onClick={() => setActiveScreen('welcome')}
            className="text-white/90 hover:text-white text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all font-outfit cursor-pointer"
          >
            Saltar
          </button>
        </div>
      </div>

      {/* Center Content Slide Text */}
      <div className="relative z-10 px-6 sm:px-8 max-w-xl mx-auto text-center my-auto space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-3 sm:space-y-4"
          >
            <p className="text-[#FFC83D] font-bold text-xs sm:text-sm tracking-widest uppercase font-ibm-plex">
              {currentSlide.eyebrow}
            </p>
            <h1 className="text-white text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md font-outfit">
              {currentSlide.headline}
            </h1>
            <p className="text-[#FFF8F1]/85 text-xs sm:text-sm font-medium font-manrope max-w-md mx-auto leading-relaxed">
              {currentSlide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Capsule Slider Pill ("Go!") */}
      <div className="relative z-10 pb-10 pt-4 flex flex-col items-center justify-center gap-5">
        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlideIndex ? 'w-8 bg-[#FF6B35]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Ir a pantalla ${idx + 1}`}
            />
          ))}
        </div>

        {/* The Capsule Slider Element */}
        <motion.div
          id="onboarding-capsule-slider"
          whileHover={{ scale: 1.03 }}
          className="relative w-20 h-36 bg-[#FFF8F1]/40 backdrop-blur-md rounded-full border-2 border-white/60 flex flex-col items-center justify-between p-2 shadow-2xl cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            if (!isDraggingRef.current && !isAdvancing) {
              triggerNext();
            }
          }}
        >
          {/* Subtle background glow when activated or dragging */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#FF6B35]/30 via-[#FF6B35]/10 to-transparent transition-opacity duration-300 pointer-events-none ${
              isAdvancing ? 'opacity-100' : 'opacity-40'
            }`}
          />

          {/* Top Animated Upward Chevrons */}
          <div className="mt-1.5 text-[#FF6B35] flex flex-col items-center pointer-events-none select-none z-10">
            <motion.div
              animate={{ y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            >
              <ChevronUp className="w-7 h-7 stroke-[3.5]" />
            </motion.div>
          </div>

          {/* Vertical Track Guide Line */}
          <div className="w-0.5 flex-1 border-l-2 border-dashed border-white/30 my-1 pointer-events-none z-0" />

          {/* Draggable White Circular "Go!" Knob in Naranja Atardecer */}
          <motion.div
            key={`go-knob-${currentSlideIndex}`}
            drag="y"
            dragConstraints={{ top: -68, bottom: 0 }}
            dragElastic={0.12}
            dragSnapToOrigin={!isAdvancing}
            onDragStart={() => {
              isDraggingRef.current = true;
            }}
            onDragEnd={(_, info) => {
              setTimeout(() => {
                isDraggingRef.current = false;
              }, 80);
              if (info.offset.y <= -30 || info.velocity.y <= -120) {
                triggerNext();
              }
            }}
            animate={isAdvancing ? { y: -68, scale: 1.08 } : { y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-white text-[#FF6B35] font-black text-xl tracking-tight hover:bg-orange-50 transition-colors font-outfit z-10 cursor-grab active:cursor-grabbing"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDraggingRef.current && !isAdvancing) {
                triggerNext();
              }
            }}
          >
            Go!
          </motion.div>
        </motion.div>

        {/* Interaction Hint Text */}
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[#FFF8F1] text-xs sm:text-sm font-bold tracking-wide font-outfit drop-shadow flex items-center gap-1.5">
            <ChevronsUp className="w-4 h-4 text-[#FF6B35] animate-bounce" />
            {currentSlideIndex === slides.length - 1
              ? 'Desliza hacia arriba para Comenzar'
              : 'Desliza hacia arriba para continuar'}
          </p>
          <span className="text-white/70 text-[11px] font-medium font-manrope">
            Desliza el botón Go! hacia arriba o toca
          </span>
        </div>
      </div>
    </div>
  );
};

