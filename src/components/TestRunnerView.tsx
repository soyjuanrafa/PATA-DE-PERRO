/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Interactive Unit Test Runner Component
 */

import React, { useState } from 'react';
import { runAllUnitTests } from '../__tests__/unitTests';
import { TestResult } from '../types';
import { Play, CheckCircle2, XCircle, ShieldCheck, Terminal, Clock, RefreshCw } from 'lucide-react';

export const TestRunnerView: React.FC = () => {
  const [testSummary, setTestSummary] = useState<{
    results: TestResult[];
    total: number;
    passed: number;
    failed: number;
  } | null>(null);

  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const summary = runAllUnitTests();
      setTestSummary(summary);
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full w-fit">
            <Terminal className="w-4 h-4 text-indigo-600" /> Suite de Pruebas Unitarias Exhaustivas
          </div>
          <h1 className="text-slate-900 text-2xl sm:text-3xl font-black tracking-tight pt-2">
            Verificación de Código y Seguridad
          </h1>
        </div>

        <button
          id="btn-run-unit-tests"
          onClick={handleRunTests}
          disabled={isRunning}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Ejecutando Pruebas...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Ejecutar Todas las Pruebas</span>
            </>
          )}
        </button>
      </div>

      {/* Test Status Banner */}
      {testSummary ? (
        <div
          className={`p-6 rounded-xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            testSummary.failed === 0
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-3">
            {testSummary.failed === 0 ? (
              <CheckCircle2 className="w-9 h-9 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-9 h-9 text-rose-600 shrink-0" />
            )}

            <div>
              <h2 className="text-base font-bold tracking-tight">
                {testSummary.failed === 0
                  ? '¡Todas las Pruebas Unitarias Pasaron con Éxito (100%)!'
                  : 'Se detectaron fallos en la suite de pruebas.'}
              </h2>
              <p className="text-xs text-slate-600">
                Se ejecutaron {testSummary.total} pruebas automatizadas de lógica de negocio y seguridad.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold shrink-0 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
            <div>
              <span className="block text-slate-400 text-[10px] uppercase">Pasadas</span>
              <span className="text-emerald-600 text-base">{testSummary.passed}</span>
            </div>
            <div className="border-x border-slate-200 px-4">
              <span className="block text-slate-400 text-[10px] uppercase">Fallidas</span>
              <span className="text-rose-600 text-base">{testSummary.failed}</span>
            </div>
            <div>
              <span className="block text-stone-500 text-[10px] uppercase">Total</span>
              <span className="text-stone-900 text-base">{testSummary.total}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-3 shadow-xs">
          <Terminal className="w-12 h-12 text-stone-400 mx-auto" />
          <h2 className="text-stone-900 font-bold text-base">
            Haz clic en "Ejecutar Todas las Pruebas" para iniciar la auditoría unitaria.
          </h2>
          <p className="text-stone-500 text-xs max-w-md mx-auto">
            Evalúa algoritmos Haversine RA, sanitización XSS contra inyecciones, generador de tokens de reserva y validadores de esquema de respaldo.
          </p>
        </div>
      )}

      {/* Test Results Detail List */}
      {testSummary && (
        <div className="space-y-3">
          <h3 className="text-stone-900 text-sm font-bold">Resultados Detallados por Módulo:</h3>

          <div className="space-y-3">
            {testSummary.results.map((res, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {res.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="text-stone-900 text-xs font-bold">{res.testName}</span>
                  </div>
                  <p className="text-stone-600 text-xs pl-6">{res.message}</p>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono shrink-0 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                  <Clock className="w-3 h-3" />
                  <span>{res.durationMs} ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
