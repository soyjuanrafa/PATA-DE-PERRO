/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Categories View Component - Recreates Screenshot 8 with Brand Palette & Dashed Route
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoriaExp } from '../types';
import { Mountain, Waves, Wind, ArrowRight, ArrowLeft, Compass } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { setSelectedCategory, setActiveScreen } = useApp();

  const categoryCards = [
    {
      id: CategoriaExp.TIERRA,
      title: 'Tierra',
      description: 'Explora senderos, talleres y comunidades.',
      image: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Taller%20de%20Cer%C3%A1mica%20Ancestral%20en%20Barro.jpg',
      icon: <Mountain className="w-6 h-6 text-[#3FAF6C]" />,
      accentColor: 'border-[#3FAF6C]',
      badge: 'Senderos, Talleres y Tradición',
    },
    {
      id: CategoriaExp.AGUA,
      title: 'Agua',
      description: 'Descubre lagos, ríos y pesca artesanal.',
      image: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Ruta%20de%20Kayak%20por%20R%C3%ADo%20Istiam%20%26%20Pesca%20Tradicional.jpg',
      icon: <Waves className="w-6 h-6 text-[#38BDF8]" />,
      accentColor: 'border-[#38BDF8]',
      badge: 'Lagos, Kayak y Pesca',
    },
    {
      id: CategoriaExp.AIRE,
      title: 'Aire',
      description: 'Vive experiencias con vistas increíbles.',
      image: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Mirador%20del%20Sombrero%20%26%20Descenso%20Ca%C3%B1%C3%B3n%20de%20Somoto.jpg',
      icon: <Wind className="w-6 h-6 text-[#FFC83D]" />,
      accentColor: 'border-[#FFC83D]',
      badge: 'Miradores 360°, Canopy y Brisa',
    },
  ];

  const handleSelectCategory = (cat: CategoriaExp) => {
    setSelectedCategory(cat);
    setActiveScreen('explore');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FFF8F1] overflow-hidden py-10 px-4 sm:px-6 flex flex-col justify-center max-w-xl mx-auto">
      {/* Dashed Orange Route Trail SVG (Page 8) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
        viewBox="0 0 500 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 250 20 C 250 80, 420 100, 420 180 C 420 260, 80 280, 80 380 C 80 480, 420 520, 420 620 C 420 720, 150 750, 250 800"
          stroke="#FF6B35"
          strokeWidth="14"
          strokeDasharray="28 20"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative z-10 space-y-6">
        {/* Top Return Button */}
        <div className="flex items-center justify-between">
          <button
            id="btn-categories-back"
            onClick={() => setActiveScreen('explore')}
            className="flex items-center gap-2 text-xs font-bold text-[#23404A] hover:text-[#FF6B35] bg-white px-3.5 py-1.5 rounded-full border border-[#E8E5E0] shadow-2xs transition-all font-manrope cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Explorador</span>
          </button>
        </div>

        {/* Main Title (Page 8: "Elige tu Aventura!") */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white border border-[#E8E5E0] shadow-xs text-xs font-bold uppercase tracking-wider text-[#FF6B35] font-ibm-plex">
            <Compass className="w-3.5 h-3.5" />
            Rutas de Nicaragua
          </div>
          <h1 className="text-[#23404A] text-4xl sm:text-5xl font-extrabold tracking-tight font-outfit">
            Elige tu Aventura!
          </h1>
          <p className="text-[#162A31]/80 text-sm font-medium font-manrope">
            Conecta con los elementos y la cultura de nuestra tierra
          </p>
        </div>

        {/* Categories Big Image Pill Cards (Page 8) */}
        <div className="space-y-5">
          {categoryCards.map(card => (
            <div
              key={card.id}
              id={`card-cat-${card.id}`}
              onClick={() => handleSelectCategory(card.id)}
              className="group relative h-40 sm:h-44 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-white transform hover:-translate-y-1"
            >
              {/* Background Cover Photo with Dark Vignette */}
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-60 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Text and Badge Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase border border-white/20 font-ibm-plex text-[#FFF8F1]">
                    {card.badge}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-[#FF6B35] transition-colors">
                    <ArrowRight className="w-5 h-5 text-white stroke-[2.5]" />
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <h2 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight font-outfit leading-none drop-shadow-md">
                    {card.title}
                  </h2>
                  <p className="text-[#FFF8F1]/90 text-xs sm:text-sm font-medium font-manrope drop-shadow-xs">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              setSelectedCategory('Todas');
              setActiveScreen('explore');
            }}
            className="text-xs font-bold text-[#23404A] hover:text-[#FF6B35] underline underline-offset-4 font-outfit uppercase tracking-wider cursor-pointer"
          >
            Ver todas las aventuras juntas
          </button>
        </div>
      </div>
    </div>
  );
};
