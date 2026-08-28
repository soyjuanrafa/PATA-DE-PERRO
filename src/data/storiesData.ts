/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Experience Stories Mock Dataset & Generator
 */

import { ExperienceStory } from '../types';

export const INITIAL_EXPERIENCE_STORIES: Record<string, ExperienceStory[]> = {
  // Experience 1: Historias que se Cocinan (Doña Marta)
  exp_cocina_01: [
    {
      id: 'story_cocina_01',
      experienceId: 'exp_cocina_01',
      order: 1,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1080&q=80',
      title: 'Historias que se Cocinan',
      description: 'Aprende recetas tradicionales junto a Doña Marta y descubre los sabores que forman parte de su historia ancestral.',
      culturalElement: 'Comal de barro curado y leña de café',
      quoteAuthor: 'Doña Marta',
      quote: 'El secreto del sabor no está solo en los ingredientes, sino en el amor y la paciencia con que se atiza el fuego.',
      duration: 6,
      language: 'es',
    },
    {
      id: 'story_cocina_02',
      experienceId: 'exp_cocina_01',
      order: 2,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1080&q=80',
      title: 'Molienda en Piedra y Tortillas Palmadas',
      description: 'Siente el maíz nixtamalizado fresco molido en metate de piedra volcánica antes de palmar las tortillas sobre hoja de plátano.',
      culturalElement: 'Técnica prehispánica del nixtamal',
      quoteAuthor: 'Doña Marta',
      quote: 'Cada palmada de tortilla lleva el ritmo de nuestras bisabuelas.',
      duration: 6,
      language: 'es',
    },
    {
      id: 'story_cocina_03',
      experienceId: 'exp_cocina_01',
      order: 3,
      type: 'video',
      mediaUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1080&q=80',
      title: 'El Banquete Comunitario al Atardecer',
      description: 'Degustamos nacatamales, indio viejo y chicha bruja en jícara mientras compartimos risas al calor del fogón.',
      culturalElement: 'Comensalidad comunitaria',
      quoteAuthor: 'Doña Marta',
      quote: '¡Buen provecho, viajeros de pata de perro! Bienvenidos a mi hogar.',
      duration: 6,
      language: 'es',
    },
  ],

  // Experience 2: Taller de Cerámica Ancestral en Barro (Doña María Ruiz)
  exp_tierra_01: [
    {
      id: 'story_tierra_01_1',
      experienceId: 'exp_tierra_01',
      order: 1,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1080&q=80',
      title: 'Manos que Moldean Tradición',
      description: 'En San Juan de Oriente, el barro cobra vida con las mismas técnicas precolombinas que usaban nuestros antepasados.',
      culturalElement: 'Barro rojo y torno de pie artesanal',
      quoteAuthor: 'Doña María Ruiz',
      quote: 'El barro te enseña humildad: si vas muy rápido se quiebra, si vas con calma florece.',
      duration: 6,
      language: 'es',
    },
    {
      id: 'story_tierra_01_2',
      experienceId: 'exp_tierra_01',
      order: 2,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1080&q=80',
      title: 'Pigmentos Minerales y Esgrafiado Fino',
      description: 'Decoramos cada jarrón con óxidos naturales y plumas de pavo real para trazar motivos de la fauna nicaragüense.',
      culturalElement: 'Bruñido con piedras de río pulidas',
      quoteAuthor: 'Doña María Ruiz',
      quote: 'Los colores vienen directamente de las faldas de la laguna.',
      duration: 6,
      language: 'es',
    },
    {
      id: 'story_tierra_01_3',
      experienceId: 'exp_tierra_01',
      order: 3,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1531875456634-3f5418280d20?auto=format&fit=crop&w=1080&q=80',
      title: 'Tu Propia Obra de Arte Horneada',
      description: 'Termina tu pieza en el horno de leña tradicional y llévate a casa un pedacito del alma de Masaya.',
      culturalElement: 'Horneado a 900°C con cáscara de arroz',
      quoteAuthor: 'Doña María Ruiz',
      quote: 'Cuando una pieza sale del horno, es como un nacimiento en la familia.',
      duration: 6,
      language: 'es',
    },
  ],

  // Experience 3: Sandboarding en Volcán Cerro Negro (Don Carlos Mendoza)
  exp_tierra_04: [
    {
      id: 'story_tierra_04_1',
      experienceId: 'exp_tierra_04',
      order: 1,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1516655855035-d5215bcb5604?auto=format&fit=crop&w=1080&q=80',
      title: 'Ascenso al Cráter Activo',
      description: 'Caminamos por la cresta del volcán más joven de Centroamérica sintiendo el calor geotérmico y el viento leonés.',
      culturalElement: 'Volcanología viva en la cordillera de los Maribios',
      quoteAuthor: 'Don Carlos Mendoza',
      quote: 'Aquí la tierra respira. Sentir la fuerza del volcán te cambia la perspectiva de la vida.',
      duration: 6,
      language: 'es',
    },
    {
      id: 'story_tierra_04_2',
      experienceId: 'exp_tierra_04',
      order: 2,
      type: 'video',
      mediaUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1080&q=80',
      title: '¡Deslízate a 80 km/h sobre Ceniza Negra!',
      description: 'Ajustamos el traje naranja, nos sentamos en la tabla de madera y nos lanzamos pendiente abajo con pura adrenalina.',
      culturalElement: 'Aventura volcánica única en el mundo',
      quoteAuthor: 'Don Carlos Mendoza',
      quote: '¡No frenes con miedo, inclínate hacia atrás y disfruta el vuelo!',
      duration: 6,
      language: 'es',
    },
  ],

  // Experience 4: Kayak en Río Istiam (Cooperativa Agua Azul)
  exp_agua_01: [
    {
      id: 'story_agua_01_1',
      experienceId: 'exp_agua_01',
      order: 1,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1080&q=80',
      title: 'Navegando entre dos Volcanes',
      description: 'El Río Istiam es el corazón verde de la Isla de Ometepe, un santuario donde conviven monos congo y garzas reales.',
      culturalElement: 'Cosmovisión Náhuatl del Cocibolca',
      quoteAuthor: 'Cooperativa Agua Azul',
      quote: 'El agua del lago nos da vida, alimento y paz.',
      duration: 6,
      language: 'es',
    },
    {
      id: 'story_agua_01_2',
      experienceId: 'exp_agua_01',
      order: 2,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80',
      title: 'Pesca Sostenible con Red Tradicional',
      description: 'Aprende a tirar la atarraya al amanecer mientras el sol despunta sobre las laderas del Volcán Concepción.',
      culturalElement: 'Oficio de pescador artesanal',
      quoteAuthor: 'Cooperativa Agua Azul',
      quote: 'Cuidamos cada especie para que nuestros hijos también puedan pescar.',
      duration: 6,
      language: 'es',
    },
  ],

  // Experience 5: Cañón de Somoto (Don Carlos Mendoza)
  exp_aire_01: [
    {
      id: 'story_aire_01_1',
      experienceId: 'exp_aire_01',
      order: 1,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1080&q=80',
      title: 'El Cañón Milenario de Somoto',
      description: 'Paredes verticales de roca de más de 150 metros de altura esculpidas durante millones de años por el Río Coco.',
      culturalElement: 'Monumento Nacional Geológico',
      quoteAuthor: 'Don Carlos Mendoza',
      quote: 'Nadar entre estas paredes de piedra te hace sentir la inmensidad de la naturaleza.',
      duration: 6,
      language: 'es',
    },
    {
      id: 'story_aire_01_2',
      experienceId: 'exp_aire_01',
      order: 2,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1080&q=80',
      title: 'Saltos a Pozas y Rosquillas Calientes',
      description: 'Flotamos en neumáticos seguros y cerramos la expedición compartiendo café de palo y rosquillas crujientes.',
      culturalElement: 'Gastronomía norteña tradicional',
      quoteAuthor: 'Don Carlos Mendoza',
      quote: '¡No hay mejor recompensa tras nadar el cañón que el calor de la gente de Somoto!',
      duration: 6,
      language: 'es',
    },
  ],
};

/**
 * Helper to get or generate stories for any given experience ID.
 */
export function getStoriesForExperience(
  expId: string,
  expTitle?: string,
  expHost?: string,
  expImage?: string
): ExperienceStory[] {
  if (INITIAL_EXPERIENCE_STORIES[expId] && INITIAL_EXPERIENCE_STORIES[expId].length > 0) {
    return INITIAL_EXPERIENCE_STORIES[expId];
  }

  // Fallback dynamic generator so EVERY existing or newly added experience has stories!
  const title = expTitle || 'Experiencia Auténtica';
  const host = expHost || 'Anfitrión Local';
  const img = expImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1080&q=80';

  return [
    {
      id: `story_${expId}_1`,
      experienceId: expId,
      order: 1,
      type: 'image',
      mediaUrl: img,
      title: title,
      description: `Conoce la magia de esta aventura comunitaria guiada por ${host} en el corazón de Nicaragua.`,
      culturalElement: 'Tradición y cultura local viva',
      quoteAuthor: host,
      quote: 'Cada rincón de nuestra tierra guarda un tesoro para quien viaja con respeto y curiosidad.',
      duration: 6,
      language: 'es',
    },
    {
      id: `story_${expId}_2`,
      experienceId: expId,
      order: 2,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1080&q=80',
      title: 'El Sendero Comunitario',
      description: 'Explora técnicas locales, comparte momentos inolvidables y apoya la economía de las familias anfitrionas.',
      culturalElement: 'Ecoturismo regenerativo',
      quoteAuthor: host,
      quote: 'Juntos construimos un turismo que cuida nuestras raíces y protege nuestros paisajes.',
      duration: 6,
      language: 'es',
    },
    {
      id: `story_${expId}_3`,
      experienceId: expId,
      order: 3,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1080&q=80',
      title: 'Momentos que Inspiran',
      description: 'Vive la calidez de nuestra gente y llévate historias que recordarás toda la vida.',
      culturalElement: 'Hospitalidad nicaragüense',
      quoteAuthor: host,
      quote: '¡Gracias por caminar con nosotros con alma de pata de perro!',
      duration: 6,
      language: 'es',
    },
  ];
}
