/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Experience Detail View Component with Multi-Language Support & Stories Launch
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { Experiencia } from '../types';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import {
  X,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Camera,
  Calendar,
  ShieldCheck,
  MessageSquare,
  Phone,
  PlayCircle,
  Sparkles,
} from 'lucide-react';

export const ExperienceDetailModal: React.FC = () => {
  const {
    selectedExperience,
    setSelectedExperience,
    setActiveBookingExperience,
    setActiveStoryExperience,
    setActiveScreen,
    openOrCreateChatThread,
  } = useApp();

  const { t } = useTranslation();

  if (!selectedExperience) return null;

  const exp = selectedExperience;

  return (
    <div className="fixed inset-0 z-50 bg-[#162A31]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFF8F1] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E5E0] my-8 flex flex-col max-h-[90vh]">
        {/* Top Header Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <img
            src={resolveImageUrl(exp.imagen_url)}
            onError={e => handleImageFallback(e, exp.imagen_url)}
            alt={exp.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#162A31]/90 via-[#162A31]/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedExperience(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#162A31]/70 hover:bg-[#162A31] text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category & AR & Story Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-[#23404A]/90 text-[#FFF8F1] backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold font-ibm-plex shadow-xs">
              {exp.categoria}
            </span>
            <button
              onClick={() => {
                setSelectedExperience(null);
                setActiveStoryExperience(exp);
              }}
              className="bg-[#FF5722] hover:bg-[#e04a1b] text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md font-outfit cursor-pointer animate-pulse"
              title={t('exp.watchStory', 'Ver Historia')}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{t('exp.watchStory', 'Ver Historia')}</span>
            </button>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-1.5 text-xs text-[#FFC83D] font-bold mb-1 font-manrope">
              <MapPin className="w-3.5 h-3.5 text-[#FFC83D]" /> {exp.ubicacion_nombre}, {exp.ciudad_creativa}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold leading-tight font-outfit text-white">
              {exp.titulo}
            </h1>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#23404A]">
          {/* Key Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white border border-[#E8E5E0] text-center shadow-xs">
            <div>
              <span className="text-[10px] text-[#9A9A9A] font-bold uppercase block font-ibm-plex">
                {t('exp.rating', 'Calificación')}
              </span>
              <span className="text-[#23404A] font-extrabold text-sm flex items-center justify-center gap-1 font-outfit">
                <Star className="w-3.5 h-3.5 fill-[#FFC83D] text-[#FFC83D]" /> {exp.rating}
              </span>
            </div>
            <div className="border-x border-[#E8E5E0]">
              <span className="text-[10px] text-[#9A9A9A] font-bold uppercase block font-ibm-plex">
                {t('exp.duration', 'Duración')}
              </span>
              <span className="text-[#23404A] font-extrabold text-sm flex items-center justify-center gap-1 font-outfit">
                <Clock className="w-3.5 h-3.5 text-[#3FAF6C]" /> {exp.duracion}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#9A9A9A] font-bold uppercase block font-ibm-plex">
                {t('exp.difficulty', 'Dificultad')}
              </span>
              <span className="text-[#23404A] font-extrabold text-sm font-outfit">
                {exp.dificultad || 'Fácil'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-[#23404A] font-extrabold text-base font-outfit">
              {t('exp.about', 'Sobre esta experiencia')}
            </h3>
            <p className="text-[#162A31]/80 text-sm leading-relaxed font-manrope">
              {exp.descripcion}
            </p>
          </div>

          {/* Host Info & Direct Contact Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E5E0] space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {exp.anfitrion_avatar && (
                  <img
                    src={exp.anfitrion_avatar}
                    alt={exp.anfitrion_nombre}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#3FAF6C]/40"
                  />
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#23404A] font-bold text-sm font-outfit">
                      {exp.anfitrion_nombre}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#3FAF6C]" />
                  </div>
                  <span className="text-[#9A9A9A] text-xs font-ibm-plex">
                    {t('exp.verifiedHost', 'Anfitrión Comunitario Verificado')}
                  </span>
                </div>
              </div>

              <span className="text-xs bg-[#E3F4EB] text-[#3FAF6C] font-bold px-3 py-1 rounded-full border border-[#3FAF6C]/30 font-ibm-plex">
                {t('exp.directBooking', 'Reserva Directa')}
              </span>
            </div>

            {/* Direct Contact Buttons */}
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedExperience(null);
                  openOrCreateChatThread(
                    exp,
                    exp.id_anfitrion,
                    exp.anfitrion_nombre,
                    `¡Hola ${exp.anfitrion_nombre}! Me gustaría consultar sobre tu experiencia "${exp.titulo}".`
                  );
                }}
                className="flex-1 py-2.5 px-4 bg-[#FF6B35]/10 hover:bg-[#FF6B35] text-[#FF6B35] hover:text-white rounded-xl text-xs font-bold font-outfit transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                {t('exp.contactChat', 'Contactar al Anfitrión (Chat)')}
              </button>

              <a
                href="https://wa.me/50588123456"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-bold font-outfit transition-all flex items-center justify-center gap-1"
                title="Mensaje directo de WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-2.5">
            <h3 className="text-[#23404A] font-extrabold text-base font-outfit">
              {t('exp.whatIncludes', '¿Qué incluye?')}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exp.incluye.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs text-[#23404A] bg-white p-3 rounded-xl border border-[#E8E5E0] font-manrope"
                >
                  <CheckCircle className="w-4 h-4 text-[#3FAF6C] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#E8E5E0] flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-[#9A9A9A] font-bold uppercase block font-ibm-plex">
              {t('exp.totalPrice', 'Precio total:')}
            </span>
            <span className="text-[#FF6B35] text-2xl font-extrabold font-outfit">
              ${exp.precio} {exp.moneda}
            </span>
            <span className="text-[10px] text-[#9A9A9A] block font-ibm-plex">/ persona</span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
            <button
              onClick={() => {
                setSelectedExperience(null);
                setActiveStoryExperience(exp);
              }}
              className="px-3.5 py-3 rounded-full bg-[#FFEADB] hover:bg-[#ffd9c2] text-[#FF5722] text-xs font-black flex items-center gap-1.5 border border-[#FF5722]/30 transition-colors font-outfit cursor-pointer"
              title={t('exp.watchStory', 'Ver Historia')}
            >
              <PlayCircle className="w-4 h-4 text-[#FF5722]" />
              <span className="hidden sm:inline">{t('exp.watchStory', 'Ver Historia')}</span>
            </button>

            <button
              onClick={() => {
                setActiveScreen('ar_navigation');
                setSelectedExperience(exp);
              }}
              className="px-3.5 py-3 rounded-full bg-[#FFF8F1] hover:bg-[#FFEADB] text-[#23404A] text-xs font-bold flex items-center gap-1.5 border border-[#E8E5E0] transition-colors font-outfit cursor-pointer"
              title="Abrir simulación de Realidad Aumentada"
            >
              <Camera className="w-4 h-4 text-[#FF6B35]" /> RA
            </button>

            <button
              id="btn-open-booking-modal"
              onClick={() => {
                setActiveBookingExperience(exp);
                setSelectedExperience(null);
              }}
              className="px-5 sm:px-6 py-3 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white text-sm font-extrabold flex items-center gap-2 shadow-md transition-all font-outfit cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> {t('exp.bookNow', 'Reservar Ahora')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
