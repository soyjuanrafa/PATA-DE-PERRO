import { db } from './index.ts';
import { users, turistas } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string, nombre?: string, role?: string) {
  try {
    if (!process.env.SQL_HOST) {
      return {
        id: 1,
        uid,
        email,
        nombre: nombre || email.split('@')[0],
        role: role || 'turista',
      };
    }
    const result = await db.insert(users)
      .values({
        uid,
        email,
        nombre: nombre || email.split('@')[0],
        role: role || 'turista',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(nombre ? { nombre } : {}),
          ...(role ? { role } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.warn("Database user operation unavailable, using local session object:", error);
    return {
      id: 1,
      uid,
      email,
      nombre: nombre || email.split('@')[0],
      role: role || 'turista',
    };
  }
}

export async function getUsers() {
  try {
    if (!process.env.SQL_HOST) {
      return [];
    }
    return await db.select().from(users);
  } catch (error) {
    console.warn("Database query for users unavailable or empty:", error);
    return [];
  }
}

export async function clearAllUsers() {
  try {
    if (process.env.SQL_HOST) {
      await db.delete(turistas);
      await db.delete(users);
      return { success: true, count: 0, message: 'Base de datos de usuarios vaciada con éxito.' };
    }
    return { success: true, message: 'No hay base de datos SQL conectada; 0 cuentas registradas.' };
  } catch (error: any) {
    console.error("Error clearing users from database:", error);
    throw new Error("Error al eliminar cuentas de la base de datos: " + error?.message);
  }
}


