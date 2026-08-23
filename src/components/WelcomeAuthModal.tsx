/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Welcome & User Authentication Component
 * Features onboarding profile creation questionnaire with mandatory & optional fields,
 * anti-duplicate registration, and clean role selection.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, MoodTag } from '../types';
import {
  ShieldAlert,
  ArrowLeft,
  User,
  Compass,
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Globe,
  Sparkles,
  Heart,
  Camera,
  Instagram,
  Check,
} from 'lucide-react';

const NICARAGUA_DEPARTAMENTOS = [
  'León',
  'Granada',
  'Masaya',
  'Matagalpa',
  'Managua',
  'Rivas',
  'Estelí',
  'Chinandega',
  'Carazo',
  'Jinotega',
  'Madriz',
  'Nueva Segovia',
  'Boaco',
  'Chontales',
  'Río San Juan',
  'RACCN (Caribe Norte)',
  'RACCS (Caribe Sur)',
  'Otro / Región Exterior',
];

const PAISES_LIST = [
  'Nicaragua',
  'Costa Rica',
  'Honduras',
  'El Salvador',
  'Guatemala',
  'Panamá',
  'México',
  'Estados Unidos',
  'España',
  'Colombia',
  'Canadá',
  'Alemania',
  'Francia',
  'Argentina',
  'Otro País',
];

const AVATAR_PRESETS = [
  {
    id: 'av1',
    label: 'Viajera Sol',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av2',
    label: 'Explorador Volcán',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av3',
    label: 'Artesana Barro',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av4',
    label: 'Guía de Ruta',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av5',
    label: 'Fotógrafa Mochilera',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av6',
    label: 'Navegante Cocibolca',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  },
];

export const WelcomeAuthModal: React.FC = () => {
  const {
    setActiveScreen,
    accounts,
    registerAccount,
    loginAccount,
    showToast,
  } = useApp();

  const [viewState, setViewState] = useState<'welcome' | 'register' | 'login'>('welcome');

  // Registration Questionnaire States
  // 1. Mandatory fields
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [pais, setPais] = useState('Nicaragua');
  const [departamento, setDepartamento] = useState('León');
  const [telefono, setTelefono] = useState('');

  // 2. Optional fields
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<MoodTag[]>([MoodTag.AVENTURERO, MoodTag.CULTURAL]);
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TURISTA);

  // Questionnaire tabs inside registration
  const [regStep, setRegStep] = useState<'obligatorios' | 'opcionales'>('obligatorios');

  // Messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setNombre('');
    setCorreo('');
    setPais('Nicaragua');
    setDepartamento('León');
    setTelefono('');
    setPassword('');
    setBio('');
    setSelectedAvatar(AVATAR_PRESETS[0].url);
    setCustomAvatarUrl('');
    setSelectedMoods([MoodTag.AVENTURERO, MoodTag.CULTURAL]);
    setInstagram('');
    setTiktok('');
    setRole(UserRole.TURISTA);
    setRegStep('obligatorios');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const toggleMood = (mood: MoodTag) => {
    setSelectedMoods(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate mandatory fields
    if (!nombre.trim()) {
      setRegStep('obligatorios');
      setErrorMessage('Por favor escribe tu nombre completo (campo obligatorio).');
      return;
    }
    if (!correo.trim() || !correo.includes('@')) {
      setRegStep('obligatorios');
      setErrorMessage('Por favor ingresa un correo electrónico válido (campo obligatorio).');
      return;
    }
    if (!pais.trim()) {
      setRegStep('obligatorios');
      setErrorMessage('Por favor indica tu país de origen (campo obligatorio).');
      return;
    }
    if (!departamento.trim()) {
      setRegStep('obligatorios');
      setErrorMessage('Por favor selecciona tu departamento / región (campo obligatorio).');
      return;
    }
    if (!telefono.trim()) {
      setRegStep('obligatorios');
      setErrorMessage('Por favor escribe tu número de teléfono / WhatsApp (campo obligatorio).');
      return;
    }

    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;

    const result = registerAccount({
      nombre,
      correo,
      pais,
      departamento,
      ciudad: departamento,
      telefono,
      password: password.trim() || '1234',
      role,
      avatar: finalAvatar,
      bio: bio.trim() || (role === UserRole.ANFITRION ? 'Anfitrión local listo para compartir experiencias y saberes tradicionales.' : 'Viajero entusiasta del turismo comunitario y la cultura nicaragüense.'),
      moodsFavoritos: selectedMoods,
      redesSociales: {
        instagram: instagram.trim() ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : undefined,
        tiktok: tiktok.trim() ? (tiktok.startsWith('@') ? tiktok : `@${tiktok}`) : undefined,
      },
    });

    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      setSuccessMessage('¡Cuenta y perfil completados con éxito! Entrando a Pata de Perro...');
      setTimeout(() => {
        resetForm();
      }, 500);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = loginAccount(correo, password);

    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      setSuccessMessage('¡Sesión iniciada con éxito!');
      resetForm();
    }
  };

  const handleSocialAuth = (provider: string) => {
    const socialEmail = `usuario.${provider.toLowerCase()}@patadeperro.ni`;
    const existing = accounts.find(a => a.correo.toLowerCase() === socialEmail);

    if (existing) {
      loginAccount(socialEmail);
    } else {
      registerAccount({
        nombre: `Viajero ${provider}`,
        correo: socialEmail,
        pais: 'Nicaragua',
        departamento: 'Granada',
        ciudad: 'Granada',
        telefono: '+505 8888-0000',
        password: '123',
        role: UserRole.TURISTA,
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#162A31] flex items-center justify-center p-4 sm:p-6">
      {/* Background Mask Image (Traditional Nicaragua Folklore) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80"
          alt="Máscaras folklóricas nicaragüenses"
          className="w-full h-full object-cover filter brightness-[0.35] contrast-110"
        />
        <div className="absolute inset-0 bg-[#162A31]/70 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto py-4">
        <AnimatePresence mode="wait">
          {/* VIEW 1: WELCOME SCREEN */}
          {viewState === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-end min-h-[520px] space-y-4 pb-4"
            >
              <div className="text-left w-full space-y-2 mb-4 px-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B35]/20 border border-[#FF6B35]/30 text-[#FF8E60] text-xs font-semibold uppercase tracking-wider mb-1 font-outfit">
                  <Sparkles className="w-3.5 h-3.5" />
                  Turismo Comunitario & Rutas Creativas
                </div>
                <h1 className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight font-outfit leading-none">
                  Bienvenidx a
                </h1>
                <h2 className="text-[#FF6B35] text-4xl sm:text-5xl font-extrabold tracking-tight font-outfit leading-none">
                  Pata de Perro!
                </h2>
                <p className="text-[#FFF8F1]/90 text-sm sm:text-base font-medium pt-2 font-manrope leading-relaxed">
                  Cada paso te acerca a nuevas historias, talleres ancestrales y anfitriones locales en Nicaragua.
                </p>
              </div>

              {/* Primary Register Button */}
              <button
                id="btn-welcome-register"
                onClick={() => {
                  resetForm();
                  setViewState('register');
                }}
                className="w-full py-4 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-base sm:text-lg tracking-wider uppercase shadow-xl transition-all font-outfit active:scale-98 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>CREAR CUENTA & PERFIL</span>
              </button>

              {/* Outlined Login Button */}
              <button
                id="btn-welcome-login"
                onClick={() => {
                  resetForm();
                  setViewState('login');
                }}
                className="w-full py-3.5 rounded-full bg-transparent hover:bg-white/10 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase border-2 border-white text-center transition-all font-outfit active:scale-98 cursor-pointer"
              >
                INICIAR SESIÓN
              </button>
            </motion.div>
          )}

          {/* VIEW 2: PROFILE ONBOARDING & REGISTRATION QUESTIONNAIRE */}
          {viewState === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#FFF8F1] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-[#E8E5E0] space-y-5 text-[#23404A]"
            >
              {/* Back Button and Title Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E5E0]">
                <button
                  id="btn-register-back-welcome"
                  onClick={() => setViewState('welcome')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#23404A] hover:text-[#FF6B35] transition-colors py-1.5 px-3 rounded-full hover:bg-black/5 font-manrope cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B35] block font-ibm-plex">
                    Registro de Usuario
                  </span>
                  <h2 className="text-[#23404A] text-lg sm:text-xl font-extrabold uppercase font-outfit">
                    Completa tu Perfil
                  </h2>
                </div>
                <div className="w-16" />
              </div>

              {/* Error or Success alerts */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-start gap-2.5 font-ibm-plex animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 font-ibm-plex">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Role Toggle Tabs */}
              <div>
                <label className="block text-xs font-bold text-[#23404A] mb-1.5 font-manrope">
                  ¿Cómo usarás Pata de Perro?
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200/70 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.TURISTA)}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold font-outfit uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === UserRole.TURISTA
                        ? 'bg-[#FF6B35] text-white shadow-xs'
                        : 'text-[#23404A] hover:text-black'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Viajero / Turista
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.ANFITRION)}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold font-outfit uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === UserRole.ANFITRION
                        ? 'bg-[#162A31] text-white shadow-xs'
                        : 'text-[#23404A] hover:text-black'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Anfitrión Local
                  </button>
                </div>
              </div>

              {/* Step Navigation Pill Indicator */}
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                <button
                  type="button"
                  onClick={() => setRegStep('obligatorios')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-outfit transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    regStep === 'obligatorios'
                      ? 'bg-[#23404A] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>1. Datos Obligatorios *</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegStep('opcionales')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-outfit transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    regStep === 'opcionales'
                      ? 'bg-[#23404A] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>2. Personalizar Perfil (Opcional)</span>
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* STEP 1: MANDATORY QUESTIONS */}
                {regStep === 'obligatorios' && (
                  <div className="space-y-3.5 animate-in fade-in">
                    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-[#A24D28] font-manrope">
                      * Todos los campos de esta sección son <strong>obligatorios</strong> para verificar tu cuenta y garantizar tu seguridad en reservas.
                    </div>

                    {/* Question 1: Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                        1. ¿Cuál es tu nombre completo? <span className="text-rose-600 font-black">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          id="input-reg-nombre"
                          type="text"
                          required
                          value={nombre}
                          onChange={e => setNombre(e.target.value)}
                          placeholder="Ej: Sofia Guevara"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Question 2: Email */}
                    <div>
                      <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                        2. ¿Cuál es tu correo electrónico? <span className="text-rose-600 font-black">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          id="input-reg-correo"
                          type="email"
                          required
                          value={correo}
                          onChange={e => setCorreo(e.target.value)}
                          placeholder="usuario@patadeperro.ni"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope shadow-2xs"
                        />
                      </div>
                      <span className="text-[10px] text-stone-400 font-manrope mt-0.5 block">
                        Único por cuenta (no se permiten correos duplicados).
                      </span>
                    </div>

                    {/* Question 3 & 4: Country & Department */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                          3. ¿De qué país eres? <span className="text-rose-600 font-black">*</span>
                        </label>
                        <div className="relative">
                          <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <select
                            id="select-reg-pais"
                            value={pais}
                            onChange={e => setPais(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope shadow-2xs cursor-pointer"
                          >
                            {PAISES_LIST.map(p => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                          4. ¿Departamento / Región? <span className="text-rose-600 font-black">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <select
                            id="select-reg-departamento"
                            value={departamento}
                            onChange={e => setDepartamento(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope shadow-2xs cursor-pointer"
                          >
                            {NICARAGUA_DEPARTAMENTOS.map(d => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Question 5: Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                        5. ¿Número de teléfono / WhatsApp? <span className="text-rose-600 font-black">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          id="input-reg-telefono"
                          type="tel"
                          required
                          value={telefono}
                          onChange={e => setTelefono(e.target.value)}
                          placeholder="+505 8888-8888"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!nombre.trim() || !correo.trim() || !telefono.trim()) {
                            setErrorMessage('Por favor completa los campos obligatorios antes de continuar.');
                            return;
                          }
                          setErrorMessage(null);
                          setRegStep('opcionales');
                        }}
                        className="flex-1 py-3 rounded-2xl bg-[#23404A] hover:bg-[#162A31] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all font-outfit cursor-pointer"
                      >
                        Siguiente: Personalizar Perfil &rarr;
                      </button>

                      <button
                        id="btn-quick-submit"
                        type="submit"
                        className="py-3 px-4 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all font-outfit cursor-pointer shrink-0"
                      >
                        Crear Cuenta Ya
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: OPTIONAL QUESTIONS (Avatar, Bio, Moods, Password, Social) */}
                {regStep === 'opcionales' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-800 font-manrope flex items-center justify-between">
                      <span>Los siguientes campos son <strong>opcionales</strong> para darle estilo a tu perfil.</span>
                      <button
                        type="button"
                        onClick={() => setRegStep('obligatorios')}
                        className="text-emerald-900 font-bold underline cursor-pointer shrink-0 ml-2"
                      >
                        &larr; Volver a datos
                      </button>
                    </div>

                    {/* Avatar Preset Selector */}
                    <div>
                      <label className="block text-xs font-bold text-[#23404A] mb-1.5 font-manrope flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-[#FF6B35]" />
                        <span>Foto de perfil o avatar ilustrado (Opcional)</span>
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {AVATAR_PRESETS.map(av => {
                          const isSelected = selectedAvatar === av.url && !customAvatarUrl;
                          return (
                            <button
                              key={av.id}
                              type="button"
                              onClick={() => {
                                setSelectedAvatar(av.url);
                                setCustomAvatarUrl('');
                              }}
                              className={`relative rounded-full aspect-square overflow-hidden border-2 transition-all cursor-pointer ${
                                isSelected ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/40 scale-105' : 'border-stone-200 hover:border-stone-400'
                              }`}
                              title={av.label}
                            >
                              <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                              {isSelected && (
                                <div className="absolute inset-0 bg-[#FF6B35]/40 flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Moods / Intereses */}
                    <div>
                      <label className="block text-xs font-bold text-[#23404A] mb-1.5 font-manrope flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-[#FF6B35]" />
                        <span>Intereses de viaje favoritos (Opcional)</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.values(MoodTag).map(mood => {
                          const isSelected = selectedMoods.includes(mood);
                          return (
                            <button
                              key={mood}
                              type="button"
                              onClick={() => toggleMood(mood)}
                              className={`px-3 py-1 rounded-full text-xs font-bold font-ibm-plex transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#FF6B35] text-white shadow-2xs'
                                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                              }`}
                            >
                              {isSelected ? `✓ ${mood}` : `+ ${mood}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                        Cuéntanos sobre ti / Biografía viajera (Opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Ej: Me apasiona aprender sobre alfarería precolombina y probar la gastronomía tradicional nica."
                        className="w-full p-3 rounded-2xl bg-white border border-[#E8E5E0] text-xs text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope resize-none shadow-2xs"
                      />
                    </div>

                    {/* Password & Social */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                          Contraseña de acceso (Opcional)
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Predeterminada: 1234"
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope shadow-2xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                          Instagram (Opcional)
                        </label>
                        <div className="relative">
                          <Instagram className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            value={instagram}
                            onChange={e => setInstagram(e.target.value)}
                            placeholder="@tu_usuario"
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Final Registration Submit */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRegStep('obligatorios')}
                        className="py-3.5 px-4 rounded-2xl bg-stone-200 hover:bg-stone-300 text-[#23404A] font-bold text-xs font-manrope cursor-pointer"
                      >
                        &larr; Volver
                      </button>

                      <button
                        id="btn-submit-register-full"
                        type="submit"
                        className="flex-1 py-3.5 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-md transition-all font-outfit cursor-pointer active:scale-98 text-center"
                      >
                        ¡FINALIZAR & CREAR PERFIL!
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* Social Login Alternatives */}
              <div className="text-center space-y-2 pt-2 border-t border-[#E8E5E0]">
                <p className="text-[#9A9A9A] text-xs font-medium font-manrope">
                  O entra rápidamente con:
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleSocialAuth('Google')}
                    className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#E8E5E0] flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Google"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleSocialAuth('Facebook')}
                    className="w-10 h-10 rounded-full bg-[#1877F2] shadow-xs text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                    title="Facebook"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      resetForm();
                      setViewState('login');
                    }}
                    className="text-[#23404A] text-xs font-semibold hover:underline font-manrope cursor-pointer"
                  >
                    ¿Ya tienes una cuenta registrada? <span className="font-bold text-[#FF6B35]">Inicia Sesión</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 3: LOGIN FORM */}
          {viewState === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#FFF8F1] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-[#E8E5E0] space-y-5 text-[#23404A]"
            >
              {/* Back Button and Title */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E5E0]">
                <button
                  id="btn-login-back-welcome"
                  onClick={() => setViewState('welcome')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#23404A] hover:text-[#FF6B35] transition-colors py-1.5 px-3 rounded-full hover:bg-black/5 font-manrope cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>
                <h2 className="text-[#23404A] text-lg sm:text-xl font-extrabold uppercase font-outfit">
                  INICIAR SESIÓN
                </h2>
                <div className="w-16" />
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-start gap-2.5 font-ibm-plex">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 font-ibm-plex">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="input-login-email"
                      type="email"
                      required
                      value={correo}
                      onChange={e => setCorreo(e.target.value)}
                      placeholder="usuario@patadeperro.ni"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="input-login-pass"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="•••••••• (1234 por defecto)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope shadow-2xs"
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-md transition-all font-outfit cursor-pointer active:scale-98"
                >
                  INGRESAR
                </button>
              </form>

              {/* Alternative Social */}
              <div className="text-center space-y-2 pt-2 border-t border-[#E8E5E0]">
                <p className="text-[#9A9A9A] text-xs font-medium font-manrope">
                  O ingresa con redes:
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleSocialAuth('Google')}
                    className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#E8E5E0] flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Google"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleSocialAuth('Facebook')}
                    className="w-10 h-10 rounded-full bg-[#1877F2] shadow-xs text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                    title="Facebook"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      resetForm();
                      setViewState('register');
                    }}
                    className="text-[#23404A] text-xs font-semibold hover:underline font-manrope cursor-pointer"
                  >
                    ¿Aún no tienes una cuenta? <span className="font-bold text-[#FF6B35]">Regístrate con tus datos</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
