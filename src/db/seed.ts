import { db } from './index.ts';
import { anfitriones, experiencias, puntosInteresRa, turistas, users } from './schema.ts';

export async function seedDatabase() {
  try {
    const exps = await db.select().from(experiencias);
    if (exps.length > 0) {
      console.log('Database already seeded.');
      return { status: 'already_seeded' };
    }

    // Seed logic here...
    console.log('Seeding process would go here.');
    return { status: 'seeded' };
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}
