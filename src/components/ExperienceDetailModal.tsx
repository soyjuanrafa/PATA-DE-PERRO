/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Experience Detail View Component
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Experiencia } from '../types';
import {
  X,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Camera,
  Calendar,
  Share2,
  ShieldCheck,
  Phone,
} from 'lucide-react';

export const ExperienceDetailModal: React.FC = () => {
  const {
    selectedExperience,
    setSelectedExperience,
    setActiveBookingExperience,
    setActiveScreen,
  } = useApp();

  if (!selectedExperience) return null;

  const exp = selectedExperience;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[90vh]">
        {/* Top Header Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <img src={exp.imagen_url} alt={exp.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedExperience(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category & AR Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-slate-900 shadow-xs">
              {exp.categoria}
            </span>
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-xs">
              <Camera className="w-3.5 h-3.5" /> RA Disponible
            </span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-indigo-200 font-bold mb-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {exp.ubicacion_nombre}, {exp.ciudad_creativa}
            </div>
            <h1 className="text-xl sm:text-2xl font-black leading-tight">{exp.titulo}</h1>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Key Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Calificación</span>
              <span className="text-slate-900 font-bold text-sm flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {exp.rating}
              </span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Duración</span>
              <span className="text-slate-900 font-bold text-sm flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> {exp.duracion}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Dificultad</span>
              <span className="text-slate-900 font-bold text-sm">{exp.dificultad || 'Fácil'}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-slate-900 font-bold text-sm">Sobre esta experiencia</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{exp.descripcion}</p>
          </div>

          {/* Host Info Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {exp.anfitrion_avatar && (
                  <img
                    src={exp.anfitrion_avatar}
                    alt={exp.anfitrion_nombre}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/30"
                  />
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-900 font-bold text-sm">{exp.anfitrion_nombre}</span>
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-slate-500 text-xs">Anfitrión Local Verificado</span>
                </div>
              </div>

              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-md border border-indigo-100">
                Reserva Directa
              </span>
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-2">
            <h3 className="text-stone-900 font-bold text-sm">¿Qué incluye?</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exp.incluye.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200/60">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-stone-200/80 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-stone-500 font-medium block">Precio total:</span>
            <span className="text-stone-900 text-2xl font-black">${exp.precio} {exp.moneda}</span>
            <span className="text-[10px] text-stone-400 block">/ persona</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveScreen('ar_navigation');
                setSelectedExperience(exp);
              }}
              className="px-3.5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 border border-stone-300 transition-colors"
              title="Abrir simulación de Realidad Aumentada"
            >
              <Camera className="w-4 h-4 text-emerald-700" /> RA
            </button>

            <button
              id="btn-open-booking-modal"
              onClick={() => {
                setActiveBookingExperience(exp);
                setSelectedExperience(null);
              }}
              className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold flex items-center gap-2 shadow-lg transition-all"
            >
              <Calendar className="w-4 h-4" /> Reservar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
