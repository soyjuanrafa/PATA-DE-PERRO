/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Host Dashboard & Activity Management Component
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoriaExp, MoodTag, EstadoReserva } from '../types';
import {
  PlusCircle,
  Calendar,
  DollarSign,
  Star,
  ShieldCheck,
  Check,
  X,
  Camera,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const HostDashboard: React.FC = () => {
  const { experiences, reservations, addExperience, updateReservationStatus, user } = useApp();

  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);

  // Form states for new experience
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<CategoriaExp>(CategoriaExp.TIERRA);
  const [precio, setPrecio] = useState(25);
  const [ciudad, setCiudad] = useState('Masaya');
  const [recursoRaUrl, setRecursoRaUrl] = useState('https://patadeperro.ni/ar/custom_3d.gltf');
  const [imagenUrl, setImagenUrl] = useState(
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
  );

  const handleSubmitExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descripcion) return;

    addExperience({
      id_anfitrion: user ? ('id_anfitrion' in user ? user.id_anfitrion : 'anf_custom') : 'anf_01',
      anfitrion_nombre: user?.nombre || 'Anfitrión Local',
      anfitrion_avatar: user?.avatar,
      categoria,
      titulo,
      descripcion,
      precio,
      moneda: 'USD',
      ubicacion_nombre: `Ruta Creativa en ${ciudad}`,
      ciudad_creativa: ciudad,
      ubicacion_lat: 11.9744,
      ubicacion_lon: -86.0942,
      recurso_ra_url: recursoRaUrl,
      imagen_url: imagenUrl,
      duracion: '3 Horas',
      incluye: ['Guía local certificado', 'Demostración práctica', 'Materiales'],
      moods: [MoodTag.CULTURAL, MoodTag.CREATIVO],
    });

    setIsAddingModalOpen(false);
    setTitulo('');
    setDescripcion('');
  };

  const totalEarnings = reservations.reduce((acc, r) => acc + r.monto_total, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full w-fit">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Panel de Anfitrión Comunitario
          </div>
          <h1 className="text-slate-900 text-2xl sm:text-3xl font-black tracking-tight pt-2">
            Gestión de Experiencias
          </h1>
        </div>

        <button
          id="btn-host-publish-exp"
          onClick={() => setIsAddingModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publicar Nueva Experiencia</span>
        </button>
      </div>

      {/* Host Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 text-xs font-medium block uppercase tracking-wider">Ingresos Estimados</span>
            <span className="text-slate-900 text-2xl font-black">${totalEarnings} USD</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 text-xs font-medium block uppercase tracking-wider">Reservas Agendadas</span>
            <span className="text-slate-900 text-2xl font-black">{reservations.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 text-xs font-medium block uppercase tracking-wider">Calificación Anfitrión</span>
            <span className="text-slate-900 text-2xl font-black flex items-center gap-1">
              4.92 <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </span>
          </div>
        </div>
      </div>

      {/* Reservations Agenda Table */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-slate-900 text-base font-bold tracking-tight flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" /> Agenda de Reservaciones
        </h2>

        {reservations.length === 0 ? (
          <p className="text-slate-500 text-xs italic py-4 text-center">
            Aún no tienes reservaciones registradas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="pb-3">Código</th>
                  <th className="pb-3">Turista</th>
                  <th className="pb-3">Actividad</th>
                  <th className="pb-3">Fecha</th>
                  <th className="pb-3">Personas</th>
                  <th className="pb-3">Monto</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {reservations.map(res => (
                  <tr key={res.id_reserva} className="hover:bg-slate-50">
                    <td className="py-3 font-mono font-bold text-slate-900">{res.codigo_confirmacion}</td>
                    <td className="py-3 font-bold text-slate-900">{res.turista_nombre}</td>
                    <td className="py-3 text-slate-700 truncate max-w-[150px]">{res.exp_titulo}</td>
                    <td className="py-3 text-slate-600">{res.fecha_reserva}</td>
                    <td className="py-3 text-slate-800">{res.personas} pers.</td>
                    <td className="py-3 font-black text-slate-900">${res.monto_total} USD</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                          res.estado_reserva === EstadoReserva.CONFIRMADA
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : res.estado_reserva === EstadoReserva.CANCELADA
                            ? 'bg-rose-50 text-rose-700 border-rose-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}
                      >
                        {res.estado_reserva}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {res.estado_reserva === EstadoReserva.CONFIRMADA && (
                        <button
                          onClick={() => updateReservationStatus(res.id_reserva, EstadoReserva.CANCELADA)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100"
                          title="Cancelar Reserva"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-slate-900 font-bold text-lg">Publicar Nueva Experiencia</h2>
              <button onClick={() => setIsAddingModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitExperience} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Título de la Experiencia</label>
                <input
                  id="input-host-exp-title"
                  type="text"
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Ej: Ruta del Café Orgánico y Leyendas"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Categoría Principal</label>
                <select
                  value={categoria}
                  onChange={e => setCategoria(e.target.value as CategoriaExp)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 font-medium"
                >
                  <option value={CategoriaExp.TIERRA}>Tierra</option>
                  <option value={CategoriaExp.AGUA}>Agua</option>
                  <option value={CategoriaExp.AIRE}>Aire</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Ciudad Creativa Base</label>
                <input
                  type="text"
                  value={ciudad}
                  onChange={e => setCiudad(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Precio ($ USD)</label>
                  <input
                    type="number"
                    value={precio}
                    onChange={e => setPrecio(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 font-medium"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Modelo 3D RA (GLTF)</label>
                  <input
                    type="text"
                    value={recursoRaUrl}
                    onChange={e => setRecursoRaUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 font-medium truncate"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Descripción Detallada</label>
                <textarea
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  rows={3}
                  placeholder="Describe qué vivirá el turista, historia local e itinerario..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 font-medium"
                  required
                />
              </div>

              <button
                id="btn-submit-host-exp"
                type="submit"
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg transition-all uppercase tracking-wide text-sm"
              >
                Guardar y Publicar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
