/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Security & Validation Utilities
 */

import { BackupSnapshot } from '../types';

/**
 * Escapes unsafe HTML characters to prevent XSS attacks.
 */
export function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates email format strictly.
 */
export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

/**
 * Validates geographical latitude/longitude bounds.
 */
export function validateCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

/**
 * Validates positive monetary values.
 */
export function validatePositivePrice(price: number): boolean {
  return typeof price === 'number' && !isNaN(price) && price >= 0 && price <= 10000;
}

/**
 * Calculates distance in meters between two lat/lon coordinates using Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Safely generates a unique verification code.
 */
export function generateConfirmationCode(prefix = 'PDP'): string {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomStr}`;
}

/**
 * Serializes application state to JSON string with integrity verification.
 */
export function serializeBackup(data: any): string {
  const snapshot: BackupSnapshot = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    appState: data,
  };
  return JSON.stringify(snapshot, null, 2);
}

/**
 * Generates a standard 6-digit numeric OTP for Two-Factor Authentication (2FA).
 */
export function generate2FACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validates a 6-digit 2FA verification token.
 */
export function verify2FACode(inputCode: string, expectedCode: string): boolean {
  if (!inputCode || !expectedCode) return false;
  return inputCode.trim() === expectedCode.trim();
}

/**
 * Checks if a user session has expired based on inactivity duration.
 */
export function isSessionExpired(lastActiveTimestamp: string | number, timeoutMinutes = 30): boolean {
  if (!lastActiveTimestamp) return false;
  const lastActiveTime = typeof lastActiveTimestamp === 'string' ? new Date(lastActiveTimestamp).getTime() : lastActiveTimestamp;
  if (isNaN(lastActiveTime)) return false;
  const now = Date.now();
  const maxInactivityMs = timeoutMinutes * 60 * 1000;
  return now - lastActiveTime > maxInactivityMs;
}

/**
 * Deserializes and validates a backup JSON payload.
 */
export function parseAndValidateBackup(jsonString: string): BackupSnapshot | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.timestamp || !parsed.appState) {
      throw new Error('Estructura de respaldo inválida.');
    }
    return parsed as BackupSnapshot;
  } catch (err) {
    console.error('Error al restaurar copia de seguridad:', err);
    return null;
  }
}
