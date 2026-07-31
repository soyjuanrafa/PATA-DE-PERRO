/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Explore View Component - Recreates Screenshot 7
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoriaExp, MoodTag } from '../types';
import {
  Search,
  Bell,
  User,
  Star,
  Compass,
  MapPin,
  Sparkles,
  ChevronRight,
  Eye,
  Camera,
} from 'lucide-react';

export const ExploreView: React.FC = () => {
  const {
    experiences,
    user,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedMood,
    setSelectedMood,
    setSelectedExperience,
    setActiveScreen,
  } = useApp();

  // Mood badge styling matching Sleek Interface theme
  const moodGradientMap: Record<MoodTag, string> = {
    [MoodTag.TRANQUILO]: 'from-indigo-50 to-slate-100 text-indigo-950 border-indigo-200',
    [MoodTag.AVENTURERO]: 'from-amber-50 to-orange-50 text-slate-900 border-amber-200',
    [MoodTag.CULTURAL]: 'from-indigo-50 to-slate-100 text-slate-900 border-indigo-200',
    [MoodTag.CREATIVO]: 'from-emerald-50 to-teal-50 text-emerald-950 border-emerald-200',
    [MoodTag.GASTRONOMICO]: 'from-rose-50 to-amber-50 text-slate-900 border-rose-200',
  };

  // Filter experiences logic
  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch =
      searchQuery === '' ||
      exp.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.ciudad_creativa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todas' || exp.categoria === selectedCategory;

    const matchesMood =
      selectedMood === 'Todos' || exp.moods.includes(selectedMood as MoodTag);

    return matchesSearch && matchesCategory && matchesMood;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Top User Profile & Notification Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-indigo-500/40 overflow-hidden bg-white shadow-xs p-0.5">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.nombre}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">¡Hola!</p>
            <p className="text-sm font-bold text-slate-900">{user?.nombre || 'Explorador'}</p>
          </div>
        </div>

        {/* Bell Notification button */}
        <button
          id="btn-notifications"
          onClick={() => setActiveScreen('reservations')}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-100 transition-colors"
          title="Ver reservaciones"
        >
          <Bell className="w-4 h-4 text-indigo-600" />
        </button>
      </div>

      {/* Main Greeting Headline */}
      <div className="space-y-1">
        <h1 className="text-slate-900 text-2xl sm:text-3xl font-black tracking-tight">
          ¿Qué historia quieres vivir hoy?
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">Descubre experiencias auténticas cerca de ti.</p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="input-explore-search"
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Busca una experiencia, comunidad o lugar..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 font-medium"
        />
      </div>

      {/* "⚡ Hoy me siento..." Mood Filter Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-amber-500">⚡</span> Hoy me siento...
          </h2>
          {selectedMood !== 'Todos' && (
            <button
              onClick={() => setSelectedMood('Todos')}
              className="text-xs text-indigo-600 font-medium hover:underline"
            >
              Limpiar filtro
            </button>
          )}
        </div>

        {/* Mood Cards */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {Object.values(MoodTag).map(mood => {
            const isSelected = selectedMood === mood;
            const gradientStyle = moodGradientMap[mood];
            return (
              <button
                key={mood}
                onClick={() => setSelectedMood(isSelected ? 'Todos' : mood)}
                className={`shrink-0 h-16 w-28 rounded-xl p-2.5 border flex flex-col justify-between transition-all bg-gradient-to-br ${gradientStyle} ${
                  isSelected ? 'ring-2 ring-indigo-600 shadow-md scale-102' : 'hover:border-slate-300'
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-75">
                  Mood
                </span>
                <span className="text-xs font-black tracking-tight leading-tight">{mood}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Switcher Pill */}
      <div className="space-y-3">
        <h2 className="text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-indigo-600" /> Tu aventura de hoy
        </h2>

        <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          {(['Todas', CategoriaExp.TIERRA, CategoriaExp.AGUA, CategoriaExp.AIRE] as const).map(
            cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all text-center ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* "Recomendadas para ti" Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-slate-900 text-lg font-black tracking-tight">
            Recomendadas para ti
          </h2>
          <button
            onClick={() => setActiveScreen('categories')}
            className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5 hover:underline"
          >
            Ver todas <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center space-y-3 border border-slate-200">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-700 text-sm font-medium">
              No se encontraron experiencias con los filtros seleccionados.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todas');
                setSelectedMood('Todos');
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map(exp => (
              <div
                key={exp.id_exp}
                id={`card-exp-${exp.id_exp}`}
                onClick={() => setSelectedExperience(exp)}
                className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Image & Badge overlay */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={exp.imagen_url}
                    alt={exp.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 text-white backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {exp.categoria}
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedExperience(exp);
                      setActiveScreen('ar_navigation');
                    }}
                    className="absolute top-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                    title="Ver en Realidad Aumentada"
                  >
                    <Camera className="w-3.5 h-3.5" /> RA
                  </button>

                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-white text-xs font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-400" />
                    <span>{exp.ciudad_creativa}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>{exp.duracion}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-slate-800">{exp.rating}</span>
                        <span className="text-slate-400 font-normal">({exp.resenas_count})</span>
                      </div>
                    </div>

                    <h3 className="text-slate-900 font-bold text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {exp.titulo}
                    </h3>
                    <p className="text-slate-600 text-xs mt-1 line-clamp-2">
                      {exp.descripcion}
                    </p>
                  </div>

                  {/* Host & Price footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {exp.anfitrion_avatar && (
                        <img
                          src={exp.anfitrion_avatar}
                          alt={exp.anfitrion_nombre}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-xs text-slate-600 font-medium truncate max-w-[120px]">
                        {exp.anfitrion_nombre}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-900 font-extrabold text-base">
                        ${exp.precio}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal block">
                        / persona
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
