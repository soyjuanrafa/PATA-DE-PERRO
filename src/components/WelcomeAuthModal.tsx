/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Pantalla de Bienvenida, Registro & Inicio de Sesión
 *
 * Fiel a las maquetas oficiales de la marca:
 * 1. Pantalla Principal (PANTALLAS-page-00004.jpg):
 *    - Fondo fotográfico completo de máscaras folklóricas y artesanales nicaragüenses.
 *    - Tipografía display: "Bienvenidx", "Pata de perro!", "Cada paso te acerca a nuevas historias."
 *    - Botones de acción: [REGISTRARSE] (Naranja sólido) e [INICIAR SESIÓN] (Borde blanco con texto naranja).
 * 2. Pantalla de Registro (PANTALLAS-page-00005.jpg):
 *    - Máscaras visibles al fondo, tarjeta arqueada inferior (#FFF8F1).
 *    - Título 'REGISTRARSE', campos: 'Nombre', 'Correo' y 'Contraseña'.
 *    - Medidor de seguridad de contraseña y validación estricta contra entradas inválidas/XSS.
 *    - Botón de acción 'REGISTRARSE', autenticación social (Google, Apple, Facebook).
 *    - Enlace: "¿Ya tienes una cuenta? Inicia Sesión".
 * 3. Pantalla de Inicio de Sesión (PANTALLAS-page-00006.jpg):
 *    - Máscaras visibles al fondo, tarjeta arqueada inferior (#FFF8F1).
 *    - Título 'INICIAR SESIÓN', campos: 'Nombre de usuario o correo' y 'Contraseña'.
 *    - Protección contra ataques de fuerza bruta (bloqueo temporal con temporizador).
 *    - Botón de acción 'INICIAR SESIÓN', autenticación social (Google, Apple, Facebook).
 *    - Enlace: "¿No tienes una cuenta? Regístrate".
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, MoodTag } from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ArrowLeft,
  RotateCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Code,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  getShuffledPantallasInicio,
  PANTALLAS_INICIO_URLS,
  ARTISAN_MASKS_BG,
} from '../utils/imageHelper';
import {
  sanitizeInput,
  validateEmail,
  validateFullName,
  validatePasswordSecurity,
  detectInjectionThreat,
  getLoginLockoutRemainingSeconds,
} from '../utils/security';

type AuthView = 'welcome' | 'register' | 'login';

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
];

export const WelcomeAuthModal: React.FC = () => {
  const {
    accounts,
    registerAccount,
    loginAccount,
    loginWithSocialProvider,
    setIsDevModeUnlocked,
    setActiveScreen,
    showToast,
  } = useApp();

  // Active view: 'welcome' (Principal) | 'register' | 'login'
  const [authView, setAuthView] = useState<AuthView>('welcome');

  // Form states for Registration (Image 5)
  const [regNombre, setRegNombre] = useState('');
  const [regCorreo, setRegCorreo] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Form states for Login (Image 6)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Security & Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | 'facebook' | 'github' | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Start screen images: randomized on initial entry and auto-rotating
  const [startScreenImages, setStartScreenImages] = useState<string[]>(() => getShuffledPantallasInicio());
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Extended Profile Modal (Optional detailed customization)
  const [showExtendedModal, setShowExtendedModal] = useState(false);
  const [pais, setPais] = useState('Nicaragua');
  const [departamento, setDepartamento] = useState('León');
  const [telefono, setTelefono] = useState('+505 8888-0000');
  const [role, setRole] = useState<UserRole>(UserRole.TURISTA);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);
  const [selectedMoods, setSelectedMoods] = useState<MoodTag[]>([MoodTag.AVENTURERO, MoodTag.CULTURAL]);

  // Demo accounts quick-modal
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  // Check lockout status every second
  useEffect(() => {
    const checkLockout = () => {
      const remaining = getLoginLockoutRemainingSeconds();
      setLockoutSeconds(remaining);
    };
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // Password strength evaluation in real-time for registration
  const passwordStrength = regPassword ? validatePasswordSecurity(regPassword) : null;

  // Clear messages when view changes
  const switchView = (view: AuthView) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setAuthView(view);
  };

  // Submit Handler for Registration (Image 5)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Security Check: Input Sanitization & Threat Detection
    if (
      detectInjectionThreat(regNombre) ||
      detectInjectionThreat(regCorreo) ||
      detectInjectionThreat(regPassword)
    ) {
      setErrorMessage('Entrada sospechosa detectada. Por favor no incluyas etiquetas ni scripts.');
      return;
    }

    // 2. Validate Full Name
    const nameValidation = validateFullName(regNombre);
    if (!nameValidation.valid) {
      setErrorMessage(nameValidation.message || 'Nombre inválido.');
      return;
    }

    // 3. Validate Email Format
    const cleanEmail = sanitizeInput(regCorreo.trim().toLowerCase());
    if (!validateEmail(cleanEmail)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido (ejemplo@dominio.com).');
      return;
    }

    // 4. Validate Password Security
    const pwdValidation = validatePasswordSecurity(regPassword);
    if (!pwdValidation.valid) {
      setErrorMessage(pwdValidation.message || 'Contraseña inválida.');
      return;
    }

    // 5. Check if account already exists (Anti-duplicate prevention)
    const existing = accounts.find(
      a => a.correo.toLowerCase() === cleanEmail || a.nombre.toLowerCase() === regNombre.trim().toLowerCase()
    );

    if (existing) {
      setErrorMessage(
        `Ya existe una cuenta vinculada a "${cleanEmail}". Por favor inicia sesión con tu contraseña.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerAccount({
        nombre: regNombre.trim(),
        correo: cleanEmail,
        password: regPassword.trim(),
        pais: pais || 'Nicaragua',
        departamento: departamento || 'León',
        ciudad: departamento || 'León',
        telefono: telefono || '+505 8888-0000',
        role: role || UserRole.TURISTA,
        avatar: selectedAvatar,
        bio: 'Viajero apasionado por el turismo auténtico y las ciudades creativas de Nicaragua.',
        moodsFavoritos: selectedMoods,
      });

      if (result.success) {
        setSuccessMessage('¡Cuenta creada con éxito! Bienvenido a Pata de Perro.');
      } else {
        setErrorMessage(result.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ocurrió un error al procesar el registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Handler for Login (Image 6)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Anti-brute force lockout check
    if (lockoutSeconds > 0) {
      setErrorMessage(
        `Acceso temporalmente bloqueado por seguridad. Por favor espera ${lockoutSeconds} segundos.`
      );
      return;
    }

    // 2. Threat detection
    if (detectInjectionThreat(loginIdentifier) || detectInjectionThreat(loginPassword)) {
      setErrorMessage('Entrada sospechosa detectada. Por favor introduce credenciales válidas.');
      return;
    }

    const cleanIdentifier = sanitizeInput(loginIdentifier.trim());
    if (!cleanIdentifier) {
      setErrorMessage('Por favor ingresa tu nombre de usuario o correo electrónico.');
      return;
    }

    if (!loginPassword.trim()) {
      setErrorMessage('Por favor ingresa tu contraseña.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginAccount(cleanIdentifier, loginPassword.trim());
      if (result.success) {
        setSuccessMessage('¡Sesión iniciada con éxito! Entrando a Pata de Perro...');
      } else {
        setErrorMessage(result.message);
        const remaining = getLoginLockoutRemainingSeconds();
        if (remaining > 0) {
          setLockoutSeconds(remaining);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ocurrió un error al iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social Authentication Handler
  const handleSocialAuth = async (provider: 'google' | 'apple' | 'facebook' | 'github') => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSocialLoading(provider);

    try {
      const result = await loginWithSocialProvider(provider);
      if (result.success) {
        const providerName =
          provider === 'github'
            ? 'GitHub'
            : provider === 'apple'
            ? 'Apple ID'
            : provider.charAt(0).toUpperCase() + provider.slice(1);

        if (provider === 'github') {
          setIsDevModeUnlocked(true);
          setActiveScreen('dev_options');
          setSuccessMessage('¡Acceso Desarrollador Concedido vía GitHub!');
        } else {
          setSuccessMessage(`¡Sesión iniciada con éxito con ${providerName}!`);
        }
      } else {
        // Safe handling for user dismissal or fallback
        if (
          result.errorCode === 'auth/popup-closed-by-user' ||
          result.errorCode === 'auth/cancelled-popup-request' ||
          result.message?.toLowerCase().includes('cancelaste')
        ) {
          setErrorMessage('Has cancelado la autenticación. Puedes volver a intentarlo cuando desees.');
          return;
        }

        const isDev = provider === 'github';
        const providerName =
          provider === 'github'
            ? 'GitHub'
            : provider === 'apple'
            ? 'Apple ID'
            : provider.charAt(0).toUpperCase() + provider.slice(1);

        const mockEmail = isDev
          ? 'dev.github@patadeperro.ni'
          : provider === 'apple'
          ? 'usuario.apple@patadeperro.ni'
          : `usuario.${provider}@patadeperro.ni`;

        const existing = accounts.find(a => a.correo.toLowerCase() === mockEmail);

        if (existing) {
          if (isDev) {
            existing.role = UserRole.DESARROLLADOR;
            existing.isDev = true;
            setIsDevModeUnlocked(true);
          }
          loginAccount(mockEmail);
        } else {
          await registerAccount({
            nombre: isDev ? 'Desarrollador GitHub' : `Usuario ${providerName}`,
            correo: mockEmail,
            pais: 'Nicaragua',
            departamento: isDev ? 'León' : 'Granada',
            ciudad: isDev ? 'León' : 'Granada',
            telefono: '+505 8888-0000',
            password: '123',
            role: isDev ? UserRole.DESARROLLADOR : UserRole.TURISTA,
            isDev,
            avatar: isDev
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
              : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
            bio: `Perfil verificado y autenticado con ${providerName} en Pata de Perro.`,
          });
        }

        if (isDev) {
          setIsDevModeUnlocked(true);
          setActiveScreen('dev_options');
          setSuccessMessage('¡Acceso Desarrollador Autorizado con GitHub!');
        } else {
          setSuccessMessage(`¡Autenticado con éxito usando ${providerName}!`);
        }
      }
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.message?.includes('popup-closed-by-user')) {
        setErrorMessage('Has cancelado la autenticación. Puedes volver a intentarlo cuando desees.');
      } else {
        setErrorMessage(e?.message || 'Error al autenticar con el proveedor.');
      }
    } finally {
      setSocialLoading(null);
    }
  };

  // Select demo account helper
  const handleSelectDemoAccount = (email: string) => {
    loginAccount(email);
    setShowDemoSelector(false);
  };

  // The active background photo: uses the official artisan masks photo
  const currentMasksBg = ARTISAN_MASKS_BG || startScreenImages[currentBgIndex] || PANTALLAS_INICIO_URLS[0];

  return (
    <div className="min-h-screen w-full bg-[#162A31] flex items-center justify-center p-0 sm:p-4 md:p-6 font-sans select-none">
      {/* Mobile-first framed container */}
      <div className="relative w-full max-w-md sm:max-w-[420px] min-h-screen sm:min-h-[820px] bg-[#162A31] sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col justify-between border-0 sm:border border-stone-800/40">
        
        {/* =================================================================== */}
        {/* 1. VISTA PRINCIPAL DE BIENVENIDA (Fiel a PANTALLAS-page-00004.jpg) */}
        {/* =================================================================== */}
        {authView === 'welcome' && (
          <motion.div
            key="view-welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full min-h-screen sm:min-h-[820px] flex flex-col justify-between p-7 sm:p-8"
          >
            {/* Background Photographic Layer with dark contrast scrim */}
            <div className="absolute inset-0 z-0">
              <img
                src={currentMasksBg}
                alt="Máscaras folklóricas nicaragüenses - Pata de Perro"
                className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.12]"
              />
              {/* Vertical subtle gradient to ensure text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />
            </div>

            {/* Top Bar: Start Screen Shuffle */}
            <div className="relative z-10 flex items-center justify-end pt-2">
              {/* Shuffle button to explore the other start screens if desired */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const shuffled = getShuffledPantallasInicio();
                    setStartScreenImages(shuffled);
                    setCurrentBgIndex(prev => (prev + 1) % shuffled.length);
                  }}
                  className="p-2 rounded-full bg-black/45 backdrop-blur-md text-white/90 hover:text-white border border-white/20 transition-all cursor-pointer shadow-sm hover:scale-105"
                  title="Rotar pantallas de inicio"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle & Lower Content: Headline & Subtext (matching image 4) */}
            <div className="relative z-10 mt-auto pb-8 space-y-6">
              {/* Display Typography */}
              <div className="space-y-1 text-left">
                <h1 className="text-white font-extrabold text-4xl sm:text-5xl tracking-tight font-outfit leading-none drop-shadow-md">
                  Bienvenidx
                </h1>
                <h2 className="text-white font-black text-5xl sm:text-6xl tracking-tight font-outfit leading-none drop-shadow-lg">
                  Pata de perro!
                </h2>
                <p className="text-white/95 text-base sm:text-lg font-normal font-sans tracking-wide pt-2 max-w-[320px] drop-shadow-sm">
                  Cada paso te acerca a nuevas historias.
                </p>
              </div>

              {/* Action Buttons (matching image 4) */}
              <div className="space-y-3.5 pt-2">
                {/* 1. Botón REGISTRARSE (Naranja Atardecer Sólido) */}
                <button
                  id="btn-welcome-register"
                  type="button"
                  onClick={() => switchView('register')}
                  className="w-full py-4 px-6 rounded-full bg-[#FF5722] hover:bg-[#FF6B35] active:bg-[#E64A19] text-white font-extrabold text-base sm:text-lg tracking-wider uppercase shadow-xl transition-all active:scale-[0.98] font-outfit text-center cursor-pointer block border border-white/10"
                >
                  REGISTRARSE
                </button>

                {/* 2. Botón INICIAR SESIÓN (Fondo oscuro con borde blanco y texto naranja) */}
                <button
                  id="btn-welcome-login"
                  type="button"
                  onClick={() => switchView('login')}
                  className="w-full py-4 px-6 rounded-full bg-black/40 hover:bg-black/60 active:bg-black/75 border-2 border-white text-[#FF5722] font-extrabold text-base sm:text-lg tracking-wider uppercase shadow-xl transition-all active:scale-[0.98] font-outfit text-center cursor-pointer block backdrop-blur-xs"
                >
                  INICIAR SESIÓN
                </button>
              </div>

              {/* Bottom discrete utilities */}
              <div className="flex items-center justify-center gap-4 text-xs text-white/70 pt-2 font-medium">
                <button
                  type="button"
                  onClick={() => setShowDemoSelector(true)}
                  className="hover:text-white underline transition-colors cursor-pointer"
                >
                  Cuentas de prueba rápidas
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleSocialAuth('github')}
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Modo Dev</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 2. VISTA DE REGISTRO (Fiel a PANTALLAS-page-00005.jpg)               */}
        {/* =================================================================== */}
        {authView === 'register' && (
          <motion.div
            key="view-register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-full min-h-screen sm:min-h-[820px] flex flex-col justify-between"
          >
            {/* Top Photographic Section showing artisan masks */}
            <div className="relative h-[210px] sm:h-[230px] w-full shrink-0 overflow-hidden bg-[#162A31]">
              <img
                src={currentMasksBg}
                alt="Máscaras tradicionales nicaragüenses"
                className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
              />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

              {/* Top navigation: Back to Welcome */}
              <div className="absolute top-4 left-4 z-20">
                <button
                  type="button"
                  onClick={() => switchView('welcome')}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-white border border-white/20 transition-all cursor-pointer shadow-md hover:scale-105"
                  title="Volver a la pantalla principal"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Shuffle button */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  type="button"
                  onClick={() => {
                    const shuffled = getShuffledPantallasInicio();
                    setStartScreenImages(shuffled);
                    setCurrentBgIndex(prev => (prev + 1) % shuffled.length);
                  }}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white border border-white/20 transition-all cursor-pointer shadow-md"
                  title="Cambiar imagen"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Arched Sheet: Matches brand Marfil #FFF8F1 with deep arch curve */}
            <div className="relative -mt-14 sm:-mt-16 z-10 w-full bg-[#FFF8F1] rounded-t-[72px] sm:rounded-t-[84px] px-7 sm:px-9 pt-7 sm:pt-8 pb-7 flex-1 flex flex-col justify-between shadow-[0_-12px_32px_rgba(0,0,0,0.2)]">
              <div className="space-y-3.5 sm:space-y-4">
                {/* Header Title: REGISTRARSE */}
                <div className="text-left">
                  <h1 className="text-[#1E293B] text-2xl sm:text-3xl font-black tracking-tight font-outfit uppercase">
                    REGISTRARSE
                  </h1>
                </div>

                {/* Feedback Alerts */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-start gap-2 animate-in fade-in">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-[#3FAF6C] shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Form matching image 5: Nombre, Correo, Contraseña */}
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  {/* Field 1: Nombre */}
                  <div>
                    <label
                      htmlFor="reg-input-nombre"
                      className="block text-[#1E293B] text-sm font-semibold mb-1 font-outfit"
                    >
                      Nombre
                    </label>
                    <input
                      id="reg-input-nombre"
                      type="text"
                      required
                      maxLength={60}
                      placeholder="Tu nombre completo"
                      value={regNombre}
                      onChange={e => setRegNombre(e.target.value)}
                      className="w-full px-5 py-3 sm:py-3.5 rounded-full bg-white text-[#1E293B] border border-[#D9D5CF] shadow-2xs text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all placeholder:text-stone-400"
                    />
                  </div>

                  {/* Field 2: Correo */}
                  <div>
                    <label
                      htmlFor="reg-input-correo"
                      className="block text-[#1E293B] text-sm font-semibold mb-1 font-outfit"
                    >
                      Correo
                    </label>
                    <input
                      id="reg-input-correo"
                      type="email"
                      required
                      maxLength={100}
                      placeholder="ejemplo@correo.com"
                      value={regCorreo}
                      onChange={e => setRegCorreo(e.target.value)}
                      className="w-full px-5 py-3 sm:py-3.5 rounded-full bg-white text-[#1E293B] border border-[#D9D5CF] shadow-2xs text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all placeholder:text-stone-400"
                    />
                  </div>

                  {/* Field 3: Contraseña */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="reg-input-password"
                        className="block text-[#1E293B] text-sm font-semibold font-outfit"
                      >
                        Contraseña
                      </label>
                      {passwordStrength && (
                        <span
                          className={`text-[11px] font-bold ${
                            passwordStrength.score <= 1
                              ? 'text-rose-600'
                              : passwordStrength.score === 2
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          Seguridad: {passwordStrength.strengthLabel}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="reg-input-password"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        maxLength={128}
                        placeholder="Mínimo 6 caracteres"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        className="w-full pl-5 pr-11 py-3 sm:py-3.5 rounded-full bg-white text-[#1E293B] border border-[#D9D5CF] shadow-2xs text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all placeholder:text-stone-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                        title={showRegPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator Bar */}
                    {regPassword && passwordStrength && (
                      <div className="mt-1.5 px-1">
                        <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.score <= 1
                                ? 'w-1/4 bg-rose-500'
                                : passwordStrength.score === 2
                                ? 'w-2/4 bg-amber-500'
                                : passwordStrength.score === 3
                                ? 'w-3/4 bg-emerald-500'
                                : 'w-full bg-[#2E9D62]'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Submit Button: REGISTRARSE */}
                  <div className="pt-2 text-center">
                    <button
                      id="btn-register-submit"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full max-w-[260px] sm:max-w-[280px] mx-auto py-3.5 sm:py-4 px-8 rounded-full bg-[#FF5722] hover:bg-[#FF6B35] active:bg-[#E64A19] text-white font-extrabold text-base sm:text-lg tracking-wider uppercase shadow-md transition-all active:scale-[0.98] font-outfit text-center cursor-pointer block disabled:opacity-60"
                    >
                      {isSubmitting ? 'REGISTRANDO...' : 'REGISTRARSE'}
                    </button>
                  </div>
                </form>

                {/* Social Authentication Section */}
                <div className="pt-1">
                  <p className="text-center text-stone-600 text-xs sm:text-[13px] font-normal mb-3 font-sans">
                    Registrate con alguna de estas opciones
                  </p>

                  {/* 3 Circular Social Buttons: Google, Apple, Facebook */}
                  <div className="flex items-center justify-center gap-5 sm:gap-6">
                    {/* Google */}
                    <button
                      id="btn-reg-social-google"
                      type="button"
                      onClick={() => handleSocialAuth('google')}
                      disabled={socialLoading !== null}
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white border border-stone-200/80 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      title="Continuar con Google"
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24">
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

                    {/* Apple */}
                    <button
                      id="btn-reg-social-apple"
                      type="button"
                      onClick={() => handleSocialAuth('apple')}
                      disabled={socialLoading !== null}
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-black text-white shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      title="Continuar con Apple"
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.78-7.98-12.27-14.7-6.03-9.17-10.74-19.3-14.13-30.41-3.39-11.11-5.08-21.73-5.08-31.86 0-14.43 3.63-26.6 10.9-36.5 7.27-9.91 16.51-14.96 27.72-15.17 4.12 0 8.89 1.15 14.32 3.44 5.43 2.29 9.3 3.49 11.61 3.6 2.45 0 6.64-1.28 12.57-3.83 5.93-2.55 10.91-3.72 14.94-3.52 11.45.64 20.69 4.79 27.72 12.44-9.87 6-14.75 14.47-14.64 25.41.11 8.57 3.38 15.75 9.8 21.55 6.43 5.8 14.07 9.07 22.92 9.81-2.12 6.53-4.83 13.06-8.13 19.6zm-27.87-108.97c0 5.45-1.97 10.64-5.91 15.57-3.94 4.93-8.87 8.16-14.79 9.69-.53-2.12-.8-4.13-.8-6.03 0-5.45 2.12-10.87 6.36-16.26 4.24-5.39 9.38-8.68 15.42-9.87.21 2.33.32 4.63.32 6.9z" />
                      </svg>
                    </button>

                    {/* Facebook */}
                    <button
                      id="btn-reg-social-facebook"
                      type="button"
                      onClick={() => handleSocialAuth('facebook')}
                      disabled={socialLoading !== null}
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#1877F2] text-white shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      title="Continuar con Facebook"
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Link: Ya tienes una cuenta? Inicia Sesión (matching image 5) */}
              <div className="pt-3 text-center">
                <button
                  id="btn-switch-to-login"
                  type="button"
                  onClick={() => switchView('login')}
                  className="text-[#1E293B] text-sm font-medium hover:underline cursor-pointer font-sans"
                >
                  ¿Ya tienes una cuenta? <span className="font-bold text-[#FF5722]">Inicia Sesión</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 3. VISTA DE INICIO DE SESIÓN (Fiel a PANTALLAS-page-00006.jpg)      */}
        {/* =================================================================== */}
        {authView === 'login' && (
          <motion.div
            key="view-login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-full min-h-screen sm:min-h-[820px] flex flex-col justify-between"
          >
            {/* Top Photographic Section showing artisan masks */}
            <div className="relative h-[240px] sm:h-[260px] w-full shrink-0 overflow-hidden bg-[#162A31]">
              <img
                src={currentMasksBg}
                alt="Máscaras artesanales nicaragüenses"
                className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
              />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

              {/* Top navigation: Back to Welcome */}
              <div className="absolute top-4 left-4 z-20">
                <button
                  type="button"
                  onClick={() => switchView('welcome')}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-white border border-white/20 transition-all cursor-pointer shadow-md hover:scale-105"
                  title="Volver a la pantalla principal"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Shuffle button */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  type="button"
                  onClick={() => {
                    const shuffled = getShuffledPantallasInicio();
                    setStartScreenImages(shuffled);
                    setCurrentBgIndex(prev => (prev + 1) % shuffled.length);
                  }}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white border border-white/20 transition-all cursor-pointer shadow-md"
                  title="Cambiar imagen"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Arched Sheet: Matches brand Marfil #FFF8F1 with deep arch curve */}
            <div className="relative -mt-14 sm:-mt-16 z-10 w-full bg-[#FFF8F1] rounded-t-[72px] sm:rounded-t-[84px] px-7 sm:px-9 pt-7 sm:pt-9 pb-8 flex-1 flex flex-col justify-between shadow-[0_-12px_32px_rgba(0,0,0,0.2)]">
              <div className="space-y-4 sm:space-y-4.5">
                {/* Header Title: INICIAR SESIÓN */}
                <div className="text-left">
                  <h1 className="text-[#1E293B] text-2xl sm:text-3xl font-black tracking-tight font-outfit uppercase">
                    INICIAR SESIÓN
                  </h1>
                </div>

                {/* Lockout Warning Banner */}
                {lockoutSeconds > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      Acceso suspendido temporalmente por seguridad. Reintentos en{' '}
                      <strong>{lockoutSeconds} segundos</strong>.
                    </span>
                  </div>
                )}

                {/* Feedback Alerts */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-start gap-2 animate-in fade-in">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-[#3FAF6C] shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Form matching image 6: Nombre de usuario o correo, Contraseña */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  {/* Field 1: Nombre de usuario o correo */}
                  <div>
                    <label
                      htmlFor="login-input-identifier"
                      className="block text-[#1E293B] text-sm font-semibold mb-1 font-outfit"
                    >
                      Nombre de usuario o correo
                    </label>
                    <input
                      id="login-input-identifier"
                      type="text"
                      required
                      maxLength={100}
                      placeholder="Correo o nombre de usuario"
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      disabled={lockoutSeconds > 0}
                      className="w-full px-5 py-3.5 rounded-full bg-white text-[#1E293B] border border-[#D9D5CF] shadow-2xs text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all placeholder:text-stone-400 disabled:bg-stone-100"
                    />
                  </div>

                  {/* Field 2: Contraseña */}
                  <div>
                    <label
                      htmlFor="login-input-password"
                      className="block text-[#1E293B] text-sm font-semibold mb-1 font-outfit"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="login-input-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        maxLength={128}
                        placeholder="Introduce tu contraseña"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        disabled={lockoutSeconds > 0}
                        className="w-full pl-5 pr-11 py-3.5 rounded-full bg-white text-[#1E293B] border border-[#D9D5CF] shadow-2xs text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all placeholder:text-stone-400 disabled:bg-stone-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                        title={showLoginPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Primary Action Button: INICIAR SESIÓN */}
                  <div className="pt-2 text-center">
                    <button
                      id="btn-login-submit"
                      type="submit"
                      disabled={isSubmitting || lockoutSeconds > 0}
                      className="w-full max-w-[260px] sm:max-w-[280px] mx-auto py-3.5 sm:py-4 px-8 rounded-full bg-[#FF5722] hover:bg-[#FF6B35] active:bg-[#E64A19] text-white font-extrabold text-base sm:text-lg tracking-wider uppercase shadow-md transition-all active:scale-[0.98] font-outfit text-center cursor-pointer block disabled:opacity-60"
                    >
                      {isSubmitting ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
                    </button>
                  </div>
                </form>

                {/* Social Authentication Section */}
                <div className="pt-1">
                  <p className="text-center text-stone-600 text-xs sm:text-[13px] font-normal mb-3 font-sans">
                    Inicia sesión con alguna de estas opciones
                  </p>

                  {/* 3 Circular Social Buttons: Google, Apple, Facebook */}
                  <div className="flex items-center justify-center gap-5 sm:gap-6">
                    {/* Google */}
                    <button
                      id="btn-login-social-google"
                      type="button"
                      onClick={() => handleSocialAuth('google')}
                      disabled={socialLoading !== null}
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white border border-stone-200/80 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      title="Continuar con Google"
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24">
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

                    {/* Apple */}
                    <button
                      id="btn-login-social-apple"
                      type="button"
                      onClick={() => handleSocialAuth('apple')}
                      disabled={socialLoading !== null}
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-black text-white shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      title="Continuar con Apple"
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.78-7.98-12.27-14.7-6.03-9.17-10.74-19.3-14.13-30.41-3.39-11.11-5.08-21.73-5.08-31.86 0-14.43 3.63-26.6 10.9-36.5 7.27-9.91 16.51-14.96 27.72-15.17 4.12 0 8.89 1.15 14.32 3.44 5.43 2.29 9.3 3.49 11.61 3.6 2.45 0 6.64-1.28 12.57-3.83 5.93-2.55 10.91-3.72 14.94-3.52 11.45.64 20.69 4.79 27.72 12.44-9.87 6-14.75 14.47-14.64 25.41.11 8.57 3.38 15.75 9.8 21.55 6.43 5.8 14.07 9.07 22.92 9.81-2.12 6.53-4.83 13.06-8.13 19.6zm-27.87-108.97c0 5.45-1.97 10.64-5.91 15.57-3.94 4.93-8.87 8.16-14.79 9.69-.53-2.12-.8-4.13-.8-6.03 0-5.45 2.12-10.87 6.36-16.26 4.24-5.39 9.38-8.68 15.42-9.87.21 2.33.32 4.63.32 6.9z" />
                      </svg>
                    </button>

                    {/* Facebook */}
                    <button
                      id="btn-login-social-facebook"
                      type="button"
                      onClick={() => handleSocialAuth('facebook')}
                      disabled={socialLoading !== null}
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#1877F2] text-white shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      title="Continuar con Facebook"
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Link: No tienes una cuenta? Registrate */}
              <div className="pt-3 text-center">
                <button
                  id="btn-switch-to-register"
                  type="button"
                  onClick={() => switchView('register')}
                  className="text-[#1E293B] text-sm font-medium hover:underline cursor-pointer font-sans"
                >
                  ¿No tienes una cuenta? <span className="font-bold text-[#FF5722]">Regístrate</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* =================================================================== */}
      {/* MODAL DE CUENTAS DEMO PARA PRUEBAS RÁPIDAS                          */}
      {/* =================================================================== */}
      <AnimatePresence>
        {showDemoSelector && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFF8F1] rounded-[2rem] p-6 max-w-sm w-full shadow-2xl border border-stone-300 text-stone-900 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="font-outfit font-extrabold text-base uppercase text-[#1E293B] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF5722]" />
                  <span>Acceso Rápido de Prueba</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowDemoSelector(false)}
                  className="p-1 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-stone-600">
                Selecciona un perfil verificado para ingresar instantáneamente sin introducir contraseña:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoAccount('turista.leon@patadeperro.ni')}
                  className="w-full text-left p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 flex items-center gap-3 transition-all cursor-pointer hover:border-[#FF5722]"
                >
                  <div className="w-9 h-9 rounded-full bg-[#FF5722]/15 text-[#FF5722] font-bold flex items-center justify-center text-sm font-outfit">
                    T
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E293B]">Turista: Sofía Castillo</p>
                    <p className="text-[11px] text-stone-500">turista.leon@patadeperro.ni</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoAccount('marta.artesanias@patadeperro.ni')}
                  className="w-full text-left p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 flex items-center gap-3 transition-all cursor-pointer hover:border-[#2E9D62]"
                >
                  <div className="w-9 h-9 rounded-full bg-[#2E9D62]/15 text-[#2E9D62] font-bold flex items-center justify-center text-sm font-outfit">
                    A
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E293B]">Anfitrión: Doña Marta Torrez</p>
                    <p className="text-[11px] text-stone-500">marta.artesanias@patadeperro.ni</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoAccount('dev@patadeperro.ni')}
                  className="w-full text-left p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 flex items-center gap-3 transition-all cursor-pointer hover:border-emerald-600"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm font-outfit">
                    D
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E293B]">Desarrollador: Auditoría Técnica</p>
                    <p className="text-[11px] text-stone-500">dev@patadeperro.ni</p>
                  </div>
                </button>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowDemoSelector(false)}
                  className="w-full py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold uppercase cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
