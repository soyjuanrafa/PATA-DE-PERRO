/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Explore View Component - With Multi-Language Support & Experience Stories Reel
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { CategoriaExp, MoodTag, EstadoReserva } from '../types';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import {
  Search,
  Bell,
  User,
  Star,
  Compass,
  MapPin,
  ChevronRight,
  Camera,
  Check,
  ChevronDown,
  Sparkles,
  Heart,
  MessageSquare,
  Calendar,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  PlayCircle,
  Plus,
} from 'lucide-react';

export const ExploreView: React.FC = () => {
  const {
    experiences,
    user,
    userRole,
    reservations,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedMood,
    setSelectedMood,
    selectedExperience,
    setSelectedExperience,
    setActiveStoryExperience,
    openStoryViewer,
    userStories,
    setActiveScreen,
    savedExperienceIds,
    toggleSavedExperience,
    openOrCreateChatThread,
    totalUnreadMessagesCount,
  } = useApp();

  const { t } = useTranslation();

  // Mood cards styling matching Screen 7 ("Hoy me siento... Relajado, Explorador, Aventurero")
  const moodConfig: Record<
    MoodTag,
    { label: string; bg: string; border: string; text: string; icon: string; desc: string }
  > = {
    [MoodTag.TRANQUILO]: {
      label: t('mood.tranquilo', 'Relajado'),
      bg: 'bg-[#E3F4EB]',
      border: 'border-[#3FAF6C]/40',
      text: 'text-[#162A31]',
      icon: '🌴',
      desc: t('mood.tranquilo.desc', 'Hamacas & calma'),
    },
    [MoodTag.AVENTURERO]: {
      label: t('mood.aventurero', 'Aventurero'),
      bg: 'bg-[#FFEADB]',
      border: 'border-[#FF6B35]/40',
      text: 'text-[#162A31]',
      icon: '🧗',
      desc: t('mood.aventurero.desc', 'Volcanes & acción'),
    },
    [MoodTag.CULTURAL]: {
      label: t('mood.cultural', 'Explorador'),
      bg: 'bg-[#E6EEF1]',
      border: 'border-[#23404A]/30',
      text: 'text-[#162A31]',
      icon: '🏺',
      desc: t('mood.cultural.desc', 'Pueblos & tradición'),
    },
    [MoodTag.CREATIVO]: {
      label: t('mood.creativo', 'Creativo'),
      bg: 'bg-[#FFF6DB]',
      border: 'border-[#FFC83D]/50',
      text: 'text-[#162A31]',
      icon: '🎨',
      desc: t('mood.creativo.desc', 'Talleres & arte'),
    },
    [MoodTag.GASTRONOMICO]: {
      label: t('mood.gastronomico', 'Gastronómico'),
      bg: 'bg-[#FFE2D6]',
      border: 'border-[#FF8D64]/40',
      text: 'text-[#162A31]',
      icon: '🍲',
      desc: t('mood.gastronomico.desc', 'Sabores locales'),
    },
  };

  // Filter experiences logic
  const filteredExperiences = experiences.filter(exp => {
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch =
      query === '' ||
      (exp.titulo && exp.titulo.toLowerCase().includes(query)) ||
      (exp.ciudad_creativa && exp.ciudad_creativa.toLowerCase().includes(query)) ||
      (exp.descripcion && exp.descripcion.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategory === 'Todas' || exp.categoria === selectedCategory;

    const matchesMood =
      selectedMood === 'Todos' ||
      (Array.isArray(exp.moods) && exp.moods.includes(selectedMood as MoodTag));

    return Boolean(matchesSearch && matchesCategory && matchesMood);
  });

  const latestActiveReservation = reservations.length > 0 ? reservations[0] : null;

  return (
    <div className="min-h-screen bg-[#FFF8F1] pb-28 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top User Profile & Action Bar */}
      <div className="flex items-center justify-between">
        <div
          onClick={() => setActiveScreen('profile')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Ver y editar tu perfil"
        >
          <div className="w-12 h-12 rounded-full border-2 border-[#FF6B35]/40 overflow-hidden bg-white shadow-xs p-0.5 group-hover:scale-105 transition-transform">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.nombre}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#162A31] text-[#FFF8F1] flex items-center justify-center font-bold text-lg font-outfit">
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B35] font-ibm-plex block">
              {t('explore.hello', '¡HOLA!')}
            </span>
            <h1 className="text-base sm:text-lg font-extrabold text-[#23404A] font-outfit truncate max-w-[200px] sm:max-w-xs group-hover:text-[#FF6B35] transition-colors">
              {user?.nombre || 'Viajero Pata de Perro'}
            </h1>
          </div>
        </div>

        {/* Action icons (Notifications & Profile) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('messages')}
            className="relative p-2.5 rounded-full bg-white border border-[#E8E5E0] text-[#23404A] hover:bg-[#FFEADB] transition-colors shadow-xs cursor-pointer"
            title="Ver Mensajes"
          >
            <Bell className="w-5 h-5 text-[#23404A]" />
            {totalUnreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF6B35] rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </div>

      {/* Main Title Callout (Page 7) */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#23404A] tracking-tight font-outfit leading-tight">
          {t('explore.title', '¿Qué historias quieres vivir hoy?')}
        </h1>
        <p className="text-xs sm:text-sm text-[#23404A]/70 font-manrope font-medium">
          {t('explore.subtitle', 'Descubre experiencias auténticas cerca de ti con anfitriones comunitarios.')}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* HISTORIAS COMUNITARIAS (INSTAGRAM-STYLE STORIES REEL CAROUSEL) */}
      {/* ========================================================================= */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🐾</span>
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#23404A] font-outfit">
              {t('explore.storiesFeed', 'Historias Comunitarias')}
            </h2>
            <span className="text-[10px] bg-[#FF5722] text-white px-2 py-0.2 rounded-full font-extrabold uppercase">
              Nuevo
            </span>
          </div>
          <span className="text-[11px] text-[#23404A]/60 font-manrope hidden sm:inline">
            {t('explore.storiesSubtitle', 'Toca para ver historias vivas contadas por anfitriones')}
          </span>
        </div>

        {/* Stories Horizontal Reel */}
        <div className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {/* User's own story or Add Story trigger */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 group relative">
            <div
              className={`relative p-0.5 rounded-full transition-all shadow-sm ${
                userStories.length > 0
                  ? 'bg-gradient-to-tr from-[#FF5722] via-[#FFC83D] to-[#2E9D62]'
                  : 'bg-stone-300 hover:bg-[#FF5722]'
              }`}
            >
              {/* Circle Avatar Button: If user has stories, view them; if not, open upload */}
              <button
                id="user-story-circle-btn"
                type="button"
                onClick={() => {
                  if (userStories.length > 0) {
                    openStoryViewer(null, 'user_stories');
                  } else {
                    openStoryViewer(experiences[0] || null, 'upload_user_story');
                  }
                }}
                className="w-16 h-16 rounded-full p-0.5 bg-[#FFF8F1] overflow-hidden flex items-center justify-center cursor-pointer block"
                title={
                  userStories.length > 0
                    ? 'Ver tu historia recién subida'
                    : 'Subir tu primera historia'
                }
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.nombre}
                    className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-[#FF5722]">
                    <User className="w-7 h-7" />
                  </div>
                )}
              </button>

              {/* Plus Badge: Click to upload another story */}
              <button
                id="user-add-story-plus-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openStoryViewer(experiences[0] || null, 'upload_user_story');
                }}
                className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#FF5722] hover:bg-[#e04a1b] text-white flex items-center justify-center text-[12px] font-black border-2 border-white shadow-sm cursor-pointer transition-transform hover:scale-110"
                title="Subir otra foto o video a tu historia"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>

            {/* Label */}
            <button
              type="button"
              onClick={() => {
                if (userStories.length > 0) {
                  openStoryViewer(null, 'user_stories');
                } else {
                  openStoryViewer(experiences[0] || null, 'upload_user_story');
                }
              }}
              className="text-[11px] font-black text-[#23404A] font-outfit max-w-[70px] truncate text-center group-hover:text-[#FF5722] cursor-pointer"
            >
              {t('story.yourStory', 'Tu historia')}
            </button>
          </div>

          {/* Experience Stories from Communities */}
          {experiences.map(exp => (
            <button
              key={exp.id_exp}
              onClick={() => setActiveStoryExperience(exp)}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
              title={`Ver historia de ${exp.titulo}`}
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#FF5722] via-[#FFC83D] to-[#2E9D62] shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-16 h-16 rounded-full p-0.5 bg-[#FFF8F1] overflow-hidden">
                  <img
                    src={resolveImageUrl(exp.imagen_url)}
                    onError={e => handleImageFallback(e, exp.imagen_url)}
                    alt={exp.titulo}
                    className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Host badge */}
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                  🐾
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#23404A] font-outfit max-w-[70px] truncate text-center group-hover:text-[#FF5722]">
                {exp.titulo.split(' ')[0]} {exp.titulo.split(' ')[1] || ''}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Trip Banner if User Has an Active Booking */}
      {latestActiveReservation && (
        <div
          onClick={() => setActiveScreen('reservations')}
          className="bg-[#23404A] text-[#FFF8F1] rounded-3xl p-4 sm:p-5 shadow-md flex items-center justify-between gap-4 cursor-pointer hover:bg-[#1f3740] transition-colors border border-white/10"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B35] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#3FAF6C] text-white px-2 py-0.5 rounded-full font-ibm-plex">
                  {latestActiveReservation.estado === EstadoReserva.CONFIRMADA
                    ? 'Reserva Confirmada'
                    : 'Reserva en Proceso'}
                </span>
                <span className="text-xs text-[#FFC83D] font-bold font-ibm-plex">
                  {latestActiveReservation.fecha_reserva}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#FFF8F1] font-outfit truncate max-w-[220px] sm:max-w-md mt-0.5">
                {latestActiveReservation.experiencia_titulo}
              </h3>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#FFC83D] shrink-0" />
        </div>
      )}

      {/* Search Input Bar (Page 7) */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-[#FF6B35]">
          <Search className="w-5 h-5" />
        </div>
        <input
          id="input-explore-search"
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t('explore.searchPlaceholder', 'Busca una experiencia, comunidad o lugar...')}
          className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-[#E8E5E0] text-[#23404A] text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] placeholder-[#9A9A9A] font-manrope font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-[#9A9A9A] hover:text-[#23404A] font-ibm-plex cursor-pointer"
          >
            {t('explore.clear', 'Limpiar')}
          </button>
        )}
      </div>

      {/* "⚡ Hoy me siento..." Mood Cards Filter Section (Page 7) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[#23404A] text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5 font-outfit">
            <span className="text-[#FF6B35]">⚡</span> {t('explore.howIFeelToday', 'Hoy me siento...')}
          </h2>
          {selectedMood !== 'Todos' && (
            <button
              onClick={() => setSelectedMood('Todos')}
              className="text-xs text-[#FF6B35] font-bold hover:underline font-ibm-plex cursor-pointer"
            >
              {t('explore.seeAll', 'Ver todos')}
            </button>
          )}
        </div>

        {/* Mood Cards horizontal scroller */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
          {Object.values(MoodTag).map(mood => {
            const isSelected = selectedMood === mood;
            const config = moodConfig[mood];
            return (
              <button
                key={mood}
                id={`mood-btn-${mood.toLowerCase()}`}
                onClick={() => setSelectedMood(isSelected ? 'Todos' : mood)}
                className={`shrink-0 h-24 w-32 rounded-2xl p-3 border-2 flex flex-col justify-between items-start transition-all cursor-pointer ${
                  config.bg
                } ${config.border} ${
                  isSelected
                    ? 'ring-3 ring-[#FF6B35] shadow-md scale-102 border-[#FF6B35]'
                    : 'hover:shadow-sm opacity-90 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{config.icon}</span>
                  {isSelected && (
                    <span className="w-5 h-5 bg-[#3FAF6C] text-white rounded-full flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-black tracking-tight text-[#162A31] block font-outfit">
                    {config.label}
                  </span>
                  <span className="text-[10px] text-[#23404A]/70 font-medium block font-ibm-plex truncate">
                    {config.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* "🧭 Tu aventura de hoy" Category Selector (Page 7) */}
      <div className="space-y-3 pt-2">
        <h2 className="text-[#23404A] text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5 font-outfit">
          <Compass className="w-4 h-4 text-[#FF6B35]" /> {t('explore.todayAdventure', 'Tu aventura de hoy')}
        </h2>

        <div className="grid grid-cols-4 gap-2 bg-white p-1.5 rounded-2xl border border-[#E8E5E0] shadow-xs">
          {(['Todas', CategoriaExp.TIERRA, CategoriaExp.AGUA, CategoriaExp.AIRE] as const).map(
            cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-btn-${cat.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center font-outfit cursor-pointer ${
                    isSelected
                      ? 'bg-[#3FAF6C] text-white shadow-xs'
                      : 'text-[#23404A] hover:bg-[#FFF8F1]'
                  }`}
                >
                  {cat === 'Todas' ? t('cat.all', 'Todas') : cat}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* "Recomendadas para ti" Section (Page 7) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[#23404A] text-xl sm:text-2xl font-extrabold tracking-tight font-outfit">
            {t('explore.recommended', 'Recomendadas para ti')}
          </h2>
          <button
            onClick={() => setActiveScreen('categories')}
            className="text-xs text-[#FF6B35] font-bold flex items-center gap-0.5 hover:underline font-ibm-plex cursor-pointer"
          >
            {t('explore.seeAllCategories', 'Ver todas las categorías')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center space-y-4 border border-[#E8E5E0] shadow-xs">
            <Compass className="w-12 h-12 text-[#9A9A9A] mx-auto" />
            <p className="text-[#23404A] text-base font-bold font-outfit">
              {t('explore.noResults', 'No se encontraron experiencias con los filtros seleccionados.')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todas');
                setSelectedMood('Todos');
              }}
              className="px-6 py-2.5 bg-[#FF6B35] text-white rounded-full text-xs font-bold uppercase tracking-wider font-outfit hover:bg-[#ff5518] transition-colors cursor-pointer"
            >
              {t('explore.resetFilters', 'Restablecer filtros')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map(exp => {
              const isSaved = Array.isArray(savedExperienceIds) && savedExperienceIds.includes(exp.id_exp);

              return (
                <div
                  key={exp.id_exp}
                  id={`card-exp-${exp.id_exp}`}
                  onClick={() => setSelectedExperience(exp)}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#E8E5E0] shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between hover:border-[#FF6B35]/40"
                >
                  {/* Image & Badges */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={resolveImageUrl(exp.imagen_url)}
                      onError={e => handleImageFallback(e, exp.imagen_url)}
                      alt={exp.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Left: Category Badge in Petrol Blue */}
                    <div className="absolute top-3 left-3 bg-[#23404A]/90 text-[#FFF8F1] backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs font-ibm-plex">
                      {exp.categoria}
                    </div>

                    {/* Top Right: Story, AR & Favorite Buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {/* VER HISTORIA DIRECT BUTTON */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setActiveStoryExperience(exp);
                        }}
                        className="bg-[#FF5722] hover:bg-[#e04a1b] text-white px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md transition-all font-outfit cursor-pointer animate-pulse"
                        title={t('explore.viewStory', 'Ver historia')}
                      >
                        <PlayCircle className="w-3.5 h-3.5 fill-white/20" />
                        <span>{t('explore.viewStory', 'Ver historia')}</span>
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedExperience(exp);
                          setActiveScreen('ar_navigation');
                        }}
                        className="bg-[#23404A] hover:bg-black text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md transition-all font-outfit cursor-pointer"
                        title="Ver en Realidad Aumentada"
                      >
                        <Camera className="w-3.5 h-3.5" /> RA
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleSavedExperience(exp.id_exp);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md shadow-xs transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-rose-500 text-white'
                            : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                        title={isSaved ? 'Guardado en favoritos' : 'Guardar experiencia'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Left: Location Tag */}
                    <div className="absolute bottom-3 left-3 bg-[#23404A]/80 backdrop-blur-xs px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 font-manrope">
                      <MapPin className="w-3.5 h-3.5 text-[#FFC83D]" />
                      <span>{exp.ciudad_creativa}</span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#9A9A9A] mb-1.5 font-ibm-plex font-medium">
                        <span>{exp.duracion}</span>
                        <div className="flex items-center gap-1 text-[#FFC83D] font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-[#23404A] font-bold">{exp.rating}</span>
                          <span className="text-[#9A9A9A] font-normal">({exp.resenas_count})</span>
                        </div>
                      </div>

                      <h3 className="text-[#23404A] font-extrabold text-lg leading-snug group-hover:text-[#FF6B35] transition-colors line-clamp-2 font-outfit">
                        {exp.titulo}
                      </h3>
                      <p className="text-[#162A31]/80 text-xs sm:text-sm mt-1.5 line-clamp-2 font-manrope leading-relaxed">
                        {exp.descripcion}
                      </p>
                    </div>

                    {/* Host, Chat & Price footer */}
                    <div className="pt-3.5 border-t border-[#E8E5E0] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {exp.anfitrion_avatar && (
                          <img
                            src={exp.anfitrion_avatar}
                            alt={exp.anfitrion_nombre}
                            className="w-7 h-7 rounded-full object-cover border border-[#E8E5E0] shrink-0"
                          />
                        )}
                        <span className="text-xs text-[#23404A] font-semibold truncate font-manrope">
                          {exp.anfitrion_nombre}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            openOrCreateChatThread(exp, exp.id_anfitrion, exp.anfitrion_nombre);
                          }}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-orange-50 hover:text-[#FF6B35] text-stone-700 rounded-full text-[11px] font-bold font-outfit flex items-center gap-1 transition-colors cursor-pointer"
                          title={t('explore.chatWithHost', 'Chatear con el anfitrión')}
                        >
                          <MessageSquare className="w-3 h-3 text-[#FF6B35]" />
                          {t('explore.chatWithHost', 'Chatear')}
                        </button>

                        <div className="text-right">
                          <span className="text-[#FF6B35] font-extrabold text-lg font-outfit">
                            ${exp.precio}
                          </span>
                          <span className="text-[10px] text-[#9A9A9A] font-bold uppercase block font-ibm-plex">
                            {t('explore.perPerson', '/ pers')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation Dock (Matching Page 7 dock bar) */}
      <div className="fixed bottom-4 inset-x-0 z-30 max-w-md mx-auto px-4 pointer-events-none">
        <div className="bg-[#23404A] text-[#FFF8F1] rounded-full p-2 shadow-2xl border border-white/20 flex items-center justify-around pointer-events-auto backdrop-blur-md">
          <button
            onClick={() => setActiveScreen('explore')}
            className="flex flex-col items-center gap-1 p-2 rounded-full text-[#FF6B35] hover:bg-white/10 transition-colors cursor-pointer"
            title={t('nav.explore', 'Explorar')}
          >
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setActiveScreen('map')}
            className="flex flex-col items-center gap-1 p-2 rounded-full text-[#FFF8F1]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={t('nav.map', 'Mapa Interactivo y Realidad Aumentada')}
          >
            <MapPin className="w-6 h-6 stroke-[2]" />
          </button>

          <button
            onClick={() => setActiveScreen('messages')}
            className="relative flex flex-col items-center gap-1 p-2 rounded-full text-[#FFF8F1]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={t('nav.messages', 'Mensajes y Chat')}
          >
            <MessageSquare className="w-6 h-6 stroke-[2]" />
            {totalUnreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF6B35] rounded-full border-2 border-[#23404A]" />
            )}
          </button>

          <button
            onClick={() => setActiveScreen('reservations')}
            className="flex flex-col items-center gap-1 p-2 rounded-full text-[#FFF8F1]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={t('nav.reservations', 'Mis Reservas')}
          >
            <Heart className="w-6 h-6 stroke-[2]" />
          </button>

          <button
            onClick={() => setActiveScreen('categories')}
            className="flex flex-col items-center gap-1 p-2 rounded-full text-[#FFF8F1]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={t('nav.categories', 'Categorías')}
          >
            <Sparkles className="w-6 h-6 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
