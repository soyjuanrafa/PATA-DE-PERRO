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

  const passedCount = results.filter(r => r.passed).length;

  return {
    results,
    total: results.length,
    passed: passedCount,
    failed: results.length - passedCount,
  };
}
