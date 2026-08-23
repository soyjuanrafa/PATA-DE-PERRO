/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro Header Component with Official Typography, Palette & Account Management
 */

import React, { useState } from 'react';
import { useApp, ActiveScreen } from '../context/AppContext';
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
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    userRole,
    setUserRole,
    user,
    logoutAccount,
    isDevModeUnlocked,
    exportBackupJSON,
    totalUnreadMessagesCount,
    showToast,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems: { id: ActiveScreen; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'explore', label: 'Explorar', icon: <Compass className="w-4 h-4" /> },
    { id: 'categories', label: 'Categorías', icon: <Grid className="w-4 h-4" /> },
    { id: 'map', label: 'Mapa & RA', icon: <MapPin className="w-4 h-4" /> },
    {
      id: 'messages',
      label: 'Mensajes',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: totalUnreadMessagesCount > 0 ? totalUnreadMessagesCount : undefined,
    },
    { id: 'reservations', label: 'Mis Reservas', icon: <Calendar className="w-4 h-4" /> },
    { id: 'profile', label: 'Mi Perfil', icon: <User className="w-4 h-4" /> },
    { id: 'help', label: 'Ayuda', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  if (userRole === UserRole.ANFITRION) {
    navItems.push({
      id: 'host_dashboard',
      label: 'Panel Anfitrión',
      icon: <UserCheck className="w-4 h-4" />,
    });
  }

  // Configuración button is always available
  navItems.push({
    id: 'settings',
    label: 'Configuración',
    icon: <Settings className="w-4 h-4" />,
  });

  const handleLogout = () => {
    logoutAccount();
    setShowLogoutConfirm(false);
    setMobileMenuOpen(false);
    showToast('Has cerrado sesión exitosamente.');
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

        {/* Right Tools (Role Switcher, Dev Options, Backup) */}
        <div className="hidden sm:flex items-center gap-2">
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
            <span className="hidden md:inline">Rol:</span> <span>{userRole}</span>
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
          <button
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#FFF8F1] hover:bg-white/10 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

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
                <span className="truncate">{item.label}</span>
                {Boolean(item.badge) && (
                  <span className="ml-auto w-4 h-4 rounded-full bg-[#FF6B35] text-white text-[10px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2">
            <button
              onClick={() => {
                const nextRole =
                  userRole === UserRole.TURISTA ? UserRole.ANFITRION : UserRole.TURISTA;
                setUserRole(nextRole);
                if (nextRole === UserRole.ANFITRION) setActiveScreen('host_dashboard');
                else setActiveScreen('explore');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 bg-[#162A31] text-[#FFC83D] border border-white/10 rounded-full text-xs font-bold flex items-center justify-center gap-2 font-ibm-plex cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#3FAF6C]" />
              Rol: {userRole}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-stone-900 text-center space-y-4 shadow-2xl border border-stone-200 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#23404A] font-outfit">¿Cerrar tu sesión?</h3>
            <p className="text-xs text-stone-500 font-manrope">
              Tus cambios, reservas y preferencias se mantendrán guardados de forma segura en tu cuenta para cuando vuelvas a iniciar sesión.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-bold font-outfit transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold font-outfit transition-colors shadow-md shadow-rose-600/25 cursor-pointer"
              >
                Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
