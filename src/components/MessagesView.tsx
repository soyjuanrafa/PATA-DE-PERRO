/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Native Messaging & Community Chat System
 * Branded in authentic Nicaraguan cultural palette (Teal, Terracotta, Ochre, Cream)
 * Fully Responsive for Mobile, Tablet, and Desktop Devices
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { UserRole, ChatThread, ChatMessage } from '../types';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import {
  MessageSquare,
  Send,
  Search,
  Check,
  CheckCheck,
  Phone,
  Video,
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
  Mic,
  MicOff,
  MoreVertical,
  Image as ImageIcon,
  FileText,
  Trash2,
  Play,
  Pause,
  Volume2,
  X,
  Lock,
  ChevronRight,
  ThumbsUp,
  Heart,
  Flame,
  Laugh,
  CheckCircle2,
  PhoneCall,
  PhoneOff,
  VideoOff,
} from 'lucide-react';

const QUICK_PROMPTS_TURISTA = [
  '¿A qué hora nos encontramos en el punto de partida?',
  '¿Qué tipo de calzado y ropa recomiendan llevar?',
  '¿Tienen estacionamiento seguro en el lugar?',
  '¿Hay opciones vegetarianas o adaptaciones especiales?',
];

const QUICK_PROMPTS_ANFITRION = [
  '¡Hola! Tu reserva está confirmada y el taller listo.',
  'Te esperamos puntualmente en el punto de encuentro.',
  'Recuerda traer ropa cómoda y agua fresca.',
  'Cualquier cambio de horario avísanos con anticipación.',
];

const EMOJI_LIST = [
  '🐶', '🌋', '🍫', '☕', '🎨', '🏖️', '🚣‍♂️', '🌿',
  '🇳🇮', '✨', '👍', '❤️', '🔥', '🙌', '😊', '🎉',
  '☀️', '🎒', '📸', '🗺️', '📍', '⭐', '🤝', '👋',
];

export const MessagesView: React.FC = () => {
  const {
    chatThreads,
    activeThreadId,
    setActiveThreadId,
    sendChatMessage,
    reactToMessage,
    deleteMessage,
    markThreadAsRead,
    userRole,
    user,
    setActiveScreen,
    setSelectedExperience,
    setActiveBookingExperience,
    experiences,
    showToast,
    statusNotes,
    updateSelfNote,
    setActiveStoryExperience,
  } = useApp();

  const { t } = useTranslation();

  // Navigation & filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [inChatSearch, setInChatSearch] = useState('');
  const [showInChatSearch, setShowInChatSearch] = useState(false);
  const [inputText, setInputText] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'routes' | 'general' | 'requests'>('all');
  const [showMobileList, setShowMobileList] = useState(!activeThreadId);
  const [showContactDetails, setShowContactDetails] = useState(false);

  // Status Note Editor State (Instagram Direct Notes)
  const [isEditingSelfNote, setIsEditingSelfNote] = useState(false);
  const selfNote = statusNotes.find(n => n.isSelf);
  const [noteInputText, setNoteInputText] = useState(selfNote?.noteText || '');
  const [noteEmoji, setNoteEmoji] = useState(selfNote?.emoji || '🐾');

  // Popovers & Interactive Features
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  // Simulated Voice Recording
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Audio Playback simulation
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Simulated Voice & Video Calls
  const [activeCallType, setActiveCallType] = useState<'voice' | 'video' | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<any>(null);
  const callTimerRef = useRef<any>(null);

  // Active thread lookup
  const activeThread = chatThreads.find(t => t.id_hilo === activeThreadId) || chatThreads[0] || null;

  // Auto mark active thread as read
  useEffect(() => {
    if (activeThread) {
      markThreadAsRead(activeThread.id_hilo);
    }
  }, [activeThread?.id_hilo, activeThread?.mensajes.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.mensajes.length]);

  // Audio recording timer loop
  useEffect(() => {
    if (isRecordingAudio) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecordingAudio]);

  // Call timer loop
  useEffect(() => {
    if (activeCallType) {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [activeCallType]);

  const isAnfitrion = userRole === UserRole.ANFITRION;

  // Filter threads by search and mode
  const filteredThreads = chatThreads.filter(t => {
    const contactName = isAnfitrion ? t.turista_nombre : t.anfitrion_nombre;
    const expTitle = t.exp_titulo || '';
    const lastMsg = t.ultimo_mensaje || '';

    const matchesSearch =
      contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMsg.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'unread') {
      const unreadCount = isAnfitrion
        ? t.mensajes_no_leidos_anfitrion || 0
        : t.mensajes_no_leidos_turista || 0;
      return unreadCount > 0;
    }

    if (filterMode === 'routes') {
      return Boolean(t.id_exp);
    }

    return true;
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    sendChatMessage(activeThread.id_hilo, inputText);
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleSendVoiceNote = () => {
    if (!activeThread) return;
    setIsRecordingAudio(false);

    const seconds = recordingSeconds || 4;
    const durationStr = `0:${seconds < 10 ? '0' : ''}${seconds}`;

    sendChatMessage(activeThread.id_hilo, `Nota de voz (${durationStr})`, {
      tipo: 'audio',
      audio_duracion: durationStr,
    });
    showToast('Nota de voz enviada.');
  };

  const handleSendImage = (presetImgUrl: string) => {
    if (!activeThread) return;
    setShowAttachmentMenu(false);

    sendChatMessage(activeThread.id_hilo, 'Foto compartida del recorrido', {
      tipo: 'foto',
      media_url: presetImgUrl,
    });
    showToast('Foto compartida.');
  };

  const handleToggleAudioPlay = (msgId: string) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(msgId);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 4000);
    }
  };

  // Associated experience lookup
  const linkedExperience = activeThread?.id_exp
    ? experiences.find(e => e.id_exp === activeThread.id_exp)
    : null;

  // Filter in-chat messages if search is active
  const displayedMessages = activeThread?.mensajes.filter(m => {
    if (!showInChatSearch || !inChatSearch.trim()) return true;
    return m.texto.toLowerCase().includes(inChatSearch.toLowerCase());
  }) || [];

  const contactName = activeThread
    ? isAnfitrion
      ? activeThread.turista_nombre
      : activeThread.anfitrion_nombre
    : '';

  const contactAvatar = activeThread
    ? isAnfitrion
      ? activeThread.turista_avatar
      : activeThread.anfitrion_avatar
    : '';

  return (
    <div className="w-full h-[calc(100dvh-4rem)] max-w-7xl mx-auto p-0 sm:p-3 lg:p-4 flex flex-col min-h-0 overflow-hidden">
      {/* Main Messaging Container with Native Pata de Perro Styling */}
      <div className="bg-white sm:rounded-3xl sm:border border-[#E8E5E0] shadow-sm overflow-hidden flex flex-1 min-h-0 w-full">
        {/* Main Grid: Left Conversation List | Center Conversation | Optional Right Details */}
        <div className="flex-1 flex overflow-hidden relative min-h-0 w-full">

          {/* ========================================================================= */}
          {/* LEFT COLUMN: CONVERSATION THREADS LIST                                    */}
          {/* ========================================================================= */}
          <div
            className={`w-full md:w-[320px] lg:w-[360px] shrink-0 border-r border-[#E8E5E0] bg-[#FAF8F5] flex flex-col z-10 transition-all ${
              !showMobileList ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Native Brand Header Bar */}
            <div className="p-3 sm:p-4 bg-[#23404A] text-white flex items-center justify-between gap-3 shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => setActiveScreen(isAnfitrion ? 'host_dashboard' : 'explore')}
                  className="p-1.5 -ml-1 rounded-full hover:bg-white/10 text-white/90 transition-colors cursor-pointer"
                  title="Volver"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="relative shrink-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white/40 bg-[#162A31]">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-[#23404A] rounded-full" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xs sm:text-sm font-extrabold font-outfit leading-tight text-white truncate">
                    Mensajes
                  </h2>
                  <p className="text-[10px] text-[#FFC83D] font-ibm-plex truncate">
                    {isAnfitrion ? 'Perfil Anfitrión' : 'Perfil Turista'}
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setFilterMode(filterMode === 'unread' ? 'all' : 'unread')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    filterMode === 'unread' ? 'bg-[#FF6B35] text-white' : 'hover:bg-white/10 text-white/90'
                  }`}
                  title="Filtrar mensajes no leídos"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 1. Well-Squared Search Bar */}
            <div className="p-2.5 sm:p-3 bg-white border-b border-stone-200 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('explore.searchPlaceholder', 'Buscar conversación o lugar...')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 bg-[#F4F1EA] border border-transparent rounded-xl text-xs font-manrope text-[#23404A] placeholder-stone-400 focus:bg-white focus:border-[#FF5722] focus:outline-hidden transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Well-Squared Instagram Direct Status Notes Reel */}
            <div className="px-3 bg-[#FAF7F2] border-b border-stone-200/90 shrink-0">
              <div className="flex items-center gap-3.5 overflow-x-auto pt-4 pb-2 scrollbar-none">
                {/* User own status note bubble */}
                <div className="flex flex-col items-center shrink-0 group relative">
                  {/* Floating Speech Bubble for Note */}
                  <button
                    type="button"
                    onClick={() => setIsEditingSelfNote(true)}
                    className="absolute -top-3 z-10 max-w-[80px] bg-white border border-stone-200 shadow-sm px-2 py-0.5 rounded-2xl text-[9.5px] font-bold text-stone-800 truncate hover:scale-105 transition-transform cursor-pointer"
                  >
                    {selfNote?.noteText ? (
                      <span className="truncate block">
                        {selfNote.emoji} {selfNote.noteText}
                      </span>
                    ) : (
                      <span className="text-[#FF5722] font-black">+ Tu nota</span>
                    )}
                  </button>

                  {/* Avatar with gradient ring */}
                  <button
                    type="button"
                    onClick={() => setIsEditingSelfNote(true)}
                    className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#FF5722] to-[#FFC83D] mt-1.5 cursor-pointer hover:scale-105 transition-transform"
                    title="Toca para compartir un estado o nota"
                  >
                    <div className="w-13 h-13 rounded-full p-0.5 bg-white overflow-hidden flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.nombre}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-orange-100 flex items-center justify-center text-[#FF5722]">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-[10px] font-bold border border-white shadow-2xs">
                      +
                    </div>
                  </button>
                  <span className="text-[10px] font-bold text-stone-700 font-outfit mt-1 max-w-[65px] truncate">
                    {t('msg.yourNote', 'Tu nota')}
                  </span>
                </div>

                {/* Community Hosts Status Notes */}
                {statusNotes
                  .filter(n => !n.isSelf)
                  .map(note => (
                    <div
                      key={note.userId}
                      onClick={() => {
                        showToast(`Nota de ${note.userName}: "${note.noteText}"`);
                      }}
                      className="flex flex-col items-center shrink-0 group relative cursor-pointer"
                    >
                      {/* Floating speech bubble */}
                      <div className="absolute -top-3 z-10 max-w-[84px] bg-white border border-stone-200 shadow-sm px-2 py-0.5 rounded-2xl text-[9.5px] font-bold text-stone-800 truncate">
                        <span className="truncate block">
                          {note.emoji} {note.noteText}
                        </span>
                      </div>

                      {/* Avatar */}
                      <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#2E9D62] to-[#FFC83D] mt-1.5 group-hover:scale-105 transition-transform">
                        <div className="w-13 h-13 rounded-full p-0.5 bg-white overflow-hidden">
                          <img
                            src={note.userAvatar}
                            alt={note.userName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-stone-700 font-outfit mt-1 max-w-[65px] truncate text-center">
                        {note.userName.split(' ')[0]}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* 3. Well-Squared 4-Tab Categorization Bar */}
            <div className="p-1.5 bg-white border-b border-stone-200 shrink-0">
              <div className="grid grid-cols-4 gap-0.5 sm:gap-1 text-[9.5px] sm:text-[11px] font-bold font-outfit">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`py-1.5 px-0.5 sm:px-1 rounded-lg text-center truncate cursor-pointer transition-all ${
                    filterMode === 'all'
                      ? 'bg-[#23404A] text-white font-black shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {t('msg.principal', 'Principal')}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('general')}
                  className={`py-1.5 px-0.5 sm:px-1 rounded-lg text-center truncate cursor-pointer transition-all ${
                    filterMode === 'general'
                      ? 'bg-[#23404A] text-white font-black shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {t('msg.general', 'General')}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('requests')}
                  className={`py-1.5 px-0.5 sm:px-1 rounded-lg text-center truncate cursor-pointer transition-all ${
                    filterMode === 'requests'
                      ? 'bg-[#23404A] text-white font-black shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {t('msg.requests', 'Solicitudes')}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('routes')}
                  className={`py-1.5 px-0.5 sm:px-1 rounded-lg text-center truncate cursor-pointer transition-all ${
                    filterMode === 'routes'
                      ? 'bg-[#FF5722] text-white font-black shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {t('msg.routes', 'Rutas')}
                </button>
              </div>
            </div>

            {/* Modal / Dialog for editing own status note */}
            {isEditingSelfNote && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-stone-200 space-y-3.5 animate-scale-up">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-stone-900 font-outfit">
                      {t('msg.shareNote', 'Compartir una nota')}
                    </h3>
                    <button
                      onClick={() => setIsEditingSelfNote(false)}
                      className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-500 font-manrope">
                    {t(
                      'msg.shareNoteDesc',
                      'Escribe lo que estás haciendo o pensando. Tus anfitriones y amigos lo verán durante 24 horas.'
                    )}
                  </p>

                  <div className="flex items-center gap-2">
                    <select
                      value={noteEmoji}
                      onChange={e => setNoteEmoji(e.target.value)}
                      className="text-lg bg-stone-100 rounded-xl px-2 py-1.5 border border-stone-200"
                    >
                      {['🐾', '🌋', '🎨', '☕', '🍫', '🏖️', '🚣‍♂️', '🌿', '✨', '🎒'].map(em => (
                        <option key={em} value={em}>
                          {em}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      maxLength={60}
                      value={noteInputText}
                      onChange={e => setNoteInputText(e.target.value)}
                      placeholder={t('msg.yourNote', '¿Qué estás planeando hoy?')}
                      className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF5722]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsEditingSelfNote(false)}
                      className="px-3 py-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        updateSelfNote(noteInputText.trim() || 'Explorando con Pata de Perro', noteEmoji);
                        setIsEditingSelfNote(false);
                        showToast('¡Nota de estado actualizada!');
                      }}
                      className="px-4 py-1.5 text-xs font-black bg-[#FF5722] hover:bg-[#e04a1b] text-white rounded-xl shadow-xs cursor-pointer font-outfit"
                    >
                      {t('msg.saveNote', 'Compartir')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Feed */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#E8E5E0]/60 bg-white">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-[#23404A] font-outfit">No hay conversaciones</h4>
                  <p className="text-[11px] text-stone-400 font-manrope">
                    {searchQuery ? 'Sin coincidencias para tu búsqueda.' : 'Inicia una conversación reservando una experiencia.'}
                  </p>
                </div>
              ) : (
                filteredThreads.map(thread => {
                  const isSelected = thread.id_hilo === activeThread?.id_hilo;
                  const itemContactName = isAnfitrion ? thread.turista_nombre : thread.anfitrion_nombre;
                  const itemContactAvatar = isAnfitrion ? thread.turista_avatar : thread.anfitrion_avatar;
                  const unreadCount = isAnfitrion
                    ? thread.mensajes_no_leidos_anfitrion || 0
                    : thread.mensajes_no_leidos_turista || 0;

                  return (
                    <div
                      key={thread.id_hilo}
                      onClick={() => {
                        setActiveThreadId(thread.id_hilo);
                        setShowMobileList(false);
                      }}
                      className={`p-3 flex items-center gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FFF8F1] border-l-4 border-l-[#FF6B35]'
                          : 'hover:bg-stone-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={itemContactAvatar}
                          alt={itemContactName}
                          className="w-10 h-10 rounded-full object-cover border border-stone-200"
                        />
                        {thread.exp_imagen && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full overflow-hidden border-2 border-white bg-stone-100 shadow-2xs">
                            <img
                              src={resolveImageUrl(thread.exp_imagen)}
                              onError={e => handleImageFallback(e, thread.exp_imagen)}
                              alt="Ruta"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Info & Last Message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h3 className={`text-xs sm:text-sm truncate font-outfit ${
                            isSelected ? 'font-black text-[#23404A]' : 'font-bold text-stone-900'
                          }`}>
                            {itemContactName}
                          </h3>
                          <span className="text-[10px] text-stone-400 font-ibm-plex shrink-0">
                            {thread.ultimo_timestamp}
                          </span>
                        </div>

                        {thread.exp_titulo && (
                          <p className="text-[11px] font-bold text-[#FF6B35] truncate font-outfit mb-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{thread.exp_titulo}</span>
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs truncate font-manrope ${
                            unreadCount > 0 ? 'font-bold text-stone-900' : 'text-stone-500'
                          }`}>
                            {thread.ultimo_mensaje || 'Conversación activa'}
                          </p>

                          {unreadCount > 0 && (
                            <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#FF6B35] text-white text-[10px] font-black flex items-center justify-center font-ibm-plex shrink-0">
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

          {/* ========================================================================= */}
          {/* MIDDLE COLUMN: ACTIVE CHAT CONVERSATION VIEW                              */}
          {/* ========================================================================= */}
          {activeThread ? (
            <div
              className={`flex-1 flex flex-col bg-[#F8F6F0] z-0 transition-all min-h-0 overflow-hidden ${
                showMobileList ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Conversation Top Header Bar */}
              <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-b border-[#E8E5E0] flex items-center justify-between gap-2 shrink-0 shadow-2xs">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Mobile Back to List Button */}
                  <button
                    onClick={() => setShowMobileList(true)}
                    className="p-1.5 -ml-1 rounded-full hover:bg-stone-100 text-[#23404A] transition-colors cursor-pointer shrink-0"
                    title="Volver a lista de chats"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Contact Avatar & Status */}
                  <button
                    onClick={() => setShowContactDetails(!showContactDetails)}
                    className="flex items-center gap-2 sm:gap-2.5 text-left group min-w-0 cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={contactAvatar}
                        alt={contactName}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-stone-200"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    <div className="min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="text-xs sm:text-sm font-extrabold text-[#23404A] font-outfit truncate group-hover:text-[#FF6B35] transition-colors min-w-0">
                          {contactName}
                        </h3>
                        <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded-full bg-orange-50 text-[#FF6B35] font-ibm-plex shrink-0">
                          {isAnfitrion ? 'Turista' : 'Anfitrión'}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-emerald-700 font-medium font-manrope flex items-center gap-1 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 block" />
                        <span className="truncate">En línea • {activeThread.exp_titulo || 'Ruta Creativa'}</span>
                      </p>
                    </div>
                  </button>
                </div>

                {/* Right Action Tools */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Voice Call Button */}
                  <button
                    onClick={() => setActiveCallType('voice')}
                    className="p-2 rounded-full hover:bg-stone-100 text-[#23404A] transition-colors cursor-pointer"
                    title="Llamada de voz"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  {/* Video Call Button */}
                  <button
                    onClick={() => setActiveCallType('video')}
                    className="p-2 rounded-full hover:bg-stone-100 text-[#23404A] transition-colors cursor-pointer"
                    title="Videollamada"
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  {/* Search in chat */}
                  <button
                    onClick={() => setShowInChatSearch(!showInChatSearch)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      showInChatSearch ? 'bg-orange-50 text-[#FF6B35]' : 'hover:bg-stone-100 text-[#23404A]'
                    }`}
                    title="Buscar mensajes"
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  {/* Info / Toggle Details Panel */}
                  <button
                    onClick={() => setShowContactDetails(!showContactDetails)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      showContactDetails ? 'bg-[#23404A] text-white' : 'hover:bg-stone-100 text-[#23404A]'
                    }`}
                    title="Ver ficha de experiencia"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Inside Chat Input Bar */}
              {showInChatSearch && (
                <div className="p-2 bg-stone-100 border-b border-stone-200 flex items-center gap-2 animate-in slide-in-from-top-2 shrink-0">
                  <Search className="w-4 h-4 text-stone-500 ml-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Buscar texto en este chat..."
                    value={inChatSearch}
                    onChange={e => setInChatSearch(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-[#23404A] focus:outline-hidden focus:border-[#FF6B35]"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setInChatSearch('');
                      setShowInChatSearch(false);
                    }}
                    className="p-1.5 text-stone-500 hover:text-stone-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Linked Experience Slim Chip Banner */}
              {linkedExperience && (
                <div className="px-3 py-1.5 bg-orange-50 border-b border-orange-200/60 flex items-center justify-between gap-2 text-xs font-manrope shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={resolveImageUrl(linkedExperience.imagen_url)}
                      onError={e => handleImageFallback(e, linkedExperience.imagen_url)}
                      alt={linkedExperience.titulo}
                      className="w-6 h-6 rounded-md object-cover border border-orange-200 shrink-0"
                    />
                    <span className="text-stone-700 truncate text-[11px] sm:text-xs">
                      Experiencia: <strong className="text-[#C85A32]">{linkedExperience.titulo}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedExperience(linkedExperience);
                      setActiveBookingExperience(linkedExperience);
                      setActiveScreen('explore');
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white text-[10px] font-bold font-outfit uppercase shrink-0 transition-colors cursor-pointer"
                  >
                    Ver
                  </button>
                </div>
              )}

              {/* Messages Body Canvas */}
              <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-5 py-3 space-y-2.5">
                {/* Security and Trust Badge */}
                <div className="flex justify-center my-1">
                  <div className="bg-white/80 backdrop-blur-xs border border-stone-200/80 px-3 py-0.5 rounded-full text-[10px] text-stone-500 font-ibm-plex flex items-center gap-1.5 shadow-2xs text-center">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Comunicación protegida y directa por Pata de Perro Nicaragua.</span>
                  </div>
                </div>

                {displayedMessages.map(msg => {
                  const isMine =
                    msg.emisor_rol === userRole ||
                    (user && msg.emisor_id === ('id_turista' in user ? user.id_turista : user.id_anfitrion));

                  // Format text for voice notes: don't duplicate title if it's already descriptive
                  const isVoiceNote = msg.tipo === 'audio';
                  const voiceCaption = isVoiceNote && msg.texto ? msg.texto.replace(/^Mensaje de voz:\s*/i, '') : msg.texto;

                  return (
                    <div
                      key={msg.id_mensaje}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group relative`}
                    >
                      <div className="relative max-w-[85%] sm:max-w-[72%]">
                        {/* Bubble Content */}
                        <div
                          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-manrope shadow-xs transition-all relative break-words ${
                            isMine
                              ? 'bg-[#FF6B35] text-white rounded-br-xs'
                              : 'bg-white text-[#23404A] border border-[#E8E5E0] rounded-bl-xs'
                          }`}
                        >
                          {/* Foto media */}
                          {msg.tipo === 'foto' && msg.media_url && (
                            <div className="mb-1.5 rounded-xl overflow-hidden border border-black/10">
                              <img
                                src={msg.media_url}
                                alt="Foto compartida"
                                className="w-full max-h-56 object-cover"
                              />
                            </div>
                          )}

                          {/* Voice Note Audio player simulation */}
                          {isVoiceNote && (
                            <div className="space-y-1 py-0.5 min-w-[180px] sm:min-w-[220px]">
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleAudioPlay(msg.id_mensaje)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs ${
                                    isMine ? 'bg-white text-[#FF6B35]' : 'bg-[#FF6B35] text-white'
                                  }`}
                                >
                                  {playingAudioId === msg.id_mensaje ? (
                                    <Pause className="w-3.5 h-3.5" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 ml-0.5" />
                                  )}
                                </button>
                                <div className="flex-1 space-y-1">
                                  <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        isMine ? 'bg-white' : 'bg-[#FF6B35]'
                                      } ${playingAudioId === msg.id_mensaje ? 'animate-pulse w-3/4' : 'w-1/3'}`}
                                    />
                                  </div>
                                  <div className="flex justify-between text-[10px] opacity-80 font-ibm-plex">
                                    <span>{msg.audio_duracion || '0:15'}</span>
                                    <span>{playingAudioId === msg.id_mensaje ? 'Reproduciendo...' : 'Nota de voz'}</span>
                                  </div>
                                </div>
                              </div>
                              {voiceCaption && (
                                <p className="text-[11px] opacity-90 leading-tight pt-0.5 italic">
                                  {voiceCaption}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Main Text Content (for standard text messages) */}
                          {!isVoiceNote && msg.texto && (
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.texto}</p>
                          )}

                          {/* Timestamp and Delivery checkmarks */}
                          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-ibm-plex ${
                            isMine ? 'text-white/80' : 'text-stone-400'
                          }`}>
                            <span>{msg.timestamp}</span>
                            {isMine && (
                              <CheckCheck className="w-3.5 h-3.5 text-white inline-block" />
                            )}
                          </div>

                          {/* Reaction badge if applied */}
                          {msg.reaccion && (
                            <div className="absolute -bottom-2 right-2 bg-white border border-stone-200 rounded-full px-1.5 py-0.2 shadow-2xs text-xs">
                              {msg.reaccion}
                            </div>
                          )}
                        </div>

                        {/* Quick Reaction buttons & Delete on hover/focus */}
                        <div
                          className={`absolute -top-3 ${
                            isMine ? 'left-0' : 'right-0'
                          } opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-1 px-1.5 py-0.5 bg-white rounded-full border border-stone-200 shadow-sm z-10`}
                        >
                          <button
                            type="button"
                            onClick={() => reactToMessage(activeThread.id_hilo, msg.id_mensaje, '❤️')}
                            className="text-xs hover:scale-125 transition-transform p-0.5 cursor-pointer"
                            title="Reaccionar amor"
                          >
                            ❤️
                          </button>
                          <button
                            type="button"
                            onClick={() => reactToMessage(activeThread.id_hilo, msg.id_mensaje, '👍')}
                            className="text-xs hover:scale-125 transition-transform p-0.5 cursor-pointer"
                            title="Reaccionar me gusta"
                          >
                            👍
                          </button>
                          {isMine && (
                            <button
                              type="button"
                              onClick={() => deleteMessage(activeThread.id_hilo, msg.id_mensaje)}
                              className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer ml-0.5"
                              title="Eliminar mensaje"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Suggestions Carousel */}
              <div className="px-3 py-1.5 bg-white border-t border-[#E8E5E0] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                <span className="text-[10px] font-bold text-stone-400 uppercase font-ibm-plex shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF6B35]" /> Sugerencias:
                </span>
                {(isAnfitrion ? QUICK_PROMPTS_ANFITRION : QUICK_PROMPTS_TURISTA).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputText(prompt);
                    }}
                    className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-[#FF6B35] text-stone-700 text-[11px] font-manrope whitespace-nowrap transition-all border border-stone-200/60 cursor-pointer shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Bottom Input Action Bar */}
              <div className="p-2 sm:p-3 bg-white border-t border-[#E8E5E0] relative shrink-0">
                {/* Emoji Picker Popover */}
                {showEmojiPicker && (
                  <div className="absolute bottom-14 left-3 sm:left-4 p-2.5 bg-white border border-stone-200 rounded-2xl shadow-xl z-30 grid grid-cols-6 sm:grid-cols-8 gap-1.5 animate-in fade-in max-w-xs">
                    {EMOJI_LIST.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-base hover:scale-125 transition-transform p-1 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Attachment Menu Popover */}
                {showAttachmentMenu && (
                  <div className="absolute bottom-14 left-10 p-2.5 bg-white border border-stone-200 rounded-2xl shadow-xl z-30 flex flex-col gap-1.5 animate-in fade-in w-52 text-xs font-manrope">
                    <button
                      onClick={() => handleSendImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80')}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-[#FF6B35] transition-colors cursor-pointer text-left"
                    >
                      <ImageIcon className="w-4 h-4 text-[#FF6B35]" />
                      <span>Foto de la Ruta / Actividad</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAttachmentMenu(false);
                        sendChatMessage(activeThread.id_hilo, '📍 Ubicación compartida: Taller Central, Masaya (11.9744° N, -86.0942° W)', {
                          tipo: 'ubicacion',
                        });
                        showToast('Ubicación compartida en el chat.');
                      }}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-[#FF6B35] transition-colors cursor-pointer text-left"
                    >
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>Compartir Ubicación GPS</span>
                    </button>
                  </div>
                )}

                {/* Audio Recording Bar Simulation */}
                {isRecordingAudio ? (
                  <div className="flex items-center justify-between gap-2 p-1.5 bg-rose-50 border border-rose-200 rounded-2xl">
                    <div className="flex items-center gap-2 text-rose-700 text-xs font-bold font-ibm-plex pl-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                      <span>Grabando: 0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsRecordingAudio(false)}
                        className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSendVoiceNote}
                        className="px-3.5 py-1 bg-[#FF6B35] text-white rounded-full text-xs font-bold font-outfit uppercase shadow-xs cursor-pointer"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center gap-1 sm:gap-2">
                    {/* Emoji Trigger */}
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
                        showEmojiPicker ? 'bg-orange-50 text-[#FF6B35]' : 'hover:bg-stone-100 text-stone-500'
                      }`}
                      title="Emojis"
                    >
                      <Smile className="w-5 h-5" />
                    </button>

                    {/* Attachment Trigger */}
                    <button
                      type="button"
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
                        showAttachmentMenu ? 'bg-orange-50 text-[#FF6B35]' : 'hover:bg-stone-100 text-stone-500'
                      }`}
                      title="Adjuntar multimedia"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Text Input */}
                    <input
                      type="text"
                      placeholder="Escribe un mensaje aquí..."
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      className="flex-1 bg-[#F4F1EA] border border-transparent rounded-full px-3.5 sm:px-4 py-2 text-xs sm:text-sm text-[#23404A] focus:bg-white focus:border-[#FF6B35] focus:outline-hidden transition-all font-manrope min-w-0"
                    />

                    {/* Mic or Send Button */}
                    {inputText.trim() ? (
                      <button
                        type="submit"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                        title="Enviar mensaje"
                      >
                        <Send className="w-4 h-4 ml-0.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsRecordingAudio(true)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-100 hover:bg-orange-50 text-stone-600 hover:text-[#FF6B35] flex items-center justify-center transition-all cursor-pointer shrink-0"
                        title="Grabar nota de voz"
                      >
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center bg-[#FAF8F5]">
              <div className="max-w-sm space-y-3">
                <div className="w-16 h-16 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center mx-auto shadow-xs">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#23404A] font-outfit">Mensajería Pata de Perro</h3>
                <p className="text-xs text-stone-500 font-manrope">
                  Selecciona una conversación de la izquierda para coordinar salidas y detalles con artesanos y viajeros.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: COLLAPSIBLE EXPERIENCE & CONTACT CARD (Desktop / Tablet)    */}
          {/* ========================================================================= */}
          {showContactDetails && activeThread && (
            <div className="w-full sm:w-80 border-l border-[#E8E5E0] bg-white p-5 overflow-y-auto space-y-5 animate-in slide-in-from-right-4 z-20 shrink-0">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E5E0]">
                <h3 className="text-sm font-extrabold text-[#23404A] font-outfit">Ficha Informativa</h3>
                <button
                  onClick={() => setShowContactDetails(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="text-center space-y-2">
                <img
                  src={contactAvatar}
                  alt={contactName}
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-[#FF6B35] shadow-xs"
                />
                <h4 className="text-base font-bold text-[#23404A] font-outfit">{contactName}</h4>
                <span className="inline-block px-3 py-0.5 rounded-full bg-orange-50 text-[#FF6B35] text-[10px] font-extrabold uppercase font-ibm-plex">
                  {isAnfitrion ? 'Viajero Registrado' : 'Anfitrión Verificado'}
                </span>
              </div>

              {/* Linked Experience info */}
              {linkedExperience ? (
                <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img
                      src={resolveImageUrl(linkedExperience.imagen_url)}
                      onError={e => handleImageFallback(e, linkedExperience.imagen_url)}
                      alt={linkedExperience.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-bold text-[#23404A] font-outfit">{linkedExperience.titulo}</h5>
                  <p className="text-stone-500 text-[11px] flex items-center gap-1 font-manrope">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" /> {linkedExperience.ciudad_creativa}, Nicaragua
                  </p>
                  <p className="font-extrabold text-[#C85A32] font-ibm-plex text-sm">
                    ${linkedExperience.precio} USD <span className="text-[10px] font-normal text-stone-500">/ persona</span>
                  </p>
                  <button
                    onClick={() => {
                      setSelectedExperience(linkedExperience);
                      setActiveBookingExperience(linkedExperience);
                      setActiveScreen('explore');
                    }}
                    className="w-full py-2 bg-[#23404A] hover:bg-[#162A31] text-white rounded-xl text-xs font-bold font-outfit uppercase transition-colors cursor-pointer"
                  >
                    Ver en Catálogo
                  </button>
                </div>
              ) : (
                <div className="bg-stone-50 p-4 rounded-2xl text-center text-xs text-stone-500">
                  <p>Conversación general sobre turismo comunitario en Nicaragua.</p>
                </div>
              )}

              {/* Direct Actions */}
              <div className="space-y-2 pt-2 border-t border-[#E8E5E0]">
                <button
                  onClick={() => setActiveCallType('voice')}
                  className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 font-outfit cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#FF6B35]" />
                  <span>Iniciar Llamada</span>
                </button>
                <button
                  onClick={() => setActiveCallType('video')}
                  className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 font-outfit cursor-pointer"
                >
                  <Video className="w-4 h-4 text-[#23404A]" />
                  <span>Iniciar Videollamada</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: LIVE VOICE OR VIDEO CALL SIMULATOR                                 */}
      {/* ========================================================================= */}
      {activeCallType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162A31] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white text-center space-y-6 shadow-2xl animate-in zoom-in-95">
            {/* Header Call Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-ibm-plex">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{activeCallType === 'video' ? 'Videollamada en directo' : 'Llamada de voz'}</span>
            </div>

            {/* Avatar or Video feed */}
            {activeCallType === 'video' && !isCameraOff ? (
              <div className="relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-white/20">
                <img
                  src={contactAvatar}
                  alt={contactName}
                  className="w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md text-[10px] text-white">
                  {contactName} (Anfitrión)
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <img
                  src={contactAvatar}
                  alt={contactName}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#FF6B35] shadow-lg animate-pulse"
                />
                <h3 className="text-xl font-bold font-outfit">{contactName}</h3>
              </div>
            )}

            {/* Duration */}
            <p className="text-sm font-ibm-plex text-stone-300">
              0:{callDuration < 10 ? '0' : ''}{callDuration}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsCallMuted(!isCallMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isCallMuted ? 'bg-rose-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title="Silenciar micrófono"
              >
                {isCallMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {activeCallType === 'video' && (
                <button
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isCameraOff ? 'bg-rose-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  title="Apagar cámara"
                >
                  {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
              )}

              <button
                onClick={() => {
                  setActiveCallType(null);
                  showToast('Llamada finalizada.');
                }}
                className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
                title="Colgar llamada"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
