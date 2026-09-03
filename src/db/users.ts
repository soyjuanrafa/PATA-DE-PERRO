import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, nombre?: string, role?: string) {
  try {
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
    console.error("Database user upsert failed:", error);
    throw new Error("Database user operation failed. Please try again later.", { cause: error });
  }
}

export async function getUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}
