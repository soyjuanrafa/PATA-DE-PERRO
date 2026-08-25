/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Settings & About Application Screen
 * Includes centralized multi-account management (switching with confirmation modal,
 * logout with confirmation modal, add new account), Android-style 3-tap rapid trigger
 * on "Versión de la aplicación" to unlock Developer Options, and complete system preferences.
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, UserAccount, Turista, Anfitrion } from '../types';
import {
  Settings,
  Info,
  Smartphone,
  Shield,
  ShieldCheck,
  Lock,
  Clock,
  Key,
  Terminal,
  KeyRound,
  CheckCircle2,
  ChevronRight,
  Database,
  Download,
  RefreshCw,
  Globe,
  Bell,
  Navigation,
  AlertTriangle,
  Code2,
  Cpu,
  Layers,
  X,
  User,
  Users,
  LogOut,
  ArrowRightLeft,
  UserPlus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Compass,
} from 'lucide-react';

const REQUIRED_PIN = '1102';
const APP_VERSION = 'v1.0.0';

export const SettingsView: React.FC = () => {
  const {
    userRole,
    setUserRole,
    user,
    accounts,
    switchAccount,
    logoutAccount,
    deleteSavedAccount,
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

  // Account switching and logout confirmation states
  const [switchTargetAccount, setSwitchTargetAccount] = useState<UserAccount | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [deleteTargetAccount, setDeleteTargetAccount] = useState<UserAccount | null>(null);

  // Local preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [locationEnabled, setLocationEnabled] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'USD' | 'NIO'>('USD');
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(30);
  const [confirmResetOpen, setConfirmResetOpen] = useState<boolean>(false);

  // Current active user ID
  const currentUserId = user
    ? 'id_turista' in user
      ? user.id_turista
      : user.id_anfitrion
    : null;

  // Other saved accounts on this device
  const otherAccounts = accounts.filter(
    a => a.id_usuario !== currentUserId && a.correo.toLowerCase() !== user?.correo?.toLowerCase()
  );

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
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, 2500);
    } else if (newTapCount === 2) {
      showToast('¡Estás a 1 paso de activar las Opciones de desarrollador!');
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, 2500);
    } else if (newTapCount >= 3) {
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

  // Execute Account Switch
  const executeAccountSwitch = () => {
    if (!switchTargetAccount) return;
    const success = switchAccount(switchTargetAccount.id_usuario);
    if (success) {
      setSwitchTargetAccount(null);
    }
  };

  // Execute Logout
  const executeLogout = () => {
    setShowLogoutConfirm(false);
    logoutAccount();
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

      {/* SECTION: GESTIÓN DE CUENTAS DE USUARIO (Account Management, Switch & Logout) */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FF6B35]/15 text-[#FF6B35] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-outfit">
                Gestión de Cuentas
              </h2>
              <p className="text-xs text-stone-500">
                Cambia de cuenta con confirmación segura, añade nuevos perfiles o cierra sesión.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-settings-add-account"
              onClick={() => setActiveScreen('welcome')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5518] text-white text-xs font-bold transition-all shadow-xs cursor-pointer font-outfit"
            >
              <UserPlus className="w-4 h-4" />
              <span>Añadir Cuenta</span>
            </button>
          </div>
        </div>

        {/* Current Active Account Card */}
        <div>
          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mb-2 font-ibm-plex">
            Cuenta Activa en Esta Sesión
          </span>
          {user ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F1] border border-[#FF6B35]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    user.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={user.nombre}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#FF6B35] shadow-xs"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-[#23404A] font-outfit">
                      {user.nombre}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FF6B35] text-white uppercase font-ibm-plex">
                      {userRole}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Sesión Activa
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600 font-manrope">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      {user.correo}
                    </span>
                    {user.telefono && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        {user.telefono}
                      </span>
                    )}
                    {(user.pais || user.departamento) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {user.departamento ? `${user.departamento}, ` : ''}{user.pais || 'Nicaragua'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="btn-settings-logout-trigger"
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer font-outfit shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-600 text-xs font-manrope flex items-center justify-between">
              <span>No hay ninguna sesión activa. Estás navegando como invitado.</span>
              <button
                onClick={() => setActiveScreen('welcome')}
                className="px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white font-bold text-xs"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>

        {/* Other Saved Accounts on this device */}
        {otherAccounts.length > 0 && (
          <div className="space-y-2.5">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-stone-500 font-ibm-plex">
              Otras Cuentas Guardadas ({otherAccounts.length})
            </span>
            <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 overflow-hidden bg-stone-50/50">
              {otherAccounts.map(acc => (
                <div
                  key={acc.id_usuario}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        acc.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={acc.nombre}
                      className="w-10 h-10 rounded-full object-cover border border-stone-300"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-stone-900 font-outfit">
                          {acc.nombre}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase font-ibm-plex ${
                            acc.role === UserRole.ANFITRION
                              ? 'bg-stone-800 text-white'
                              : 'bg-[#FF6B35]/20 text-[#FF6B35]'
                          }`}
                        >
                          {acc.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 font-manrope">
                        <span>{acc.correo}</span>
                        {acc.departamento && <span>• {acc.departamento}, {acc.pais || 'Nicaragua'}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Switch button triggering confirmation modal */}
                    <button
                      id={`btn-settings-switch-to-${acc.id_usuario}`}
                      onClick={() => setSwitchTargetAccount(acc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#FF6B35] hover:text-white text-stone-800 text-xs font-bold transition-all border border-stone-200 cursor-pointer font-outfit"
                      title="Cambiar a esta cuenta"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Cambiar a esta cuenta</span>
                    </button>

                    {/* Delete account from device */}
                    <button
                      onClick={() => setDeleteTargetAccount(acc)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eliminar del dispositivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

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

            {/* Master Switch */}
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

      {/* SECTION 2: Preferencias Generales */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-outfit">Preferencias de Experiencia</h2>
            <p className="text-xs text-stone-500">Ajustes visuales, notificaciones y geolocalización.</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-stone-500" />
              <div>
                <span className="block text-xs font-bold text-stone-800">Notificaciones de reservas y mensajes</span>
                <span className="block text-[11px] text-stone-500">Alertas en tiempo real</span>
              </div>
            </div>
            <button
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

          {/* Location Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center gap-3">
              <Navigation className="w-4 h-4 text-stone-500" />
              <div>
                <span className="block text-xs font-bold text-stone-800">Geolocalización Comunitaria</span>
                <span className="block text-[11px] text-stone-500">Ordenar rutas por cercanía en Nicaragua</span>
              </div>
            </div>
            <button
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
              <span className="block text-xs font-bold text-stone-800">Modalidad de Rol Rápido</span>
              <span className="block text-[11px] text-stone-500">Cambiar temporalmente entre Turista y Anfitrión</span>
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

      {/* SECTION 2.5: Seguridad, Autenticación 2FA y Ciclo de Sesión */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-outfit">Seguridad y Protección de Datos</h2>
            <p className="text-xs text-stone-500">2FA, control de sesiones por inactividad y desarrollo seguro.</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* 2FA Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-stone-800">Autenticación de 2 Factores (2FA / OTP)</span>
                <span className="block text-[11px] text-stone-500">Solicitar token de 6 dígitos al iniciar sesión</span>
              </div>
            </div>
            <button
              onClick={() => {
                const nextState = !twoFactorAuth;
                setTwoFactorAuth(nextState);
                showToast(nextState ? '2FA activado: se generó token OTP de verificación' : '2FA desactivado para esta sesión');
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                twoFactorAuth ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  twoFactorAuth ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Session Inactivity Timeout */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="block text-xs font-bold text-stone-800">Expiración de Sesión por Inactividad</span>
                <span className="block text-[11px] text-stone-500">Cierre de sesión automático por seguridad</span>
              </div>
            </div>
            <div className="flex rounded-lg bg-stone-200 p-0.5 text-xs font-bold">
              {[15, 30, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    setSessionTimeoutMinutes(mins);
                    showToast(`Expiración de sesión configurada a ${mins} minutos`);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    sessionTimeoutMinutes === mins ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* RBAC & Protected Data Summary */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 space-y-1">
              <p className="font-bold">Protección de Rutas y Datos Activa (RBAC):</p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Sesión aislada por token de usuario, desinfección XSS de campos de texto, validación de coordenadas y control de acceso estricto a paneles de administración.
              </p>
            </div>
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer border border-stone-200 font-outfit"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Descargar Respaldo JSON</span>
          </button>

          <button
            id="btn-settings-reset-data"
            onClick={() => setConfirmResetOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer border border-rose-200 font-outfit"
          >
            <RefreshCw className="w-4 h-4 text-rose-600" />
            <span>Restablecer Datos de la App</span>
          </button>
        </div>
      </section>

      {/* MODAL 1: CONFIRM ACCOUNT SWITCH (Questionnaire & Confirmation) */}
      {switchTargetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95 duration-200 text-[#23404A]">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/15 text-[#FF6B35] flex items-center justify-center">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <button
                onClick={() => setSwitchTargetAccount(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B35] font-ibm-plex block">
                Confirmación de Seguridad
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#23404A] font-outfit mt-0.5">
                ¿Estás seguro de cambiar de cuenta?
              </h3>
              <p className="text-xs text-stone-600 mt-2 font-manrope leading-relaxed">
                Se cerrará la sesión actual de <strong>{user?.nombre || 'Usuario'}</strong> y se activará la cuenta seleccionada. Todos tus datos, reservas y mensajes se conservarán guardados en este dispositivo.
              </p>
            </div>

            {/* Target Account Preview Card */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3.5">
              <img
                src={
                  switchTargetAccount.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                }
                alt={switchTargetAccount.nombre}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6B35]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-[#23404A] truncate font-outfit">
                    {switchTargetAccount.nombre}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#FF6B35] text-white uppercase shrink-0">
                    {switchTargetAccount.role}
                  </span>
                </div>
                <p className="text-xs text-stone-500 truncate font-manrope">{switchTargetAccount.correo}</p>
                {switchTargetAccount.departamento && (
                  <p className="text-[10px] text-stone-400 font-manrope">
                    {switchTargetAccount.departamento}, {switchTargetAccount.pais || 'Nicaragua'}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setSwitchTargetAccount(null)}
                className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer font-outfit"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-account-switch"
                type="button"
                onClick={executeAccountSwitch}
                className="flex-1 py-3 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5518] text-white text-xs font-extrabold shadow-md shadow-[#FF6B35]/25 transition-all cursor-pointer font-outfit active:scale-98"
              >
                Sí, Cambiar Cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200 text-[#23404A]">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[#23404A] font-outfit">
                ¿Cerrar tu sesión actual?
              </h3>
              <p className="text-xs text-stone-600 mt-1 font-manrope leading-relaxed">
                Tu perfil, reservas y configuración quedarán guardados de forma segura en este dispositivo para cuando desees volver a ingresar.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer font-outfit"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-logout-action"
                type="button"
                onClick={executeLogout}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/25 transition-all cursor-pointer font-outfit active:scale-98"
              >
                Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM DELETE SAVED ACCOUNT */}
      {deleteTargetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 text-[#23404A]">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#23404A] font-outfit">
                ¿Eliminar cuenta guardada de este dispositivo?
              </h3>
              <p className="text-xs text-stone-600 mt-1 font-manrope">
                Se quitará el acceso rápido a la cuenta de <strong>{deleteTargetAccount.nombre}</strong> ({deleteTargetAccount.correo}).
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetAccount(null)}
                className="flex-1 py-2.5 rounded-2xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer font-outfit"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteSavedAccount(deleteTargetAccount.id_usuario);
                  setDeleteTargetAccount(null);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer font-outfit shadow-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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
                  className="flex-1 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors cursor-pointer font-outfit"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-confirm-pin-unlock"
                  className="flex-1 py-2.5 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5514] text-white text-xs font-bold shadow-lg shadow-[#FF6B35]/25 transition-colors cursor-pointer font-outfit"
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
                className="flex-1 py-2.5 rounded-2xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer font-outfit"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setConfirmResetOpen(false);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shadow-md shadow-rose-600/20 font-outfit"
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
