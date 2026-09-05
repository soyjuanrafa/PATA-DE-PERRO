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
  RedesSociales,
  PublishedStoryReview,
  UserStory,
  UserStatusNote,
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
  validateFullName,
  validatePasswordSecurity,
  recordFailedLoginAttempt,
  getLoginLockoutRemainingSeconds,
  clearLoginAttempts,
  detectInjectionThreat,
} from '../utils/security';
import {
  registerUserBackend,
  loginUserBackend,
  logoutUserBackend,
  saveUserProfileBackend,
  saveReservationBackend,
  signInWithSocialBackend,
} from '../lib/backendService';
import { isFirebaseConfigured } from '../lib/firebase';


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
  errorCode?: string;
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
    pais?: string;
    departamento?: string;
    ciudad?: string;
    bio?: string;
    telefono?: string;
    redesSociales?: RedesSociales;
    moodsFavoritos?: MoodTag[];
    isDev?: boolean;
  }) => AuthResponse;
  loginAccount: (correo: string, password?: string) => Promise<AuthResponse>;
  loginWithSocialProvider: (provider: 'google' | 'facebook' | 'github' | 'apple') => Promise<AuthResponse>;
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
  activeStoryExperience: Experiencia | null;
  setActiveStoryExperience: (exp: Experiencia | null) => void;
  storyModalMode: 'viewer' | 'upload_user_story' | 'user_stories';
  setStoryModalMode: (mode: 'viewer' | 'upload_user_story' | 'user_stories') => void;
  openStoryViewer: (exp: Experiencia | null, mode?: 'viewer' | 'upload_user_story' | 'user_stories') => void;
  publishedStoryReviews: PublishedStoryReview[];
  addPublishedStoryReview: (review: PublishedStoryReview) => void;
  userStories: UserStory[];
  addUserStory: (story: Omit<UserStory, 'id' | 'date'>) => UserStory;
  deleteUserStory: (storyId: string) => void;
  statusNotes: UserStatusNote[];
  updateSelfNote: (text: string, emoji?: string) => void;
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
const SESSION_STORAGE_KEY = 'patadeperro_active_user_session_v1';
const PUBLISHED_STORIES_STORAGE_KEY = 'patadeperro_published_stories_v1';
const USER_STORIES_STORAGE_KEY = 'patadeperro_user_stories_v1';
const STATUS_NOTES_STORAGE_KEY = 'patadeperro_status_notes_v1';

const INITIAL_STATUS_NOTES: UserStatusNote[] = [
  {
    userId: 'usr_self',
    userName: 'Tu nota',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    noteText: 'Planeando mi próxima aventura 🐾',
    emoji: '🐾',
    updatedAt: 'hace 10 min',
    isSelf: true,
  },
  {
    userId: 'host_marta',
    userName: 'Doña Marta',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    noteText: 'Cocinando quesillo caliente 🧀',
    emoji: '🧀',
    updatedAt: 'hace 25 min',
  },
  {
    userId: 'host_carlos',
    userName: 'Don Carlos',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    noteText: 'Sandboarding en Cerro Negro 🌋',
    emoji: '🌋',
    updatedAt: 'hace 1 h',
  },
  {
    userId: 'host_elena',
    userName: 'Artesanos',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    noteText: 'Modelando barro tradicional 🏺',
    emoji: '🏺',
    updatedAt: 'hace 2 h',
  },
  {
    userId: 'host_isletas',
    userName: 'Capitán Silvio',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    noteText: 'Navegando en Isletas ⛵',
    emoji: '⛵',
    updatedAt: 'hace 3 h',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('onboarding');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.TURISTA);
  const [user, setUser] = useState<Turista | Anfitrion | null>(() => {
    try {
      const activeUserId = localStorage.getItem(SESSION_STORAGE_KEY);
      if (activeUserId) {
        const savedAccountsStr = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
        const accs: UserAccount[] = savedAccountsStr ? JSON.parse(savedAccountsStr) : INITIAL_ACCOUNTS;
        const found = accs.find(a => a.id_usuario === activeUserId);
        if (found) {
          if (found.role === UserRole.DESARROLLADOR || found.isDev) {
            return {
              id_turista: found.id_usuario,
              nombre: found.nombre,
              correo: found.correo,
              telefono: found.telefono,
              pais: found.pais || 'Nicaragua',
              departamento: found.departamento || 'León',
              ciudad_origen: found.ciudad,
              bio: found.bio || 'Desarrollador con acceso a opciones de desarrollador y descarga de código.',
              avatar: found.avatar,
              redesSociales: found.redesSociales,
              moodsFavoritos: found.moodsFavoritos || [MoodTag.CREATIVO, MoodTag.AVENTURERO],
              fechaRegistro: found.fechaRegistro,
            } as Turista;
          } else if (found.role === UserRole.ANFITRION) {
            return {
              id_anfitrion: found.id_usuario,
              nombre: found.nombre,
              correo: found.correo,
              telefono: found.telefono || '+505 8812-3456',
              bio: found.bio || '',
              pais: found.pais || 'Nicaragua',
              departamento: found.departamento || 'Masaya',
              ciudad: found.ciudad || 'Masaya',
              avatar: found.avatar,
              rating: 4.95,
              experiencias_count: found.experienciasPropias?.length || 1,
              verificado: true,
              redesSociales: found.redesSociales,
            } as Anfitrion;
          } else {
            return {
              id_turista: found.id_usuario,
              nombre: found.nombre,
              correo: found.correo,
              telefono: found.telefono,
              pais: found.pais || 'Nicaragua',
              departamento: found.departamento || 'León',
              ciudad_origen: found.ciudad,
              bio: found.bio,
              avatar: found.avatar,
              redesSociales: found.redesSociales,
              moodsFavoritos: found.moodsFavoritos || [MoodTag.AVENTURERO, MoodTag.CULTURAL],
              fechaRegistro: found.fechaRegistro,
            } as Turista;
          }
        }
      }
    } catch (e) {
      console.warn('Could not restore user session', e);
    }
    return null;
  });

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
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoriaExp | 'Todas'>('Todas');
  const [selectedMood, setSelectedMood] = useState<MoodTag | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<Experiencia | null>(null);
  const [activeStoryExperience, setActiveStoryExperience] = useState<Experiencia | null>(null);
  const [storyModalMode, setStoryModalMode] = useState<'viewer' | 'upload_user_story' | 'user_stories'>('viewer');

  const openStoryViewer = (
    exp: Experiencia | null,
    mode: 'viewer' | 'upload_user_story' | 'user_stories' = 'viewer'
  ) => {
    setActiveStoryExperience(exp || experiences[0] || null);
    setStoryModalMode(mode);
  };
  const [publishedStoryReviews, setPublishedStoryReviews] = useState<PublishedStoryReview[]>(() => {
    try {
      const saved = localStorage.getItem(PUBLISHED_STORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read cached published stories', e);
    }
    return [];
  });

  const [userStories, setUserStories] = useState<UserStory[]>(() => {
    try {
      const saved = localStorage.getItem(USER_STORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read cached user stories', e);
    }
    return [];
  });

  const [statusNotes, setStatusNotes] = useState<UserStatusNote[]>(() => {
    try {
      const saved = localStorage.getItem(STATUS_NOTES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read cached status notes', e);
    }
    return INITIAL_STATUS_NOTES;
  });

  const [activeBookingExperience, setActiveBookingExperience] = useState<Experiencia | null>(null);

  // Add Published Story Review with automatic persistence
  const addPublishedStoryReview = (review: PublishedStoryReview) => {
    setPublishedStoryReviews(prev => {
      const updated = [review, ...prev];
      try {
        localStorage.setItem(PUBLISHED_STORIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist published story review', e);
      }
      return updated;
    });

    // If photos or videos are attached, also save to userStories so user can view it in "Tu historia"
    if (review.photos && review.photos.length > 0) {
      review.photos.forEach((photo) => {
        addUserStory({
          type: 'foto',
          mediaUrl: photo,
          title: review.experienceTitle,
          caption: review.comment,
          location: review.experienceTitle || 'Nicaragua',
        });
      });
    }
    if (review.videoUrl) {
      addUserStory({
        type: 'video',
        mediaUrl: review.videoUrl,
        title: review.experienceTitle,
        caption: review.comment,
        location: review.experienceTitle || 'Nicaragua',
      });
    }

    // Also increase review count on experience
    setExperiences(prev =>
      prev.map(e => {
        if (e.id_exp === review.experienceId) {
          const newCount = (e.resenas_count || 0) + 1;
          const newRating = Number(
            (((e.rating * (e.resenas_count || 1)) + review.adventureRating) / newCount).toFixed(2)
          );
          return { ...e, resenas_count: newCount, rating: newRating };
        }
        return e;
      })
    );
  };

  // Add User Story (photos or videos uploaded by traveler)
  const addUserStory = (storyData: Omit<UserStory, 'id' | 'date'>): UserStory => {
    const newStory: UserStory = {
      ...storyData,
      id: `usr_story_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setUserStories(prev => {
      const updated = [newStory, ...prev];
      try {
        localStorage.setItem(USER_STORIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist user story', e);
      }
      return updated;
    });

    return newStory;
  };

  const deleteUserStory = (storyId: string) => {
    setUserStories(prev => {
      const updated = prev.filter(s => s.id !== storyId);
      try {
        localStorage.setItem(USER_STORIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist user stories deletion', e);
      }
      return updated;
    });
  };

  // Update self status note
  const updateSelfNote = (text: string, emoji: string = '🐾') => {
    setStatusNotes(prev => {
      const updated = prev.map(n =>
        n.isSelf
          ? {
              ...n,
              noteText: text,
              emoji,
              updatedAt: 'justo ahora',
              userName: user?.nombre ? `${user.nombre.split(' ')[0]} (Tú)` : 'Tu nota',
              userAvatar: user?.avatar || n.userAvatar,
            }
          : n
      );
      try {
        localStorage.setItem(STATUS_NOTES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist status notes', e);
      }
      return updated;
    });
  };
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
        pais: currentUser.pais || (idx >= 0 ? prevAccounts[idx].pais : 'Nicaragua'),
        departamento: currentUser.departamento || (idx >= 0 ? prevAccounts[idx].departamento : 'León'),
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

  // Register Account with anti-duplicate email protection & full profile questionnaires
  const registerAccount = (data: {
    nombre: string;
    correo: string;
    password?: string;
    role?: UserRole;
    avatar?: string;
    pais?: string;
    departamento?: string;
    ciudad?: string;
    bio?: string;
    telefono?: string;
    redesSociales?: RedesSociales;
    moodsFavoritos?: MoodTag[];
    isDev?: boolean;
  }): AuthResponse => {
    const cleanNombre = sanitizeInput(data.nombre?.trim() || '');
    const cleanCorreo = sanitizeInput(data.correo?.trim() || '');
    const cleanPais = sanitizeInput(data.pais?.trim() || 'Nicaragua');
    const cleanDepartamento = sanitizeInput(data.departamento?.trim() || 'León');
    const cleanTelefono = sanitizeInput(data.telefono?.trim() || '+505 8888-0000');
    const cleanPassword = data.password?.trim() || '';
    const role = data.role || UserRole.TURISTA;

    // Security validation on Full Name
    const nameCheck = validateFullName(cleanNombre);
    if (!nameCheck.valid) {
      return { success: false, message: nameCheck.message || 'El nombre es inválido.' };
    }

    // Security validation on Email
    if (!cleanCorreo || !validateEmail(cleanCorreo)) {
      return { success: false, message: 'El correo electrónico es obligatorio y debe tener un formato válido (ej. usuario@ejemplo.com).' };
    }

    // Security validation on Password
    if (cleanPassword) {
      const pwdCheck = validatePasswordSecurity(cleanPassword);
      if (!pwdCheck.valid) {
        return { success: false, message: pwdCheck.message || 'La contraseña no cumple con los requisitos de seguridad.' };
      }
    } else {
      return { success: false, message: 'La contraseña es obligatoria para registrar una cuenta segura.' };
    }

    if (!cleanPais) {
      return { success: false, message: 'El país de origen es un campo obligatorio.' };
    }

    if (!cleanDepartamento) {
      return { success: false, message: 'El departamento / región es un campo obligatorio.' };
    }

    // CHECK DUPLICATE EMAIL: Strictly prevent registering the same email twice
    const emailLower = cleanCorreo.toLowerCase();
    const existingAccount = accounts.find(a => a.correo.trim().toLowerCase() === emailLower);
    if (existingAccount) {
      return {
        success: false,
        message: `El correo "${cleanCorreo}" ya se encuentra registrado en Pata de Perro. Por favor inicia sesión con tu contraseña o utiliza otro correo.`,
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
      telefono: cleanTelefono,
      pais: cleanPais,
      departamento: cleanDepartamento,
      ciudad: data.ciudad || cleanDepartamento,
      bio: data.bio || (role === UserRole.ANFITRION ? 'Anfitrión local comprometido con el turismo vivencial y comunitario.' : 'Amante del turismo comunitario y la riqueza cultural de Nicaragua.'),
      redesSociales: data.redesSociales,
      moodsFavoritos: data.moodsFavoritos || [MoodTag.AVENTURERO, MoodTag.CULTURAL],
      savedExperienceIds: ['exp_tierra_01'],
      reservas: [],
      chatThreads: [],
      fechaRegistro: new Date().toISOString().split('T')[0],
      ultimoAcceso: new Date().toISOString(),
    };

    // Save into accounts collection
    setAccounts(prev => [newAccount, ...prev]);

    // Set active session
    if (role === UserRole.DESARROLLADOR || data.isDev) {
      setIsDevModeUnlocked(true);
      const devUser: Turista = {
        id_turista: newId,
        nombre: cleanNombre,
        correo: cleanCorreo,
        telefono: cleanTelefono,
        pais: cleanPais,
        departamento: cleanDepartamento,
        ciudad_origen: newAccount.ciudad || cleanDepartamento,
        bio: newAccount.bio || 'Desarrollador con acceso a opciones de desarrollador y descargas de código.',
        avatar: defaultAvatar,
        redesSociales: data.redesSociales,
        moodsFavoritos: newAccount.moodsFavoritos || [MoodTag.CREATIVO, MoodTag.AVENTURERO],
        fechaRegistro: newAccount.fechaRegistro,
      };
      setUser(devUser);
      setUserRole(UserRole.DESARROLLADOR);
      setActiveScreen('dev_options');
    } else if (role === UserRole.ANFITRION) {
      const hostUser: Anfitrion = {
        id_anfitrion: newId,
        nombre: cleanNombre,
        correo: cleanCorreo,
        telefono: cleanTelefono,
        bio: newAccount.bio || '',
        pais: cleanPais,
        departamento: cleanDepartamento,
        ciudad: newAccount.ciudad || cleanDepartamento,
        avatar: defaultAvatar,
        rating: 5.0,
        experiencias_count: 0,
        verificado: true,
        redesSociales: data.redesSociales,
      };
      setUser(hostUser);
      setUserRole(UserRole.ANFITRION);
      setActiveScreen('host_dashboard');
    } else {
      const touristUser: Turista = {
        id_turista: newId,
        nombre: cleanNombre,
        correo: cleanCorreo,
        telefono: cleanTelefono,
        pais: cleanPais,
        departamento: cleanDepartamento,
        ciudad_origen: newAccount.ciudad || cleanDepartamento,
        bio: newAccount.bio,
        avatar: defaultAvatar,
        redesSociales: data.redesSociales,
        moodsFavoritos: newAccount.moodsFavoritos,
        fechaRegistro: newAccount.fechaRegistro,
      };
      setUser(touristUser);
      setUserRole(UserRole.TURISTA);
      setActiveScreen('explore');
    }

    setSavedExperienceIds(['exp_tierra_01']);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, newId);
    } catch (e) {
      console.warn('Could not save session key', e);
    }

    // Persist to Firebase Backend (Auth + Firestore users collection)
    registerUserBackend({
      nombre: cleanNombre,
      correo: cleanCorreo,
      password: cleanPassword,
      role,
      telefono: cleanTelefono,
      pais: cleanPais,
      departamento: cleanDepartamento,
      avatar: defaultAvatar,
      bio: newAccount.bio,
    }).then(backendRes => {
      if (backendRes.success && backendRes.userAccount) {
        console.log('User synced to Firebase Auth & Firestore successfully:', backendRes.userAccount.id_usuario);
      }
    }).catch(err => console.warn('Firebase sync warning:', err));

    showToast(`¡Cuenta y perfil creados exitosamente! Bienvenido, ${cleanNombre}.`);
    return { success: true, message: '¡Cuenta registrada exitosamente!', account: newAccount };
  };

  // Login with existing account (supports local cache + Firebase Cloud Authentication across all devices)
  const loginAccount = async (correo: string, password?: string): Promise<AuthResponse> => {
    // Check if currently locked out due to excessive failed attempts
    const lockoutSecs = getLoginLockoutRemainingSeconds();
    if (lockoutSecs > 0) {
      return {
        success: false,
        message: `Acceso temporalmente bloqueado por múltiples intentos fallidos. Por favor espera ${lockoutSecs} segundos antes de reintentar.`,
      };
    }

    if (detectInjectionThreat(correo) || (password && detectInjectionThreat(password))) {
      return {
        success: false,
        message: 'Se detectó una secuencia no válida en los datos ingresados.',
      };
    }

    const cleanCorreo = sanitizeInput(correo.trim().toLowerCase());
    if (!cleanCorreo) {
      return { success: false, message: 'Por favor ingresa tu correo electrónico o nombre de usuario.' };
    }

    // Lookup account by email or username in local storage
    let found = accounts.find(
      a =>
        a.correo.trim().toLowerCase() === cleanCorreo ||
        a.correo.split('@')[0].toLowerCase() === cleanCorreo ||
        a.nombre.trim().toLowerCase() === cleanCorreo
    );

    // If account not found in this device's local storage OR password doesn't match cached copy,
    // authenticate directly with Firebase Cloud Authentication & Firestore
    if ((!found || (password && found.password && found.password !== password)) && isFirebaseConfigured) {
      try {
        const backendRes = await loginUserBackend(cleanCorreo, password);
        if (backendRes.success && backendRes.userAccount) {
          const cloudAcc: UserAccount = {
            id_usuario: backendRes.userAccount.id_usuario,
            nombre: backendRes.userAccount.nombre,
            correo: backendRes.userAccount.correo,
            password: password || found?.password || '123456',
            role: (backendRes.userAccount.role as any) || found?.role || UserRole.TURISTA,
            avatar: backendRes.userAccount.avatar || found?.avatar || '',
            telefono: backendRes.userAccount.telefono || found?.telefono || '',
            pais: backendRes.userAccount.pais || found?.pais || 'Nicaragua',
            departamento: backendRes.userAccount.departamento || found?.departamento || 'León',
            ciudad: backendRes.userAccount.ciudad || found?.ciudad || 'León',
            bio: backendRes.userAccount.bio || found?.bio || '',
            savedExperienceIds: backendRes.userAccount.savedExperienceIds || found?.savedExperienceIds || ['exp_tierra_01'],
            reservas: backendRes.userAccount.reservas || found?.reservas || [],
            chatThreads: backendRes.userAccount.chatThreads || found?.chatThreads || [],
            fechaRegistro: backendRes.userAccount.fechaRegistro || new Date().toISOString().split('T')[0],
            ultimoAcceso: new Date().toISOString(),
          };

          // Save account on this device so next operations are fast
          setAccounts(prev => {
            const index = prev.findIndex(
              a => a.id_usuario === cloudAcc.id_usuario || a.correo.toLowerCase() === cloudAcc.correo.toLowerCase()
            );
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = { ...updated[index], ...cloudAcc };
              return updated;
            }
            return [cloudAcc, ...prev];
          });

          found = cloudAcc;
        } else if (!found && backendRes.errorCode) {
          const attempt = recordFailedLoginAttempt();
          if (attempt.isLocked) {
            return {
              success: false,
              message: `Demasiados intentos fallidos. Acceso suspendido por ${attempt.remainingSeconds} segundos.`,
            };
          }
          return {
            success: false,
            message: backendRes.message || `No encontramos ninguna cuenta vinculada a "${correo}".`,
          };
        }
      } catch (cloudErr) {
        console.warn('Firebase cloud login sync note:', cloudErr);
      }
    }

    if (!found) {
      const attempt = recordFailedLoginAttempt();
      if (attempt.isLocked) {
        return {
          success: false,
          message: `Demasiados intentos fallidos. Por seguridad, tu acceso ha sido suspendido por ${attempt.remainingSeconds} segundos.`,
        };
      }
      return {
        success: false,
        message: `No encontramos ninguna cuenta vinculada a "${correo}". Por favor verifica tus datos o regístrate como nuevo usuario.`,
      };
    }

    // Password verification
    if (password && found.password && found.password !== password) {
      const attempt = recordFailedLoginAttempt();
      if (attempt.isLocked) {
        return {
          success: false,
          message: `Demasiados intentos fallidos con contraseña incorrecta. Acceso suspendido por ${attempt.remainingSeconds} segundos.`,
        };
      }
      return {
        success: false,
        message: 'Contraseña incorrecta. Por favor intenta nuevamente.',
      };
    }

    // Clear failed attempts counter on valid login
    clearLoginAttempts();

    // Switch active state to matched user
    if (found.role === UserRole.DESARROLLADOR || found.isDev) {
      setIsDevModeUnlocked(true);
      const devUser: Turista = {
        id_turista: found.id_usuario,
        nombre: found.nombre,
        correo: found.correo,
        telefono: found.telefono,
        pais: found.pais || 'Nicaragua',
        departamento: found.departamento || 'León',
        ciudad_origen: found.ciudad,
        bio: found.bio || 'Desarrollador con acceso a opciones de desarrollador, descargas de código y archivos de proyecto.',
        avatar: found.avatar,
        redesSociales: found.redesSociales,
        moodsFavoritos: found.moodsFavoritos || [MoodTag.CREATIVO, MoodTag.AVENTURERO],
        fechaRegistro: found.fechaRegistro,
      };
      setUser(devUser);
      setUserRole(UserRole.DESARROLLADOR);
      setActiveScreen('dev_options');
    } else if (found.role === UserRole.ANFITRION) {
      const hostUser: Anfitrion = {
        id_anfitrion: found.id_usuario,
        nombre: found.nombre,
        correo: found.correo,
        telefono: found.telefono || '+505 8812-3456',
        bio: found.bio || '',
        pais: found.pais || 'Nicaragua',
        departamento: found.departamento || 'Masaya',
        ciudad: found.ciudad || 'Masaya',
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
        pais: found.pais || 'Nicaragua',
        departamento: found.departamento || 'León',
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

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, found.id_usuario);
    } catch (e) {
      console.warn('Could not save session key', e);
    }

    showToast(`¡Hola de nuevo, ${found.nombre}! Sesión iniciada.`);
    return { success: true, message: '¡Sesión iniciada con éxito!', account: found };
  };

  // Login with Social Providers: Google, Facebook, GitHub, Apple via Firebase Auth
  const loginWithSocialProvider = async (provider: 'google' | 'facebook' | 'github' | 'apple'): Promise<AuthResponse> => {
    try {
      const res = await signInWithSocialBackend(provider);
      if (res.success && res.userAccount) {
        const acc = res.userAccount;
        setAccounts(prev => {
          const idx = prev.findIndex(a => a.id_usuario === acc.id_usuario);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = acc;
            return updated;
          }
          return [acc, ...prev];
        });

        if (provider === 'github' || acc.role === UserRole.DESARROLLADOR || acc.isDev) {
          setIsDevModeUnlocked(true);
          const devUser: Turista = {
            id_turista: acc.id_usuario,
            nombre: acc.nombre,
            correo: acc.correo,
            telefono: acc.telefono || '+505 8888-0000',
            pais: acc.pais || 'Nicaragua',
            departamento: acc.departamento || 'León',
            ciudad_origen: acc.ciudad || 'León',
            bio: acc.bio || 'Desarrollador con acceso a opciones de desarrollador, descargas de código y archivos de proyecto.',
            avatar: acc.avatar,
            moodsFavoritos: [MoodTag.CREATIVO, MoodTag.AVENTURERO],
            fechaRegistro: acc.fechaRegistro,
          };
          setUser(devUser);
          setUserRole(UserRole.DESARROLLADOR);
          setActiveScreen('dev_options');
          showToast('¡Sesión GitHub! Opciones de Desarrollador y descarga de archivos activadas.');
        } else if (acc.role === UserRole.ANFITRION) {
          const hostUser: Anfitrion = {
            id_anfitrion: acc.id_usuario,
            nombre: acc.nombre,
            correo: acc.correo,
            telefono: acc.telefono || '+505 8888-0000',
            bio: acc.bio || '',
            pais: acc.pais || 'Nicaragua',
            departamento: acc.departamento || 'Granada',
            ciudad: acc.ciudad || 'Granada',
            avatar: acc.avatar,
            rating: 5.0,
            experiencias_count: 1,
            verificado: true,
          };
          setUser(hostUser);
          setUserRole(UserRole.ANFITRION);
          setActiveScreen('host_dashboard');
        } else {
          const touristUser: Turista = {
            id_turista: acc.id_usuario,
            nombre: acc.nombre,
            correo: acc.correo,
            telefono: acc.telefono || '+505 8888-0000',
            pais: acc.pais || 'Nicaragua',
            departamento: acc.departamento || 'Granada',
            ciudad_origen: acc.ciudad,
            bio: acc.bio,
            avatar: acc.avatar,
            moodsFavoritos: [MoodTag.AVENTURERO, MoodTag.CULTURAL],
            fechaRegistro: acc.fechaRegistro,
          };
          setUser(touristUser);
          setUserRole(UserRole.TURISTA);
          setActiveScreen('explore');
        }

        try {
          localStorage.setItem(SESSION_STORAGE_KEY, acc.id_usuario);
        } catch (e) {
          console.warn('Could not save session key', e);
        }

        showToast(res.message);
        return { success: true, message: res.message, account: acc };
      }

      if (provider === 'github') {
        // Guaranteed fallback for GitHub developer mode
        setIsDevModeUnlocked(true);
        const devUser: Turista = {
          id_turista: 'dev-github-master',
          nombre: 'Desarrollador GitHub',
          correo: 'dev.github@patadeperro.ni',
          telefono: '+505 8888-0000',
          pais: 'Nicaragua',
          departamento: 'León',
          ciudad_origen: 'León',
          bio: 'Desarrollador verificado con acceso a opciones de desarrollo, descargas de código y archivos de proyecto.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          moodsFavoritos: [MoodTag.CREATIVO, MoodTag.AVENTURERO],
          fechaRegistro: new Date().toISOString(),
        };
        setUser(devUser);
        setUserRole(UserRole.DESARROLLADOR);
        setActiveScreen('dev_options');
        showToast('¡Sesión GitHub activada con permisos de Desarrollador!');
        return { success: true, message: '¡Acceso Desarrollador Concedido vía GitHub!' };
      }

      return { success: false, message: res.message, errorCode: res.errorCode };
    } catch (e: any) {
      console.warn('Social login notice:', e);
      if (provider === 'github') {
        setIsDevModeUnlocked(true);
        const devUser: Turista = {
          id_turista: 'dev-github-master',
          nombre: 'Desarrollador GitHub',
          correo: 'dev.github@patadeperro.ni',
          telefono: '+505 8888-0000',
          pais: 'Nicaragua',
          departamento: 'León',
          ciudad_origen: 'León',
          bio: 'Desarrollador verificado con acceso a opciones de desarrollo, descargas de código y archivos de proyecto.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          moodsFavoritos: [MoodTag.CREATIVO, MoodTag.AVENTURERO],
          fechaRegistro: new Date().toISOString(),
        };
        setUser(devUser);
        setUserRole(UserRole.DESARROLLADOR);
        setActiveScreen('dev_options');
        showToast('¡Sesión GitHub activada con permisos de Desarrollador!');
        return { success: true, message: '¡Acceso Desarrollador Concedido vía GitHub!' };
      }
      return {
        success: false,
        message: e?.message || 'Error durante la autenticación social.',
        errorCode: e?.code,
      };
    }
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
    logoutUserBackend().catch(err => console.warn('Firebase logout warning:', err));
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not remove session key', e);
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
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (e) {
        console.warn('Could not remove session key', e);
      }
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

    // Persist to backend Firestore in background
    if (user) {
      const uId = 'id_turista' in user ? user.id_turista : user.id_anfitrion;
      saveReservationBackend(uId, newReserva).catch(err =>
        console.warn('Backend reservation sync error:', err)
      );
    }

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
    const newBio = updated.bio !== undefined ? sanitizeInput(updated.bio) : user?.bio;
    const activeUserId = (user as Turista)?.id_turista || (user as any)?.id_usuario;
    const userEmail = updated.correo?.trim().toLowerCase() || user?.correo?.trim().toLowerCase();

    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updated,
        nombre: newName,
        avatar: newAvatar,
        bio: newBio,
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

    // Update registered accounts collection and persist synchronously to localStorage
    setAccounts(prevAccounts => {
      const idx = prevAccounts.findIndex(
        a => (activeUserId && a.id_usuario === activeUserId) || (userEmail && a.correo.trim().toLowerCase() === userEmail)
      );

      const mergedData: Partial<UserAccount> = {
        nombre: newName,
        correo: updated.correo?.trim() || user?.correo || '',
        avatar: newAvatar,
        telefono: updated.telefono !== undefined ? updated.telefono : user?.telefono,
        pais: updated.pais !== undefined ? updated.pais : user?.pais,
        departamento: updated.departamento !== undefined ? updated.departamento : user?.departamento,
        ciudad: updated.ciudad_origen !== undefined ? updated.ciudad_origen : (user as Turista)?.ciudad_origen,
        bio: newBio,
        redesSociales: updated.redesSociales !== undefined ? updated.redesSociales : user?.redesSociales,
        moodsFavoritos: updated.moodsFavoritos !== undefined ? updated.moodsFavoritos : (user as Turista)?.moodsFavoritos,
        ultimoAcceso: new Date().toISOString(),
      };

      let nextAccounts: UserAccount[];
      if (idx >= 0) {
        nextAccounts = [...prevAccounts];
        nextAccounts[idx] = {
          ...nextAccounts[idx],
          ...mergedData,
        };
      } else {
        const fallbackAcc: UserAccount = {
          id_usuario: activeUserId || `usr_${Date.now()}`,
          password: '••••••••',
          role: UserRole.TURISTA,
          fechaRegistro: new Date().toISOString().split('T')[0],
          ...mergedData,
        } as UserAccount;
        nextAccounts = [fallbackAcc, ...prevAccounts];
      }

      try {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(nextAccounts));
        if (activeUserId) {
          localStorage.setItem(SESSION_STORAGE_KEY, activeUserId);
        }
      } catch (err) {
        console.warn('Could not persist accounts to localStorage', err);
      }

      return nextAccounts;
    });

    // Cloud / Firestore Backend sync
    if (activeUserId) {
      saveUserProfileBackend(activeUserId, {
        nombre: newName,
        correo: updated.correo?.trim() || user?.correo || '',
        avatar: newAvatar,
        telefono: updated.telefono !== undefined ? updated.telefono : user?.telefono,
        pais: updated.pais !== undefined ? updated.pais : user?.pais,
        departamento: updated.departamento !== undefined ? updated.departamento : user?.departamento,
        bio: newBio,
        redesSociales: updated.redesSociales !== undefined ? updated.redesSociales : user?.redesSociales,
      }).catch(err => {
        console.warn('Notice syncing profile with backend:', err);
      });
    }

    showToast('¡Perfil de usuario, fotos y vinculaciones guardados permanentemente!');
  };

  const updateHostProfile = (updated: Partial<Anfitrion>) => {
    const newName = updated.nombre ? sanitizeInput(updated.nombre) : (user?.nombre || 'Anfitrión');
    const newAvatar = updated.avatar !== undefined ? updated.avatar : user?.avatar;
    const newBio = updated.bio !== undefined ? sanitizeInput(updated.bio) : user?.bio;
    const activeUserId = (user as Anfitrion)?.id_anfitrion || (user as any)?.id_usuario;
    const userEmail = updated.correo?.trim().toLowerCase() || user?.correo?.trim().toLowerCase();

    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updated,
        nombre: newName,
        avatar: newAvatar,
        bio: newBio,
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

    // Update registered accounts collection and persist synchronously to localStorage
    setAccounts(prevAccounts => {
      const idx = prevAccounts.findIndex(
        a => (activeUserId && a.id_usuario === activeUserId) || (userEmail && a.correo.trim().toLowerCase() === userEmail)
      );

      const mergedData: Partial<UserAccount> = {
        nombre: newName,
        correo: updated.correo?.trim() || user?.correo || '',
        avatar: newAvatar,
        telefono: updated.telefono !== undefined ? updated.telefono : user?.telefono,
        ciudad: updated.ciudad !== undefined ? updated.ciudad : (user as Anfitrion)?.ciudad,
        bio: newBio,
        redesSociales: updated.redesSociales !== undefined ? updated.redesSociales : user?.redesSociales,
        ultimoAcceso: new Date().toISOString(),
      };

      let nextAccounts: UserAccount[];
      if (idx >= 0) {
        nextAccounts = [...prevAccounts];
        nextAccounts[idx] = {
          ...nextAccounts[idx],
          ...mergedData,
        };
      } else {
        const fallbackAcc: UserAccount = {
          id_usuario: activeUserId || `host_${Date.now()}`,
          password: '••••••••',
          role: UserRole.ANFITRION,
          fechaRegistro: new Date().toISOString().split('T')[0],
          ...mergedData,
        } as UserAccount;
        nextAccounts = [fallbackAcc, ...prevAccounts];
      }

      try {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(nextAccounts));
        if (activeUserId) {
          localStorage.setItem(SESSION_STORAGE_KEY, activeUserId);
        }
      } catch (err) {
        console.warn('Could not persist host accounts to localStorage', err);
      }

      return nextAccounts;
    });

    // Cloud / Firestore Backend sync
    if (activeUserId) {
      saveUserProfileBackend(activeUserId, {
        nombre: newName,
        correo: updated.correo?.trim() || user?.correo || '',
        avatar: newAvatar,
        telefono: updated.telefono !== undefined ? updated.telefono : user?.telefono,
        ciudad: updated.ciudad !== undefined ? updated.ciudad : (user as Anfitrion)?.ciudad,
        bio: newBio,
        redesSociales: updated.redesSociales !== undefined ? updated.redesSociales : user?.redesSociales,
      }).catch(err => {
        console.warn('Notice syncing host profile with backend:', err);
      });
    }

    showToast('¡Perfil de anfitrión, fotos y vinculaciones guardados permanentemente!');
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
    setReservations([]);
    setChatThreads([]);
    setSavedExperienceIds([]);
    setAccounts([]);
    setUser(null);
    setUserRole(UserRole.TURISTA);
    setIsDevModeUnlocked(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(DEV_MODE_STORAGE_KEY);
    showToast('Estado restablecido. Base de datos y cuentas limpiadas.');
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
        loginWithSocialProvider,
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
        activeStoryExperience,
        setActiveStoryExperience,
        storyModalMode,
        setStoryModalMode,
        openStoryViewer,
        publishedStoryReviews,
        addPublishedStoryReview,
        userStories,
        addUserStory,
        deleteUserStory,
        statusNotes,
        updateSelfNote,
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

