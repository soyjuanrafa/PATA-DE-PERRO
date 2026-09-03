/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro Header Component with Multi-Language Support & Official Styling
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp, ActiveScreen } from '../context/AppContext';
import { useTranslation, SUPPORTED_LANGUAGES } from '../i18n';
import { UserRole } from '../types';
import { Logo } from './Logo';
import {
  Compass,
  Grid,
  MapPin,
  Calendar,
  UserCheck,
  Download,
  Menu,
  X,
  Settings,
  Terminal,
  User,
  HelpCircle,
  MessageSquare,
  LogOut,
  Globe,
  ChevronDown,
  Check,
  Mail,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    userRole,
    setUserRole,
    logoutAccount,
    isDevModeUnlocked,
    exportBackupJSON,
    totalUnreadMessagesCount,
    showToast,
  } = useApp();

  const { t, language, setLanguage, currentLanguageInfo } = useTranslation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ActiveScreen; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'explore', label: t('nav.explore', 'Explorar'), icon: <Compass className="w-4 h-4" /> },
    { id: 'categories', label: t('nav.categories', 'Categorías'), icon: <Grid className="w-4 h-4" /> },
    { id: 'map', label: t('nav.map', 'Mapa & RA'), icon: <MapPin className="w-4 h-4" /> },
    {
      id: 'messages',
      label: t('nav.messages', 'Mensajes'),
      icon: <MessageSquare className="w-4 h-4" />,
      badge: totalUnreadMessagesCount > 0 ? totalUnreadMessagesCount : undefined,
    },
    { id: 'reservations', label: t('nav.reservations', 'Mis Reservas'), icon: <Calendar className="w-4 h-4" /> },
    { id: 'workspace', label: 'Gmail & Docs', icon: <Mail className="w-4 h-4" /> },
    { id: 'profile', label: t('nav.profile', 'Mi Perfil'), icon: <User className="w-4 h-4" /> },
    { id: 'help', label: t('nav.help', 'Ayuda'), icon: <HelpCircle className="w-4 h-4" /> },
  ];

  if (userRole === UserRole.ANFITRION) {
    navItems.push({
      id: 'host_dashboard',
      label: t('nav.hostDashboard', 'Panel Anfitrión'),
      icon: <UserCheck className="w-4 h-4" />,
    });
  }

  // Configuración button is always available
  navItems.push({
    id: 'settings',
    label: t('nav.settings', 'Configuración'),
    icon: <Settings className="w-4 h-4" />,
  });

  const handleLogout = () => {
    logoutAccount();
    setShowLogoutConfirm(false);
    setMobileMenuOpen(false);
    showToast(t('nav.logout', 'Has cerrado sesión exitosamente.'));
  };

  return (
    <header className="sticky top-0 z-40 bg-[#23404A] border-b border-[#162A31] text-[#FFF8F1] shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Screen Switcher */}
        <button
          id="btn-header-logo"
          onClick={() => setActiveScreen('explore')}
          className="hover:opacity-90 transition-opacity focus:outline-hidden flex items-center gap-2 cursor-pointer shrink-0"
          title="Ir al Inicio"
        >
          <Logo variant="white" size="sm" />
        </button>

        {/* Navigation items for Desktop */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#162A31]/70 p-1.5 rounded-full border border-white/10">
          {navItems.map(item => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveScreen(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all font-outfit cursor-pointer ${
                  isActive
                    ? 'bg-[#FF6B35] text-white shadow-sm'
                    : 'text-[#FFF8F1]/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {Boolean(item.badge) && (
                  <span className="w-4 h-4 rounded-full bg-[#FF6B35] text-white text-[10px] font-black flex items-center justify-center border border-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools (Language Switcher, Role Switcher, Dev Options, Backup) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Visual Multi-Language Selector Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              id="btn-lang-selector"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold bg-[#162A31] text-[#FFF8F1] border border-white/10 hover:bg-[#162A31]/90 transition-colors font-outfit cursor-pointer"
              title="Cambiar idioma de la aplicación"
            >
              <span className="text-sm">{currentLanguageInfo.flag}</span>
              <span className="hidden md:inline uppercase">{currentLanguageInfo.code}</span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-stone-900 border border-stone-700 shadow-2xl p-1.5 z-50 animate-fade-in text-white space-y-0.5">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdownOpen(false);
                      showToast(`${t('settings.languageChanged', 'Idioma cambiado a')} ${lang.name}`);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      language === lang.code
                        ? 'bg-[#FF6B35] text-white'
                        : 'hover:bg-white/10 text-stone-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Toggle Switcher */}
          <button
            id="btn-toggle-role"
            onClick={() => {
              const nextRole =
                userRole === UserRole.TURISTA ? UserRole.ANFITRION : UserRole.TURISTA;
              setUserRole(nextRole);
              if (nextRole === UserRole.ANFITRION) {
                setActiveScreen('host_dashboard');
              } else {
                setActiveScreen('explore');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#162A31] text-[#FFC83D] border border-white/10 hover:bg-[#162A31]/90 transition-colors font-ibm-plex cursor-pointer"
            title="Cambiar entre modo Turista y Anfitrión"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#3FAF6C]" />
            <span className="hidden md:inline">{t('nav.role', 'Rol')}:</span> <span>{userRole}</span>
          </button>

          {/* Opciones de Desarrollador */}
          {isDevModeUnlocked && (
            <button
              id="btn-nav-dev-options"
              onClick={() => setActiveScreen('dev_options')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all font-outfit cursor-pointer ${
                activeScreen === 'dev_options' || activeScreen === 'unit_tests' || activeScreen === 'tech_docs'
                  ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-sm'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
              }`}
              title="Opciones de Desarrollador activadas"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Opciones Dev</span>
            </button>
          )}

          {/* Backup Action */}
          <button
            id="btn-quick-backup"
            onClick={exportBackupJSON}
            className="p-2 rounded-full text-[#FFF8F1]/80 hover:text-white hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
            title="Exportar copia de seguridad JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Mobile Language button */}
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="p-1.5 px-2.5 rounded-full bg-[#162A31] border border-white/10 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>{currentLanguageInfo.flag}</span>
            <span className="uppercase text-[11px]">{currentLanguageInfo.code}</span>
          </button>

          <button
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#FFF8F1] hover:bg-white/10 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Language Dropdown */}
      {langDropdownOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-700 px-4 py-2 flex items-center justify-around gap-1">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setLangDropdownOpen(false);
                showToast(`${t('settings.languageChanged', 'Idioma cambiado a')} ${lang.name}`);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                language === lang.code ? 'bg-[#FF6B35] text-white' : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#23404A] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveScreen(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold w-full text-left font-outfit cursor-pointer ${
                  activeScreen === item.id
                    ? 'bg-[#FF6B35] text-white shadow-sm'
                    : 'text-[#FFF8F1] bg-[#162A31] border border-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {Boolean(item.badge) && (
                  <span className="ml-auto w-4 h-4 rounded-full bg-[#FF6B35] text-white text-[10px] font-black flex items-center justify-center border border-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                const nextRole =
                  userRole === UserRole.TURISTA ? UserRole.ANFITRION : UserRole.TURISTA;
                setUserRole(nextRole);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold bg-[#162A31] text-[#FFC83D] border border-white/10 font-ibm-plex cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#3FAF6C]" />
              <span>{t('nav.role', 'Rol')}: {userRole} (Cambiar)</span>
            </button>

            {/* Logout button in Mobile menu */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold bg-rose-950/70 text-rose-300 border border-rose-800/40 font-outfit cursor-pointer hover:bg-rose-900/80 transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>{t('nav.logout', 'Cerrar Sesión')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-stone-900 shadow-2xl border border-stone-200 space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black font-outfit text-stone-900">
                {t('nav.logout', '¿Cerrar Sesión?')}
              </h3>
              <p className="text-xs text-stone-600 font-manrope">
                Tu progreso y reservas quedan guardados de forma segura en tu dispositivo.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shadow-md"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
