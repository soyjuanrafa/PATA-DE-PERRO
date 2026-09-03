/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Types & Interface Definitions
 */

export enum CategoriaExp {
  TIERRA = 'Tierra',
  AGUA = 'Agua',
  AIRE = 'Aire',
}

export enum EstadoReserva {
  PENDIENTE = 'Pendiente',
  CONFIRMADA = 'Confirmada',
  COMPLETADA = 'Completada',
  CANCELADA = 'Cancelada',
}

export enum MoodTag {
  TRANQUILO = 'Tranquilo',
  AVENTURERO = 'Aventurero',
  CULTURAL = 'Cultural',
  CREATIVO = 'Creativo',
  GASTRONOMICO = 'Gastronómico',
}

export enum UserRole {
  TURISTA = 'Turista',
  ANFITRION = 'Anfitrión',
  DESARROLLADOR = 'Desarrollador',
}

export interface RedesSociales {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  web?: string;
}

export interface UserAccount {
  id_usuario: string;
  nombre: string;
  correo: string;
  password?: string;
  role: UserRole;
  isDev?: boolean;
  authProvider?: 'google' | 'facebook' | 'github' | 'apple' | 'email';
  avatar?: string;
  telefono?: string;
  pais?: string;
  departamento?: string;
  ciudad?: string;
  bio?: string;
  redesSociales?: RedesSociales;
  moodsFavoritos?: MoodTag[];
  savedExperienceIds?: string[];
  reservas?: Reserva[];
  experienciasPropias?: Experiencia[];
  chatThreads?: ChatThread[];
  fechaRegistro: string;
  ultimoAcceso: string;
  twoFactorEnabled?: boolean;
  twoFactorCode?: string;
  sessionTimeoutMinutes?: number;
}

export interface Turista {
  id_turista: string;
  nombre: string;
  correo: string;
  telefono?: string;
  avatar?: string;
  pais?: string;
  departamento?: string;
  ciudad_origen?: string;
  bio?: string;
  redesSociales?: RedesSociales;
  moodsFavoritos?: MoodTag[];
  fechaRegistro?: string;
}

export interface Anfitrion {
  id_anfitrion: string;
  nombre: string;
  correo: string;
  telefono: string;
  bio: string;
  pais?: string;
  departamento?: string;
  ciudad: string;
  avatar?: string;
  rating: number;
  experiencias_count: number;
  verificado: boolean;
  redesSociales?: RedesSociales;
  especialidad?: string;
}

export interface Experiencia {
  id_exp: string;
  id_anfitrion: string;
  anfitrion_nombre: string;
  anfitrion_avatar?: string;
  categoria: CategoriaExp;
  titulo: string;
  descripcion: string;
  precio: number;
  moneda: string; // 'USD' | 'NIO'
  ubicacion_nombre: string;
  ciudad_creativa: string;
  ubicacion_lat: number;
  ubicacion_lon: number;
  recurso_ra_url: string;
  imagen_url: string;
  rating: number;
  resenas_count: number;
  duracion: string;
  incluye: string[];
  moods: MoodTag[];
  dificultad?: 'Fácil' | 'Moderado' | 'Desafiante';
}

export interface Reserva {
  id_reserva: string;
  id_turista: string;
  turista_nombre: string;
  id_exp: string;
  exp_titulo: string;
  exp_imagen: string;
  exp_ciudad: string;
  fecha_reserva: string;
  personas: number;
  monto_total: number;
  estado_reserva: EstadoReserva;
  codigo_confirmacion: string;
  contacto_whatsapp: string;
  fecha_creacion: string;
}

export interface Resena {
  id_resena: string;
  id_exp: string;
  autor_nombre: string;
  comentario: string;
  calificacion: number;
  fecha: string;
}

export interface PuntoRA {
  id: string;
  expId: string;
  titulo: string;
  distancia_metros: number;
  lat: number;
  lon: number;
  categoria: CategoriaExp;
  icono: string;
  instrucciones_ra: string;
}

export interface ChatMessage {
  id_mensaje: string;
  id_hilo: string;
  emisor_id: string;
  emisor_nombre: string;
  emisor_rol: UserRole;
  emisor_avatar?: string;
  texto: string;
  timestamp: string;
  tipo?: 'texto' | 'ubicacion' | 'reserva_info' | 'foto' | 'audio' | 'itinerario';
  media_url?: string;
  audio_duracion?: string;
  reaccion?: string;
  leido: boolean;
}

export interface ChatThread {
  id_hilo: string;
  id_turista: string;
  turista_nombre: string;
  turista_avatar?: string;
  id_anfitrion: string;
  anfitrion_nombre: string;
  anfitrion_avatar?: string;
  id_exp?: string;
  exp_titulo?: string;
  exp_imagen?: string;
  ultimo_mensaje: string;
  ultimo_timestamp: string;
  mensajes_no_leidos_turista: number;
  mensajes_no_leidos_anfitrion: number;
  mensajes: ChatMessage[];
}

export interface BackupSnapshot {
  timestamp: string;
  version: string;
  appState: {
    user: Turista | Anfitrion | null;
    userRole: UserRole;
    experiencias: Experiencia[];
    reservas: Reserva[];
    savedExperienceIds?: string[];
    chatThreads?: ChatThread[];
  };
}

export interface ExperienceStory {
  id: string;
  experienceId: string;
  order: number;
  type: 'image' | 'video' | 'text';
  mediaUrl: string;
  title: string;
  description: string;
  quote?: string;
  quoteAuthor?: string;
  culturalElement?: string;
  duration?: number; // duration in seconds
  language?: string;
  createdAt?: string;
}

export interface UserStory {
  id: string;
  type: 'foto' | 'video';
  mediaUrl: string;
  title: string;
  caption?: string;
  location?: string;
  date: string;
}

export interface PublishedStoryReview {
  id: string;
  experienceId: string;
  experienceTitle: string;
  experienceImage?: string;
  authorName: string;
  authorAvatar?: string;
  sharedTypes: ('foto' | 'video' | 'historia')[];
  photos?: string[];
  videoUrl?: string;
  comment: string;
  adventureRating: number;
  hostRating: number;
  publishedAt: string;
}

export interface UserStatusNote {
  userId: string;
  userName: string;
  userAvatar: string;
  noteText: string;
  emoji?: string;
  updatedAt: string;
  isSelf?: boolean;
}

export interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  durationMs: number;
}

export interface UserFile {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  downloadUrl: string; // Base64 or cloud storage URL
  uploadDate: string; // ISO string
  category?: 'document' | 'photo' | 'ticket' | 'story' | 'other';
  description?: string;
}

