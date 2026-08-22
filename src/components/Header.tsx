/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro Header Component with Official Typography, Palette & Account Management
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp, ActiveScreen } from '../context/AppContext';
import { UserRole, Turista, Anfitrion } from '../types';
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
  Users,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    userRole,
    setUserRole,
    user,
    accounts,
    logoutAccount,
    switchAccount,
    isDevModeUnlocked,
    exportBackupJSON,
    totalUnreadMessagesCount,
    showToast,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setAccountMenuOpen(false);
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

        {/* Right Tools (Account, Role Switcher, Dev Options, Backup) */}
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

          {/* Account Profile Pill & Dropdown */}
          <div className="relative" ref={accountMenuRef}>
            <button
              id="btn-header-account-menu"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 bg-[#162A31] hover:bg-[#162A31]/90 border border-white/15 rounded-full text-xs font-bold text-white transition-all cursor-pointer"
            >
              <span className="max-w-[100px] truncate font-outfit hidden md:inline">
                {user?.nombre?.split(' ')[0] || 'Mi Cuenta'}
              </span>
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#FF6B35] bg-[#23404A] flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.nombre} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <ChevronDown className="w-3 h-3 text-stone-400 mr-1" />
            </button>

            {/* Account Dropdown Menu */}
            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-stone-900 rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 font-manrope">
                <div className="px-4 py-2.5 border-b border-stone-100">
                  <p className="text-xs font-bold text-[#23404A] font-outfit truncate">{user?.nombre || 'Usuario'}</p>
                  <p className="text-[11px] text-stone-500 truncate font-ibm-plex">{user?.correo || 'Sin correo'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B35] text-[10px] font-extrabold uppercase font-ibm-plex">
                    {userRole === UserRole.ANFITRION ? 'Anfitrión Verificado' : 'Turista Registrado'}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveScreen('profile');
                      setAccountMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs font-bold text-stone-700 hover:bg-orange-50 hover:text-[#FF6B35] flex items-center gap-2.5 transition-colors cursor-pointer text-left font-outfit"
                  >
                    <User className="w-4 h-4 text-[#FF6B35]" />
                    <span>Ver Mi Perfil & Redes</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveScreen('welcome');
                      setAccountMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left font-outfit"
                  >
                    <Users className="w-4 h-4 text-stone-500" />
                    <span>Cambiar / Administrar Cuentas ({accounts.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveScreen('settings');
                      setAccountMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left font-outfit"
                  >
                    <Settings className="w-4 h-4 text-stone-500" />
                    <span>Configuración General</span>
                  </button>
                </div>

                {/* Quick Account Switch List if multiple accounts exist */}
                {accounts.length > 1 && (
                  <div className="px-3 py-1.5 border-t border-stone-100 bg-stone-50/70">
                    <p className="text-[10px] font-bold text-stone-400 uppercase font-ibm-plex mb-1">Cuentas Guardadas:</p>
                    <div className="space-y-1">
                      {accounts.map(acc => {
                        const isCurrent = acc.correo.toLowerCase() === user?.correo?.toLowerCase();
                        return (
                          <button
                            key={acc.id_usuario}
                            onClick={() => {
                              switchAccount(acc.id_usuario);
                              setAccountMenuOpen(false);
                              showToast(`Cambiaste a la cuenta de ${acc.nombre}`);
                            }}
                            className={`w-full flex items-center justify-between p-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              isCurrent ? 'bg-orange-100/70 text-[#C85A32] font-bold' : 'hover:bg-white text-stone-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <img src={acc.avatar} alt={acc.nombre} className="w-5 h-5 rounded-full object-cover" />
                              <span className="truncate">{acc.nombre}</span>
                            </div>
                            {isCurrent && <span className="text-[9px] font-bold text-[#FF6B35]">Activo</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-1 border-t border-stone-100">
                  <button
                    id="btn-header-logout"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left font-outfit"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>

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

        {/* Mobile menu and user quick button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('profile')}
            className="w-8 h-8 rounded-full overflow-hidden border border-[#FF6B35] bg-[#162A31] flex items-center justify-center cursor-pointer"
            title="Mi Perfil"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.nombre} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
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

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#23404A] px-4 pt-3 pb-6 space-y-3">
          {/* User Status in mobile */}
          <div className="flex items-center justify-between p-3 bg-[#162A31] rounded-2xl border border-white/10">
            <div className="flex items-center gap-2.5">
              <img src={user?.avatar} alt={user?.nombre} className="w-9 h-9 rounded-full object-cover border border-[#FF6B35]" />
              <div>
                <p className="text-xs font-bold text-white font-outfit">{user?.nombre}</p>
                <p className="text-[10px] text-stone-300 font-ibm-plex">{user?.correo}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-full text-[11px] font-bold font-outfit flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Salir
            </button>
          </div>

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

            <button
              onClick={() => {
                setActiveScreen('welcome');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-4 bg-stone-700 text-white rounded-full text-xs font-bold flex items-center justify-center gap-1.5 font-outfit cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Cuentas
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
