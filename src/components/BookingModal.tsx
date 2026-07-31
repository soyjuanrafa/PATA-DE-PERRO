/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Booking Modal Component with WhatsApp Integration
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Users, X, CheckCircle, MessageSquare, ShieldCheck } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { activeBookingExperience, setActiveBookingExperience, createReservation, setActiveScreen } = useApp();

  const [date, setDate] = useState('2026-08-15');
  const [guests, setGuests] = useState(2);
  const [completedCode, setCompletedCode] = useState<string | null>(null);

  if (!activeBookingExperience) return null;

  const exp = activeBookingExperience;
  const totalPrice = exp.precio * guests;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createReservation(exp, date, guests);
    if (created) {
      setCompletedCode(created.codigo_confirmacion);
    }
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `¡Hola ${exp.anfitrion_nombre}! Me gustaría confirmar mi reserva de "${exp.titulo}" para ${guests} personas el día ${date}. Mi código de reserva Pata de Perro es: ${completedCode}.`
    );
    return `https://wa.me/50588123456?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-6 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-slate-900 font-bold text-lg">Confirmar Reserva</h2>
          </div>

          <button
            onClick={() => {
              setActiveBookingExperience(null);
              setCompletedCode(null);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!completedCode ? (
          <form onSubmit={handleConfirm} className="space-y-4">
            {/* Activity Summary */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <img src={exp.imagen_url} alt={exp.titulo} className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div>
                <h3 className="text-slate-900 text-xs font-bold line-clamp-1">{exp.titulo}</h3>
                <p className="text-slate-500 text-[11px]">{exp.ubicacion_nombre}</p>
                <span className="text-indigo-600 text-xs font-bold">${exp.precio} / persona</span>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de la Actividad</label>
              <input
                id="input-booking-date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Número de Personas</label>
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-9 h-9 rounded-md bg-slate-100 hover:bg-slate-200 font-bold text-base text-slate-800 transition-colors"
                >
                  -
                </button>
                <span className="font-bold text-slate-900 text-sm">{guests} Personas</span>
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                  className="w-9 h-9 rounded-md bg-slate-100 hover:bg-slate-200 font-bold text-base text-slate-800 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-900 font-semibold block">Monto Total a Pagar</span>
                <span className="text-[10px] text-indigo-600">Sin comisiones ocultas</span>
              </div>
              <span className="text-slate-900 text-2xl font-black">${totalPrice} USD</span>
            </div>

            <button
              id="btn-confirm-reservation-submit"
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-xs transition-colors text-xs uppercase tracking-wider"
            >
              Confirmar y Agendar
            </button>
          </form>
        ) : (
          /* Confirmation State with WhatsApp Button */
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-slate-900 font-bold text-xl">¡Reserva Generada!</h3>
              <p className="text-slate-500 text-xs mt-1">
                Código de confirmación exclusivo:
              </p>
              <span className="inline-block my-2 px-4 py-1.5 bg-slate-900 text-indigo-300 font-mono font-bold text-lg rounded-lg tracking-wider">
                {completedCode}
              </span>
            </div>

            {/* WhatsApp Integration Button */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
              <p className="text-xs text-slate-600 font-medium">
                Conecta directamente con <span className="font-bold text-slate-900">{exp.anfitrion_nombre}</span> vía WhatsApp para coordinar punto de encuentro y detalles:
              </p>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors text-xs"
              >
                <MessageSquare className="w-4 h-4" /> Contactar Anfitrión en WhatsApp
              </a>
            </div>

            <button
              onClick={() => {
                setActiveBookingExperience(null);
                setCompletedCode(null);
                setActiveScreen('reservations');
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
            >
              Ver Mis Reservas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
