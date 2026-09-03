import { db } from './index.ts';
import { anfitriones, experiencias, puntosInteresRa, reservas, turistas } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getExperiencias() {
  try {
    return await db.select().from(experiencias);
  } catch (error) {
    console.error("Database query failed for experiencias:", error);
    throw new Error("Failed to fetch experiences from database.", { cause: error });
  }
}

export async function getReservas() {
  try {
    return await db.select().from(reservas);
  } catch (error) {
    console.error("Database query failed for reservas:", error);
    throw new Error("Failed to fetch reservations from database.", { cause: error });
  }
}

export async function getAnfitriones() {
  try {
    return await db.select().from(anfitriones);
  } catch (error) {
    console.error("Database query failed for anfitriones:", error);
    throw new Error("Failed to fetch hosts from database.", { cause: error });
  }
}

export async function getPuntosInteresRa() {
  try {
    return await db.select().from(puntosInteresRa);
  } catch (error) {
    console.error("Database query failed for puntosInteresRa:", error);
    throw new Error("Failed to fetch AR POIs from database.", { cause: error });
  }
}

export async function createReservaSync(reservaData: any) {
  try {
    // Note: In a real app we would map Firebase UID to local serial ID.
    // For now we just insert the core details if they map exactly, 
    // or we can store it as a fallback.
    return await db.insert(reservas).values({
      fecha: reservaData.fecha,
      personas: reservaData.personas,
      montoTotal: reservaData.monto_total?.toString() || "0",
      codigoConf: reservaData.codigo_conf,
      estado: reservaData.estado_reserva || 'confirmada',
    }).onConflictDoUpdate({
      target: reservas.codigoConf,
      set: {
        estado: reservaData.estado_reserva,
      }
    }).returning();
  } catch (error) {
    console.error("Database query failed for createReservaSync:", error);
    throw new Error("Failed to create reservation in database.", { cause: error });
  }
}
