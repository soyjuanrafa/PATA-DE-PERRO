/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - App State Context & Persistence Layer
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Turista,
  Anfitrion,
  Experiencia,
  Reserva,
  UserRole,
  CategoriaExp,
  MoodTag,
  EstadoReserva,
} from '../types';
import {
  INITIAL_EXPERIENCES,
  INITIAL_HOSTS,
  INITIAL_USER,
  INITIAL_RESERVATIONS,
} from '../data/mockData';
import {
  generateConfirmationCode,
  serializeBackup,
  parseAndValidateBackup,
  sanitizeInput,
} from '../utils/security';

export type ActiveScreen =
  | 'onboarding'
  | 'welcome'
  | 'explore'
  | 'categories'
  | 'map'
  | 'ar_navigation'
  | 'reservations'
  | 'host_dashboard'
  | 'unit_tests'
  | 'tech_docs'
  | 'dev_options';

interface AppContextType {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  user: Turista | Anfitrion | null;
  setUser: (user: Turista | Anfitrion | null) => void;
  experiences: Experiencia[];
  setExperiences: React.Dispatch<React.SetStateAction<Experiencia[]>>;
  reservations: Reserva[];
  setReservations: React.Dispatch<React.SetStateAction<Reserva[]>>;
  selectedCategory: CategoriaExp | 'Todas';
  setSelectedCategory: (cat: CategoriaExp | 'Todas') => void;
  selectedMood: MoodTag | 'Todos';
  setSelectedMood: (mood: MoodTag | 'Todos') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedExperience: Experiencia | null;
  setSelectedExperience: (exp: Experiencia | null) => void;
  activeBookingExperience: Experiencia | null;
  setActiveBookingExperience: (exp: Experiencia | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  createReservation: (exp: Experiencia, date: string, guests: number) => Reserva | null;
  updateReservationStatus: (reservaId: string, status: EstadoReserva) => void;
  addExperience: (newExp: Omit<Experiencia, 'id_exp' | 'rating' | 'resenas_count'>) => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonStr: string) => boolean;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'patadeperro_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('onboarding');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.TURISTA);
  const [user, setUser] = useState<Turista | Anfitrion | null>(INITIAL_USER);
  const [experiences, setExperiences] = useState<Experiencia[]>(INITIAL_EXPERIENCES);
  const [reservations, setReservations] = useState<Reserva[]>(INITIAL_RESERVATIONS);
  const [selectedCategory, setSelectedCategory] = useState<CategoriaExp | 'Todas'>('Todas');
  const [selectedMood, setSelectedMood] = useState<MoodTag | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<Experiencia | null>(null);
  const [activeBookingExperience, setActiveBookingExperience] = useState<Experiencia | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load state from localStorage if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = parseAndValidateBackup(saved);
        if (parsed && parsed.appState) {
          if (parsed.appState.userRole) setUserRole(parsed.appState.userRole);
          if (parsed.appState.user) setUser(parsed.appState.user);
          if (parsed.appState.experiencias?.length) setExperiences(parsed.appState.experiencias);
          if (parsed.appState.reservas?.length) setReservations(parsed.appState.reservas);
        }
      }
    } catch (e) {
      console.warn('Could not load cached app state', e);
    }
  }, []);

  // Auto save to localStorage when key data updates
  useEffect(() => {
    try {
      const snapshotStr = serializeBackup({
        userRole,
        user,
        experiencias: experiences,
        reservas: reservations,
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, snapshotStr);
    } catch (e) {
      console.warn('Could not save app state', e);
    }
  }, [userRole, user, experiences, reservations]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const createReservation = (exp: Experiencia, date: string, guests: number): Reserva | null => {
    const total = exp.precio * guests;
    const code = generateConfirmationCode('PDP');

    const newReserva: Reserva = {
      id_reserva: `res_${Date.now()}`,
      id_turista: user ? ('id_turista' in user ? user.id_turista : user.id_anfitrion) : 'usr_guest',
      turista_nombre: user ? user.nombre : 'Turista Invitado',
      id_exp: exp.id_exp,
      exp_titulo: sanitizeInput(exp.titulo),
      exp_imagen: exp.imagen_url,
      exp_ciudad: exp.ciudad_creativa,
      fecha_reserva: date,
      personas: guests,
      monto_total: total,
      estado_reserva: EstadoReserva.CONFIRMADA,
      codigo_confirmacion: code,
      contacto_whatsapp: '+505 8812-3456',
      fecha_creacion: new Date().toISOString().split('T')[0],
    };

    setReservations(prev => [newReserva, ...prev]);
    showToast(`¡Reserva confirmada con código ${code}!`);
    return newReserva;
  };

  const updateReservationStatus = (reservaId: string, status: EstadoReserva) => {
    setReservations(prev =>
      prev.map(r => (r.id_reserva === reservaId ? { ...r, estado_reserva: status } : r))
    );
    showToast(`Reserva ${reservaId} actualizada a: ${status}`);
  };

  const addExperience = (newExpData: Omit<Experiencia, 'id_exp' | 'rating' | 'resenas_count'>) => {
    const newExp: Experiencia = {
      ...newExpData,
      id_exp: `exp_custom_${Date.now()}`,
      rating: 5.0,
      resenas_count: 1,
      titulo: sanitizeInput(newExpData.titulo),
      descripcion: sanitizeInput(newExpData.descripcion),
    };

    setExperiences(prev => [newExp, ...prev]);
    showToast('¡Nueva experiencia publicada exitosamente!');
  };

  const exportBackupJSON = () => {
    const jsonStr = serializeBackup({
      userRole,
      user,
      experiencias: experiences,
      reservas: reservations,
    });
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pata_de_Perro_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Copia de seguridad exportada correctamente en JSON.');
  };

  const importBackupJSON = (jsonStr: string): boolean => {
    const restored = parseAndValidateBackup(jsonStr);
    if (!restored) {
      showToast('Error: El archivo JSON de respaldo es inválido o corrupto.');
      return false;
    }
    if (restored.appState.userRole) setUserRole(restored.appState.userRole);
    if (restored.appState.user) setUser(restored.appState.user);
    if (restored.appState.experiencias?.length) setExperiences(restored.appState.experiencias);
    if (restored.appState.reservas?.length) setReservations(restored.appState.reservas);

    showToast('¡Estado restaurado exitosamente desde la copia de seguridad!');
    return true;
  };

  const resetToDefaultData = () => {
    setExperiences(INITIAL_EXPERIENCES);
    setReservations(INITIAL_RESERVATIONS);
    setUser(INITIAL_USER);
    setUserRole(UserRole.TURISTA);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('Estado restablecido a los valores predeterminados del sistema.');
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        userRole,
        setUserRole,
        user,
        setUser,
        experiences,
        setExperiences,
        reservations,
        setReservations,
        selectedCategory,
        setSelectedCategory,
        selectedMood,
        setSelectedMood,
        searchQuery,
        setSearchQuery,
        selectedExperience,
        setSelectedExperience,
        activeBookingExperience,
        setActiveBookingExperience,
        toastMessage,
        showToast,
        createReservation,
        updateReservationStatus,
        addExperience,
        exportBackupJSON,
        importBackupJSON,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
