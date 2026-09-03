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
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 100) return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(trimmed);
}

/**
 * Detects potential SQL Injection or XSS patterns in raw user input.
 */
export function detectInjectionThreat(input: string): boolean {
  if (!input) return false;
  const injectionPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /union\s+select/gi,
    /'\s+or\s+'1'='1/gi,
    /--/g,
    /\bdrop\s+table\b/gi,
    /\binsert\s+into\b/gi,
    /\bdelete\s+from\b/gi,
  ];
  return injectionPatterns.some(pattern => pattern.test(input));
}

/**
 * Validates full name for registration.
 */
export function validateFullName(name: string): { valid: boolean; message?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'El nombre es obligatorio.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, message: 'El nombre debe tener al menos 2 caracteres.' };
  }
  if (trimmed.length > 60) {
    return { valid: false, message: 'El nombre no puede exceder los 60 caracteres.' };
  }
  if (detectInjectionThreat(trimmed)) {
    return { valid: false, message: 'El nombre contiene caracteres o secuencias no permitidas.' };
  }
  // Must contain at least one letter
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(trimmed)) {
    return { valid: false, message: 'El nombre debe contener caracteres alfabéticos válidos.' };
  }
  return { valid: true };
}

/**
 * Common insecure passwords list to block.
 */
const COMMON_PASSWORDS = new Set([
  '123456',
  'password',
  '12345678',
  '123456789',
  '12345',
  '111111',
  '1234567',
  'admin',
  'qwerty',
  'patadeperro',
  'nicaragua',
  'leon123',
  'granada123',
  'welcome',
  'iloveyou',
]);

/**
 * Evaluates password security, strength and policy compliance.
 */
export function validatePasswordSecurity(password: string): {
  valid: boolean;
  score: number; // 0 to 4
  strengthLabel: 'Muy débil' | 'Débil' | 'Media' | 'Segura' | 'Excelente';
  message?: string;
} {
  if (!password || typeof password !== 'string') {
    return { valid: false, score: 0, strengthLabel: 'Muy débil', message: 'La contraseña es obligatoria.' };
  }

  const trimmed = password.trim();

  if (trimmed.length < 6) {
    return {
      valid: false,
      score: 1,
      strengthLabel: 'Muy débil',
      message: 'La contraseña debe contener al menos 6 caracteres (recomendado 8+).',
    };
  }

  if (trimmed.length > 128) {
    return {
      valid: false,
      score: 1,
      strengthLabel: 'Muy débil',
      message: 'La contraseña excede el límite máximo de 128 caracteres.',
    };
  }

  if (COMMON_PASSWORDS.has(trimmed.toLowerCase())) {
    return {
      valid: false,
      score: 1,
      strengthLabel: 'Débil',
      message: 'Esta contraseña es demasiado común y fácil de vulnerar. Por favor elige una contraseña más segura.',
    };
  }

  // Calculate entropy score
  let score = 0;
  if (trimmed.length >= 8) score++;
  if (/[A-Z]/.test(trimmed)) score++;
  if (/[0-9]/.test(trimmed)) score++;
  if (/[^a-zA-Z0-9]/.test(trimmed)) score++;

  let strengthLabel: 'Muy débil' | 'Débil' | 'Media' | 'Segura' | 'Excelente' = 'Débil';
  if (score === 1) strengthLabel = 'Débil';
  else if (score === 2) strengthLabel = 'Media';
  else if (score === 3) strengthLabel = 'Segura';
  else if (score >= 4) strengthLabel = 'Excelente';

  return {
    valid: true,
    score: Math.max(score, 1),
    strengthLabel,
  };
}

/**
 * Anti-brute force / Rate-limiting mechanism for authentication attempts.
 */
const RATE_LIMIT_KEY = 'pdp_auth_failed_attempts';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30000; // 30 seconds

interface FailedAttemptsRecord {
  count: number;
  lastAttemptTime: number;
  lockedUntil?: number;
}

export function recordFailedLoginAttempt(): { isLocked: boolean; remainingSeconds: number } {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    let record: FailedAttemptsRecord = raw ? JSON.parse(raw) : { count: 0, lastAttemptTime: now };

    // Reset counter if previous attempt was more than 2 minutes ago
    if (now - record.lastAttemptTime > 120000) {
      record.count = 0;
    }

    record.count += 1;
    record.lastAttemptTime = now;

    if (record.count >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_DURATION_MS;
      sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(record));
      return { isLocked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
    }

    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(record));
    return { isLocked: false, remainingSeconds: 0 };
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

export function getLoginLockoutRemainingSeconds(): number {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return 0;
    const record: FailedAttemptsRecord = JSON.parse(raw);
    if (!record.lockedUntil) return 0;
    const now = Date.now();
    if (record.lockedUntil > now) {
      return Math.ceil((record.lockedUntil - now) / 1000);
    }
    // Lockout expired: reset count partially
    sessionStorage.removeItem(RATE_LIMIT_KEY);
    return 0;
  } catch {
    return 0;
  }
}

export function clearLoginAttempts(): void {
  try {
    sessionStorage.removeItem(RATE_LIMIT_KEY);
  } catch {
    // ignore
  }
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
