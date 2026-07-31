/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro Header Component
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
  Code2,
  FileCheck2,
  Lock,
  KeyRound,
  Download,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    userRole,
    setUserRole,
    user,
    exportBackupJSON,
    resetToDefaultData,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'explore', label: 'Explorar', icon: <Compass className="w-4 h-4" /> },
    { id: 'categories', label: 'Categorías', icon: <Grid className="w-4 h-4" /> },
    { id: 'map', label: 'Mapa & RA', icon: <MapPin className="w-4 h-4" /> },
    { id: 'reservations', label: 'Mis Reservas', icon: <Calendar className="w-4 h-4" /> },
  ];

  if (userRole === UserRole.ANFITRION) {
    navItems.push({
      id: 'host_dashboard',
      label: 'Panel Anfitrión',
      icon: <UserCheck className="w-4 h-4" />,
    });
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Screen Switcher */}
        <button
          id="btn-header-logo"
          onClick={() => setActiveScreen('explore')}
          className="hover:opacity-90 transition-opacity focus:outline-hidden flex items-center gap-2"
          title="Ir al Inicio"
        >
          <Logo variant="white" size="sm" />
        </button>

        {/* Navigation items for Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          {navItems.map(item => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveScreen(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools (Role Switcher, Unit Tests, Tech Audit, Backup) */}
        <div className="hidden lg:flex items-center gap-2">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700 hover:bg-slate-700 transition-colors"
            title="Cambiar entre modo Turista y Anfitrión"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Rol: {userRole}</span>
          </button>

          {/* Opciones de Desarrollador Button (Protected by PIN 1102) */}
          <button
            id="btn-nav-dev-options"
            onClick={() => setActiveScreen('dev_options')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              activeScreen === 'dev_options' || activeScreen === 'unit_tests' || activeScreen === 'tech_docs'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Opciones de Desarrollador, Auditoría, README y Pruebas Unitarias (Requiere PIN 1102)"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Opciones de Desarrollador</span>
          </button>

          {/* Backup Action */}
          <button
            id="btn-quick-backup"
            onClick={exportBackupJSON}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
            title="Exportar copia de seguridad JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveScreen(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium w-full text-left ${
                  activeScreen === item.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 bg-slate-800 border border-slate-700'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
            <button
              onClick={() => {
                const nextRole =
                  userRole === UserRole.TURISTA ? UserRole.ANFITRION : UserRole.TURISTA;
                setUserRole(nextRole);
                if (nextRole === UserRole.ANFITRION) setActiveScreen('host_dashboard');
                else setActiveScreen('explore');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 bg-slate-800 text-indigo-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-indigo-400" />
              Rol: {userRole}
            </button>

            <button
              onClick={() => {
                setActiveScreen('dev_options');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              Opciones de Desarrollador
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
