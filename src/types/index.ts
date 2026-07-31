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
}

export interface Turista {
  id_turista: string;
  nombre: string;
  correo: string;
  telefono?: string;
  avatar?: string;
  ciudad_origen?: string;
}

export interface Anfitrion {
  id_anfitrion: string;
  nombre: string;
  correo: string;
  telefono: string;
  bio: string;
  ciudad: string;
  avatar?: string;
  rating: number;
  experiencias_count: number;
  verificado: boolean;
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

export interface BackupSnapshot {
  timestamp: string;
  version: string;
  appState: {
    user: Turista | Anfitrion | null;
    userRole: UserRole;
    experiencias: Experiencia[];
    reservas: Reserva[];
  };
}

export interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  durationMs: number;
}
