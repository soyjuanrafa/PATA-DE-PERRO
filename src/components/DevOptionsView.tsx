/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Developer Options & Technical Documentation Component
 * Protected by PIN 1102 for Authorized Personnel
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TECHNICAL_DOCS } from '../data/mockData';
import { runAllUnitTests } from '../__tests__/unitTests';
import { TestResult } from '../types';
import {
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Database,
  Workflow,
  Server,
  HelpCircle,
  FileText,
  Download,
  Copy,
  Check,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  KeyRound,
  Code2,
} from 'lucide-react';

const AUTHORIZED_PIN = '1102';

const FULL_README_CONTENT = `# 🐾 Pata de Perro - Plataforma de Turismo Auténtico y Sostenible

> **Ciudades Creativas de Nicaragua** • Navegación en Realidad Aumentada (RA) • Reservas Directas y Comercio Comunitario.

---

## 📌 Visión General del Proyecto

**Pata de Perro** es una solución digital integral diseñada para promover el turismo auténtico, sostenible y comunitario en la Red de Ciudades Creativas de Nicaragua (León, Granada, Masaya, Matagalpa, Ometepe, Estelí, San Juan del Sur, entre otras).

La plataforma permite a los **Turistas** descubrir actividades auténticas (talleres de artesanía, senderismo volcánico, rutas del cacao y gastronomía ancestral), explorar destinos mediante un **Simulador de Navegación con Realidad Aumentada (RA)** y agendar experiencias directamente con **Anfitriones Locales** vía WhatsApp sin intermediarios abusivos.

---

## 🎨 Paleta de Colores Minimalista y Tipografía Moderna

Cumpliendo con los lineamientos de diseño de la marca:

- **Paleta de Colores Primaria**:
  - \`Verde Naturaleza (#2E9D62)\`: Representa la riqueza natural y el desarrollo sostenible.
  - \`Naranja Atardecer (#FF5722)\`: Refleja la calidez comunitaria, la cultura e intensidad folklórica.
  - \`Fondo Neutro Cálido (#FAF6F0)\`: Papel artesanal ligero, ofreciendo una experiencia visual de descanso.
  - \`Texto Oscuro (#1E293B)\`: Alto contraste para máxima legibilidad.
- **Estilo Tipográfico**:
  - \`Plus Jakarta Sans\`: Tipografía sans-serif limpia, legible e intuitiva para cuerpo de texto y controles UI.
  - \`Outfit\`: Display moderno sans-serif en fuentes de peso extra-bold para títulos y la identidad gráfica del logo.

---

## 🚀 Guía de Configuración e Instalación Local

Asegura la **portabilidad total** entre estaciones de trabajo mediante Node.js, Vite y Docker.

### Prerrequisitos
- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior
- *(Opcional)* **Docker** & **Docker Compose**

### 1. Clonar el Repositorio
\`\`\`bash
git clone https://github.com/tu-usuario/pata-de-perro.git
cd pata-de-perro
\`\`\`

### 2. Instalar Dependencias
\`\`\`bash
npm install
\`\`\`

### 3. Configurar Variables de Entorno
Copia el archivo de ejemplo para inicializar las credenciales locales:
\`\`\`bash
cp .env.example .env
\`\`\`

### 4. Iniciar el Servidor de Desarrollo
\`\`\`bash
npm run dev
\`\`\`
La aplicación estará disponible inmediatamente en \`http://localhost:3000\`.

---

## 🐳 Despliegue con Docker y CI/CD en la Nube

El proyecto incluye contenedores optimizados multi-etapa y pipelines de integración continua.

### Iniciar con Docker Compose
\`\`\`bash
docker-compose up --build -d
\`\`\`

### Pipeline de CI/CD (GitHub Actions)
Ubicado en \`/.github/workflows/ci-cd.yml\`, el pipeline ejecuta automáticamente:
1. Instalación limpia de dependencias (\`npm ci\`).
2. Validación tipográfica y de sintaxis (\`npm run lint\`).
3. Ejecución de la suite de pruebas unitarias automatizadas (\`npm run test\`).
4. Compilación del artefacto de producción (\`npm run build\`).
5. Construcción de la imagen Docker para despliegue en Cloud Run / GCP.

---

## 🗄️ Modelo Relacional Normalizado (3NF)

El motor de base de datos está diseñado bajo la Tercera Forma Normal (3NF) para garantizar la integridad referencial y evitar redundancias.

\`\`\`
+------------------+       +-------------------+       +--------------------+
|     TURISTA      |       |    ANFITRION      |       |    EXPERIENCIA     |
+------------------+       +-------------------+       +--------------------+
| PK id_turista    |       | PK id_anfitrion   |       | PK id_exp          |
|    nombre        |       |    nombre         |       | FK id_anfitrion    |
|    correo        |       |    comunidad      |       |    titulo          |
|    telefono      |       |    verificado     |       |    categoria       |
+--------+---------+       +---------+---------+       |    precio          |
         |                           |                 |    recurso_ra_url  |
         |                           |                 +---------+----------+
         |                           |                           |
         |       +-------------------+                           |
         |       |                                               |
         v       v                                               v
+------------------+                                   +--------------------+
|     RESERVA      |                                   |  PUNTO_INTERES_RA  |
+------------------+                                   +--------------------+
| PK id_reserva    |                                   | PK id_poi_ra       |
| FK id_turista    |                                   | FK id_exp          |
| FK id_exp        |                                   |    latitud         |
|    fecha         |                                   |    longitud        |
|    personas      |                                   |    distancia_m     |
|    monto_total   |                                   |    gltf_modelo     |
|    codigo_conf   |                                   +--------------------+
+------------------+
\`\`\`

---

## 🧪 Pruebas Unitarias Automatizadas

El proyecto cuenta con una suite de pruebas accesible directamente desde la interfaz en la pestaña **"Pruebas"** o ejecutando los módulos de validación en \`src/__tests__/unitTests.ts\`:

- **Seguridad XSS**: Desinfección de fragmentos \`<script>\` con \`sanitizeInput()\`.
- **Validación de Correos**: Verificación de expresiones regulares para usuarios.
- **Geolocalización RA**: Algoritmo Haversine para cálculo de distancias en metros.
- **Motor de Reservas**: Verificación de totales y generación de tokens de confirmación \`PDP-XXXXXX\`.
- **Restauración de Respaldo**: Importación y exportación de snapshots de datos en JSON.

---

## ❓ Preguntas Frecuentes para Desarrolladores (FAQ)

### 1. ¿Cómo se gestionan las imágenes y modelos 3D de la Realidad Aumentada?
Los recursos 3D utilizan formato estándar \`.gltf\` / \`.glb\` almacenados en CDN y referenciados mediante el campo \`recurso_ra_url\` en la entidad \`EXPERIENCIA\`.

### 2. ¿Cómo mantengo la persistencia de datos si cambio de computadora?
Puedes usar el botón **Exportar Respaldo** en el encabezado de la app para descargar un snapshot completo de los datos en formato \`.json\`. Luego, puedes importarlo en tu nueva estación de trabajo.

### 3. ¿El mapa requiere una clave de API de Google Maps paga?
No. El componente del mapa de Ciudades Creativas utiliza renderizado de vector dinámico SVG y proyección de coordenadas WGS84, reduciendo costos de infraestructura y garantizando respuesta instantánea.

---

## 📄 Licencia

Licenciado bajo Apache 2.0. Desarrollado para la auditoría técnica de las Ciudades Creativas de Nicaragua.
`;

export const DevOptionsView: React.FC = () => {
  const { exportBackupJSON, resetToDefaultData, showToast } = useApp();

  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Active sub-tab inside Developer Options
  const [activeTab, setActiveTab] = useState<'doc' | 'tests' | 'architecture' | 'backup'>('doc');

  // Copy state
  const [copied, setCopied] = useState(false);

  // Unit tests state
  const [testSummary, setTestSummary] = useState<{
    results: TestResult[];
    total: number;
    passed: number;
    failed: number;
  } | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Handle PIN Submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === AUTHORIZED_PIN) {
      setIsUnlocked(true);
      setPinError(null);
      showToast('🔒 Acceso concedido a Opciones de Desarrollador.');
    } else {
      setPinError('PIN de seguridad incorrecto. Intente nuevamente.');
      setPinInput('');
    }
  };

  // Download complete README + Diagrams document
  const handleDownloadDoc = () => {
    const blob = new Blob([FULL_README_CONTENT], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README_y_Diagramas_Pata_de_Perro.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📄 Documento README y Diagramas descargado en formato Markdown.');
  };

  // Copy document to clipboard
  const handleCopyDoc = () => {
    navigator.clipboard.writeText(FULL_README_CONTENT);
    setCopied(true);
    showToast('Copiado al portapapeles');
    setTimeout(() => setCopied(false), 2500);
  };

  // Run Unit Tests
  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const summary = runAllUnitTests();
      setTestSummary(summary);
      setIsRunningTests(false);
    }, 400);
  };

  // Lock view
  const handleLock = () => {
    setIsUnlocked(false);
    setPinInput('');
    setPinError(null);
    showToast('Acceso a Opciones de Desarrollador bloqueado.');
  };

  // Render PIN Gate Modal if not unlocked
  if (!isUnlocked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl border border-slate-200 text-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <KeyRound className="w-7 h-7" />
            </div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
              Acceso Restringido
            </span>
            <h1 className="text-slate-900 font-bold text-xl sm:text-2xl tracking-tight">
              Opciones de Desarrollador
            </h1>
            <p className="text-slate-500 text-xs">
              Área protegida para personal autorizado. Ingrese el PIN de seguridad de 4 dígitos para continuar.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 text-center uppercase tracking-wider">
                PIN de Seguridad
              </label>
              <input
                id="input-dev-pin"
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value.replace(/\D/g, ''));
                  if (pinError) setPinError(null);
                }}
                placeholder="••••"
                autoFocus
                className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white font-bold"
              />
            </div>

            {pinError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              id="btn-submit-dev-pin"
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-lg shadow-xs transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Verificar PIN e Ingresar</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Personal autorizado: Ingrese su clave de acceso asignada.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render Unlocked Developer Options Workspace
  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full w-fit">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Personal Autorizado • PIN Verified (1102)
          </div>
          <h1 className="text-slate-900 text-2xl sm:text-3xl font-black tracking-tight pt-2">
            Opciones de Desarrollador
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Centro de documentación técnica, suite de pruebas unitarias y auditoría de arquitectura.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadDoc}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" /> Descargar README & Diagramas (.md)
          </button>
          <button
            onClick={handleLock}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Bloquear sesión"
          >
            <Lock className="w-4 h-4" /> Bloquear
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between shadow-xs gap-1">
        <button
          onClick={() => setActiveTab('doc')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'doc'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" /> Documento README & Diagramas
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'tests'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" /> Suite de Pruebas Unitarias
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'architecture'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" /> Modelo ER (3NF) & Arquitectura
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'backup'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Server className="w-4 h-4" /> Respaldos JSON & Estado
        </button>
      </div>

      {/* Main Workspace Content */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* TAB 1: README & DIAGRAMS DOCUMENT */}
        {activeTab === 'doc' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <h2 className="text-slate-900 text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Documento Completo: README + Diagramas + Especificaciones
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Documentación consolidada en formato Markdown estándar para entrega de auditoría.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyDoc}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
                </button>

                <button
                  onClick={handleDownloadDoc}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Documento (.md)</span>
                </button>
              </div>
            </div>

            {/* Formatted View Container */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-6 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono">{FULL_README_CONTENT}</pre>
            </div>
          </div>
        )}

        {/* TAB 2: UNIT TEST SUITE */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <h2 className="text-slate-900 text-xl font-bold flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  Suite de Pruebas Unitarias Automatizadas
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Verificación de seguridad XSS, fórmulas Haversine RA, validación de tokens y persistencia JSON.
                </p>
              </div>

              <button
                id="btn-run-tests-dev"
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 shrink-0"
              >
                {isRunningTests ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Ejecutando Pruebas...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Ejecutar Pruebas Unitarias</span>
                  </>
                )}
              </button>
            </div>

            {testSummary ? (
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    testSummary.failed === 0
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {testSummary.failed === 0 ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                    )}

                    <div>
                      <h3 className="text-base font-bold">
                        {testSummary.failed === 0
                          ? '¡100% de Pruebas Pasadas con Éxito!'
                          : 'Fallo detectado en las pruebas.'}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Se ejecutaron {testSummary.total} pruebas automatizadas de lógica de negocio y seguridad.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold shrink-0 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">Pasadas</span>
                      <span className="text-emerald-600 text-base">{testSummary.passed}</span>
                    </div>
                    <div className="border-x border-slate-200 px-4">
                      <span className="block text-slate-400 text-[10px] uppercase">Fallidas</span>
                      <span className="text-rose-600 text-base">{testSummary.failed}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">Total</span>
                      <span className="text-slate-900 text-base">{testSummary.total}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider">
                    Resultados Detallados:
                  </h4>
                  <div className="space-y-2">
                    {testSummary.results.map((res, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {res.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                            <span className="text-slate-900 text-xs font-bold">{res.testName}</span>
                          </div>
                          <p className="text-slate-600 text-xs pl-6">{res.message}</p>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{res.durationMs} ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 text-center space-y-3">
                <Terminal className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-slate-900 font-bold text-sm">
                  Suite Lista para Ejecución
                </h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto">
                  Presiona el botón "Ejecutar Pruebas Unitarias" para ejecutar las pruebas automatizadas de Haversine RA, desinfección XSS y generación de tokens.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ER MODEL (3NF) & ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-slate-900 text-xl font-bold flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Modelo Entidad-Relación Normalizado (3NF)
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                {TECHNICAL_DOCS.erDiagram.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TECHNICAL_DOCS.erDiagram.tables.map(tabla => (
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

            {/* UML Activity Diagram Steps */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-slate-900 text-base font-bold flex items-center gap-2">
                <Workflow className="w-4 h-4 text-indigo-600" /> Flujo de Actividades UML
              </h3>
              <div className="space-y-2">
                {TECHNICAL_DOCS.activityDiagram.steps.map(step => (
                  <div key={step.step} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {step.step}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 font-bold text-xs">{step.title}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-medium">
                          Actor: {step.actor}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{step.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BACKUPS & STATE MANAGEMENT */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-slate-900 text-xl font-bold flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                Gestión de Copias de Seguridad & Estado
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Exporta la base de datos local en JSON para migrar entre máquinas o restablece el estado de fábrica.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-600" /> Exportar Snapshot JSON
                </h3>
                <p className="text-slate-600 text-xs">
                  Descarga un archivo con todas las reservaciones, experiencias y configuración de usuario.
                </p>
                <button
                  onClick={exportBackupJSON}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Exportar Respaldo
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-rose-600" /> Restablecer Estado Inicial
                </h3>
                <p className="text-slate-600 text-xs">
                  Borra el almacenamiento local y reinicia la aplicación con los datos semilla por defecto.
                </p>
                <button
                  onClick={resetToDefaultData}
                  className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-medium transition-colors"
                >
                  Restablecer Datos Semilla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
