/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Technical Documentation & Architecture Audit Hub
 */

import React, { useState } from 'react';
import { TECHNICAL_DOCS } from '../data/mockData';
import { Code2, Database, Workflow, HelpCircle, Server, ShieldCheck, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TechDocsModal: React.FC = () => {
  const { exportBackupJSON, resetToDefaultData } = useApp();
  const [activeTab, setActiveTab] = useState<'er' | 'activity' | 'cloud' | 'faq'>('er');

  const { erDiagram, activityDiagram, faq } = TECHNICAL_DOCS;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full w-fit">
            <Code2 className="w-4 h-4 text-indigo-600" /> Centro de Auditoría y Documentación Técnica
          </div>
          <h1 className="text-slate-900 text-2xl sm:text-3xl font-black tracking-tight pt-2">
            Arquitectura de Pata de Perro
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportBackupJSON}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" /> Exportar Respaldo
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between shadow-xs gap-1">
        <button
          onClick={() => setActiveTab('er')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'er'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" /> Modelo ER (3NF)
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'activity'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Workflow className="w-4 h-4" /> Diagrama Actividades
        </button>

        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'cloud'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Server className="w-4 h-4" /> Docker & CI/CD
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'faq'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> FAQ Desarrolladores
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* TAB 1: MODELO ER 3NF */}
        {activeTab === 'er' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-slate-900 text-xl font-bold">Modelo Entidad-Relación Normalizado (3NF)</h2>
              <p className="text-slate-500 text-xs mt-1">{erDiagram.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {erDiagram.tables.map(tabla => (
                <div key={tabla.name} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{tabla.name}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      Normalizada 3NF
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <p className="text-indigo-600 font-bold">
                      PK: <span className="text-slate-800">{tabla.pk}</span>
                    </p>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block mb-1">
                        Atributos de Datos:
                      </span>
                      <ul className="space-y-1 text-slate-700 text-[11px] font-sans">
                        {tabla.fields.map((f, i) => (
                          <li key={i} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                            <span className="font-mono font-bold text-slate-900">{f.name}</span>
                            <span className="text-slate-500 text-[10px]">{f.type}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: DIAGRAMA DE ACTIVIDADES */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-stone-900 text-xl font-black">Flujo de Actividades UML</h2>
              <p className="text-stone-600 text-xs mt-1">{activityDiagram.description}</p>
            </div>

            <div className="space-y-3">
              {activityDiagram.steps.map(step => (
                <div key={step.step} className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {step.step}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900 font-bold text-sm">{step.title}</span>
                      <span className="text-[10px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-semibold">
                        Actor: {step.actor}
                      </span>
                    </div>
                    <p className="text-stone-600 text-xs leading-relaxed">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CLOUD & DOCKER */}
        {activeTab === 'cloud' && (
          <div className="space-y-6 text-xs text-stone-700">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-stone-900 text-xl font-black">Configuración Cloud, Docker & Portabilidad</h2>
              <p className="text-stone-600 text-xs mt-1">
                Instrucciones para migrar el entorno entre cualquier computadora mediante Git.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 space-y-3 font-mono">
                <h3 className="text-emerald-400 font-bold text-sm font-sans flex items-center gap-2">
                  <Server className="w-4 h-4" /> 1. Ejecución con Docker Compose
                </h3>
                <p className="text-[11px] text-stone-400 font-sans">
                  Levanta la aplicación en producción o desarrollo aislado con un solo comando:
                </p>
                <div className="bg-black p-3 rounded-xl text-emerald-300 font-bold overflow-x-auto">
                  <code>docker-compose up --build -d</code>
                </div>
              </div>

              <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 space-y-3 font-mono">
                <h3 className="text-orange-400 font-bold text-sm font-sans flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> 2. Pipeline de CI/CD (GitHub Actions)
                </h3>
                <p className="text-[11px] text-stone-400 font-sans">
                  Compilación automática, ejecución de linter y pruebas unitarias en `.github/workflows/ci-cd.yml`.
                </p>
                <div className="bg-black p-3 rounded-xl text-orange-300 font-bold overflow-x-auto">
                  <code>git push origin main</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-stone-900 text-xl font-black">Preguntas Frecuentes para Desarrolladores</h2>
              <p className="text-stone-600 text-xs mt-1">Guía rápida de resolución de problemas e integración.</p>
            </div>

            <div className="space-y-4">
              {faq.map((item, idx) => (
                <div key={idx} className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-2">
                  <h3 className="text-stone-900 font-bold text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    {item.q}
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed pl-6">{item.a}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-center">
              <button
                onClick={resetToDefaultData}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-full text-xs font-bold"
              >
                Restablecer Datos Semilla por Defecto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
