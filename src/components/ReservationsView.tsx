/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Tourist Reservations Manager Component
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, MessageSquare, MapPin, CheckCircle, Clock, ShieldCheck, X } from 'lucide-react';
import { EstadoReserva } from '../types';

export const ReservationsView: React.FC = () => {
  const { reservations, updateReservationStatus, setActiveScreen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Turista Comunitario
          </span>
          <h1 className="text-slate-900 text-2xl sm:text-3xl font-black tracking-tight pt-1">
            Mis Reservas y Agendas
          </h1>
        </div>

        <button
          onClick={() => setActiveScreen('explore')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          Explorar Más
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-xl p-10 border border-slate-200 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-slate-900 font-bold text-lg">No tienes reservas activas</h2>
          <p className="text-slate-500 text-xs">
            Explora el catálogo de Ciudades Creativas de Nicaragua y conecta directamente con anfitriones locales.
          </p>
          <button
            onClick={() => setActiveScreen('explore')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium uppercase tracking-wider shadow-xs transition-colors"
          >
            Descubrir Experiencias
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map(res => (
            <div
              key={res.id_reserva}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-slate-900 text-indigo-300 font-mono font-bold text-xs px-3 py-1 rounded-md">
                    {res.codigo_confirmacion}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-md text-xs font-bold uppercase border ${
                      res.estado_reserva === EstadoReserva.CONFIRMADA
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}
                  >
                    {res.estado_reserva}
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  {res.exp_imagen && (
                    <img
                      src={res.exp_imagen}
                      alt={res.exp_titulo}
                      className="w-20 h-20 rounded-lg object-cover shrink-0 border border-slate-100"
                    />
                  )}
                  <div className="space-y-1">
                    <h3 className="text-slate-900 font-bold text-sm leading-snug">{res.exp_titulo}</h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {res.exp_ciudad}
                    </p>
                    <p className="text-slate-600 text-xs flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" /> {res.fecha_reserva} • {res.personas} pers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-slate-900 font-black text-lg">
                  ${res.monto_total} USD
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/50588123456?text=${encodeURIComponent(
                      `Hola! Consulta sobre mi reserva ${res.codigo_confirmacion} de ${res.exp_titulo}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </a>

                  {res.estado_reserva === EstadoReserva.CONFIRMADA && (
                    <button
                      onClick={() => updateReservationStatus(res.id_reserva, EstadoReserva.CANCELADA)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
