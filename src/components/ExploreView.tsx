/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Explore View Component - Recreates Screenshot 7 with Official Brand Guidelines
 */

import React from 'react';
import { useApp } from '../context/AppContext';
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
    setActiveScreen,
    savedExperienceIds,
    toggleSavedExperience,
    openOrCreateChatThread,
    totalUnreadMessagesCount,
  } = useApp();

  // Mood cards styling matching Screen 7 ("Hoy me siento... Relajado, Explorador, Aventurero")
  const moodConfig: Record<
    MoodTag,
    { label: string; bg: string; border: string; text: string; icon: string; desc: string }
  > = {
    [MoodTag.TRANQUILO]: {
      label: 'Relajado',
      bg: 'bg-[#E3F4EB]',
      border: 'border-[#3FAF6C]/40',
      text: 'text-[#162A31]',
      icon: '🌴',
      desc: 'Hamacas & calma',
    },
    [MoodTag.AVENTURERO]: {
      label: 'Aventurero',
      bg: 'bg-[#FFEADB]',
      border: 'border-[#FF6B35]/40',
      text: 'text-[#162A31]',
      icon: '🧗',
      desc: 'Volcanes & acción',
    },
    [MoodTag.CULTURAL]: {
      label: 'Explorador',
      bg: 'bg-[#E6EEF1]',
      border: 'border-[#23404A]/30',
      text: 'text-[#162A31]',
      icon: '🏺',
      desc: 'Pueblos & tradición',
    },
    [MoodTag.CREATIVO]: {
      label: 'Creativo',
      bg: 'bg-[#FFF6DB]',
      border: 'border-[#FFC83D]/50',
      text: 'text-[#162A31]',
      icon: '🎨',
      desc: 'Talleres & arte',
    },
    [MoodTag.GASTRONOMICO]: {
      label: 'Gastronómico',
      bg: 'bg-[#FFE2D6]',
      border: 'border-[#FF8D64]/40',
      text: 'text-[#162A31]',
      icon: '🍲',
      desc: 'Sabores locales',
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
              <div className="w-full h-full bg-[#E6EEF1] flex items-center justify-center text-[#23404A] font-bold">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] font-bold uppercase tracking-wider font-ibm-plex">
              ¡HOLA!
            </p>
            <p className="text-base font-extrabold text-[#23404A] font-outfit group-hover:text-[#FF6B35] transition-colors">
              {user?.nombre || 'Explorador'}
            </p>
          </div>
        </div>

        {/* Action Buttons: Messages & Notifications */}
        <div className="flex items-center gap-2">
          {/* Chat / Messages Button with Real-Time Badge */}
          <button
            id="btn-messages-inbox"
            onClick={() => setActiveScreen('messages')}
            className="relative w-11 h-11 rounded-full bg-white border border-[#E8E5E0] flex items-center justify-center text-[#23404A] shadow-xs hover:bg-orange-50 transition-colors cursor-pointer"
            title="Bandeja de Mensajes y Chat"
          >
            <MessageSquare className="w-5 h-5 text-[#23404A]" />
            {totalUnreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                {totalUnreadMessagesCount}
              </span>
            )}
          </button>

          {/* Bell Notification with Yellow Indicator Ring */}
          <button
            id="btn-notifications"
            onClick={() => setActiveScreen('reservations')}
            className="relative w-11 h-11 rounded-full bg-white border border-[#E8E5E0] flex items-center justify-center text-[#23404A] shadow-xs hover:bg-orange-50 transition-colors cursor-pointer"
            title="Ver tus reservas y notificaciones"
          >
            <Bell className="w-5 h-5 text-[#FFC83D]" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FF6B35] rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      {/* Main Greeting Headline */}
      <div className="space-y-1.5">
        <h1 className="text-[#23404A] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-outfit leading-tight">
          ¿Qué historias quieres vivir hoy?
        </h1>
        <p className="text-[#162A31]/80 text-sm sm:text-base font-medium font-manrope">
          Descubre experiencias auténticas cerca de ti con anfitriones comunitarios.
        </p>
      </div>

      {/* Active Reservation Live Widget on Home Screen */}
      {latestActiveReservation && (
        <div className="bg-gradient-to-r from-[#23404A] to-[#1a323a] text-[#FFF8F1] rounded-3xl p-5 sm:p-6 shadow-md border border-[#23404A]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/10 shrink-0 border border-white/20">
              <img
                src={resolveImageUrl(latestActiveReservation.exp_imagen)}
                onError={e => handleImageFallback(e, latestActiveReservation.exp_imagen)}
                alt={latestActiveReservation.exp_titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#FFC83D] text-[#23404A] px-2.5 py-0.5 rounded-full font-ibm-plex">
                  {latestActiveReservation.estado_reserva}
                </span>
                <span className="text-xs text-white/70 font-ibm-plex">
                  Cód: {latestActiveReservation.codigo_confirmacion}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-outfit text-white">
                {latestActiveReservation.exp_titulo}
              </h3>
              <p className="text-xs text-white/80 font-manrope flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#FFC83D]" /> {latestActiveReservation.fecha_reserva} • {latestActiveReservation.personas} persona(s) • ${latestActiveReservation.monto_total} USD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-center">
            <button
              onClick={() => {
                const targetExp = experiences.find(e => e.id_exp === latestActiveReservation.id_exp);
                openOrCreateChatThread(targetExp, undefined, undefined, `¡Hola! Tengo una consulta sobre mi reserva ${latestActiveReservation.codigo_confirmacion}.`);
              }}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#FF6B35] hover:bg-[#ff5518] text-white rounded-full text-xs font-bold font-outfit shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Chatear con Anfitrión
            </button>
            <button
              onClick={() => setActiveScreen('reservations')}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold font-outfit transition-colors flex items-center gap-1 cursor-pointer"
            >
              Ver mis reservas <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
          placeholder="Busca una experiencia, comunidad o lugar..."
          className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-[#E8E5E0] text-[#23404A] text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] placeholder-[#9A9A9A] font-manrope font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-[#9A9A9A] hover:text-[#23404A] font-ibm-plex cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* "⚡ Hoy me siento..." Mood Cards Filter Section (Page 7) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[#23404A] text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5 font-outfit">
            <span className="text-[#FF6B35]">⚡</span> Hoy me siento...
          </h2>
          {selectedMood !== 'Todos' && (
            <button
              onClick={() => setSelectedMood('Todos')}
              className="text-xs text-[#FF6B35] font-bold hover:underline font-ibm-plex cursor-pointer"
            >
              Ver todos
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
          <Compass className="w-4 h-4 text-[#FF6B35]" /> Tu aventura de hoy
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
                  {cat}
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
            Recomendadas para ti
          </h2>
          <button
            onClick={() => setActiveScreen('categories')}
            className="text-xs text-[#FF6B35] font-bold flex items-center gap-0.5 hover:underline font-ibm-plex cursor-pointer"
          >
            Ver todas las categorías <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center space-y-4 border border-[#E8E5E0] shadow-xs">
            <Compass className="w-12 h-12 text-[#9A9A9A] mx-auto" />
            <p className="text-[#23404A] text-base font-bold font-outfit">
              No se encontraron experiencias con los filtros seleccionados.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todas');
                setSelectedMood('Todos');
              }}
              className="px-6 py-2.5 bg-[#FF6B35] text-white rounded-full text-xs font-bold uppercase tracking-wider font-outfit hover:bg-[#ff5518] transition-colors cursor-pointer"
            >
              Restablecer filtros
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

                    {/* Top Right: AR & Favorite Buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedExperience(exp);
                          setActiveScreen('ar_navigation');
                        }}
                        className="bg-[#FF6B35] hover:bg-[#ff5518] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md transition-all font-outfit cursor-pointer"
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
                          title="Chatear con el anfitrión de esta experiencia"
                        >
                          <MessageSquare className="w-3 h-3 text-[#FF6B35]" />
                          Chatear
                        </button>

                        <div className="text-right">
                          <span className="text-[#FF6B35] font-extrabold text-lg font-outfit">
                            ${exp.precio}
                          </span>
                          <span className="text-[10px] text-[#9A9A9A] font-bold uppercase block font-ibm-plex">
                            / pers
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
            title="Explorar"
          >
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setActiveScreen('map')}
            className="flex flex-col items-center gap-1 p-2 rounded-full text-[#FFF8F1]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Mapa Interactivo y Realidad Aumentada"
          >
            <MapPin className="w-6 h-6 stroke-[2]" />
          </button>

          <button
            onClick={() => setActiveScreen('messages')}
            className="relative flex flex-col items-center gap-1 p-2 rounded-full text-[#FFF8F1]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Mensajes y Chat"
          >
            <MessageSquare className="w-6 h-6 stroke-[2]" />
            {totalUnreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF6B35] rounded-full border-2 border-[#23404A]" />
            )}
          </button>

          <button
            onClick={() => setActiveScreen('reservations')}
            className="flex flex-col items-center gap-1 p-2 rounded-full text-[#FFF8F1]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Mis Reservas"
          >
            <Heart className="w-6 h-6 stroke-[2]" />
          </button>

          <button
            onClick={() => setActiveScreen('categories')}
            className="flex flex-col items-center gap-1 p-2 rounded-full text-[#FFF8F1]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Categorías"
          >
            <Sparkles className="w-6 h-6 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
