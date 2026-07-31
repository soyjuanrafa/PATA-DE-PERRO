/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Categories View Component - Recreates Screenshot 8
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoriaExp } from '../types';
import { Mountain, Waves, Wind, ArrowRight } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { setSelectedCategory, setActiveScreen } = useApp();

  const categoryCards = [
    {
      id: CategoriaExp.TIERRA,
      title: 'Tierra',
      description: 'Explora senderos, talleres y comunidades.',
      icon: <Mountain className="w-8 h-8 text-indigo-600" />,
      badgeBg: 'bg-indigo-50 border-indigo-100 text-indigo-700',
      count: 'Senderos, Cerámica, Cacao, Senderismo',
    },
    {
      id: CategoriaExp.AGUA,
      title: 'Agua',
      description: 'Descubre lagos, ríos y pesca artesanal.',
      icon: <Waves className="w-8 h-8 text-indigo-600" />,
      badgeBg: 'bg-indigo-50 border-indigo-100 text-indigo-700',
      count: 'Kayak, Pesca, Isletas, Cascadas',
    },
    {
      id: CategoriaExp.AIRE,
      title: 'Aire',
      description: 'Vive experiencias con vistas increíbles.',
      icon: <Wind className="w-8 h-8 text-indigo-600" />,
      badgeBg: 'bg-indigo-50 border-indigo-100 text-indigo-700',
      count: 'Miradores 360°, Canopy, Parapente',
    },
  ];

  const handleSelectCategory = (cat: CategoriaExp) => {
    setSelectedCategory(cat);
    setActiveScreen('explore');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col justify-center py-10 px-6 max-w-lg mx-auto">
      <div className="text-center mb-8 space-y-2">
        <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          Rutas de Nicaragua
        </span>
        <h1 className="text-slate-900 text-3xl sm:text-4xl font-black tracking-tight pt-1">
          Elige tu Aventura
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Selecciona un elemento para descubrir actividades locales
        </p>
      </div>

      <div className="space-y-4">
        {categoryCards.map(card => (
          <div
            key={card.id}
            id={`card-cat-${card.id}`}
            onClick={() => handleSelectCategory(card.id)}
            className="group bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${card.badgeBg}`}>
                {card.count}
              </span>
              <h2 className="text-slate-900 text-2xl font-black tracking-tight group-hover:text-indigo-600 transition-colors">
                {card.title}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                {card.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 group-hover:bg-indigo-50 group-hover:scale-105 transition-all shrink-0 border border-slate-100">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
