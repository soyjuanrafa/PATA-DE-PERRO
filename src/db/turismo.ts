import { db } from './index.ts';
import { anfitriones, experiencias, puntosInteresRa, reservas, turistas } from './schema.ts';
import { eq } from 'drizzle-orm';
import { INITIAL_EXPERIENCES, INITIAL_HOSTS, INITIAL_RESERVATIONS } from '../data/mockData.ts';

export async function getExperiencias() {
  try {
    if (!process.env.SQL_HOST) {
      return INITIAL_EXPERIENCES;
    }
    return await db.select().from(experiencias);
  } catch (error) {
    console.warn("Database query for experiencias unavailable, using fallback mock data:", error);
    return INITIAL_EXPERIENCES;
  }
}

export async function getReservas() {
  try {
    if (!process.env.SQL_HOST) {
      return INITIAL_RESERVATIONS;
    }
    return await db.select().from(reservas);
  } catch (error) {
    console.warn("Database query for reservas unavailable, using fallback mock data:", error);
    return INITIAL_RESERVATIONS;
  }
}

export async function getAnfitriones() {
  try {
    if (!process.env.SQL_HOST) {
      return INITIAL_HOSTS;
    }
    return await db.select().from(anfitriones);
  } catch (error) {
    console.warn("Database query for anfitriones unavailable, using fallback mock data:", error);
    return INITIAL_HOSTS;
  }
}

export async function getPuntosInteresRa() {
  try {
    if (!process.env.SQL_HOST) {
      return [];
    }
    return await db.select().from(puntosInteresRa);
  } catch (error) {
    console.warn("Database query for puntosInteresRa unavailable:", error);
    return [];
  }
}

export async function createReservaSync(reservaData: any) {
  try {
    if (!process.env.SQL_HOST) {
      return reservaData;
    }
    return await db.insert(reservas).values({
      fecha: reservaData.fecha || reservaData.fecha_reserva,
      personas: reservaData.personas,
      montoTotal: (reservaData.monto_total || reservaData.montoTotal)?.toString() || "0",
      codigoConf: reservaData.codigo_conf || reservaData.codigo_confirmacion,
      estado: reservaData.estado_reserva || reservaData.estado || 'confirmada',
    }).onConflictDoUpdate({
      target: reservas.codigoConf,
      set: {
        estado: reservaData.estado_reserva || reservaData.estado || 'confirmada',
      }
    }).returning();
  } catch (error) {
    console.warn("Could not sync reservation to database, returning local copy:", error);
    return reservaData;
  }
}

