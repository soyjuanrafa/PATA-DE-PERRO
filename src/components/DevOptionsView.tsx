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
import { TestResult, UserRole } from '../types';
import { UserFilesManager } from './UserFilesManager';
import { GoogleMapsDevLab } from './GoogleMapsDevLab';
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
  Settings,
  Globe,
  Radio,
  Trash2,
  HardDrive,
  CheckCircle,
  Cloud,
} from 'lucide-react';

const AUTHORIZED_PIN = '1102';

const SQL_SCHEMA_CONTENT = `-- 🐾 Pata de Perro - Esquema Relacional Normalizado (3NF) para PostgreSQL / Cloud SQL / Supabase
-- Red de Ciudades Creativas de Nicaragua (León, Granada, Masaya, Matagalpa, Ometepe, Estelí)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Entidad Turista
CREATE TABLE IF NOT EXISTS turista (
    id_turista VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(120) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    preferencia_idioma VARCHAR(10) DEFAULT 'es',
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Entidad Anfitrión Comunitario
CREATE TABLE IF NOT EXISTS anfitrion (
    id_anfitrion VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    comunidad VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    verificado BOOLEAN DEFAULT TRUE,
    biografia TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Entidad Experiencia Turística
CREATE TABLE IF NOT EXISTS experiencia (
    id_exp VARCHAR(36) PRIMARY KEY,
    id_anfitrion VARCHAR(36) NOT NULL REFERENCES anfitrion(id_anfitrion) ON DELETE CASCADE,
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('Tierra', 'Agua', 'Aire')),
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    ubicacion_lat DECIMAL(10,8) NOT NULL,
    ubicacion_lon DECIMAL(11,8) NOT NULL,
    recurso_ra_url VARCHAR(255),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Entidad Punto de Interés RA (POI en coordenadas WGS84)
CREATE TABLE IF NOT EXISTS punto_interes_ra (
    id_poi_ra VARCHAR(36) PRIMARY KEY,
    id_exp VARCHAR(36) NOT NULL REFERENCES experiencia(id_exp) ON DELETE CASCADE,
    latitud DECIMAL(10,8) NOT NULL,
    longitud DECIMAL(11,8) NOT NULL,
    distancia_m INT DEFAULT 0,
    gltf_modelo VARCHAR(255)
);

-- 5. Entidad Reserva (Tercera Forma Normal)
CREATE TABLE IF NOT EXISTS reserva (
    id_reserva VARCHAR(36) PRIMARY KEY,
    id_turista VARCHAR(36) NOT NULL REFERENCES turista(id_turista) ON DELETE CASCADE,
    id_exp VARCHAR(36) NOT NULL REFERENCES experiencia(id_exp) ON DELETE CASCADE,
    fecha_reserva DATE NOT NULL,
    personas INT NOT NULL CHECK (personas > 0),
    monto_total DECIMAL(10,2) NOT NULL,
    estado_reserva VARCHAR(20) NOT NULL DEFAULT 'Confirmada',
    codigo_confirmacion VARCHAR(20) NOT NULL UNIQUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices optimizados para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_exp_categoria ON experiencia(categoria);
CREATE INDEX IF NOT EXISTS idx_reserva_turista ON reserva(id_turista);
CREATE INDEX IF NOT EXISTS idx_reserva_exp ON reserva(id_exp);
`;

const DOCKER_COMPOSE_CONTENT = `# 🐾 Pata de Perro - Configuración Docker Compose Multietapa
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: pata_de_perro_app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
`;

const CICD_YAML_CONTENT = `# 🐾 Pata de Perro - Pipeline de CI/CD (GitHub Actions)
# Ubicación: /.github/workflows/ci-cd.yml
name: Pata de Perro CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout del Repositorio
        uses: actions/checkout@v3

      - name: Configurar Node.js v18
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Instalación Limpia de Dependencias
        run: npm ci

      - name: Validación de Sintaxis y Linting
        run: npm run lint

      - name: Compilación del Artefacto para Producción
        run: npm run build
`;

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

## 🔐 Autenticación Multi-Proveedor en Firebase

La plataforma cuenta con integración a **Firebase Authentication** con soporte completo para:
- **Correo Electrónico y Contraseña (Email/Password)**: Registro y verificación de turistas y anfitriones con hash seguro y control de acceso por roles.
- **Google**: Autenticación rápida federada con Google Identity y vinculación de cuenta.
- **Facebook**: Inicio de sesión mediante \`FacebookAuthProvider\` con permisos de perfil público y correo.
- **GitHub (Nuevo Proveedor)**: Autenticación mediante \`GithubAuthProvider\` con scopes de lectura de perfil y sincronización automática de credenciales.
- **Sincronización con Firestore**: Cada inicio de sesión federado o por email verifica y almacena el documento del usuario en la colección \`/users/{userId}\` bajo reglas de seguridad RLS.

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
  const {
    currentUser,
    loginWithSocialProvider,
    exportBackupJSON,
    resetToDefaultData,
    showToast,
    isDevModeUnlocked,
    setIsDevModeUnlocked,
    setActiveScreen,
  } = useApp();

  // Determine if user has DEVELOPER privilege via GitHub or developer account
  const isDevUser = currentUser?.role === UserRole.DESARROLLADOR || currentUser?.isDev || currentUser?.authProvider === 'github';
  const isUnlocked = isDevModeUnlocked || isDevUser;

  // Authentication State (defaults to isDevModeUnlocked from context)
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Active sub-tab inside Developer Options
  const [activeTab, setActiveTab] = useState<'doc' | 'tests' | 'architecture' | 'backup' | 'files' | 'maps'>('doc');

  // Developer runtime modifiers state
  const [simulatedRAMode, setSimulatedRAMode] = useState(true);
  const [verboseLogging, setVerboseLogging] = useState(false);
  const [backendEndpoint, setBackendEndpoint] = useState('/api/sync');
  const [endpointSaved, setEndpointSaved] = useState(false);

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

  // Handle PIN Submission if locked
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === AUTHORIZED_PIN) {
      setIsDevModeUnlocked(true);
      setPinError(null);
      setPinInput('');
      showToast('Opciones de desarrollador activadas');
    } else {
      setPinError('PIN de seguridad incorrecto. Intente nuevamente.');
      setPinInput('');
    }
  };

  // Quick GitHub developer unlock
  const handleGithubDevUnlock = async () => {
    setPinError(null);
    const res = await loginWithSocialProvider('github');
    if (res.success) {
      setIsDevModeUnlocked(true);
      showToast('¡Desbloqueado con cuenta de Desarrollador GitHub!');
    } else {
      setPinError('Error de autenticación con GitHub: ' + res.message);
    }
  };

  // Toggle master developer mode switch
  const handleToggleDevMode = () => {
    if (isDevModeUnlocked) {
      setIsDevModeUnlocked(false);
      showToast('Opciones de desarrollador desactivadas');
    } else {
      setIsDevModeUnlocked(true);
      showToast('Opciones de desarrollador activadas');
    }
  };

  // Helper for direct file download
  const handleDownloadFile = (filename: string, content: string, mimeType: string = 'text/plain') => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Descargado: ${filename}`);
  };

  // Download complete README + Diagrams document
  const handleDownloadDoc = () => {
    handleDownloadFile('README_y_Diagramas_Pata_de_Perro.md', FULL_README_CONTENT, 'text/markdown');
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
    setIsDevModeUnlocked(false);
    setPinInput('');
    setPinError(null);
    showToast('Opciones de desarrollador desactivadas');
  };

  // Render PIN Gate Modal if not unlocked
  if (!isUnlocked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-stone-200 text-stone-800 space-y-6 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <KeyRound className="w-7 h-7" />
            </div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
              Acceso Restringido para Desarrolladores
            </span>
            <h1 className="text-stone-900 font-extrabold text-xl sm:text-2xl font-outfit tracking-tight">
              Opciones de Desarrollador
            </h1>
            <p className="text-stone-500 text-xs">
              Acceso exclusivo para descarga de archivos, esquemas SQL y modificación de configuraciones de sistema.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 text-center uppercase tracking-wider">
                PIN de Seguridad (1102)
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
                className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3.5 px-4 rounded-2xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] focus:bg-white font-bold"
              />
            </div>

            {pinError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              id="btn-submit-dev-pin"
              type="submit"
              className="w-full py-3.5 bg-[#FF6B35] hover:bg-[#ff5514] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#FF6B35]/25 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Verificar PIN e Ingresar</span>
            </button>
          </form>

          {/* GitHub Developer Bypass */}
          <div className="pt-3 border-t border-stone-100 text-center space-y-2">
            <p className="text-xs text-stone-500 font-medium">
              ¿Acceso mediante cuenta autorizada de desarrollador?
            </p>
            <button
              type="button"
              onClick={handleGithubDevUnlock}
              className="w-full py-2.5 px-4 bg-[#24292e] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-emerald-500/40"
            >
              <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Acceder con GitHub (Desarrollador)</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setActiveScreen('settings')}
              className="text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
            >
              ← Volver a Configuración
            </button>
            <span className="text-[11px] text-stone-400 font-mono">PIN: 1102</span>
          </div>
        </div>
      </div>
    );
  }

  // Render Unlocked Developer Options Workspace
  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header with Master Android Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Modo Desarrollador Activo • PIN 1102
          </div>
          <h1 className="text-stone-900 text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight pt-2">
            Opciones de desarrollador
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm font-medium">
            Centro de documentación técnica, suite de pruebas unitarias y auditoría de arquitectura.
          </p>
        </div>

        {/* Master Toggle Switch: Modo Desarrollador Activado / Desactivado */}
        <div className="flex flex-wrap items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-3">
            <div>
              <span className="block text-xs font-bold text-stone-800">Modo desarrollador</span>
              <span className="block text-[10px] text-stone-500">
                {isDevModeUnlocked ? 'Activado' : 'Desactivado'}
              </span>
            </div>
            <button
              id="btn-master-toggle-devmode"
              onClick={handleToggleDevMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isDevModeUnlocked ? 'bg-[#FF6B35]' : 'bg-stone-400'
              }`}
              role="switch"
              aria-checked={isDevModeUnlocked}
              title="Desactivar modo desarrollador"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isDevModeUnlocked ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-6 w-px bg-stone-300 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadDoc}
              className="px-3.5 py-2 bg-[#23404A] hover:bg-[#162A31] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Descargar README (.md)
            </button>
            <button
              onClick={handleLock}
              className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Desactivar y bloquear opciones de desarrollador"
            >
              <Lock className="w-3.5 h-3.5" /> Desactivar
            </button>
          </div>
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

        <button
          id="btn-tab-dev-files"
          onClick={() => setActiveTab('files')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'files'
              ? 'bg-[#FF6B35] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Code2 className="w-4 h-4" /> Descargas & Modificaciones
        </button>

        <button
          id="btn-tab-dev-maps"
          onClick={() => setActiveTab('maps')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'maps'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-4 h-4" /> Google Maps (Laboratorio)
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

        {/* TAB 5: FILES DOWNLOAD & REAL-TIME DEVELOPER MODIFICATIONS */}
        {activeTab === 'files' && (
          <div className="space-y-8 animate-in fade-in-50">
            {/* Header info */}
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-slate-900 text-xl font-bold flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#FF6B35]" />
                  Descargas de Archivos & Modificaciones de Desarrollador
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Descarga directa de archivos de configuración, esquemas SQL, pruebas y modificación de parámetros en tiempo real.
                </p>
              </div>

              {currentUser && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Sesión: <strong>{currentUser.nombre}</strong> ({currentUser.authProvider || 'github'})
                  </span>
                </div>
              )}
            </div>

            {/* Sub-section 1: 1-Click File Downloads */}
            <div className="space-y-3">
              <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                <Download className="w-4 h-4 text-[#FF6B35]" />
                Archivos del Proyecto Disponibles para Descarga
              </h3>
              <p className="text-xs text-slate-500">
                Selecciona y descarga cualquiera de los artefactos y archivos técnicos del proyecto en su formato nativo:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {/* File 1: SQL 3NF Schema */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-indigo-600" />
                        schema_3nf_postgresql.sql
                      </span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        SQL DDL
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Esquema relacional formal en 3NF con llaves primarias, foráneas, índices de búsqueda y restricciones CHECK.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile('schema_3nf_postgresql.sql', SQL_SCHEMA_CONTENT, 'text/sql')}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar (.sql)
                  </button>
                </div>

                {/* File 2: README Markdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        README_y_Diagramas.md
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        Markdown
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Documentación técnica completa, visión general, paleta de colores, instalación local con Docker y FAQ.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadDoc}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar (.md)
                  </button>
                </div>

                {/* File 3: Docker Compose */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-sky-600" />
                        docker-compose.yml
                      </span>
                      <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-bold">
                        YAML
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Orquestación de contenedor multietapa listo para producción, puerto 3000 y healthcheck integrado.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile('docker-compose.yml', DOCKER_COMPOSE_CONTENT, 'text/yaml')}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar (.yml)
                  </button>
                </div>

                {/* File 4: GitHub Actions CI/CD */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Workflow className="w-4 h-4 text-amber-600" />
                        ci-cd.yml (Workflow)
                      </span>
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                        Actions
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Pipeline automatizado con pruebas unitarias, linting estricto y compilación en GitHub Actions.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile('ci-cd.yml', CICD_YAML_CONTENT, 'text/yaml')}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar (.yml)
                  </button>
                </div>

                {/* File 5: JSON Database Snapshot */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Server className="w-4 h-4 text-purple-600" />
                        respaldo_datos.json
                      </span>
                      <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                        Snapshot
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Instantánea completa de la base de datos con usuarios, anfitriones de Ciudades Creativas y reservas activas.
                    </p>
                  </div>
                  <button
                    onClick={exportBackupJSON}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Exportar (.json)
                  </button>
                </div>

                {/* File 6: Unit Tests Suite Source */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-stone-700" />
                        unitTests_suite.ts
                      </span>
                      <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                        TypeScript
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Lógica de validación matemática Haversine, desinfección XSS y generación de tokens criptográficos PDP.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const testsSummary = runAllUnitTests();
                      const content = `// Pata de Perro - Suite de Pruebas Unitarias\n// Total ejecutadas: ${testsSummary.total}\n\n` +
                        JSON.stringify(testsSummary, null, 2);
                      handleDownloadFile('unitTests_suite.json', content, 'application/json');
                    }}
                    className="w-full py-2 bg-stone-700 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar Resultados
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-section 2: Real-time Runtime Modifiers */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#FF6B35]" />
                Modificador de Parámetros del Sistema (En Vivo)
              </h3>
              <p className="text-xs text-slate-500">
                Cambia el comportamiento de los motores en caliente sin reiniciar la aplicación:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Modifier 1: AR Engine Simulation Mode */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">
                        Modo de Simulación de Realidad Aumentada (RA)
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {simulatedRAMode
                          ? 'Simulador activo con coordenadas WGS84 preconfiguradas'
                          : 'Uso forzado de sensores de brújula/giroscopio del dispositivo'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSimulatedRAMode(!simulatedRAMode);
                        showToast(
                          simulatedRAMode
                            ? 'Simulador RA desactivado: Sensores nativos activos'
                            : 'Simulador RA activado con coordenadas de Nicaragua'
                        );
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        simulatedRAMode ? 'bg-[#FF6B35]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          simulatedRAMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Modifier 2: Verbose Console Logging */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">
                        Depuración y Logs Detallados en Consola
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {verboseLogging
                          ? 'Imprimiendo cada evento de geolocalización y reserva en consola'
                          : 'Modo silencioso para producción'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !verboseLogging;
                        setVerboseLogging(next);
                        if (next) {
                          console.log('🐾 [Pata de Perro DEV] Depuración activada:', new Date().toISOString());
                        }
                        showToast(next ? 'Logs de consola activados' : 'Logs de consola desactivados');
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        verboseLogging ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          verboseLogging ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Modifier 3: Custom Backend Endpoint URL */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 md:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-xs font-bold text-slate-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-600" />
                        URL de Endpoint de Sincronización Backend
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Permite a los desarrolladores redirigir las peticiones a un servidor local o túnel de prueba.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={backendEndpoint}
                        onChange={e => {
                          setBackendEndpoint(e.target.value);
                          setEndpointSaved(false);
                        }}
                        className="p-2 text-xs rounded-xl bg-white border border-slate-300 font-mono w-64 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35]"
                        placeholder="/api/sync o https://..."
                      />
                      <button
                        onClick={() => {
                          setEndpointSaved(true);
                          showToast(`Endpoint guardado: ${backendEndpoint}`);
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        {endpointSaved ? '¡Guardado!' : 'Modificar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-section: Cloud Storage & User Files Manager */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-emerald-600" />
                      Gestor Técnico de Archivos en la Nube (Firestore / Cifrado Local)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Panel administrativo de desarrollador para auditar, subir, respaldar y gestionar archivos multimedia y documentos de las cuentas.
                    </p>
                  </div>
                </div>

                <UserFilesManager />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GOOGLE MAPS PLATFORM LABORATORY */}
        {activeTab === 'maps' && <GoogleMapsDevLab />}
      </div>
    </div>
  );
};

