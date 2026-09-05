/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Mock Data & Technical Documentation Specifications
 */

import {
  CategoriaExp,
  EstadoReserva,
  MoodTag,
  Experiencia,
  Anfitrion,
  Reserva,
  Turista,
  UserRole,
  UserAccount,
} from '../types';

export interface CiudadCreativa {
  id: string;
  nombre: string;
  departamento: string;
  descripcion: string;
  lat: number;
  lon: number;
  imagen: string;
  mapa_imagen?: string;
}

export const MAPA_NICARAGUA_URL =
  'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Mapa%20de%20Nicaragua%20map.jpg';

export const CIUDADES_CREATIVAS: CiudadCreativa[] = [
  {
    id: 'leon',
    nombre: 'León',
    departamento: 'León',
    descripcion: 'Ciudad de aprendizaje, poesía y aventura volcánica.',
    lat: 12.4379,
    lon: -86.878,
    imagen:
      'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Leon%20map.jpg',
    mapa_imagen:
      'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Leon%20map.jpg',
  },
  {
    id: 'granada',
    nombre: 'Granada',
    departamento: 'Granada',
    descripcion: 'Joyera colonial, isletas serenas y rica tradición gastronómica.',
    lat: 11.9344,
    lon: -85.956,
    imagen:
      'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Granada%20map.jpg',
    mapa_imagen:
      'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Granada%20map.jpg',
  },
  {
    id: 'masaya',
    nombre: 'Masaya',
    departamento: 'Masaya',
    descripcion: 'Capital del folklore nicaragüense y artesanías ancestrales.',
    lat: 11.9744,
    lon: -86.0942,
    imagen:
      'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Masaya%20map.jpg',
    mapa_imagen:
      'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Masaya%20map.jpg',
  },
  {
    id: 'matagalpa',
    nombre: 'Matagalpa',
    departamento: 'Matagalpa',
    descripcion: 'Perla del norte, rutas de café orgánico y bosques de neblina.',
    lat: 12.9256,
    lon: -85.9178,
    imagen:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    mapa_imagen:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ometepe',
    nombre: 'Ometepe',
    departamento: 'Rivas',
    descripcion: 'Oasis de paz entre dos volcanes e íconos rupestres.',
    lat: 11.4983,
    lon: -85.5786,
    imagen:
      'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Ometepe%20map.jpg',
    mapa_imagen:
      'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Ometepe%20map.jpg',
  },
  {
    id: 'esteli',
    nombre: 'Estelí',
    departamento: 'Estelí',
    descripcion: 'Murales vibrantes, cañones naturales y cultura de montaña.',
    lat: 13.0918,
    lon: -86.3538,
    imagen:
      'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Esteli%20map.jpg',
    mapa_imagen:
      'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Esteli%20map.jpg',
  },
];

export const INITIAL_HOSTS: Anfitrion[] = [
  {
    id_anfitrion: 'anf_01',
    nombre: 'Doña María Ruiz',
    correo: 'maria.ruiz@patadeperro.ni',
    telefono: '+505 8812-3456',
    bio: 'Artesana tradicional con más de 25 años moldeando cerámica barroca en San Juan de Oriente.',
    ciudad: 'Masaya',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    experiencias_count: 3,
    verificado: true,
  },
  {
    id_anfitrion: 'anf_02',
    nombre: 'Don Carlos Mendoza',
    correo: 'carlos.mendoza@patadeperro.ni',
    telefono: '+505 8765-4321',
    bio: 'Guía nativo de senderos ecológicos y observador de fauna en Reserva Diriangén.',
    ciudad: 'León',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.95,
    experiencias_count: 5,
    verificado: true,
  },
  {
    id_anfitrion: 'anf_03',
    nombre: 'Cooperativa Agua Azul',
    correo: 'contacto@aguaazul.org',
    telefono: '+505 8543-9988',
    bio: 'Pescadores artesanales promotores del ecoturismo responsable en el Gran Lago de Nicaragua.',
    ciudad: 'Ometepe',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 4.88,
    experiencias_count: 2,
    verificado: true,
  },
  {
    id_anfitrion: 'anf_04',
    nombre: 'Doña Marta Gómez',
    correo: 'marta.cocina@patadeperro.ni',
    telefono: '+505 8642-1357',
    bio: 'Cocinera tradicional y guardiana de recetas ancestrales de fogón de leña y comal de barro en Granada.',
    ciudad: 'Granada',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 4.97,
    experiencias_count: 4,
    verificado: true,
  },
];

export const INITIAL_EXPERIENCES: Experiencia[] = [
  {
    id_exp: 'exp_cocina_01',
    id_anfitrion: 'anf_04',
    anfitrion_nombre: 'Doña Marta Gómez',
    anfitrion_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    categoria: CategoriaExp.TIERRA,
    titulo: 'Historias que se Cocinan',
    descripcion: 'Aprende recetas tradicionales junto a Doña Marta y descubre los sabores que forman parte de su historia ancestral en fogón de leña.',
    precio: 26,
    moneda: 'USD',
    ubicacion_nombre: 'Cocina Tradicional El Fogón, Granada',
    ciudad_creativa: 'Granada',
    ubicacion_lat: 11.9312,
    ubicacion_lon: -85.952,
    recurso_ra_url: 'https://patadeperro.ni/ar/comal_tradicional.gltf',
    imagen_url: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Historias%20que%20se%20Cocinan.jpg',
    rating: 4.98,
    resenas_count: 46,
    duracion: '3.5 Horas',
    incluye: ['Ingredientes frescos de huerto local', 'Degustación de recetas tradicionales', 'Recetario impreso ilustrado'],
    moods: [MoodTag.GASTRONOMICO, MoodTag.CULTURAL, MoodTag.TRANQUILO],
    dificultad: 'Fácil',
  },
  {
    id_exp: 'exp_tierra_01',
    id_anfitrion: 'anf_01',
    anfitrion_nombre: 'Doña María Ruiz',
    anfitrion_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    categoria: CategoriaExp.TIERRA,
    titulo: 'Taller de Cerámica Ancestral en Barro',
    descripcion: 'Aprende a tornear, moldear y pigmentar piezas únicas con arcilla natural guiado por maestros artesanos locales de San Juan de Oriente.',
    precio: 25,
    moneda: 'USD',
    ubicacion_nombre: 'Pueblo de San Juan de Oriente',
    ciudad_creativa: 'Masaya',
    ubicacion_lat: 11.9056,
    ubicacion_lon: -86.0742,
    recurso_ra_url: 'https://patadeperro.ni/ar/ceramica_3d.gltf',
    imagen_url: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Taller%20de%20Cer%C3%A1mica%20Ancestral%20en%20Barro.jpg',
    rating: 4.95,
    resenas_count: 38,
    duracion: '3 Horas',
    incluye: ['Materiales de arcilla y pigmentos', 'Café artesanal con rosquillas', 'Pieza terminada para llevar'],
    moods: [MoodTag.CREATIVO, MoodTag.CULTURAL, MoodTag.TRANQUILO],
    dificultad: 'Fácil',
  },
  {
    id_exp: 'exp_tierra_04',
    id_anfitrion: 'anf_02',
    anfitrion_nombre: 'Don Carlos Mendoza',
    anfitrion_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    categoria: CategoriaExp.TIERRA,
    titulo: 'Sandboarding en el Volcán Cerro Negro',
    descripcion: 'Desciende a toda velocidad sobre las arenas negras del volcán más joven y activo de Centroamérica en traje especial y tabla de deslizamiento.',
    precio: 40,
    moneda: 'USD',
    ubicacion_nombre: 'Reserva Natural Cerro Negro',
    ciudad_creativa: 'León',
    ubicacion_lat: 12.506,
    ubicacion_lon: -86.702,
    recurso_ra_url: 'https://patadeperro.ni/ar/cerro_negro_3d.gltf',
    imagen_url: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Sandboarding%20en%20el%20Volc%C3%A1n%20Cerro%20Negro.jpg',
    rating: 4.98,
    resenas_count: 84,
    duracion: '5 Horas',
    incluye: ['Traje protector, gafas y tabla', 'Guía bilingüe de aventura', 'Frutas tropicales y bebidas'],
    moods: [MoodTag.AVENTURERO, MoodTag.CULTURAL],
    dificultad: 'Desafiante',
  },
  {
    id_exp: 'exp_tierra_02',
    id_anfitrion: 'anf_02',
    anfitrion_nombre: 'Don Carlos Mendoza',
    anfitrion_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    categoria: CategoriaExp.TIERRA,
    titulo: 'Senderismo Nocturno y Leyendas Volcánicas',
    descripcion: 'Camina por senderos rocosos bajo las estrellas con linternas frontales mientras escuchas historias ancestrales y aprecias el resplandor nocturno.',
    precio: 35,
    moneda: 'USD',
    ubicacion_nombre: 'Faldas del Volcán Telica',
    ciudad_creativa: 'León',
    ubicacion_lat: 12.6025,
    ubicacion_lon: -86.845,
    recurso_ra_url: 'https://patadeperro.ni/ar/sendero_mapa.gltf',
    imagen_url: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Senderismo%20Nocturno%20y%20Leyendas%20Volc%C3%A1nicas.jpg',
    rating: 4.96,
    resenas_count: 52,
    duracion: '4.5 Horas',
    incluye: ['Lámpara minera de alta potencia', 'Guía de montaña certificado', 'Bocadillos típicos y malvaviscos'],
    moods: [MoodTag.AVENTURERO, MoodTag.CULTURAL],
    dificultad: 'Moderado',
  },
  {
    id_exp: 'exp_agua_01',
    id_anfitrion: 'anf_03',
    anfitrion_nombre: 'Cooperativa Agua Azul',
    anfitrion_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    categoria: CategoriaExp.AGUA,
    titulo: 'Ruta de Kayak por Río Istiam & Pesca Tradicional',
    descripcion: 'Navega en aguas calmas flanqueadas por humedales y vista imponente al volcán, conviviendo con pescadores artesanales del istmo.',
    precio: 30,
    moneda: 'USD',
    ubicacion_nombre: 'Río Istiam, Ometepe',
    ciudad_creativa: 'Ometepe',
    ubicacion_lat: 11.4392,
    ubicacion_lon: -85.5417,
    recurso_ra_url: 'https://patadeperro.ni/ar/fauna_laguna.gltf',
    imagen_url: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Ruta%20de%20Kayak%20por%20R%C3%ADo%20Istiam%20%26%20Pesca%20Tradicional.jpg',
    rating: 4.92,
    resenas_count: 27,
    duracion: '3.5 Horas',
    incluye: ['Kayak & chaleco salvavidas', 'Agua de coco fresca', 'Demostración de red de pesca'],
    moods: [MoodTag.TRANQUILO, MoodTag.AVENTURERO],
    dificultad: 'Fácil',
  },
  {
    id_exp: 'exp_agua_02',
    id_anfitrion: 'anf_03',
    anfitrion_nombre: 'Cooperativa Agua Azul',
    anfitrion_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    categoria: CategoriaExp.AGUA,
    titulo: 'Tour en Bote por las Isletas de Granada y Fortaleza',
    descripcion: 'Explora el archipiélago de 365 isletas volcánicas formadas por el Mombacho en el Gran Lago Cocibolca y visita el histórico Fuerte San Pablo.',
    precio: 28,
    moneda: 'USD',
    ubicacion_nombre: 'Puerto Asese, Isletas de Granada',
    ciudad_creativa: 'Granada',
    ubicacion_lat: 11.9167,
    ubicacion_lon: -85.9167,
    recurso_ra_url: 'https://patadeperro.ni/ar/isletas_3d.gltf',
    imagen_url: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Tour%20en%20Bote%20por%20las%20Isletas%20de%20Granada%20y%20Fortaleza.jpg',
    rating: 4.94,
    resenas_count: 65,
    duracion: '3 Horas',
    incluye: ['Lancha con capitán local', 'Avistamiento de aves migratorias', 'Bebida de cacao helada'],
    moods: [MoodTag.CULTURAL, MoodTag.TRANQUILO],
    dificultad: 'Fácil',
  },
  {
    id_exp: 'exp_aire_01',
    id_anfitrion: 'anf_02',
    anfitrion_nombre: 'Don Carlos Mendoza',
    anfitrion_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    categoria: CategoriaExp.AIRE,
    titulo: 'Mirador del Sombrero & Descenso Cañón de Somoto',
    descripcion: 'Sube al mirador panorámico con vista impresionante de 360 grados al cañón y disfruta de saltos, flotación y nado en sus aguas cristalinas entre paredes milenarias.',
    precio: 25,
    moneda: 'USD',
    ubicacion_nombre: 'Monumento Nacional Cañón de Somoto',
    ciudad_creativa: 'Estelí',
    ubicacion_lat: 13.4385,
    ubicacion_lon: -86.581,
    recurso_ra_url: 'https://patadeperro.ni/ar/mirador_360.gltf',
    imagen_url: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Mirador%20del%20Sombrero%20%26%20Descenso%20Ca%C3%B1%C3%B3n%20de%20Somoto.jpg',
    rating: 4.97,
    resenas_count: 41,
    duracion: '4 Horas',
    incluye: ['Chaleco salvavidas y neumático', 'Guía local certificado del cañón', 'Rosquillas somoteñas y café'],
    moods: [MoodTag.TRANQUILO, MoodTag.AVENTURERO],
    dificultad: 'Moderado',
  },
  {
    id_exp: 'exp_tierra_03',
    id_anfitrion: 'anf_01',
    anfitrion_nombre: 'Doña María Ruiz',
    anfitrion_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    categoria: CategoriaExp.TIERRA,
    titulo: 'Ruta del Cacao Orgánico y Tarta Tradicional',
    descripcion: 'Descubre el proceso artesanal del grano a la taza de cacao sagrado con jícaras tradicionales, moliendo con piedra ancestral y catando chocolates puros.',
    precio: 22,
    moneda: 'USD',
    ubicacion_nombre: 'Finca Ecoturística Selva Negra',
    ciudad_creativa: 'Matagalpa',
    ubicacion_lat: 12.9833,
    ubicacion_lon: -85.9167,
    recurso_ra_url: 'https://patadeperro.ni/ar/planta_cacao.gltf',
    imagen_url: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Ruta%20del%20Cacao%20Org%C3%A1nico%20y%20Tarta%20Tradicional.jpg',
    rating: 4.89,
    resenas_count: 19,
    duracion: '2 Horas',
    incluye: ['Cata de 5 variedades de chocolate', 'Degustación en jícara ancestral', 'Semillas orgánicas para plantar'],
    moods: [MoodTag.GASTRONOMICO, MoodTag.CULTURAL],
    dificultad: 'Fácil',
  },
];

export const INITIAL_USER: Turista | null = null;

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id_usuario: 'demo-turista-evaluador',
    nombre: 'Evaluador Turista',
    correo: 'turista@patadeperro.ni',
    password: 'Turista2026!',
    role: UserRole.TURISTA,
    isDev: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    telefono: '+505 8888 1234',
    pais: 'Nicaragua',
    departamento: 'León',
    ciudad: 'León',
    bio: 'Cuenta de evaluación para jurado y evaluadores con perfil de viajero.',
    savedExperienceIds: ['exp_tierra_01', 'exp_agua_01'],
    reservas: [],
    fechaRegistro: '2026-01-15',
    ultimoAcceso: new Date().toISOString(),
  },
  {
    id_usuario: 'demo-anfitrion-evaluador',
    nombre: 'Anfitrión Comunitario',
    correo: 'anfitrion@patadeperro.ni',
    password: 'Anfitrion2026!',
    role: UserRole.ANFITRION,
    isDev: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    telefono: '+505 8765 4321',
    pais: 'Nicaragua',
    departamento: 'Granada',
    ciudad: 'Granada',
    bio: 'Cuenta demo para evaluación de publicación de experiencias y gestión de reservas.',
    savedExperienceIds: [],
    reservas: [],
    fechaRegistro: '2026-01-10',
    ultimoAcceso: new Date().toISOString(),
  },
  {
    id_usuario: 'demo-admin-evaluador',
    nombre: 'Comité Evaluador / Auditor',
    correo: 'admin@patadeperro.ni',
    password: 'Admin2026!',
    role: UserRole.DESARROLLADOR,
    isDev: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    telefono: '+505 8999 0000',
    pais: 'Nicaragua',
    departamento: 'Managua',
    ciudad: 'Managua',
    bio: 'Cuenta de auditoría técnica con acceso a herramientas de desarrollo, SQL y pruebas unitarias.',
    savedExperienceIds: ['exp_tierra_01', 'exp_tierra_02', 'exp_agua_01'],
    reservas: [],
    fechaRegistro: '2026-01-01',
    ultimoAcceso: new Date().toISOString(),
  },
];

export const INITIAL_RESERVATIONS: Reserva[] = [];

export const INITIAL_CHAT_THREADS: any[] = [];


export const TECHNICAL_DOCS = {
  erDiagram: {
    description: 'Diagrama Entidad-Relación Normalizado a Tercera Forma Normal (3NF) para el núcleo de datos de Pata de Perro.',
    tables: [
      {
        name: 'Turista (1NF / 2NF / 3NF)',
        pk: 'id_turista (VARCHAR 36)',
        fields: [
          { name: 'id_turista', type: 'VARCHAR(36)', key: 'PK', desc: 'Identificador único del viajero' },
          { name: 'nombre', type: 'VARCHAR(100)', key: '-', desc: 'Nombre completo' },
          { name: 'correo', type: 'VARCHAR(150)', key: 'UNIQUE', desc: 'Correo electrónico institucional / personal' },
          { name: 'telefono', type: 'VARCHAR(20)', key: '-', desc: 'Teléfono celular para confirmaciones' },
          { name: 'fecha_registro', type: 'TIMESTAMP', key: '-', desc: 'Fecha de alta en plataforma' },
        ],
      },
      {
        name: 'Anfitrion (1NF / 2NF / 3NF)',
        pk: 'id_anfitrion (VARCHAR 36)',
        fields: [
          { name: 'id_anfitrion', type: 'VARCHAR(36)', key: 'PK', desc: 'Identificador único del emprendedor local' },
          { name: 'nombre', type: 'VARCHAR(100)', key: '-', desc: 'Nombre o razón social' },
          { name: 'correo', type: 'VARCHAR(150)', key: 'UNIQUE', desc: 'Contacto principal' },
          { name: 'telefono', type: 'VARCHAR(20)', key: '-', desc: 'WhatsApp directo para gestión' },
          { name: 'ciudad_creativa', type: 'VARCHAR(50)', key: 'FK', desc: 'Ciudad creativa base' },
          { name: 'verificado', type: 'BOOLEAN', key: '-', desc: 'Estado de validación comunitaria' },
        ],
      },
      {
        name: 'Experiencia (1NF / 2NF / 3NF)',
        pk: 'id_exp (VARCHAR 36)',
        fields: [
          { name: 'id_exp', type: 'VARCHAR(36)', key: 'PK', desc: 'ID de la actividad turística' },
          { name: 'id_anfitrion', type: 'VARCHAR(36)', key: 'FK', desc: 'Relación 1:N con Anfitrión' },
          { name: 'categoria', type: 'VARCHAR(20)', key: '-', desc: 'Tierra | Agua | Aire' },
          { name: 'titulo', type: 'VARCHAR(150)', key: '-', desc: 'Título público' },
          { name: 'descripcion', type: 'TEXT', key: '-', desc: 'Detalle de la experiencia' },
          { name: 'precio', type: 'DECIMAL(10,2)', key: '-', desc: 'Costo unitario en USD' },
          { name: 'ubicacion_lat', type: 'DECIMAL(10,8)', key: '-', desc: 'Latitud en coordenadas GPS WGS84' },
          { name: 'ubicacion_lon', type: 'DECIMAL(11,8)', key: '-', desc: 'Longitud en coordenadas GPS WGS84' },
          { name: 'recurso_ra_url', type: 'VARCHAR(255)', key: '-', desc: 'URL del modelo 3D GLTF para vista RA' },
        ],
      },
      {
        name: 'Reserva (1NF / 2NF / 3NF)',
        pk: 'id_reserva (VARCHAR 36)',
        fields: [
          { name: 'id_reserva', type: 'VARCHAR(36)', key: 'PK', desc: 'ID transaccional de la reserva' },
          { name: 'id_turista', type: 'VARCHAR(36)', key: 'FK', desc: 'Turista que solicita' },
          { name: 'id_exp', type: 'VARCHAR(36)', key: 'FK', desc: 'Experiencia reservada' },
          { name: 'fecha_reserva', type: 'DATE', key: '-', desc: 'Fecha agendada para la actividad' },
          { name: 'personas', type: 'INT', key: '-', desc: 'Número de acompañantes' },
          { name: 'monto_total', type: 'DECIMAL(10,2)', key: '-', desc: 'Total procesado' },
          { name: 'estado_reserva', type: 'VARCHAR(20)', key: '-', desc: 'Pendiente | Confirmada | Cancelada' },
          { name: 'codigo_confirmacion', type: 'VARCHAR(20)', key: 'UNIQUE', desc: 'Hash / Token verificador' },
        ],
      },
    ],
  },
  activityDiagram: {
    description: 'Flujo de Actividades del Sistema Pata de Perro (Desde Descubrimiento hasta Reserva & RA).',
    steps: [
      { step: 1, title: 'Inicio / Onboarding', actor: 'Turista', action: 'Navega diapositivas de bienvenida y acepta el compromiso de turismo responsable.' },
      { step: 2, title: 'Autenticación', actor: 'Turista / Anfitrión', action: 'Inicia sesión con correo o proveedor social (Google / Apple / Facebook).' },
      { step: 3, title: 'Exploración por Categoría o Mapa', actor: 'Turista', action: 'Filtra experiencias por "Tierra", "Agua", "Aire" o selecciona estado de ánimo ("Hoy me siento...").' },
      { step: 4, title: 'Visualización RA', actor: 'Turista', action: 'Activa la cámara con simulación RA para previsualizar POIs y orientación geográfica.' },
      { step: 5, title: 'Generación de Reserva', actor: 'Turista', action: 'Selecciona fecha y número de personas. El sistema calcula monto y emite código de confirmación.' },
      { step: 6, title: 'Notificación al Anfitrión', actor: 'Anfitrión', action: 'Recibe la solicitud en su agenda y confirma la recepción vía enlace directo a WhatsApp.' },
      { step: 7, title: 'Calificación y Reseña', actor: 'Turista', action: 'Posterior a la experiencia, evalúa con puntuación de 1 a 5 estrellas.' },
    ],
  },
  faq: [
    {
      q: '¿Cómo garantizo la portabilidad del código entre diferentes estaciones de trabajo con GitHub?',
      a: 'El repositorio incluye un archivo .gitignore estandarizado, scripts de npm limpios y configuración de Dockerfile. Solo requiere clonar el repo (git clone), ejecutar `npm install` o `docker-compose up` y el proyecto estará listo para desarrollo en VS Code o Visual Studio Studio.'
    },
    {
      q: '¿Es compatible con Visual Studio / VS Code en Windows, Linux y macOS?',
      a: 'Sí. Todo el código utiliza TypeScript estándar y Vite. En Visual Studio o VS Code puedes abrir la carpeta raíz directamente. Se incluyen configuraciones predeterminadas para tareas de compilación e IntelliSense.'
    },
    {
      q: '¿Cómo se ejecuta el despliegue automático en la nube?',
      a: 'El proyecto cuenta con el flujo `.github/workflows/ci-cd.yml` que ejecuta linters, compilación y empaquetado Docker en cada commit a la rama principal. Puede conectarse directamente a Cloud Run, Render o Vercel.'
    },
    {
      q: '¿Qué mecanismos de seguridad se implementan para evitar corrupción de código y vulnerabilidades?',
      a: 'Se aplica desinfección estricta contra ataques XSS, validaciones de coordenadas y montos positivos, inicialización diferida de claves de API y un sistema de Copia de Seguridad JSON con validación de integridad.'
    },
    {
      q: '¿Dónde se encuentran las pruebas unitarias y cómo las ejecuto?',
      a: 'Las pruebas unitarias están definidas en `src/__tests__/unitTests.ts`. Puedes ejecutarlas visualmente a través del "Panel de Pruebas Unitarias" integrado en la aplicación o mediante el comando `npm test` / `npm run lint` en terminal.'
    }
  ]
};
