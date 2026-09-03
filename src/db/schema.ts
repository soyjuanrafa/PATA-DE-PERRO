import { relations } from 'drizzle-orm';
import { boolean, integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table - identifier is Firebase Auth uid
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  nombre: text('nombre'),
  role: text('role').default('turista'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define 'turistas' table
export const turistas = pgTable('turistas', {
  id: serial('id_turista').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  uid: text('uid').notNull().unique(),
  nombre: text('nombre').notNull(),
  correo: text('correo').notNull(),
  telefono: text('telefono'),
  pais: text('pais').default('Nicaragua'),
  departamento: text('departamento').default('Granada'),
  ciudad: text('ciudad').default('Granada'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define 'anfitriones' table
export const anfitriones = pgTable('anfitriones', {
  id: serial('id_anfitrion').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  nombre: text('nombre').notNull(),
  comunidad: text('comunidad').notNull(),
  departamento: text('departamento').notNull(),
  telefono: text('telefono'),
  verificado: boolean('verificado').default(true),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define 'experiencias' table
export const experiencias = pgTable('experiencias', {
  id: serial('id_exp').primaryKey(),
  idAnfitrion: integer('id_anfitrion').references(() => anfitriones.id),
  titulo: text('titulo').notNull(),
  categoria: text('categoria').notNull(),
  precio: numeric('precio', { precision: 10, scale: 2 }).notNull(),
  departamento: text('departamento').notNull(),
  ciudad: text('ciudad').notNull(),
  recursoRaUrl: text('recurso_ra_url'),
  descripcion: text('descripcion'),
  duracion: text('duracion'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define 'reservas' table
export const reservas = pgTable('reservas', {
  id: serial('id_reserva').primaryKey(),
  idTurista: integer('id_turista').references(() => turistas.id),
  idExp: integer('id_exp').references(() => experiencias.id),
  fecha: text('fecha').notNull(),
  personas: integer('personas').notNull(),
  montoTotal: numeric('monto_total', { precision: 10, scale: 2 }).notNull(),
  codigoConf: text('codigo_conf').notNull().unique(),
  estado: text('estado').default('confirmada'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define 'puntos_interes_ra' table
export const puntosInteresRa = pgTable('puntos_interes_ra', {
  id: serial('id_poi_ra').primaryKey(),
  idExp: integer('id_exp').references(() => experiencias.id),
  nombre: text('nombre').notNull(),
  latitud: numeric('latitud', { precision: 10, scale: 6 }).notNull(),
  longitud: numeric('longitud', { precision: 10, scale: 6 }).notNull(),
  distanciaM: integer('distancia_m'),
  gltfModelo: text('gltf_modelo'),
  descripcion: text('descripcion'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ one }) => ({
  turista: one(turistas, {
    fields: [users.id],
    references: [turistas.userId],
  }),
  anfitrion: one(anfitriones, {
    fields: [users.id],
    references: [anfitriones.userId],
  }),
}));

export const turistasRelations = relations(turistas, ({ one, many }) => ({
  user: one(users, {
    fields: [turistas.userId],
    references: [users.id],
  }),
  reservas: many(reservas),
}));

export const anfitrionesRelations = relations(anfitriones, ({ one, many }) => ({
  user: one(users, {
    fields: [anfitriones.userId],
    references: [users.id],
  }),
  experiencias: many(experiencias),
}));

export const experienciasRelations = relations(experiencias, ({ one, many }) => ({
  anfitrion: one(anfitriones, {
    fields: [experiencias.idAnfitrion],
    references: [anfitriones.id],
  }),
  reservas: many(reservas),
  puntosRa: many(puntosInteresRa),
}));

export const reservasRelations = relations(reservas, ({ one }) => ({
  turista: one(turistas, {
    fields: [reservas.idTurista],
    references: [turistas.id],
  }),
  experiencia: one(experiencias, {
    fields: [reservas.idExp],
    references: [experiencias.id],
  }),
}));

export const puntosInteresRaRelations = relations(puntosInteresRa, ({ one }) => ({
  experiencia: one(experiencias, {
    fields: [puntosInteresRa.idExp],
    references: [experiencias.id],
  }),
}));
