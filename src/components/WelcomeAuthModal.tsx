/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Welcome & Auth Screen Component - Recreates Screenshots 4, 5, and 6
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { sanitizeInput, validateEmail } from '../utils/security';
import { UserRole } from '../types';
import { ShieldAlert } from 'lucide-react';

export const WelcomeAuthModal: React.FC = () => {
  const { setActiveScreen, setUser, setUserRole, showToast } = useApp();
  const [viewState, setViewState] = useState<'welcome' | 'register' | 'login'>('welcome');

  // Form states
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const sanitizedNombre = sanitizeInput(nombre.trim());
    const sanitizedCorreo = sanitizeInput(correo.trim());

    if (!sanitizedNombre) {
      setErrorMessage('Por favor ingresa tu nombre.');
      return;
    }

    if (!validateEmail(sanitizedCorreo)) {
      setErrorMessage('Ingresa un correo electrónico válido (ej: usuario@dominio.com).');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    // Set authenticated user state
    setUser({
      id_turista: `usr_${Date.now()}`,
      nombre: sanitizedNombre,
      correo: sanitizedCorreo,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });
    setUserRole(UserRole.TURISTA);
    showToast(`¡Bienvenido a Pata de Perro, ${sanitizedNombre}!`);
    setActiveScreen('explore');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const sanitizedCorreo = sanitizeInput(correo.trim());

    if (!sanitizedCorreo) {
      setErrorMessage('Ingresa tu nombre de usuario o correo.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Contraseña incorrecta.');
      return;
    }

    setUser({
      id_turista: 'usr_demo_01',
      nombre: sanitizedCorreo.split('@')[0] || 'Sofía Guevara',
      correo: sanitizedCorreo.includes('@') ? sanitizedCorreo : `${sanitizedCorreo}@patadeperro.ni`,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    });
    setUserRole(UserRole.TURISTA);
    showToast('Sesión iniciada correctamente.');
    setActiveScreen('explore');
  };

  const handleSocialAuth = (provider: string) => {
    setUser({
      id_turista: `usr_social_${Date.now()}`,
      nombre: `Usuario ${provider}`,
      correo: `usuario.${provider.toLowerCase()}@ejemplo.com`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });
    setUserRole(UserRole.TURISTA);
    showToast(`Sesión iniciada con ${provider}.`);
    setActiveScreen('explore');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#162A31] flex items-center justify-center p-4">
      {/* Background Mask Image (Traditional Nicaragua Folklore Masks) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80"
          alt="Máscaras folklóricas nicaragüenses"
          className="w-full h-full object-cover filter brightness-[0.45] contrast-110"
        />
        <div className="absolute inset-0 bg-[#162A31]/50 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {/* SCREEN 4: WELCOME SCREEN */}
          {viewState === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-end min-h-[540px] space-y-5 pb-8"
            >
              <div className="text-left w-full space-y-2 mb-6 px-2">
                <h1 className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight font-outfit leading-none">
                  Bienvenidx
                </h1>
                <h2 className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight font-outfit leading-none text-[#FF6B35]">
                  Pata de perro!
                </h2>
                <p className="text-[#FFF8F1]/90 text-sm font-medium pt-2 font-manrope">
                  Cada paso te acerca a nuevas historias.
                </p>
              </div>

              {/* Orange Register Button */}
              <button
                id="btn-welcome-register"
                onClick={() => setViewState('register')}
                className="w-full py-4 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-base sm:text-lg tracking-wider uppercase shadow-xl transition-all font-outfit active:scale-98 text-center cursor-pointer"
              >
                REGISTRARSE
              </button>

              {/* Outlined Login Button */}
              <button
                id="btn-welcome-login"
                onClick={() => setViewState('login')}
                className="w-full py-4 rounded-full bg-transparent hover:bg-white/10 text-[#FF6B35] font-extrabold text-base sm:text-lg tracking-wider uppercase border-2 border-white text-center transition-all font-outfit active:scale-98 cursor-pointer"
              >
                INICIAR SESIÓN
              </button>

              {/* Continue as Guest */}
              <button
                id="btn-welcome-guest"
                onClick={() => {
                  showToast('Explorando como invitado.');
                  setActiveScreen('explore');
                }}
                className="text-[#FFF8F1]/80 hover:text-white text-xs font-semibold underline underline-offset-4 pt-2 font-manrope cursor-pointer"
              >
                Explorar catálogo como invitado
              </button>
            </motion.div>
          )}

          {/* SCREEN 5: REGISTER FORM */}
          {viewState === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="bg-[#FFF8F1] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-[#E8E5E0] space-y-6 text-[#23404A]"
            >
              <h2 className="text-[#23404A] text-2xl sm:text-3xl font-extrabold tracking-tight text-center uppercase font-outfit">
                REGISTRARSE
              </h2>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-ibm-plex">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Nombre
                  </label>
                  <input
                    id="input-register-name"
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full px-5 py-3 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Correo
                  </label>
                  <input
                    id="input-register-email"
                    type="email"
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-5 py-3 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Contraseña
                  </label>
                  <input
                    id="input-register-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                  />
                </div>

                <button
                  id="btn-submit-register"
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-md transition-all font-outfit cursor-pointer"
                >
                  REGISTRARSE
                </button>
              </form>

              {/* Social Login Buttons */}
              <div className="text-center space-y-3 pt-2">
                <p className="text-[#9A9A9A] text-xs font-medium font-manrope">
                  Regístrate con alguna de estas opciones
                </p>

                <div className="flex items-center justify-center gap-4">
                  {/* Google Icon */}
                  <button
                    onClick={() => handleSocialAuth('Google')}
                    className="w-12 h-12 rounded-full bg-white shadow-md border border-[#E8E5E0] flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Google"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
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

                  {/* Apple Icon */}
                  <button
                    onClick={() => handleSocialAuth('Apple')}
                    className="w-12 h-12 rounded-full bg-[#23404A] shadow-md text-white flex items-center justify-center hover:bg-[#162A31] transition-colors cursor-pointer"
                    title="Apple"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.04-1.89-14.12-6.07-3.37-2.82-7.22-7.46-11.56-13.93-7.5-11.1-13.27-23.75-17.3-37.96-4.04-14.21-6.06-27.18-6.06-38.9 0-16.71 4.29-30.34 12.87-40.89 8.58-10.55 19.3-15.93 32.17-16.14 4.57 0 9.77 1.15 15.61 3.45 5.84 2.3 9.77 3.45 11.79 3.45 1.62 0 5.54-1.15 11.75-3.45 6.21-2.3 11.04-3.37 14.49-3.21 11.97.63 21.84 5.37 29.61 14.21-10.76 6.52-16.02 15.61-15.77 27.27.25 11.66 4.96 21.05 14.13 28.16 4.12 3.26 8.71 5.66 13.78 7.2-2.73 8.04-6.39 16.02-10.98 23.94zM119.22 31.06c0-7.39 2.67-14.52 8-21.39 5.34-6.87 12.04-11.13 20.1-12.78.38 1.13.57 2.26.57 3.39 0 7.39-2.7 14.56-8.1 21.52-5.4 6.96-12.21 11.22-20.43 12.78-.07-1.13-.14-2.26-.14-3.52z" />
                    </svg>
                  </button>

                  {/* Facebook Icon */}
                  <button
                    onClick={() => handleSocialAuth('Facebook')}
                    className="w-12 h-12 rounded-full bg-[#1877F2] shadow-md text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                    title="Facebook"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setViewState('login')}
                    className="text-[#23404A] text-xs font-semibold hover:underline font-manrope cursor-pointer"
                  >
                    ¿Ya tienes una cuenta? <span className="font-bold text-[#FF6B35]">Inicia Sesión</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN 6: LOGIN FORM */}
          {viewState === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="bg-[#FFF8F1] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-[#E8E5E0] space-y-6 text-[#23404A]"
            >
              <h2 className="text-[#23404A] text-2xl sm:text-3xl font-extrabold tracking-tight text-center uppercase font-outfit">
                INICIAR SESIÓN
              </h2>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-ibm-plex">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Nombre de usuario o correo
                  </label>
                  <input
                    id="input-login-username"
                    type="text"
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
                    placeholder="usuario@patadeperro.ni"
                    className="w-full px-5 py-3 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23404A] mb-1 font-manrope">
                    Contraseña
                  </label>
                  <input
                    id="input-login-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3 rounded-full bg-white border border-[#E8E5E0] text-sm text-[#23404A] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] font-manrope"
                  />
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-full bg-[#FF6B35] hover:bg-[#ff5518] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-md transition-all font-outfit cursor-pointer"
                >
                  INICIAR SESIÓN
                </button>
              </form>

              {/* Social Login Buttons */}
              <div className="text-center space-y-3 pt-2">
                <p className="text-[#9A9A9A] text-xs font-medium font-manrope">
                  Inicia sesión con alguna de estas opciones
                </p>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleSocialAuth('Google')}
                    className="w-12 h-12 rounded-full bg-white shadow-md border border-[#E8E5E0] flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Google"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                    onClick={() => handleSocialAuth('Apple')}
                    className="w-12 h-12 rounded-full bg-[#23404A] shadow-md text-white flex items-center justify-center hover:bg-[#162A31] transition-colors cursor-pointer"
                    title="Apple"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.04-1.89-14.12-6.07-3.37-2.82-7.22-7.46-11.56-13.93-7.5-11.1-13.27-23.75-17.3-37.96-4.04-14.21-6.06-27.18-6.06-38.9 0-16.71 4.29-30.34 12.87-40.89 8.58-10.55 19.3-15.93 32.17-16.14 4.57 0 9.77 1.15 15.61 3.45 5.84 2.3 9.77 3.45 11.79 3.45 1.62 0 5.54-1.15 11.75-3.45 6.21-2.3 11.04-3.37 14.49-3.21 11.97.63 21.84 5.37 29.61 14.21-10.76 6.52-16.02 15.61-15.77 27.27.25 11.66 4.96 21.05 14.13 28.16 4.12 3.26 8.71 5.66 13.78 7.2-2.73 8.04-6.39 16.02-10.98 23.94zM119.22 31.06c0-7.39 2.67-14.52 8-21.39 5.34-6.87 12.04-11.13 20.1-12.78.38 1.13.57 2.26.57 3.39 0 7.39-2.7 14.56-8.1 21.52-5.4 6.96-12.21 11.22-20.43 12.78-.07-1.13-.14-2.26-.14-3.52z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleSocialAuth('Facebook')}
                    className="w-12 h-12 rounded-full bg-[#1877F2] shadow-md text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                    title="Facebook"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setViewState('register')}
                    className="text-[#23404A] text-xs font-semibold hover:underline font-manrope cursor-pointer"
                  >
                    ¿No tienes una cuenta? <span className="font-bold text-[#FF6B35]">Regístrate</span>
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
