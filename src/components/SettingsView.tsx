/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Settings & About Application Screen
 * Includes Android-style 3-tap rapid trigger on "Versión de la aplicación" to unlock Developer Options
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Settings,
  Info,
  Smartphone,
  Shield,
  Terminal,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  ChevronRight,
  Database,
  Download,
  Upload,
  RefreshCw,
  Sliders,
  Globe,
  Bell,
  Navigation,
  Check,
  AlertTriangle,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  X,
  User,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

const REQUIRED_PIN = '1102';
const APP_VERSION = 'v1.0.0';

export const SettingsView: React.FC = () => {
  const {
    userRole,
    setUserRole,
    user,
    isDevModeUnlocked,
    setIsDevModeUnlocked,
    setActiveScreen,
    exportBackupJSON,
    resetToDefaultData,
    showToast,
  } = useApp();

  // Multi-tap detection state for Version
  const [tapCount, setTapCount] = useState<number>(0);
  const lastTapTimeRef = useRef<number>(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // PIN Modal State
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinValue, setPinValue] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Local preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [locationEnabled, setLocationEnabled] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'USD' | 'NIO'>('USD');
  const [confirmResetOpen, setConfirmResetOpen] = useState<boolean>(false);

  // Handle rapid 3-tap on Application Version
  const handleVersionClick = () => {
    if (isDevModeUnlocked) {
      showToast('Las opciones de desarrollador ya están activadas.');
      return;
    }

    const now = Date.now();
    const timeDiff = now - lastTapTimeRef.current;
    lastTapTimeRef.current = now;

    // Reset count if interval is too long (> 1500ms between taps)
    let currentTaps = tapCount;
    if (timeDiff > 1500 && currentTaps > 0) {
      currentTaps = 0;
    }

    const newTapCount = currentTaps + 1;
    setTapCount(newTapCount);

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    if (newTapCount === 1) {
      // First tap: start timer window
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, 2500);
    } else if (newTapCount === 2) {
      // Second tap: Android-style hint
      showToast('¡Estás a 1 paso de activar las Opciones de desarrollador!');
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, 2500);
    } else if (newTapCount >= 3) {
      // 3 rapid taps achieved! Prompt for security PIN
      setTapCount(0);
      setShowPinModal(true);
      setPinValue('');
      setPinError(null);
    }
  };

  // Submit PIN to unlock developer mode
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinValue.trim() === REQUIRED_PIN) {
      setIsDevModeUnlocked(true);
      setShowPinModal(false);
      setPinValue('');
      setPinError(null);
      // Notification text explicitly requested by user: «"Opciones de desarrollador activadas"»
      showToast('Opciones de desarrollador activadas');
    } else {
      setPinError('PIN de desarrollador incorrecto. Intente nuevamente.');
      setPinValue('');
    }
  };

  // Toggle Developer Mode from settings
  const handleToggleDevMode = () => {
    if (isDevModeUnlocked) {
      setIsDevModeUnlocked(false);
      showToast('Opciones de desarrollador desactivadas');
    } else {
      setShowPinModal(true);
      setPinValue('');
      setPinError(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
            <Settings className="w-4 h-4" />
            <span>Sistema & Preferencias</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-outfit mt-1">
            Configuración
          </h1>
        </div>

        {/* Quick Role status */}
        <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 text-xs font-bold text-stone-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Rol actual: {userRole}</span>
        </div>
      </div>

      {/* SECTION 1: Developer Options (Appears only when isDevModeUnlocked is TRUE) */}
      {isDevModeUnlocked && (
        <section
          id="section-developer-options"
          className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-700 relative overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B35] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20 text-white shrink-0">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold font-outfit text-white">
                    Opciones de desarrollador
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ACTIVADO
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Herramientas avanzadas para auditoría técnica, pruebas y modelos relacionales 3NF.
                </p>
              </div>
            </div>

            {/* Master Switch: Modo desarrollador Activado / Desactivado */}
            <div className="flex items-center gap-3 bg-stone-800/80 px-4 py-2.5 rounded-2xl border border-stone-700">
              <div className="text-right">
                <span className="block text-xs font-bold text-stone-200">Modo desarrollador</span>
                <span className="block text-[10px] text-stone-400">
                  {isDevModeUnlocked ? 'Activado' : 'Desactivado'}
                </span>
              </div>
              <button
                id="toggle-developer-mode-switch"
                onClick={handleToggleDevMode}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isDevModeUnlocked ? 'bg-[#FF6B35]' : 'bg-stone-600'
                }`}
                role="switch"
                aria-checked={isDevModeUnlocked}
                title="Desactivar o activar Modo Desarrollador"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isDevModeUnlocked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Access Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
            <button
              id="btn-dev-goto-full-suite"
              onClick={() => setActiveScreen('dev_options')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/80 hover:border-[#FF6B35] transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white group-hover:text-[#FF6B35] transition-colors">
                    Suite Completa
                  </span>
                  <span className="block text-[10px] text-stone-400">Abrir consola</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-white transition-colors" />
            </button>

            <button
              id="btn-dev-goto-unit-tests"
              onClick={() => setActiveScreen('unit_tests')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/80 hover:border-emerald-500 transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Pruebas Unitarias
                  </span>
                  <span className="block text-[10px] text-stone-400">5 módulos test</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-white transition-colors" />
            </button>

            <button
              id="btn-dev-goto-relational-docs"
              onClick={() => setActiveScreen('tech_docs')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-500 transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    Arquitectura 3NF
                  </span>
                  <span className="block text-[10px] text-stone-400">Diagramas ER</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-white transition-colors" />
            </button>

            <button
              id="btn-dev-export-backup"
              onClick={exportBackupJSON}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/80 hover:border-purple-500 transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                    Respaldo JSON
                  </span>
                  <span className="block text-[10px] text-stone-400">Exportar snapshot</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-white transition-colors" />
            </button>
          </div>
        </section>
      )}

      {/* SECTION 2: Accesos Directos de Cuenta & Soporte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => setActiveScreen('profile')}
          className="bg-white hover:bg-stone-50/80 p-5 rounded-3xl border border-stone-200 shadow-xs cursor-pointer flex items-center justify-between transition-all group hover:border-[#FF6B35]/40"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center font-bold">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-outfit group-hover:text-[#FF6B35] transition-colors">
                Mi Perfil & Redes Sociales
              </h3>
              <p className="text-xs text-stone-500">
                Foto de galería, nombre, contacto y redes
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-800 transition-colors" />
        </div>

        <div
          onClick={() => setActiveScreen('help')}
          className="bg-white hover:bg-stone-50/80 p-5 rounded-3xl border border-stone-200 shadow-xs cursor-pointer flex items-center justify-between transition-all group hover:border-indigo-400"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-outfit group-hover:text-indigo-600 transition-colors">
                Centro de Ayuda & Manual
              </h3>
              <p className="text-xs text-stone-500">
                Preguntas frecuentes y guía de uso de la app
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-800 transition-colors" />
        </div>
      </div>

      {/* SECTION 3: Preferencias de la Cuenta y App */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-outfit">Preferencias Generales</h2>
            <p className="text-xs text-stone-500">Configura la experiencia de navegación y avisos.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-stone-500" />
              <div>
                <span className="block text-xs font-bold text-stone-800">Notificaciones</span>
                <span className="block text-[11px] text-stone-500">Avisos de reservas y confirmaciones</span>
              </div>
            </div>
            <button
              id="toggle-notifications-btn"
              onClick={() => {
                setNotificationsEnabled(!notificationsEnabled);
                showToast(notificationsEnabled ? 'Notificaciones silenciadas' : 'Notificaciones activadas');
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                notificationsEnabled ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Location / AR Sensor Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center gap-3">
              <Navigation className="w-4 h-4 text-stone-500" />
              <div>
                <span className="block text-xs font-bold text-stone-800">Geolocalización RA</span>
                <span className="block text-[11px] text-stone-500">Cálculo de distancias y brújula</span>
              </div>
            </div>
            <button
              id="toggle-location-btn"
              onClick={() => {
                setLocationEnabled(!locationEnabled);
                showToast(locationEnabled ? 'Geolocalización en modo manual' : 'Geolocalización activada');
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                locationEnabled ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  locationEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Currency Selection */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-stone-500" />
              <div>
                <span className="block text-xs font-bold text-stone-800">Moneda de visualización</span>
                <span className="block text-[11px] text-stone-500">Dólares o Córdobas</span>
              </div>
            </div>
            <div className="flex rounded-lg bg-stone-200 p-0.5 text-xs font-bold">
              <button
                onClick={() => {
                  setCurrency('USD');
                  showToast('Moneda establecida en USD ($)');
                }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => {
                  setCurrency('NIO');
                  showToast('Moneda establecida en Córdobas (C$)');
                }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'NIO' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                NIO (C$)
              </button>
            </div>
          </div>

          {/* Role Switching */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div>
              <span className="block text-xs font-bold text-stone-800">Modalidad de Uso</span>
              <span className="block text-[11px] text-stone-500">Cambiar entre Turista y Anfitrión</span>
            </div>
            <button
              onClick={() => {
                const next = userRole === UserRole.TURISTA ? UserRole.ANFITRION : UserRole.TURISTA;
                setUserRole(next);
                showToast(`Rol cambiado a ${next}`);
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 transition-colors cursor-pointer"
            >
              Cambiar a {userRole === UserRole.TURISTA ? 'Anfitrión' : 'Turista'}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: Acerca de la aplicación (Android-style Target) */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="w-10 h-10 rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-outfit">Acerca de la aplicación</h2>
            <p className="text-xs text-stone-500">Información del sistema, autoría y versión de compilación.</p>
          </div>
        </div>

        <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200/70 overflow-hidden bg-stone-50/50">
          {/* Item 1: App Name */}
          <div className="flex items-center justify-between p-4 bg-white hover:bg-stone-50/80 transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-stone-400" />
              <div>
                <span className="block text-xs font-bold text-stone-800">Nombre del Sistema</span>
                <span className="block text-[11px] text-stone-500">Plataforma Pata de Perro</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-stone-700">Ciudades Creativas Nicaragua</span>
          </div>

          {/* Item 2: Versión de la aplicación (TRIGGER: 3 Rapid Taps to unlock Developer Mode) */}
          <div
            id="item-version-app-trigger"
            onClick={handleVersionClick}
            className="flex items-center justify-between p-4 bg-white hover:bg-stone-50 cursor-pointer select-none transition-all active:bg-amber-50/60"
            role="button"
            tabIndex={0}
            title="Toca 3 veces rápidamente para activar las opciones de desarrollador"
          >
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-[#FF6B35]" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="block text-xs font-bold text-stone-900">
                    Versión de la aplicación
                  </span>
                  {isDevModeUnlocked && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800">
                      Dev On
                    </span>
                  )}
                </div>
                <span className="block text-[11px] text-stone-500 font-mono">
                  Compilación de producción estable
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-extrabold font-mono text-stone-800">
                {APP_VERSION}
              </span>
            </div>
          </div>

          {/* Item 3: Developer & Team */}
          <div className="flex items-center justify-between p-4 bg-white hover:bg-stone-50/80 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-stone-400" />
              <div>
                <span className="block text-xs font-bold text-stone-800">Desarrollo e Innovación</span>
                <span className="block text-[11px] text-stone-500">Turismo Auténtico y Sostenible</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-stone-700">Comunidad de Ciudades Creativas</span>
          </div>

          {/* Item 4: License */}
          <div className="flex items-center justify-between p-4 bg-white hover:bg-stone-50/80 transition-colors">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-stone-400" />
              <div>
                <span className="block text-xs font-bold text-stone-800">Licencia de Código</span>
                <span className="block text-[11px] text-stone-500">Protocolo de auditoría</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-stone-700">Apache License 2.0</span>
          </div>
        </div>
      </section>

      {/* SECTION 4: Mantenimiento y Reinicio de Datos */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-outfit">Gestión de Almacenamiento</h2>
            <p className="text-xs text-stone-500">Copia de seguridad local o reinicio de valores predeterminados.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            id="btn-settings-export-json"
            onClick={exportBackupJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer border border-stone-200"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Descargar Respaldo JSON</span>
          </button>

          <button
            id="btn-settings-reset-data"
            onClick={() => setConfirmResetOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer border border-rose-200"
          >
            <RefreshCw className="w-4 h-4 text-rose-600" />
            <span>Restablecer Datos de la App</span>
          </button>
        </div>
      </section>

      {/* SECURITY PIN DIALOG (Triggered after 3 rapid taps) */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-700 text-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center border border-[#FF6B35]/30">
                <KeyRound className="w-6 h-6" />
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold font-outfit text-white">
                Verificación de Desarrollador
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Se detectaron los 3 toques sobre la versión. Ingrese el PIN de seguridad asignado para desbloquear las opciones avanzadas.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  PIN de Autorización (4 dígitos)
                </label>
                <input
                  type="password"
                  id="input-dev-pin-activation"
                  autoFocus
                  maxLength={6}
                  placeholder="• • • •"
                  value={pinValue}
                  onChange={e => {
                    setPinValue(e.target.value);
                    setPinError(null);
                  }}
                  className="w-full text-center text-xl tracking-[0.5em] font-mono py-3 px-4 rounded-2xl bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:outline-hidden focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                />
                {pinError && (
                  <p className="text-xs font-semibold text-rose-400 mt-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {pinError}
                  </p>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-confirm-pin-unlock"
                  className="flex-1 py-2.5 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5514] text-white text-xs font-bold shadow-lg shadow-[#FF6B35]/25 transition-colors cursor-pointer"
                >
                  Confirmar PIN
                </button>
              </div>

              <p className="text-[10px] text-center text-stone-500 font-mono">
                PIN de auditoría por defecto: 1102
              </p>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-outfit">
                ¿Restablecer datos de la aplicación?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Esto restaurará las experiencias, anfitriones y reservas originales. También se desactivará el modo desarrollador.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="flex-1 py-2.5 rounded-2xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setConfirmResetOpen(false);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shadow-md shadow-rose-600/20"
              >
                Restablecer Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
