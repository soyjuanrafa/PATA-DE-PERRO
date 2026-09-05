/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Booking Modal Component with WhatsApp Integration & Brand Guidelines
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import { Calendar, Users, X, CheckCircle, MessageSquare, ShieldCheck } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    activeBookingExperience,
    setActiveBookingExperience,
    createReservation,
    setActiveScreen,
    openOrCreateChatThread,
  } = useApp();

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
    <div className="fixed inset-0 z-50 bg-[#162A31]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFF8F1] rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-[#E8E5E0] space-y-5 text-[#23404A] max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between border-b border-[#E8E5E0] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#FFEADB] text-[#FF6B35] rounded-xl border border-[#FF6B35]/30">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-[#23404A] font-extrabold text-lg sm:text-xl font-outfit">Confirmar Reserva</h2>
          </div>

          <button
            onClick={() => {
              setActiveBookingExperience(null);
              setCompletedCode(null);
            }}
            className="p-1.5 text-[#9A9A9A] hover:text-[#23404A] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!completedCode ? (
          <form onSubmit={handleConfirm} className="space-y-4">
            {/* Activity Summary */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E8E5E0] shadow-xs">
              <img
                src={resolveImageUrl(exp.imagen_url)}
                onError={e => handleImageFallback(e, exp.imagen_url)}
                alt={exp.titulo}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div>
                <h3 className="text-[#23404A] text-xs font-bold line-clamp-1 font-outfit">{exp.titulo}</h3>
                <p className="text-[#9A9A9A] text-[11px] font-manrope">{exp.ubicacion_nombre}</p>
                <span className="text-[#FF6B35] text-xs font-extrabold font-outfit">${exp.precio} / persona</span>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">Fecha de la Actividad</label>
              <input
                id="input-booking-date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
              />
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">Número de Personas</label>
              <div className="flex items-center justify-between bg-white p-2 rounded-full border border-[#E8E5E0]">
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-9 h-9 rounded-full bg-[#FFF8F1] hover:bg-[#FFEADB] font-bold text-base text-[#23404A] transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="font-extrabold text-[#23404A] text-sm font-outfit">{guests} Personas</span>
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                  className="w-9 h-9 rounded-full bg-[#FFF8F1] hover:bg-[#FFEADB] font-bold text-base text-[#23404A] transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-4 bg-[#FFEADB] rounded-2xl border border-[#FF6B35]/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#23404A] font-bold block font-manrope">Monto Total a Pagar</span>
                <span className="text-[10px] text-[#FF6B35] font-semibold font-ibm-plex">Sin comisiones ocultas</span>
              </div>
              <span className="text-[#23404A] text-2xl font-extrabold font-outfit">${totalPrice} USD</span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveBookingExperience(null);
                  setCompletedCode(null);
                }}
                className="w-1/3 py-3.5 bg-stone-200/80 hover:bg-stone-300 text-stone-700 font-bold rounded-full transition-colors text-xs font-outfit cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-reservation-submit"
                type="submit"
                className="w-2/3 py-3.5 bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold rounded-full shadow-md transition-all text-xs uppercase tracking-wider font-outfit cursor-pointer"
              >
                Confirmar y Agendar
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State with WhatsApp Button */
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 bg-[#E3F4EB] text-[#3FAF6C] border border-[#3FAF6C]/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-[#23404A] font-extrabold text-2xl font-outfit">¡Reserva Generada!</h3>
              <p className="text-[#9A9A9A] text-xs mt-1 font-manrope">
                Código de confirmación exclusivo:
              </p>
              <span className="inline-block my-2 px-5 py-2 bg-[#23404A] text-[#FFC83D] font-mono font-bold text-lg rounded-full tracking-wider">
                {completedCode}
              </span>
            </div>

            {/* WhatsApp Integration Button */}
            <div className="p-4 bg-white rounded-2xl border border-[#E8E5E0] text-left space-y-2 shadow-xs">
              <p className="text-xs text-[#162A31]/80 font-medium font-manrope">
                Conecta directamente con <span className="font-bold text-[#23404A]">{exp.anfitrion_nombre}</span> vía WhatsApp para coordinar punto de encuentro y detalles:
              </p>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-md transition-all text-xs font-outfit cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" /> Abrir en WhatsApp Externo
              </a>

              <button
                type="button"
                onClick={() => {
                  openOrCreateChatThread(
                    exp,
                    exp.id_anfitrion,
                    exp.anfitrion_nombre,
                    `¡Hola ${exp.anfitrion_nombre}! Acabo de reservar "${exp.titulo}" (Código: ${completedCode}) para el ${date} con ${guests} personas.`
                  );
                  setActiveBookingExperience(null);
                  setCompletedCode(null);
                }}
                className="w-full py-3 bg-[#23404A] hover:bg-[#162A31] text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-md transition-all text-xs font-outfit cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#FF6B35]" /> Chatear en la App (Estilo WhatsApp)
              </button>
            </div>

            <button
              onClick={() => {
                setActiveBookingExperience(null);
                setCompletedCode(null);
                setActiveScreen('reservations');
              }}
              className="w-full py-3 bg-white hover:bg-[#FFF8F1] text-[#23404A] text-xs font-bold rounded-full border border-[#E8E5E0] transition-colors font-outfit cursor-pointer"
            >
              Ver Mis Reservas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
