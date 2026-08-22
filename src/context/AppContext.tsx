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
  ChatMessage,
  ChatThread,
  UserAccount,
} from '../types';
import {
  INITIAL_EXPERIENCES,
  INITIAL_HOSTS,
  INITIAL_USER,
  INITIAL_ACCOUNTS,
  INITIAL_RESERVATIONS,
  INITIAL_CHAT_THREADS,
} from '../data/mockData';
import {
  generateConfirmationCode,
  serializeBackup,
  parseAndValidateBackup,
  sanitizeInput,
  validateEmail,
} from '../utils/security';

export type ActiveScreen =
  | 'onboarding'
  | 'welcome'
  | 'explore'
  | 'categories'
  | 'map'
  | 'ar_navigation'
  | 'reservations'
  | 'profile'
  | 'messages'
  | 'help'
  | 'settings'
  | 'host_dashboard'
  | 'unit_tests'
  | 'tech_docs'
  | 'dev_options';

interface AuthResponse {
  success: boolean;
  message: string;
  account?: UserAccount;
}

interface AppContextType {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  user: Turista | Anfitrion | null;
  setUser: (user: Turista | Anfitrion | null) => void;
  accounts: UserAccount[];
  registerAccount: (data: {
    nombre: string;
    correo: string;
    password?: string;
    role?: UserRole;
    avatar?: string;
    ciudad?: string;
    bio?: string;
    telefono?: string;
  }) => AuthResponse;
  loginAccount: (correo: string, password?: string) => AuthResponse;
  logoutAccount: () => void;
  switchAccount: (accountId: string) => boolean;
  deleteSavedAccount: (accountId: string) => boolean;
  updateUserProfile: (updated: Partial<Turista>) => void;
  updateHostProfile: (updated: Partial<Anfitrion>) => void;
  experiences: Experiencia[];
  setExperiences: React.Dispatch<React.SetStateAction<Experiencia[]>>;
  reservations: Reserva[];
  setReservations: React.Dispatch<React.SetStateAction<Reserva[]>>;
  chatThreads: ChatThread[];
  setChatThreads: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
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
  savedExperienceIds: string[];
  toggleSavedExperience: (expId: string) => void;
  isDevModeUnlocked: boolean;
  setIsDevModeUnlocked: (unlocked: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  createReservation: (exp: Experiencia, date: string, guests: number) => Reserva | null;
  updateReservationStatus: (reservaId: string, status: EstadoReserva) => void;
  addExperience: (newExp: Omit<Experiencia, 'id_exp' | 'rating' | 'resenas_count'>) => void;
  updateExperience: (expId: string, updated: Partial<Experiencia>) => void;
  deleteExperience: (expId: string) => void;
  openOrCreateChatThread: (exp?: Experiencia | null, hostId?: string, hostNombre?: string, initialMsg?: string) => string;
  sendChatMessage: (
    threadId: string,
    text: string,
    options?: {
      tipo?: 'texto' | 'foto' | 'audio' | 'ubicacion' | 'itinerario';
      media_url?: string;
      audio_duracion?: string;
    }
  ) => void;
  reactToMessage: (threadId: string, messageId: string, emoji: string) => void;
  deleteMessage: (threadId: string, messageId: string) => void;
  markThreadAsRead: (threadId: string) => void;
  totalUnreadMessagesCount: number;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonStr: string) => boolean;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'patadeperro_app_state_v2';
const ACCOUNTS_STORAGE_KEY = 'patadeperro_registered_accounts_v1';
const DEV_MODE_STORAGE_KEY = 'patadeperro_dev_mode_unlocked';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('onboarding');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.TURISTA);
  const [user, setUser] = useState<Turista | Anfitrion | null>(INITIAL_USER);

  // Stored User Accounts on Device
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const savedAccountsStr = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (savedAccountsStr) {
        const parsed = JSON.parse(savedAccountsStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read cached accounts', e);
    }
    return INITIAL_ACCOUNTS;
  });

  const [experiences, setExperiences] = useState<Experiencia[]>(INITIAL_EXPERIENCES);
  const [reservations, setReservations] = useState<Reserva[]>(INITIAL_RESERVATIONS);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(INITIAL_CHAT_THREADS as ChatThread[]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>('thread_01');
  const [selectedCategory, setSelectedCategory] = useState<CategoriaExp | 'Todas'>('Todas');
  const [selectedMood, setSelectedMood] = useState<MoodTag | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<Experiencia | null>(null);
  const [activeBookingExperience, setActiveBookingExperience] = useState<Experiencia | null>(null);
  const [savedExperienceIds, setSavedExperienceIds] = useState<string[]>(['exp_tierra_01', 'exp_tierra_04']);
  const [isDevModeUnlocked, setDevModeUnlockedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DEV_MODE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const setIsDevModeUnlocked = (unlocked: boolean) => {
    setDevModeUnlockedState(unlocked);
    try {
      if (unlocked) {
        localStorage.setItem(DEV_MODE_STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(DEV_MODE_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not persist dev mode state', e);
    }
  };

  const toggleSavedExperience = (expId: string) => {
    setSavedExperienceIds(prev => {
      const isSaved = prev.includes(expId);
      if (isSaved) {
        showToast('Experiencia removida de tus favoritos.');
        return prev.filter(id => id !== expId);
      } else {
        showToast('¡Experiencia guardada en tus favoritos!');
        return [...prev, expId];
      }
    });
  };

  // Persist accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Could not persist accounts to localStorage', e);
    }
  }, [accounts]);

  // Sync active user state back to accounts collection
  const syncCurrentUserToAccounts = (currentUser: Turista | Anfitrion | null, currentRole: UserRole) => {
    if (!currentUser) return;
    const userEmail = currentUser.correo?.trim().toLowerCase();
    if (!userEmail) return;

    setAccounts(prevAccounts => {
      const idx = prevAccounts.findIndex(a => a.correo.trim().toLowerCase() === userEmail);
      const isTourist = currentRole === UserRole.TURISTA;
      const currentId = isTourist ? (currentUser as Turista).id_turista : (currentUser as Anfitrion).id_anfitrion;

      const updatedAccount: UserAccount = {
        id_usuario: currentId || (idx >= 0 ? prevAccounts[idx].id_usuario : `usr_${Date.now()}`),
        nombre: currentUser.nombre,
        correo: currentUser.correo,
        password: idx >= 0 ? prevAccounts[idx].password : '1234',
        role: currentRole,
        avatar: currentUser.avatar,
        telefono: currentUser.telefono,
        ciudad: isTourist ? (currentUser as Turista).ciudad_origen : (currentUser as Anfitrion).ciudad,
        bio: currentUser.bio,
        redesSociales: currentUser.redesSociales,
        moodsFavoritos: isTourist ? (currentUser as Turista).moodsFavoritos : undefined,
        savedExperienceIds,
        reservas: reservations,
        chatThreads,
        fechaRegistro: idx >= 0 ? prevAccounts[idx].fechaRegistro : new Date().toISOString().split('T')[0],
        ultimoAcceso: new Date().toISOString(),
      };

      if (idx >= 0) {
        const copy = [...prevAccounts];
        copy[idx] = { ...copy[idx], ...updatedAccount };
        return copy;
      } else {
        return [...prevAccounts, updatedAccount];
      }
    });
  };

  // Register Account with anti-duplicate email protection
  const registerAccount = (data: {
    nombre: string;
    correo: string;
    password?: string;
    role?: UserRole;
    avatar?: string;
    ciudad?: string;
    bio?: string;
    telefono?: string;
  }): AuthResponse => {
    const cleanNombre = sanitizeInput(data.nombre?.trim() || '');
    const cleanCorreo = sanitizeInput(data.correo?.trim() || '');
    const cleanPassword = data.password?.trim() || '1234';
    const role = data.role || UserRole.TURISTA;

    if (!cleanNombre) {
      return { success: false, message: 'Por favor ingresa tu nombre completo.' };
    }

    if (!cleanCorreo || !validateEmail(cleanCorreo)) {
      return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
    }

    // CHECK DUPLICATE EMAIL: Strictly prevent registering the same email twice
    const emailLower = cleanCorreo.toLowerCase();
    const existingAccount = accounts.find(a => a.correo.trim().toLowerCase() === emailLower);
    if (existingAccount) {
      return {
        success: false,
        message: `El correo "${cleanCorreo}" ya se encuentra registrado en Pata de Perro. Por favor inicia sesión con tu contraseña o usa otro correo.`,
      };
    }

    const newId = role === UserRole.ANFITRION ? `anf_${Date.now()}` : `usr_${Date.now()}`;
    const defaultAvatar =
      data.avatar ||
      (role === UserRole.ANFITRION
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');

    const newAccount: UserAccount = {
      id_usuario: newId,
      nombre: cleanNombre,
      correo: cleanCorreo,
      password: cleanPassword,
      role,
      avatar: defaultAvatar,
      telefono: data.telefono || '+505 8000-0000',
      ciudad: data.ciudad || (role === UserRole.ANFITRION ? 'Masaya' : 'Managua'),
      bio: data.bio || 'Amante del turismo comunitario y la riqueza cultural de Nicaragua.',
      moodsFavoritos: [MoodTag.AVENTURERO, MoodTag.CULTURAL],
      savedExperienceIds: ['exp_tierra_01'],
      reservas: [],
      chatThreads: [],
      fechaRegistro: new Date().toISOString().split('T')[0],
      ultimoAcceso: new Date().toISOString(),
    };

    // Save into accounts collection
    setAccounts(prev => [newAccount, ...prev]);

    // Set active session
    if (role === UserRole.ANFITRION) {
      const hostUser: Anfitrion = {
        id_anfitrion: newId,
        nombre: cleanNombre,
        correo: cleanCorreo,
        telefono: newAccount.telefono || '+505 8000-0000',
        bio: newAccount.bio || '',
        ciudad: newAccount.ciudad || 'Masaya',
        avatar: defaultAvatar,
        rating: 5.0,
        experiencias_count: 0,
        verificado: true,
      };
      setUser(hostUser);
      setUserRole(UserRole.ANFITRION);
      setActiveScreen('host_dashboard');
    } else {
      const touristUser: Turista = {
        id_turista: newId,
        nombre: cleanNombre,
        correo: cleanCorreo,
        telefono: newAccount.telefono,
        ciudad_origen: newAccount.ciudad,
        bio: newAccount.bio,
        avatar: defaultAvatar,
        moodsFavoritos: [MoodTag.AVENTURERO, MoodTag.CULTURAL],
        fechaRegistro: newAccount.fechaRegistro,
      };
      setUser(touristUser);
      setUserRole(UserRole.TURISTA);
      setActiveScreen('explore');
    }

    setSavedExperienceIds(['exp_tierra_01']);
    showToast(`¡Cuenta registrada exitosamente! Bienvenido, ${cleanNombre}.`);
    return { success: true, message: '¡Cuenta registrada exitosamente!', account: newAccount };
  };

  // Login with existing account
  const loginAccount = (correo: string, password?: string): AuthResponse => {
    const cleanCorreo = sanitizeInput(correo.trim().toLowerCase());
    if (!cleanCorreo) {
      return { success: false, message: 'Por favor ingresa tu correo electrónico o nombre de usuario.' };
    }

    // Lookup account by email or username
    const found = accounts.find(
      a => a.correo.trim().toLowerCase() === cleanCorreo || a.correo.split('@')[0].toLowerCase() === cleanCorreo
    );

    if (!found) {
      return {
        success: false,
        message: `No encontramos ninguna cuenta con el correo "${correo}". Por favor verifica tus datos o regístrate como nuevo usuario.`,
      };
    }

    // Optional password verification
    if (password && found.password && found.password !== password) {
      return {
        success: false,
        message: 'Contraseña incorrecta. Por favor intenta nuevamente.',
      };
    }

    // Switch active state to matched user
    if (found.role === UserRole.ANFITRION) {
      const hostUser: Anfitrion = {
        id_anfitrion: found.id_usuario,
        nombre: found.nombre,
        correo: found.correo,
        telefono: found.telefono || '+505 8812-3456',
        bio: found.bio || '',
        ciudad: found.ciudad || 'Nicaragua',
        avatar: found.avatar,
        rating: 4.95,
        experiencias_count: found.experienciasPropias?.length || 1,
        verificado: true,
        redesSociales: found.redesSociales,
      };
      setUser(hostUser);
      setUserRole(UserRole.ANFITRION);
      setActiveScreen('host_dashboard');
    } else {
      const touristUser: Turista = {
        id_turista: found.id_usuario,
        nombre: found.nombre,
        correo: found.correo,
        telefono: found.telefono,
        ciudad_origen: found.ciudad,
        bio: found.bio,
        avatar: found.avatar,
        redesSociales: found.redesSociales,
        moodsFavoritos: found.moodsFavoritos || [MoodTag.AVENTURERO, MoodTag.CULTURAL],
        fechaRegistro: found.fechaRegistro,
      };
      setUser(touristUser);
      setUserRole(UserRole.TURISTA);
      setActiveScreen('explore');
    }

    if (found.savedExperienceIds) {
      setSavedExperienceIds(found.savedExperienceIds);
    }
    if (found.reservas && found.reservas.length > 0) {
      setReservations(prev => {
        const unique = [...found.reservas!, ...prev.filter(r => !found.reservas!.some(fr => fr.id_reserva === r.id_reserva))];
        return unique;
      });
    }

    // Update last access timestamp
    setAccounts(prev =>
      prev.map(a => (a.id_usuario === found.id_usuario ? { ...a, ultimoAcceso: new Date().toISOString() } : a))
    );

    showToast(`¡Hola de nuevo, ${found.nombre}! Sesión iniciada.`);
    return { success: true, message: '¡Sesión iniciada con éxito!', account: found };
  };

  // Switch between existing registered accounts
  const switchAccount = (accountId: string): boolean => {
    const target = accounts.find(a => a.id_usuario === accountId);
    if (!target) {
      showToast('No se encontró la cuenta seleccionada.');
      return false;
    }

    // Save current active state before switching
    if (user) {
      syncCurrentUserToAccounts(user, userRole);
    }

    // Log in target account
    loginAccount(target.correo);
    return true;
  };

  // Logout session
  const logoutAccount = () => {
    if (user) {
      syncCurrentUserToAccounts(user, userRole);
    }
    setUser(null);
    setActiveScreen('welcome');
    showToast('Has cerrado sesión correctamente.');
  };

  // Delete an account from device
  const deleteSavedAccount = (accountId: string): boolean => {
    const accountToDelete = accounts.find(a => a.id_usuario === accountId);
    if (!accountToDelete) return false;

    setAccounts(prev => prev.filter(a => a.id_usuario !== accountId));

    // If deleting active account, logout
    const currentId = user ? ('id_turista' in user ? user.id_turista : user.id_anfitrion) : null;
    if (currentId === accountId) {
      setUser(null);
      setActiveScreen('welcome');
    }

    showToast(`Cuenta de "${accountToDelete.nombre}" eliminada de este dispositivo.`);
    return true;
  };
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
          if (parsed.appState.savedExperienceIds?.length) setSavedExperienceIds(parsed.appState.savedExperienceIds);
          if (parsed.appState.chatThreads?.length) setChatThreads(parsed.appState.chatThreads);
        }
      }
    } catch (e) {
      console.warn('Could not load cached app state', e);
    }
  }, []);

  // Auto save to localStorage when ANY relevant data changes
  useEffect(() => {
    try {
      const snapshotStr = serializeBackup({
        userRole,
        user,
        experiencias: experiences,
        reservas: reservations,
        savedExperienceIds,
        chatThreads,
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, snapshotStr);
    } catch (e) {
      console.warn('Could not save app state', e);
    }
  }, [userRole, user, experiences, reservations, savedExperienceIds, chatThreads]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Calculate unread messages based on active user role
  const totalUnreadMessagesCount = chatThreads.reduce((acc, thread) => {
    return acc + (userRole === UserRole.ANFITRION ? (thread.mensajes_no_leidos_anfitrion || 0) : (thread.mensajes_no_leidos_turista || 0));
  }, 0);

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

    // Automatically open / create a chat thread with the host about this reservation
    const initialNote = `¡Hola ${exp.anfitrion_nombre}! Acabo de generar una reservación para "${exp.titulo}" para ${guests} persona(s) el ${date}. Mi código de confirmación es ${code}.`;
    openOrCreateChatThread(exp, exp.id_anfitrion, exp.anfitrion_nombre, initialNote);

    showToast(`¡Reserva confirmada con código ${code}!`);
    return newReserva;
  };

  const updateReservationStatus = (reservaId: string, status: EstadoReserva) => {
    setReservations(prev =>
      prev.map(r => (r.id_reserva === reservaId ? { ...r, estado_reserva: status } : r))
    );
    showToast(`Reserva ${reservaId} actualizada a: ${status}`);
  };

  const updateUserProfile = (updated: Partial<Turista>) => {
    const newName = updated.nombre ? sanitizeInput(updated.nombre) : (user?.nombre || 'Sofía Guevara');
    const newAvatar = updated.avatar !== undefined ? updated.avatar : user?.avatar;

    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updated,
        nombre: newName,
        avatar: newAvatar,
        bio: updated.bio ? sanitizeInput(updated.bio) : (prev as Turista).bio,
      } as Turista;
    });

    // Propagate profile name and avatar to active tourist reservations and chat threads
    setReservations(prev =>
      prev.map(r => (r.id_turista === (user as Turista)?.id_turista ? { ...r, turista_nombre: newName } : r))
    );

    setChatThreads(prev =>
      prev.map(thread =>
        thread.id_turista === (user as Turista)?.id_turista
          ? { ...thread, turista_nombre: newName, turista_avatar: newAvatar }
          : thread
      )
    );

    showToast('¡Perfil de usuario actualizado exitosamente en toda la app!');
  };

  const updateHostProfile = (updated: Partial<Anfitrion>) => {
    const newName = updated.nombre ? sanitizeInput(updated.nombre) : (user?.nombre || 'Anfitrión');
    const newAvatar = updated.avatar !== undefined ? updated.avatar : user?.avatar;

    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updated,
        nombre: newName,
        avatar: newAvatar,
        bio: updated.bio ? sanitizeInput(updated.bio) : (prev as Anfitrion).bio,
      } as Anfitrion;
    });

    // Propagate host profile name and avatar to experiences and chat threads
    setExperiences(prev =>
      prev.map(exp => (exp.id_anfitrion === (user as Anfitrion)?.id_anfitrion ? { ...exp, anfitrion_nombre: newName, anfitrion_avatar: newAvatar } : exp))
    );

    setChatThreads(prev =>
      prev.map(thread =>
        thread.id_anfitrion === (user as Anfitrion)?.id_anfitrion
          ? { ...thread, anfitrion_nombre: newName, anfitrion_avatar: newAvatar }
          : thread
      )
    );

    showToast('¡Perfil de anfitrión actualizado exitosamente en toda la app!');
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

  const updateExperience = (expId: string, updated: Partial<Experiencia>) => {
    setExperiences(prev =>
      prev.map(exp => {
        if (exp.id_exp === expId) {
          return {
            ...exp,
            ...updated,
            titulo: updated.titulo ? sanitizeInput(updated.titulo) : exp.titulo,
            descripcion: updated.descripcion ? sanitizeInput(updated.descripcion) : exp.descripcion,
          };
        }
        return exp;
      })
    );
    showToast('Experiencia actualizada correctamente.');
  };

  const deleteExperience = (expId: string) => {
    setExperiences(prev => prev.filter(exp => exp.id_exp !== expId));
    showToast('Experiencia eliminada.');
  };

  // Open existing or create a new Chat thread with a Host
  const openOrCreateChatThread = (
    exp?: Experiencia | null,
    hostId?: string,
    hostNombre?: string,
    initialMsg?: string
  ): string => {
    const targetHostId = hostId || exp?.id_anfitrion || 'anf_01';
    const targetHostName = hostNombre || exp?.anfitrion_nombre || 'Anfitrión Local';
    const targetHostAvatar = exp?.anfitrion_avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80';
    const currentUserId = user ? ('id_turista' in user ? user.id_turista : user.id_anfitrion) : 'usr_demo_01';
    const currentUserName = user?.nombre || 'Sofía Guevara';
    const currentUserAvatar = user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';

    // Find if an existing thread exists with this host
    const existingThread = chatThreads.find(
      t => t.id_anfitrion === targetHostId && (exp ? t.id_exp === exp.id_exp : true)
    );

    if (existingThread) {
      setActiveThreadId(existingThread.id_hilo);
      if (initialMsg) {
        sendChatMessage(existingThread.id_hilo, initialMsg);
      }
      markThreadAsRead(existingThread.id_hilo);
      setActiveScreen('messages');
      return existingThread.id_hilo;
    }

    // Create new thread
    const newThreadId = `thread_${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage | null = initialMsg
      ? {
          id_mensaje: `msg_${Date.now()}`,
          id_hilo: newThreadId,
          emisor_id: currentUserId,
          emisor_nombre: currentUserName,
          emisor_rol: userRole,
          emisor_avatar: currentUserAvatar,
          texto: sanitizeInput(initialMsg),
          timestamp: nowTime,
          tipo: 'texto',
          leido: false,
        }
      : null;

    const newThread: ChatThread = {
      id_hilo: newThreadId,
      id_turista: currentUserId,
      turista_nombre: currentUserName,
      turista_avatar: currentUserAvatar,
      id_anfitrion: targetHostId,
      anfitrion_nombre: targetHostName,
      anfitrion_avatar: targetHostAvatar,
      id_exp: exp?.id_exp,
      exp_titulo: exp?.titulo,
      exp_imagen: exp?.imagen_url,
      ultimo_mensaje: initialMsg ? sanitizeInput(initialMsg) : 'Conversación iniciada',
      ultimo_timestamp: nowTime,
      mensajes_no_leidos_turista: 0,
      mensajes_no_leidos_anfitrion: initialMsg ? 1 : 0,
      mensajes: newMsg ? [newMsg] : [],
    };

    setChatThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThreadId);
    setActiveScreen('messages');
    return newThreadId;
  };

  // Send a message in a chat thread with automated host/tourist response simulation
  const sendChatMessage = (
    threadId: string,
    text: string,
    options?: {
      tipo?: 'texto' | 'foto' | 'audio' | 'ubicacion' | 'itinerario';
      media_url?: string;
      audio_duracion?: string;
    }
  ) => {
    if (!text.trim() && !options?.media_url && !options?.audio_duracion) return;
    const cleanText = sanitizeInput(text.trim());
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentUserId = user ? ('id_turista' in user ? user.id_turista : user.id_anfitrion) : 'usr_current';
    const currentUserName = user?.nombre || (userRole === UserRole.TURISTA ? 'Sofía Guevara' : 'Anfitrión');
    const currentUserAvatar = user?.avatar;

    const newMsg: ChatMessage = {
      id_mensaje: `msg_${Date.now()}`,
      id_hilo: threadId,
      emisor_id: currentUserId,
      emisor_nombre: currentUserName,
      emisor_rol: userRole,
      emisor_avatar: currentUserAvatar,
      texto: cleanText,
      timestamp: nowTime,
      tipo: options?.tipo || 'texto',
      media_url: options?.media_url,
      audio_duracion: options?.audio_duracion,
      leido: false,
    };

    const previewSnippet =
      options?.tipo === 'audio'
        ? '🎤 Mensaje de voz'
        : options?.tipo === 'foto'
        ? '📷 Foto'
        : options?.tipo === 'ubicacion'
        ? '📍 Ubicación'
        : cleanText;

    setChatThreads(prev =>
      prev.map(thread => {
        if (thread.id_hilo === threadId) {
          const isUserTurista = userRole === UserRole.TURISTA;
          return {
            ...thread,
            ultimo_mensaje: previewSnippet,
            ultimo_timestamp: nowTime,
            mensajes_no_leidos_turista: isUserTurista ? thread.mensajes_no_leidos_turista : thread.mensajes_no_leidos_turista + 1,
            mensajes_no_leidos_anfitrion: isUserTurista ? thread.mensajes_no_leidos_anfitrion + 1 : thread.mensajes_no_leidos_anfitrion,
            mensajes: [...thread.mensajes, newMsg],
          };
        }
        return thread;
      })
    );

    // If sent as Turista, simulate an authentic response from the Host after 1.5s
    if (userRole === UserRole.TURISTA) {
      setTimeout(() => {
        const hostResponses = [
          '¡Con gusto! Estaremos listos para recibirte con toda la hospitalidad nicaragüense. ¿Tienes alguna otra duda sobre la ruta?',
          '¡Hola! Claro que sí, todo el equipo y materiales ya están coordinados. ¡Nos vemos en el punto de encuentro!',
          '¡Excelente! Te recomendamos traer calzado cómodo y una botella de agua fresca. Quedamos a tu completa disposición.',
          '¡Recibido! Te confirmo que el cupo y la agenda están al 100%. Te enviaremos indicaciones de clima el día previo.',
        ];
        const randomResp = hostResponses[Math.floor(Math.random() * hostResponses.length)];
        const hostNowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setChatThreads(curThreads =>
          curThreads.map(t => {
            if (t.id_hilo === threadId) {
              const hostReplyMsg: ChatMessage = {
                id_mensaje: `msg_host_reply_${Date.now()}`,
                id_hilo: threadId,
                emisor_id: t.id_anfitrion,
                emisor_nombre: t.anfitrion_nombre,
                emisor_rol: UserRole.ANFITRION,
                emisor_avatar: t.anfitrion_avatar,
                texto: randomResp,
                timestamp: hostNowTime,
                tipo: 'texto',
                leido: false,
              };
              return {
                ...t,
                ultimo_mensaje: randomResp,
                ultimo_timestamp: hostNowTime,
                mensajes_no_leidos_turista: t.mensajes_no_leidos_turista + 1,
                mensajes: [...t.mensajes, hostReplyMsg],
              };
            }
            return t;
          })
        );
      }, 1500);
    }
  };

  const reactToMessage = (threadId: string, messageId: string, emoji: string) => {
    setChatThreads(prev =>
      prev.map(thread => {
        if (thread.id_hilo === threadId) {
          return {
            ...thread,
            mensajes: thread.mensajes.map(msg =>
              msg.id_mensaje === messageId
                ? { ...msg, reaccion: msg.reaccion === emoji ? undefined : emoji }
                : msg
            ),
          };
        }
        return thread;
      })
    );
  };

  const deleteMessage = (threadId: string, messageId: string) => {
    setChatThreads(prev =>
      prev.map(thread => {
        if (thread.id_hilo === threadId) {
          const filtered = thread.mensajes.filter(m => m.id_mensaje !== messageId);
          const lastMsg = filtered[filtered.length - 1];
          return {
            ...thread,
            ultimo_mensaje: lastMsg ? lastMsg.texto : 'Mensaje eliminado',
            mensajes: filtered,
          };
        }
        return thread;
      })
    );
  };

  const markThreadAsRead = (threadId: string) => {
    setChatThreads(prev =>
      prev.map(thread => {
        if (thread.id_hilo === threadId) {
          return {
            ...thread,
            mensajes_no_leidos_turista: userRole === UserRole.TURISTA ? 0 : thread.mensajes_no_leidos_turista,
            mensajes_no_leidos_anfitrion: userRole === UserRole.ANFITRION ? 0 : thread.mensajes_no_leidos_anfitrion,
            mensajes: thread.mensajes.map(m => ({ ...m, leido: true })),
          };
        }
        return thread;
      })
    );
  };

  const exportBackupJSON = () => {
    const jsonStr = serializeBackup({
      userRole,
      user,
      experiencias: experiences,
      reservas: reservations,
      savedExperienceIds,
      chatThreads,
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
    if (restored.appState.savedExperienceIds?.length) setSavedExperienceIds(restored.appState.savedExperienceIds);
    if (restored.appState.chatThreads?.length) setChatThreads(restored.appState.chatThreads);

    showToast('¡Estado restaurado exitosamente desde la copia de seguridad!');
    return true;
  };

  const resetToDefaultData = () => {
    setExperiences(INITIAL_EXPERIENCES);
    setReservations(INITIAL_RESERVATIONS);
    setChatThreads(INITIAL_CHAT_THREADS as ChatThread[]);
    setSavedExperienceIds(['exp_tierra_01', 'exp_tierra_04']);
    setUser(INITIAL_USER);
    setUserRole(UserRole.TURISTA);
    setIsDevModeUnlocked(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(DEV_MODE_STORAGE_KEY);
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
        accounts,
        registerAccount,
        loginAccount,
        logoutAccount,
        switchAccount,
        deleteSavedAccount,
        updateUserProfile,
        updateHostProfile,
        experiences,
        setExperiences,
        reservations,
        setReservations,
        chatThreads,
        setChatThreads,
        activeThreadId,
        setActiveThreadId,
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
        savedExperienceIds,
        toggleSavedExperience,
        isDevModeUnlocked,
        setIsDevModeUnlocked,
        toastMessage,
        showToast,
        createReservation,
        updateReservationStatus,
        addExperience,
        updateExperience,
        deleteExperience,
        openOrCreateChatThread,
        sendChatMessage,
        reactToMessage,
        deleteMessage,
        markThreadAsRead,
        totalUnreadMessagesCount,
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

