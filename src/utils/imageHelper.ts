/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - Image URL Resolution & Curated Fallbacks
 */

import React from 'react';

// Mapping of uploaded asset filenames to high-quality curated fallbacks
export const IMAGE_FALLBACK_MAP: Record<string, string> = {
  '341fa7530e46bdee603f28736b625f9e.jpg':
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
  'fadeb6cdbd7a54476669b3cf00153229.jpg':
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
  '95a84bf6b6e9fc1d9e997116be632aee.jpg':
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  'ad98149312ef68933798fcdc8f8109c9.jpg':
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  '54c4c86928fa84290a11e36ee4572f92.jpg':
    'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80',
  'aa7d1375bf513a7f7987c3f661c41126.jpg':
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'b7893a5bec8af14fdeb13ad0341c5bfe.jpg':
    'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80',
};

/**
 * Resolves an image URL or returns its fallback if broken or local
 */
export function resolveImageUrl(url: string | undefined): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
  }
  // Base64 data URLs from user gallery upload
  if (url.startsWith('data:image/')) {
    return url;
  }
  // If exact filename is in fallback map
  if (IMAGE_FALLBACK_MAP[url]) {
    return url;
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
  // Generic fallback if not matched
  target.src =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
}
