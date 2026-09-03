/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Tourist Reservations Manager Component
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, MessageSquare, MapPin, CheckCircle, Clock, ShieldCheck, X, Compass, Phone, ArrowLeft, Mail } from 'lucide-react';
import { EstadoReserva } from '../types';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';

export const ReservationsView: React.FC = () => {
  const {
    reservations,
    updateReservationStatus,
    setActiveScreen,
    openOrCreateChatThread,
    experiences,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#FFF8F1] pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Back navigation */}
      <div className="flex items-center justify-between">
        <button
          id="btn-reservations-back"
          onClick={() => setActiveScreen('explore')}
          className="flex items-center gap-2 text-xs font-bold text-[#23404A] hover:text-[#FF6B35] bg-white px-3.5 py-1.5 rounded-full border border-[#E8E5E0] shadow-2xs transition-all font-manrope cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E5E0] shadow-xs">
        <div>
          <span className="bg-orange-50 border border-orange-100 text-[#FF6B35] text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full font-ibm-plex">
            Itinerario & Reservas
          </span>
          <h1 className="text-[#23404A] text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight pt-1.5">
            Mis Reservas y Agendas
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm font-manrope">
            Consulta el estado de tus actividades comunitarias y comunícate directamente con tus anfitriones.
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('explore')}
          className="bg-[#23404A] hover:bg-[#1a323a] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-xs transition-colors flex items-center gap-2 font-outfit cursor-pointer self-start sm:self-auto"
        >
          <Compass className="w-4 h-4 text-[#FFC83D]" />
          Explorar Más Rutas
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-[#E8E5E0] text-center space-y-4 max-w-md mx-auto shadow-xs">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="text-[#23404A] font-extrabold text-lg font-outfit">No tienes reservas activas</h2>
          <p className="text-stone-500 text-xs font-manrope">
            Explora el catálogo de Ciudades Creativas de Nicaragua y conecta directamente con artesanos y guías locales.
          </p>
          <button
            onClick={() => setActiveScreen('explore')}
            className="px-6 py-2.5 bg-[#FF6B35] hover:bg-[#ff5514] text-white rounded-full text-xs font-bold uppercase tracking-wider font-outfit shadow-md transition-colors cursor-pointer"
          >
            Descubrir Experiencias
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map(res => {
            const targetExp = experiences.find(e => e.id_exp === res.id_exp);

            return (
              <div
                key={res.id_reserva}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E5E0] shadow-xs space-y-4 flex flex-col justify-between hover:border-[#FF6B35]/30 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#23404A] text-[#FFC83D] font-ibm-plex font-bold text-xs px-3 py-1 rounded-full">
                      Cód: {res.codigo_confirmacion}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase font-ibm-plex ${
                        res.estado_reserva === EstadoReserva.CONFIRMADA
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : res.estado_reserva === EstadoReserva.COMPLETADA
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {res.estado_reserva}
                    </span>
                  </div>

                  <div className="flex gap-4 items-center">
                    {res.exp_imagen && (
                      <img
                        src={resolveImageUrl(res.exp_imagen)}
                        onError={e => handleImageFallback(e, res.exp_imagen)}
                        alt={res.exp_titulo}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-stone-100 shadow-xs"
                      />
                    )}
                    <div className="space-y-1">
                      <h3 className="text-[#23404A] font-extrabold text-sm sm:text-base leading-snug font-outfit">
                        {res.exp_titulo}
                      </h3>
                      <p className="text-stone-500 text-xs flex items-center gap-1 font-manrope">
                        <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" /> {res.exp_ciudad}
                      </p>
                      <p className="text-stone-700 text-xs flex items-center gap-1 font-medium font-ibm-plex">
                        <Calendar className="w-3.5 h-3.5 text-[#23404A]" /> {res.fecha_reserva} • {res.personas} persona(s)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#E8E5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase block font-ibm-plex">
                      Monto Pagado
                    </span>
                    <span className="text-[#FF6B35] font-extrabold text-xl font-outfit">
                      ${res.monto_total} USD
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* In-App Chat */}
                    <button
                      onClick={() => {
                        openOrCreateChatThread(
                          targetExp,
                          undefined,
                          undefined,
                          `¡Hola! Te escribo con respecto a mi reserva #${res.codigo_confirmacion} para "${res.exp_titulo}".`
                        );
                      }}
                      className="px-3.5 py-2 bg-[#FF6B35]/10 hover:bg-[#FF6B35] text-[#FF6B35] hover:text-white rounded-full text-xs font-bold font-outfit flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat en App
                    </button>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/50588123456?text=${encodeURIComponent(
                        `¡Hola! Consulta sobre mi reserva ${res.codigo_confirmacion} de "${res.exp_titulo}".`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold font-outfit flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>

                    {/* Google Workspace */}
                    <button
                      onClick={() => setActiveScreen('workspace')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold font-outfit flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Enviar comprobante por Gmail o exportar a Google Docs"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#2E9D62]" />
                      Gmail & Docs
                    </button>

                    {res.estado_reserva === EstadoReserva.CONFIRMADA && (
                      <button
                        onClick={() => updateReservationStatus(res.id_reserva, EstadoReserva.CANCELADA)}
                        className="px-3 py-2 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 rounded-full text-xs font-bold font-outfit transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

