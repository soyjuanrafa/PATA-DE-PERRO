/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Image URL Resolution, Brand Logos & Curated Fallbacks
 */

import React from 'react';
import masksBgAsset from '../assets/images/nicaragua_artisan_masks_1788467295657.jpg';

// Authentic Artisan Masks Background matching PANTALLAS-page-00004/00005/00006
export const ARTISAN_MASKS_BG = masksBgAsset;

// Official Brand Logos
export const BRAND_LOGOS = {
  white: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/logo%20pata%20de%20perro%20blanco.jpeg',
  color: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/logo%20pata%20de%20perro%20a%20color%20y%20letras.jpeg',
  colorAlt: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/logo%20pata%20de%20perro%20a%20color%20y%20letras%20otro%20estilo.jpeg',
  symbol: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/logo%20de%20pata%20de%20perro.jpeg',
  black: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/logo%20pata%20de%20perro%20negro.jpeg',
  blackAndWhite: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/logo%20de%20pata%20de%20perro%20blanco%20y%20negro.jpeg',
  impresiones: 'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/logo%20pata%20de%20perro%20impresiones.jpeg',
};

// Pantallas de inicio options (8 authentic options to rotate randomly on entry)
export const PANTALLAS_INICIO_URLS: string[] = [
  'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Pantallas%20de%20inicio%20opcion%201.jpg',
  'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Pantallas%20de%20inicio%20opcion%202.jpg',
  'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Pantallas%20de%20inicio%20opcion%203.jpg',
  'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Pantallas%20de%20inicio%20opcion%204.jpg',
  'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Pantallas%20de%20inicio%20opcion%205.jpg',
  'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Pantallas%20de%20inicio%20opcion%206.jpg',
  'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Pantallas%20de%20inicio%20opcion%207.jpg',
  'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Pantallas%20de%20inicio%20opcion%208.jpg',
];

/**
 * Returns a randomized order of the 8 start screens each time user visits
 */
export function getShuffledPantallasInicio(): string[] {
  return [...PANTALLAS_INICIO_URLS].sort(() => Math.random() - 0.5);
}

/**
 * Gets a random single start screen
 */
export function getRandomPantallaInicio(): string {
  const index = Math.floor(Math.random() * PANTALLAS_INICIO_URLS.length);
  return PANTALLAS_INICIO_URLS[index];
}

// Mapping of uploaded asset filenames and experience titles to authentic images
export const IMAGE_FALLBACK_MAP: Record<string, string> = {
  // Filename hash fallbacks -> Raw GitHub URLs
  '341fa7530e46bdee603f28736b625f9e.jpg':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Taller%20de%20Cer%C3%A1mica%20Ancestral%20en%20Barro.jpg',
  'fadeb6cdbd7a54476669b3cf00153229.jpg':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Sandboarding%20en%20el%20Volc%C3%A1n%20Cerro%20Negro.jpg',
  '95a84bf6b6e9fc1d9e997116be632aee.jpg':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Senderismo%20Nocturno%20y%20Leyendas%20Volc%C3%A1nicas.jpg',
  'ad98149312ef68933798fcdc8f8109c9.jpg':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Ruta%20de%20Kayak%20por%20R%C3%ADo%20Istiam%20%26%20Pesca%20Tradicional.jpg',
  '54c4c86928fa84290a11e36ee4572f92.jpg':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Tour%20en%20Bote%20por%20las%20Isletas%20de%20Granada%20y%20Fortaleza.jpg',
  'aa7d1375bf513a7f7987c3f661c41126.jpg':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Mirador%20del%20Sombrero%20%26%20Descenso%20Ca%C3%B1%C3%B3n%20de%20Somoto.jpg',
  'b7893a5bec8af14fdeb13ad0341c5bfe.jpg':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Ruta%20del%20Cacao%20Org%C3%A1nico%20y%20Tarta%20Tradicional.jpg',

  // Experience title mappings
  'Historias que se Cocinan':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Historias%20que%20se%20Cocinan.jpg',
  'Taller de Cerámica Ancestral en Barro':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Taller%20de%20Cer%C3%A1mica%20Ancestral%20en%20Barro.jpg',
  'Sandboarding en el Volcán Cerro Negro':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Sandboarding%20en%20el%20Volc%C3%A1n%20Cerro%20Negro.jpg',
  'Senderismo Nocturno y Leyendas Volcánicas':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Senderismo%20Nocturno%20y%20Leyendas%20Volc%C3%A1nicas.jpg',
  'Ruta de Kayak por Río Istiam & Pesca Tradicional':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Ruta%20de%20Kayak%20por%20R%C3%ADo%20Istiam%20%26%20Pesca%20Tradicional.jpg',
  'Tour en Bote por las Isletas de Granada y Fortaleza':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Tour%20en%20Bote%20por%20las%20Isletas%20de%20Granada%20y%20Fortaleza.jpg',
  'Mirador del Sombrero & Descenso Cañón de Somoto':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Mirador%20del%20Sombrero%20%26%20Descenso%20Ca%C3%B1%C3%B3n%20de%20Somoto.jpg',
  'Ruta del Cacao Orgánico y Tarta Tradicional':
    'https://raw.githubusercontent.com/soyjuanrafa/imagenes-y-iconos-de-aplicaciones/main/Ruta%20del%20Cacao%20Org%C3%A1nico%20y%20Tarta%20Tradicional.jpg',
};

/**
 * Resolves an image URL or returns its fallback if local or unmapped
 */
export function resolveImageUrl(url: string | undefined): string {
  if (!url) {
    return PANTALLAS_INICIO_URLS[0];
  }
  // Base64 data URLs from user gallery upload
  if (url.startsWith('data:image/')) {
    return url;
  }
  // If exact filename is in fallback map
  if (IMAGE_FALLBACK_MAP[url]) {
    return IMAGE_FALLBACK_MAP[url];
  }
  return url;
}

/**
 * Handle image error and set to fallback
 */
export function handleImageFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  originalUrl?: string
) {
  const target = event.currentTarget;
  if (originalUrl && IMAGE_FALLBACK_MAP[originalUrl]) {
    if (target.src !== IMAGE_FALLBACK_MAP[originalUrl]) {
      target.src = IMAGE_FALLBACK_MAP[originalUrl];
      return;
    }
  }
  target.src = PANTALLAS_INICIO_URLS[0];
}
