/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Onboarding Flow Component - Recreates screenshots 1, 2, and 3
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ArrowRight, Sparkles } from 'lucide-react';

interface SlideData {
  id: number;
  eyebrow: string;
  headline: string;
  image: string;
  alt: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    eyebrow: 'DESCUBRE EXPERIENCIAS AUTÉNTICAS',
    headline: 'Conoce lugares que no aparecen en las rutas de siempre',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
    alt: 'Mujer artesana preparando tortillas artesanales tradicionales',
  },
  {
    id: 2,
    eyebrow: 'CONECTA CON LAS COMUNIDADES',
    headline: 'Cada experiencia es compartida por quienes viven y preservan su cultura',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
    alt: 'Maestro alfarero moldeando vasijas en torno de barro',
  },
  {
    id: 3,
    eyebrow: 'VIAJA DEJANDO HUELLAS',
    headline: 'Explora de forma responsable y apoya la economía local',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
    alt: 'Atardecer místico frente al volcán y lago de Nicaragua',
  },
];

export const OnboardingFlow: React.FC = () => {
  const { setActiveScreen } = useApp();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      setActiveScreen('welcome');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-stone-900 overflow-hidden flex flex-col justify-between select-none">
      {/* Background Fullscreen Image with Motion & Dark Vignette */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
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
          {/* Subtle gradient overlay to match UI screenshot contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Top Header Controls */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-white text-xs font-semibold tracking-wide">Pata de Perro</span>
        </div>

        <button
          id="btn-skip-onboarding"
          onClick={() => setActiveScreen('welcome')}
          className="text-white/80 hover:text-white text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all"
        >
          Saltar
        </button>
      </div>

      {/* Center Content Slide Text */}
      <div className="relative z-10 px-8 max-w-lg mx-auto text-center my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <p className="text-white/90 font-bold text-xs sm:text-sm tracking-widest uppercase">
              {currentSlide.eyebrow}
            </p>
            <h1 className="text-white text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-md">
              {currentSlide.headline}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Capsule Slider Pill ("Go!") matching Screenshot Design */}
      <div className="relative z-10 pb-12 pt-6 flex flex-col items-center justify-center gap-6">
        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlideIndex ? 'w-8 bg-orange-500' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* The Capsule Capsule Slider Element from Screenshot 1-3 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-20 h-36 bg-stone-200/40 backdrop-blur-md rounded-full border border-white/40 flex flex-col items-center justify-between p-2 shadow-2xl cursor-pointer"
          onClick={handleNext}
        >
          {/* Top Chevron Up Icon */}
          <div className="mt-2 text-orange-500 animate-bounce">
            <ChevronUp className="w-8 h-8 stroke-[3]" />
          </div>

          {/* White Circular "Go!" Button */}
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-white text-orange-600 font-black text-xl tracking-tight hover:bg-orange-50 transition-colors">
            Go!
          </div>
        </motion.div>

        <p className="text-white/70 text-xs font-medium tracking-wide">
          {currentSlideIndex === SLIDES.length - 1
            ? 'Toca Go! para Comenzar'
            : 'Toca Go! para continuar'}
        </p>
      </div>
    </div>
  );
};
