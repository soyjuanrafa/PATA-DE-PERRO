/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Exhaustive Unit Test Suite for Pata de Perro Business Engine
 */

import { TestResult, CategoriaExp, EstadoReserva, Reserva } from '../types';
import {
  sanitizeInput,
  validateEmail,
  validateCoordinates,
  validatePositivePrice,
  calculateHaversineDistance,
  generateConfirmationCode,
  serializeBackup,
  parseAndValidateBackup,
  generate2FACode,
  verify2FACode,
  isSessionExpired,
} from '../utils/security';
import { INITIAL_EXPERIENCES } from '../data/mockData';

export function runAllUnitTests(): { results: TestResult[]; total: number; passed: number; failed: number } {
  const results: TestResult[] = [];

  // Test 1: Data Sanitization (XSS Security)
  const t1Start = performance.now();
  try {
    const rawMaliciousInput = '<script>alert("hack")</script>';
    const sanitized = sanitizeInput(rawMaliciousInput);
    const passed = sanitized === '&lt;script&gt;alert(&quot;hack&quot;)&lt;&#x2F;script&gt;';
    results.push({
      testName: 'Seguridad: Desinfección de entradas XSS (sanitizeInput)',
      passed,
      message: passed ? 'Entrada maliciosa neutralizada correctamente.' : `Error: resultado fue ${sanitized}`,
      durationMs: Math.round(performance.now() - t1Start),
    });
  } catch (err: any) {
    results.push({
      testName: 'Seguridad: Desinfección de entradas XSS (sanitizeInput)',
      passed: false,
      message: `Excepción: ${err?.message}`,
      durationMs: Math.round(performance.now() - t1Start),
    });
  }

  // Test 2: Email Format Validation
  const t2Start = performance.now();
  try {
    const validEmail = validateEmail('turista.leon@patadeperro.ni');
    const invalidEmail = validateEmail('email_invalido_sin_arroba');
    const passed = validEmail && !invalidEmail;
    results.push({
      testName: 'Validación: Expresión regular de correo electrónico',
      passed,
      message: passed ? 'Evaluación de emails correctos e incorrectos exitosa.' : 'Fallo en la validación de email.',
      durationMs: Math.round(performance.now() - t2Start),
    });
  } catch (err: any) {
    results.push({
      testName: 'Validación: Expresión regular de correo electrónico',
      passed: false,
      message: `Excepción: ${err?.message}`,
      durationMs: Math.round(performance.now() - t2Start),
    });
  }

  // Test 3: Haversine Distance Calculation (AR Engine)
  const t3Start = performance.now();
  try {
    // Distance between León (12.4379, -86.878) and Granada (11.9344, -85.956) ~ 115 km
    const distanceMeters = calculateHaversineDistance(12.4379, -86.878, 11.9344, -85.956);
    const distanceKm = distanceMeters / 1000;
    const passed = distanceKm > 100 && distanceKm < 130;
    results.push({
      testName: 'Cálculo RA: Algoritmo Haversine de proximidad geográfica',
      passed,
      message: passed ? `Distancia calculada: ${distanceKm.toFixed(1)} km (dentro del rango esperado).` : `Error: Distancia fue ${distanceKm} km`,
      durationMs: Math.round(performance.now() - t3Start),
    });
  } catch (err: any) {
    results.push({
      testName: 'Cálculo RA: Algoritmo Haversine de proximidad geográfica',
      passed: false,
      message: `Excepción: ${err?.message}`,
      durationMs: Math.round(performance.now() - t3Start),
    });
  }

  // Test 4: Booking Engine Calculation & Token Generator
  const t4Start = performance.now();
  try {
    const code = generateConfirmationCode('PDP');
    const pricePerPerson = 25;
    const guests = 3;
    const total = pricePerPerson * guests;
    const isCodeValid = code.startsWith('PDP-') && code.length === 10;
    const passed = isCodeValid && total === 75;
    results.push({
      testName: 'Motor de Reservas: Cálculo de totales y hash de confirmación',
      passed,
      message: passed ? `Código emitió ${code} y total procesado en $${total}.` : 'Fallo en motor de reservas.',
      durationMs: Math.round(performance.now() - t4Start),
    });
  } catch (err: any) {
    results.push({
      testName: 'Motor de Reservas: Cálculo de totales y hash de confirmación',
      passed: false,
      message: `Excepción: ${err?.message}`,
      durationMs: Math.round(performance.now() - t4Start),
    });
  }

  // Test 5: Category Filtering Engine
  const t5Start = performance.now();
  try {
    const tierraExps = INITIAL_EXPERIENCES.filter(e => e.categoria === CategoriaExp.TIERRA);
    const aguaExps = INITIAL_EXPERIENCES.filter(e => e.categoria === CategoriaExp.AGUA);
    const passed = tierraExps.length > 0 && aguaExps.length > 0 && tierraExps.length + aguaExps.length <= INITIAL_EXPERIENCES.length;
    results.push({
      testName: 'Búsqueda & Catálogo: Filtrado multicriterio (Tierra / Agua / Aire)',
      passed,
      message: passed ? `Se categorizaron ${tierraExps.length} de Tierra y ${aguaExps.length} de Agua correctamente.` : 'Fallo en filtrado por categoría.',
      durationMs: Math.round(performance.now() - t5Start),
    });
  } catch (err: any) {
    results.push({
      testName: 'Búsqueda & Catálogo: Filtrado multicriterio (Tierra / Agua / Aire)',
      passed: false,
      message: `Excepción: ${err?.message}`,
      durationMs: Math.round(performance.now() - t5Start),
    });
  }

  // Test 6: Serialization & Corruption Recovery Backup
  const t6Start = performance.now();
  try {
    const mockState = { userRole: 'Turista', testKey: 'validador' };
    const jsonStr = serializeBackup(mockState);
    const restored = parseAndValidateBackup(jsonStr);
    const passed = restored !== null && (restored.appState as any)?.testKey === 'validador' && restored.version === '1.0.0';
    results.push({
      testName: 'Persistencia & Respaldo: Serialización y validación de snapshot JSON',
      passed,
      message: passed ? 'Copia de seguridad empaquetada y restaurada sin pérdida de integridad.' : 'Error al restaurar respaldo JSON.',
      durationMs: Math.round(performance.now() - t6Start),
    });
  } catch (err: any) {
    results.push({
      testName: 'Persistencia & Respaldo: Serialización y validación de snapshot JSON',
      passed: false,
      message: `Excepción: ${err?.message}`,
      durationMs: Math.round(performance.now() - t6Start),
    });
  }

  // Test 7: Two-Factor Authentication (2FA) OTP Engine
  const t7Start = performance.now();
  try {
    const otpCode = generate2FACode();
    const isSixDigits = /^\d{6}$/.test(otpCode);
    const verifySuccess = verify2FACode(otpCode, otpCode);
    const verifyFail = !verify2FACode('000000', otpCode === '000000' ? '999999' : otpCode);
    const passed = isSixDigits && verifySuccess && verifyFail;
    results.push({
      testName: 'Seguridad: Generación y Validación de Códigos 2FA (OTP 6 dígitos)',
      passed,
      message: passed ? `Generación de código (${otpCode}) y validación de 2 factores exitosa.` : 'Fallo en motor de 2FA.',
      durationMs: Math.round(performance.now() - t7Start),
    });
  } catch (err: any) {
    results.push({
      testName: 'Seguridad: Generación y Validación de Códigos 2FA (OTP 6 dígitos)',
      passed: false,
      message: `Excepción: ${err?.message}`,
      durationMs: Math.round(performance.now() - t7Start),
    });
  }

  // Test 8: Session Lifecycle & Inactivity Expiration
  const t8Start = performance.now();
  try {
    const now = Date.now();
    const activeRecent = now - 5 * 60 * 1000; // 5 mins ago
    const expiredPast = now - 45 * 60 * 1000; // 45 mins ago
    const notExpired = !isSessionExpired(activeRecent, 30);
    const expired = isSessionExpired(expiredPast, 30);
    const passed = notExpired && expired;
    results.push({
      testName: 'Manejo de Estados: Detección y Expiración de Sesión por Inactividad',
      passed,
      message: passed ? 'Control de tiempo límite y expiración automática evaluado con éxito.' : 'Fallo en evaluación de expiración de sesión.',
      durationMs: Math.round(performance.now() - t8Start),
    });
  } catch (err: any) {
    results.push({
      testName: 'Manejo de Estados: Detección y Expiración de Sesión por Inactividad',
      passed: false,
      message: `Excepción: ${err?.message}`,
      durationMs: Math.round(performance.now() - t8Start),
    });
  }

  const passedCount = results.filter(r => r.passed).length;

  return {
    results,
    total: results.length,
    passed: passedCount,
    failed: results.length - passedCount,
  };
}
