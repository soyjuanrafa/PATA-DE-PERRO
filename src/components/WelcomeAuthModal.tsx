/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Welcome & User Authentication Component
 * Supports persistent multi-account login, anti-duplicate registration,
 * quick account switching, and explicit back navigation.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
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
  Trash2,
  Sparkles,
} from 'lucide-react';

export const WelcomeAuthModal: React.FC = () => {
  const {
    setActiveScreen,
    accounts,
    registerAccount,
    loginAccount,
    switchAccount,
    deleteSavedAccount,
    showToast,
    user,
  } = useApp();

  const [viewState, setViewState] = useState<'welcome' | 'register' | 'login' | 'saved_accounts'>('welcome');

  // Form states
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('León');
  const [role, setRole] = useState<UserRole>(UserRole.TURISTA);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setNombre('');
    setCorreo('');
    setPassword('');
    setTelefono('');
    setCiudad('León');
    setRole(UserRole.TURISTA);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = registerAccount({
      nombre,
      correo,
      password,
      role,
      ciudad,
      telefono,
    });

    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo...');
      resetForm();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
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
    // Check if demo social email exists
    const socialEmail = `usuario.${provider.toLowerCase()}@patadeperro.ni`;
    const existing = accounts.find(a => a.correo.toLowerCase() === socialEmail);

    if (existing) {
      loginAccount(socialEmail);
    } else {
      registerAccount({
        nombre: `Viajero ${provider}`,
        correo: socialEmail,
        password: '123',
        role: UserRole.TURISTA,
        ciudad: 'Granada',
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#162A31] flex items-center justify-center p-4 sm:p-6">
      {/* Background Mask Image (Traditional Nicaragua Folklore Masks) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80"
          alt="Máscaras folklóricas nicaragüenses"
          className="w-full h-full object-cover filter brightness-[0.40] contrast-110"
        />
        <div className="absolute inset-0 bg-[#162A31]/60 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* VIEW 1: WELCOME SCREEN */}
          {viewState === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-end min-h-[540px] space-y-4 pb-4"
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
                <p className="text-[#FFF8F1]/90 text-sm sm:text-base font-medium pt-2 font-manrope">
                  Cada paso te acerca a nuevas historias, talleres ancestrales y anfitriones locales en Nicaragua.
                </p>
              </div>

              {/* Saved accounts shortcut pill if available */}
              {accounts.length > 0 && (
                <button
                  id="btn-view-saved-accounts"
                  onClick={() => setViewState('saved_accounts')}
                  className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-semibold flex items-center justify-between transition-all font-manrope cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-xs font-bold font-outfit">
                      {accounts.length}
                    </div>
                    <span>Cuentas registradas en este equipo</span>
                  </div>
                  <span className="text-[#FF8E60] font-bold text-xs">Ver todas &rarr;</span>
                </button>
              )}

              {/* Orange Register Button */}
              <button
                id="btn-welcome-register"
                onClick={() => {
                  resetForm();
                  setViewState('register');
                }}
                className="w-full py-4 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-base sm:text-lg tracking-wider uppercase shadow-xl transition-all font-outfit active:scale-98 text-center cursor-pointer"
              >
                REGISTRARSE
              </button>

              {/* Outlined Login Button */}
              <button
                id="btn-welcome-login"
                onClick={() => {
                  resetForm();
                  setViewState('login');
                }}
                className="w-full py-4 rounded-full bg-transparent hover:bg-white/10 text-white font-extrabold text-base sm:text-lg tracking-wider uppercase border-2 border-white text-center transition-all font-outfit active:scale-98 cursor-pointer"
              >
                INICIAR SESIÓN
              </button>

              {/* Continue as Guest */}
              <button
                id="btn-welcome-guest"
                onClick={() => {
                  showToast('Explorando el catálogo como visitante.');
                  setActiveScreen('explore');
                }}
                className="text-[#FFF8F1]/80 hover:text-white text-xs font-semibold underline underline-offset-4 pt-2 font-manrope cursor-pointer"
              >
                Explorar catálogo como invitado sin cuenta
              </button>
            </motion.div>
          )}

          {/* VIEW 2: REGISTER FORM WITH ANTI-DUPLICATE CHECK & ROLE SELECTION */}
          {viewState === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              className="bg-[#FFF8F1] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-[#E8E5E0] space-y-5 text-[#23404A]"
            >
              {/* Back Button and Title */}
              <div className="flex items-center justify-between pb-1 border-b border-[#E8E5E0]">
                <button
                  id="btn-register-back"
                  onClick={() => setViewState('welcome')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#23404A] hover:text-[#FF6B35] transition-colors py-1 px-2.5 rounded-lg hover:bg-black/5 font-manrope cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </button>
                <h2 className="text-[#23404A] text-xl sm:text-2xl font-extrabold uppercase font-outfit">
                  CREAR CUENTA
                </h2>
                <div className="w-16" />
              </div>

              {/* Error or Success alerts */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2.5 font-ibm-plex">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-ibm-plex">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Role Toggle Tabs */}
              <div>
                <label className="block text-xs font-bold text-[#23404A] mb-1.5 font-manrope">
                  Tipo de Cuenta
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-200/70 rounded-full">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.TURISTA)}
                    className={`py-2 px-3 rounded-full text-xs font-extrabold font-outfit uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
                    className={`py-2 px-3 rounded-full text-xs font-extrabold font-outfit uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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

              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="input-register-name"
                      type="text"
                      required
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      placeholder="Ej: Sofia Guevara"
                      className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Correo Electrónico (Único por cuenta)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="input-register-email"
                      type="email"
                      required
                      value={correo}
                      onChange={e => setCorreo(e.target.value)}
                      placeholder="usuario@patadeperro.ni"
                      className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                      Ciudad Origen
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        id="input-register-city"
                        type="text"
                        value={ciudad}
                        onChange={e => setCiudad(e.target.value)}
                        placeholder="Ej: Masaya, León"
                        className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                      Teléfono / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        id="input-register-phone"
                        type="tel"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                        placeholder="+505 8888-8888"
                        className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="input-register-password"
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-register"
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-md transition-all font-outfit cursor-pointer active:scale-98"
                >
                  REGISTRAR CUENTA
                </button>
              </form>

              {/* Social Login Buttons */}
              <div className="text-center space-y-2 pt-1 border-t border-[#E8E5E0]">
                <p className="text-[#9A9A9A] text-xs font-medium font-manrope">
                  O crea tu cuenta rápidamente con:
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

                <div className="pt-2">
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
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              className="bg-[#FFF8F1] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-[#E8E5E0] space-y-5 text-[#23404A]"
            >
              {/* Back Button and Title */}
              <div className="flex items-center justify-between pb-1 border-b border-[#E8E5E0]">
                <button
                  id="btn-login-back"
                  onClick={() => setViewState('welcome')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#23404A] hover:text-[#FF6B35] transition-colors py-1 px-2.5 rounded-lg hover:bg-black/5 font-manrope cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </button>
                <h2 className="text-[#23404A] text-xl sm:text-2xl font-extrabold uppercase font-outfit">
                  INICIAR SESIÓN
                </h2>
                <div className="w-16" />
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2.5 font-ibm-plex">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-ibm-plex">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Quick switch button if accounts exist */}
              {accounts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setViewState('saved_accounts')}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-50/80 border border-orange-200/80 text-[#C85A32] text-xs font-semibold flex items-center justify-between hover:bg-orange-100/60 transition-colors font-manrope cursor-pointer"
                >
                  <span>Seleccionar una cuenta ya guardada ({accounts.length})</span>
                  <span className="font-bold">&rarr;</span>
                </button>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Correo o Nombre de Usuario
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="input-login-username"
                      type="text"
                      required
                      value={correo}
                      onChange={e => setCorreo(e.target.value)}
                      placeholder="usuario@patadeperro.ni"
                      className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
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
                      id="input-login-password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-md transition-all font-outfit cursor-pointer active:scale-98"
                >
                  INICIAR SESIÓN
                </button>
              </form>

              {/* Social Login */}
              <div className="text-center space-y-2 pt-1 border-t border-[#E8E5E0]">
                <p className="text-[#9A9A9A] text-xs font-medium font-manrope">
                  O entra con tus redes:
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

                <div className="pt-2">
                  <button
                    onClick={() => {
                      resetForm();
                      setViewState('register');
                    }}
                    className="text-[#23404A] text-xs font-semibold hover:underline font-manrope cursor-pointer"
                  >
                    ¿Aún no tienes una cuenta? <span className="font-bold text-[#FF6B35]">Regístrate gratis</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 4: SAVED ACCOUNTS SELECTOR */}
          {viewState === 'saved_accounts' && (
            <motion.div
              key="saved_accounts"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#FFF8F1] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-[#E8E5E0] space-y-4 text-[#23404A]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E5E0]">
                <button
                  id="btn-saved-accounts-back"
                  onClick={() => setViewState('welcome')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#23404A] hover:text-[#FF6B35] transition-colors py-1 px-2.5 rounded-lg hover:bg-black/5 font-manrope cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </button>
                <h2 className="text-[#23404A] text-lg sm:text-xl font-extrabold uppercase font-outfit">
                  CUENTAS GUARDADAS
                </h2>
                <div className="w-16" />
              </div>

              <p className="text-xs text-neutral-600 font-manrope">
                Selecciona una cuenta registrada para ingresar inmediatamente sin reescribir tus datos:
              </p>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {accounts.map(acc => {
                  const isCurrent = user?.correo?.toLowerCase() === acc.correo.toLowerCase();
                  return (
                    <div
                      key={acc.id_usuario}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-amber-50/80 border-[#FF6B35] shadow-xs'
                          : 'bg-white border-[#E8E5E0] hover:border-neutral-400'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          switchAccount(acc.id_usuario);
                        }}
                        className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                      >
                        <img
                          src={acc.avatar}
                          alt={acc.nombre}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#23404A] truncate font-outfit">
                              {acc.nombre}
                            </h4>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full font-outfit uppercase ${
                                acc.role === UserRole.ANFITRION
                                  ? 'bg-[#162A31] text-white'
                                  : 'bg-[#FF6B35] text-white'
                              }`}
                            >
                              {acc.role === UserRole.ANFITRION ? 'Anfitrión' : 'Turista'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 truncate font-manrope">{acc.correo}</p>
                          {acc.ciudad && (
                            <p className="text-[11px] text-neutral-400 font-manrope flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {acc.ciudad}
                            </p>
                          )}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteSavedAccount(acc.id_usuario)}
                        title="Eliminar de este dispositivo"
                        className="p-2 text-neutral-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setViewState('register');
                  }}
                  className="w-full py-3 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xs transition-all font-outfit cursor-pointer"
                >
                  + REGISTRAR OTRA CUENTA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setViewState('login');
                  }}
                  className="w-full py-2.5 rounded-full bg-transparent hover:bg-black/5 text-[#23404A] font-bold text-xs font-manrope cursor-pointer"
                >
                  Iniciar sesión con otro correo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
