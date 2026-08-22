/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - In-App Chat & Messaging Inbox (Turista & Anfitrión)
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, ChatThread } from '../types';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import {
  MessageSquare,
  Send,
  Search,
  Check,
  CheckCheck,
  Phone,
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  User,
  ShieldCheck,
  Info,
  ExternalLink,
  Smile,
  Paperclip,
} from 'lucide-react';

const QUICK_PROMPTS_TURISTA = [
  '¿A qué hora nos encontramos en el punto de partida?',
  '¿Qué tipo de calzado y ropa recomiendan llevar?',
  '¿Tienen estacionamiento seguro en el lugar?',
  '¿Hay opciones vegetarianas o adaptaciones especiales?',
];

const QUICK_PROMPTS_ANFITRION = [
  '¡Hola! Tu reserva está confirmada y el equipo listo.',
  'Te esperamos puntualmente en el punto de encuentro.',
  'Recuerda traer agua fresca y protector solar.',
  'Cualquier cambio de horario avísanos con anticipación.',
];

export const MessagesView: React.FC = () => {
  const {
    chatThreads,
    activeThreadId,
    setActiveThreadId,
    sendChatMessage,
    markThreadAsRead,
    userRole,
    user,
    setActiveScreen,
    setSelectedExperience,
    experiences,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');
  const [showMobileList, setShowMobileList] = useState(!activeThreadId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active thread lookup
  const activeThread = chatThreads.find(t => t.id_hilo === activeThreadId) || chatThreads[0] || null;

  // Auto mark active thread as read
  useEffect(() => {
    if (activeThread) {
      markThreadAsRead(activeThread.id_hilo);
    }
  }, [activeThread?.id_hilo, activeThread?.mensajes.length]);

  // Scroll to bottom of message list on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.mensajes]);

  // Filter threads by search query and unread status
  const filteredThreads = chatThreads.filter(thread => {
    const isAnfitrion = userRole === UserRole.ANFITRION;
    const name = isAnfitrion ? thread.turista_nombre : thread.anfitrion_nombre;
    const title = thread.exp_titulo || '';
    const lastMsg = thread.ultimo_mensaje || '';
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      q === '' ||
      name.toLowerCase().includes(q) ||
      title.toLowerCase().includes(q) ||
      lastMsg.toLowerCase().includes(q);

    const unreadCount = isAnfitrion
      ? thread.mensajes_no_leidos_anfitrion
      : thread.mensajes_no_leidos_turista;

    const matchesUnread = filterMode === 'all' || unreadCount > 0;

    return matchesSearch && matchesUnread;
  });

  const handleSend = (textToSend?: string) => {
    const msg = textToSend || inputText;
    if (!msg.trim() || !activeThread) return;
    sendChatMessage(activeThread.id_hilo, msg);
    if (!textToSend) setInputText('');
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    markThreadAsRead(threadId);
    setShowMobileList(false);
  };

  // Associated experience lookup
  const linkedExperience = activeThread?.id_exp
    ? experiences.find(e => e.id_exp === activeThread.id_exp)
    : null;

  const isAnfitrion = userRole === UserRole.ANFITRION;

  return (
    <div className="min-h-screen bg-[#FFF8F1] pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E5E0] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#23404A] font-outfit">
                {isAnfitrion ? 'Bandeja de Mensajes del Anfitrión' : 'Bandeja de Mensajes'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-100 text-[#FF6B35]">
                {isAnfitrion ? 'Modo Anfitrión' : 'Modo Turista'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-manrope">
              {isAnfitrion
                ? 'Comunícate en tiempo real con los viajeros interesados en tus experiencias comunitarias.'
                : 'Chatea directamente con tus guías y maestros artesanos locales en Nicaragua.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveScreen('explore')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#23404A] rounded-full text-xs font-bold font-outfit transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Compass className="w-4 h-4 text-[#FF6B35]" />
          Explorar Experiencias
        </button>
      </div>

      {/* Main Chat Interface: 2-Column Split View */}
      <div className="bg-white rounded-3xl border border-[#E8E5E0] shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px] max-h-[820px]">
        {/* Left Column: Conversations List */}
        <div
          className={`md:col-span-4 lg:col-span-4 border-r border-[#E8E5E0] flex flex-col bg-stone-50/50 ${
            !showMobileList ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* List Search & Filter Bar */}
          <div className="p-4 border-b border-[#E8E5E0] bg-white space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar conversación o ruta..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-100 border border-transparent rounded-full text-xs font-manrope text-[#23404A] focus:bg-white focus:border-[#FF6B35] focus:outline-hidden transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold font-outfit transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-[#23404A] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Todos ({chatThreads.length})
              </button>
              <button
                onClick={() => setFilterMode('unread')}
                className={`px-3 py-1 rounded-full text-xs font-bold font-outfit transition-all cursor-pointer ${
                  filterMode === 'unread'
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                No leídos
              </button>
            </div>
          </div>

          {/* Conversations Scrollable Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-xs font-bold text-stone-600 font-outfit">
                  No hay conversaciones {filterMode === 'unread' ? 'no leídas' : ''}
                </p>
                <p className="text-[11px] text-stone-400 font-manrope">
                  {isAnfitrion
                    ? 'Cuando los viajeros consulten tus actividades, aparecerán aquí.'
                    : 'Contacta anfitriones desde cualquier experiencia para iniciar un chat.'}
                </p>
              </div>
            ) : (
              filteredThreads.map(thread => {
                const isSelected = activeThread?.id_hilo === thread.id_hilo;
                const contactName = isAnfitrion ? thread.turista_nombre : thread.anfitrion_nombre;
                const contactAvatar = isAnfitrion ? thread.turista_avatar : thread.anfitrion_avatar;
                const unreadCount = isAnfitrion
                  ? thread.mensajes_no_leidos_anfitrion
                  : thread.mensajes_no_leidos_turista;

                return (
                  <div
                    key={thread.id_hilo}
                    onClick={() => handleSelectThread(thread.id_hilo)}
                    className={`p-3.5 sm:p-4 cursor-pointer transition-all flex items-start gap-3 select-none ${
                      isSelected
                        ? 'bg-orange-50/70 border-l-4 border-[#FF6B35]'
                        : 'hover:bg-white bg-transparent'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-stone-200 bg-stone-100">
                        {contactAvatar ? (
                          <img
                            src={contactAvatar}
                            alt={contactName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-500 font-bold bg-stone-200">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    {/* Thread Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="text-xs sm:text-sm font-extrabold text-[#23404A] font-outfit truncate">
                          {contactName}
                        </h3>
                        <span className="text-[10px] font-bold text-stone-400 font-ibm-plex shrink-0">
                          {thread.ultimo_timestamp}
                        </span>
                      </div>

                      {thread.exp_titulo && (
                        <p className="text-[10px] font-bold text-[#FF6B35] font-ibm-plex truncate mb-1">
                          🏷️ {thread.exp_titulo}
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-stone-500 font-manrope truncate line-clamp-1">
                          {thread.ultimo_mensaje || 'Conversación abierta'}
                        </p>

                        {unreadCount > 0 && (
                          <span className="shrink-0 w-5 h-5 bg-[#FF6B35] text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Stream */}
        <div
          className={`md:col-span-8 lg:col-span-8 flex flex-col bg-white ${
            showMobileList ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeThread ? (
            <>
              {/* Chat Window Header */}
              <div className="p-4 sm:p-5 border-b border-[#E8E5E0] bg-white flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  {/* Mobile Back to List Button */}
                  <button
                    onClick={() => setShowMobileList(true)}
                    className="md:hidden p-2 -ml-2 rounded-full hover:bg-stone-100 text-stone-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-stone-200 bg-stone-100">
                      {isAnfitrion ? (
                        activeThread.turista_avatar ? (
                          <img
                            src={activeThread.turista_avatar}
                            alt={activeThread.turista_nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-500 font-bold bg-stone-200">
                            <User className="w-5 h-5" />
                          </div>
                        )
                      ) : activeThread.anfitrion_avatar ? (
                        <img
                          src={activeThread.anfitrion_avatar}
                          alt={activeThread.anfitrion_nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-500 font-bold bg-stone-200">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm sm:text-base font-extrabold text-[#23404A] font-outfit">
                        {isAnfitrion ? activeThread.turista_nombre : activeThread.anfitrion_nombre}
                      </h2>
                      {!isAnfitrion && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" /> Verificado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 font-manrope">
                      {isAnfitrion ? 'Viajero registrado en Pata de Perro' : 'Anfitrión comunitario • En línea'}
                    </p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                  {linkedExperience && (
                    <button
                      onClick={() => {
                        setSelectedExperience(linkedExperience);
                      }}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-[#23404A] rounded-full text-xs font-bold font-outfit transition-colors cursor-pointer"
                      title="Ver ficha completa de la experiencia"
                    >
                      <Info className="w-3.5 h-3.5 text-[#FF6B35]" />
                      Ver Experiencia
                    </button>
                  )}

                  <a
                    href="https://wa.me/50588123456"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold font-outfit shadow-xs transition-colors"
                    title="Contactar directamente por WhatsApp"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Linked Activity Info Bar */}
              {activeThread.exp_titulo && (
                <div className="px-4 py-2.5 bg-orange-50/80 border-b border-orange-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#23404A] font-manrope truncate">
                    <span className="text-[#FF6B35]">🏷️</span>
                    <span className="text-stone-500 font-normal">Consulta sobre:</span>
                    <span className="truncate">{activeThread.exp_titulo}</span>
                  </div>
                  {linkedExperience && (
                    <button
                      onClick={() => setSelectedExperience(linkedExperience)}
                      className="text-[11px] font-bold text-[#FF6B35] hover:underline font-ibm-plex shrink-0 flex items-center gap-0.5"
                    >
                      Detalles <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Message Feed Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FFF8F1]/40">
                {/* Date separator */}
                <div className="flex items-center justify-center">
                  <span className="px-3 py-1 bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-wider rounded-full font-ibm-plex">
                    Hoy • Mensajería Segura Pata de Perro
                  </span>
                </div>

                {activeThread.mensajes.map((msg, index) => {
                  const isMe = msg.emisor_rol === userRole;

                  return (
                    <div
                      key={msg.id_mensaje || index}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                        {!isMe && msg.emisor_avatar && (
                          <img
                            src={msg.emisor_avatar}
                            alt={msg.emisor_nombre}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mb-1 border border-stone-200"
                          />
                        )}

                        <div
                          className={`p-3.5 sm:p-4 rounded-3xl shadow-xs space-y-1 ${
                            isMe
                              ? 'bg-[#23404A] text-white rounded-br-xs'
                              : 'bg-white text-stone-900 border border-stone-200 rounded-bl-xs'
                          }`}
                        >
                          {!isMe && (
                            <p className="text-[10px] font-black text-[#FF6B35] font-ibm-plex">
                              {msg.emisor_nombre}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm font-manrope leading-relaxed whitespace-pre-wrap">
                            {msg.texto}
                          </p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[10px] font-ibm-plex pt-1 ${
                              isMe ? 'text-stone-300' : 'text-stone-400'
                            }`}
                          >
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck className="w-3 h-3 text-[#FFC83D]" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Suggestions */}
              <div className="px-4 py-2 bg-white border-t border-stone-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-ibm-plex shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF6B35]" /> Sugerencias:
                </span>
                {(isAnfitrion ? QUICK_PROMPTS_ANFITRION : QUICK_PROMPTS_TURISTA).map(
                  (prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="shrink-0 px-3 py-1.5 bg-stone-50 hover:bg-orange-50 hover:border-orange-200 text-stone-700 hover:text-[#FF6B35] text-[11px] font-semibold rounded-full border border-stone-200 transition-all font-manrope cursor-pointer"
                    >
                      {prompt}
                    </button>
                  )
                )}
              </div>

              {/* Message Input Box */}
              <div className="p-3.5 sm:p-4 bg-white border-t border-[#E8E5E0]">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje al anfitrión..."
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-stone-100 border border-transparent rounded-full text-xs sm:text-sm font-manrope text-[#23404A] focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-hidden transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-11 h-11 bg-[#FF6B35] hover:bg-[#ff5518] disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0"
                    title="Enviar mensaje"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#23404A] font-outfit">
                Selecciona una conversación
              </h3>
              <p className="text-xs text-stone-500 font-manrope max-w-sm">
                Elige un anfitrión o viajero de la lista izquierda para visualizar y continuar la conversación.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
