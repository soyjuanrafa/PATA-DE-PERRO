# 🐾 Pata de Perro - Plataforma de Turismo Auténtico y Sostenible

> **Ciudades Creativas de Nicaragua** • Navegación en Realidad Aumentada (RA) • Reservas Directas y Comercio Comunitario.

![Pata de Perro Brand Banner](https://raw.githubusercontent.com/patadeperro/assets/main/banner.png)

---

## 📌 Visión General del Proyecto

**Pata de Perro** es una solución digital integral de alto impacto diseñada para promover el turismo auténtico, comunitario y sostenible en la Red de Ciudades Creativas de Nicaragua (**León, Granada, Masaya, Matagalpa, Ometepe, Estelí, San Juan del Sur**, entre otras).

La plataforma conecta a viajeros y turistas de todo el mundo con anfitriones locales y artesanos comunitarios, permitiendo:
- **Descubrir experiencias culturales auténticas**: Talleres artesanales, senderismo volcánico, rutas del café y cacao, gastronomía ancestral y tradiciones folklóricas.
- **Historias Comunitarias Vivas (Stories Feed)**: Formato inmersivo tipo historias para revivir momentos y testimonios directos de anfitriones y viajeros.
- **Simulador de Navegación con Realidad Aumentada (RA)**: Proyección interactiva de puntos de interés (POIs), brújula virtual y modelos 3D sin requerir hardware especializado.
- **Mensajería Directa y Notas de Estado**: Comunicación en tiempo real con anfitriones locales, notas de voz, fotos y notas de estado (Direct Status Notes).
- **Reservas Directas & Comercio Comunitario**: Generación de reservas transparentes sin comisiones ocultas ni intermediarios abusivos.
- **Acceso Multi-Dispositivo en Tiempo Real**: Creación e inicio de sesión seguro desde computadoras, tablets y teléfonos móviles con persistencia en la nube.

---

## 📋 Guía Rápida para el Comité Evaluador y Jurado Calificador

Esta sección está diseñada específicamente para que los evaluadores puedan verificar de forma ágil, transparente y metódica cada uno de los criterios técnicos y funcionales del proyecto.

### 🔑 Opciones de Acceso para Evaluación
El evaluador tiene total libertad para evaluar el sistema mediante cualquiera de estas dos vías:

1. **Registro Libre e Inmediato (Recomendado)**:
   - Puede crear una cuenta nueva pulsando en **"Crear Cuenta"** usando **cualquier correo electrónico** (ej: `@gmail.com`, `@outlook.com`, `@unan.edu.ni`, correo institucional o empresarial) desde su computadora, tablet o teléfono móvil.
   - El registro se sincroniza en la nube en tiempo real mediante **Firebase Authentication** y **Cloud Firestore**.

2. **Cuentas Pre-cargadas de Demostración Rápida (Demo Fast-Pass)**:
   Si el jurado desea ingresar de inmediato sin llenar formularios:

| Rol de Evaluación | Correo Demo | Contraseña | Capacidades a Evaluar |
| :--- | :--- | :--- | :--- |
| **Turista / Explorador** | `turista@patadeperro.ni` | `Turista2026!` | Exploración, Simulador RA, Reservas instantáneas, Chat directo y Stories. |
| **Anfitrión Comunitario** | `anfitrion@patadeperro.ni` | `Anfitrion2026!` | Publicación de experiencias, gestión de cupos, métricas de ocupación e ingresos. |
| **Auditor / Administrador** | `admin@patadeperro.ni` | `Admin2026!` | Auditoría de base de datos relacional PostgreSQL, suite de 13 pruebas unitarias y backup JSON. |

---

### 🗺️ Rutas de Prueba Sugeridas para la Evaluación

#### Ruta 1: Experiencia del Turista y Tecnologías Inmersivas
1. **Catálogo Inteligente**: Ingrese a la vista principal y filtre por Ciudades Creativas (ej. *León*, *Granada*, *Masaya*) o por categorías (*Tierra*, *Agua*, *Aire*).
2. **Historias Comunitarias (Stories)**: En la parte superior, haga clic en las historias activas para probar el reproductor inmersivo con control táctil y barras de progreso.
3. **Simulador de Realidad Aumentada (RA)**: Acceda a la pestaña **"RA"**. Verifique la proyección de puntos de interés (POIs), la orientación con brújula y el cálculo métrico de distancia mediante el algoritmo de **Haversine**.
4. **Motor de Reservas**: Seleccione una experiencia (ej. *"Sandboarding en Cerro Negro"*), escoja fecha y número de personas. Verifique el cálculo exacto de la tarifa en USD y la emisión del comprobante con código de validación `PDP-XXXXXX`.
5. **Mensajería Directa & Notas de Estado**: Ingrese a la pestaña **"Mensajes"** para interactuar con los anfitriones, revisar las notas de estado y probar respuestas rápidas.

#### Ruta 2: Gestión Comunitaria del Anfitrión Local
1. Desde el menú o perfil, active el **"Modo Anfitrión"** (o ingrese con la cuenta de anfitrión).
2. Cree una nueva experiencia comunitaria completando título, descripción, comunidad y precio.
3. Observe cómo la nueva experiencia se refleja en el catálogo y queda disponible para reservas.

#### Ruta 3: Auditoría Técnica, Seguridad y Persistencia
1. **Suite de Pruebas Automatizadas en Vivo**: Diríjase a la pestaña **"Pruebas"** en la aplicación o ejecute `npm run test` en consola. Observe la ejecución en tiempo real de las **13 pruebas unitarias** (seguridad XSS, inyecciones SQL, 2FA OTP, algoritmos RA y OAuth de Google).
2. **Persistencia Híbrida y Fallback**: Compruebe la resiliencia del sistema; la plataforma almacena datos en la nube (Firebase/Cloud SQL) y mantiene sincronización de respaldo en caché local para operar con alta disponibilidad incluso con conectividad inestable.
3. **Exportación de Respaldo Forense**: En el menú superior o perfil, haga clic en **"Exportar Respaldo"** para obtener el snapshot íntegro de datos en formato `.json`.

---

## 🌐 Compatibilidad Multi-Dispositivo y Tipos de Correo

Para garantizar accesibilidad universal y democratización del turismo:

- **Soporte de Dispositivos**: La aplicación está optimizada con arquitectura **Progressive Web App (PWA)** y diseño fluido:
  - 📱 **Smartphones**: Android (Chrome, Firefox, Brave, Edge) e iOS / iPhone (Safari, Chrome).
  - 💻 **Computadoras**: Windows, macOS, Linux (cualquier navegador moderno).
  - 📟 **Tablets**: iPadOS y Android Tablets.
- **Soporte Universal de Correos**:
  - Acepta cualquier dominio de correo estándar del mundo: `@gmail.com`, `@outlook.com`, `@hotmail.com`, `@yahoo.com`, `@icloud.com`, etc.
  - Acepta correos institucionales universitarios (ej. `@unan.edu.ni`, `@uni.edu.ni`, `@uca.edu.ni`).
  - Acepta correos corporativos o de dominio propio (ej. `@turismo-nicaragua.com`).
- **Persistencia en la Nube Multi-Dispositivo**: Si un usuario se registra desde su teléfono celular en el enlace de Vercel, puede abrir su sesión en una computadora de escritorio en cualquier momento; todas sus reservas, perfil y mensajes permanecen guardados en la nube.

---

## 🌟 Novedades y Actualizaciones Recientes

1. **Autenticación Cross-Device en la Nube (Firebase Cloud Sync)**:
   - Las cuentas creadas en cualquier dispositivo (por ejemplo, desde un teléfono en Vercel) se registran directamente en **Firebase Authentication** y **Cloud Firestore**.
   - El inicio de sesión ahora consulta la nube de forma asíncrona: un usuario puede registrarse en su computadora y acceder inmediatamente desde su celular o cualquier otro equipo sin depender del almacenamiento local.
2. **Soporte Oficial de Despliegue en Vercel**:
   - Inclusión del hook automático `prebuild` en `package.json` para garantizar compilaciones fluidas sin fallar por ausencia de archivos de configuración locales.
   - Soporte para inyección de credenciales mediante variables de entorno estándar `VITE_FIREBASE_*`.
3. **Persistencia Híbrida: PostgreSQL (Cloud SQL + Drizzle ORM) con Fallback Resiliente**:
   - Integración con esquema normalizado Drizzle ORM para Cloud SQL PostgreSQL.
   - Sistema de conmutación por falla (fallback) automático: si la instancia SQL no está activa o se ejecuta sin credenciales en preview, la aplicación opera de forma transparente con almacenamiento local/Firebase sin interrumpir la experiencia de usuario.
4. **Diseño y Encuadres Perfeccionados (Pixel-Perfect UI)**:
   - Auditoría integral de encuadres, márgenes de seguridad y jerarquía tipográfica (*Plus Jakarta Sans* y *Outfit*).
   - Experiencia completamente responsiva desde pantallas compactas de 320px hasta monitores de escritorio panorámicos.
5. **Suite de Pruebas Unitarias Extendida (13/13 Pruebas Exitosas)**:
   - Verificación de seguridad de contraseñas, detección de inyecciones SQL/XSS, validación de códigos 2FA, emulación RA paso a paso y alcances de integración de Google Workspace.

---

## 🎨 Identidad Visual y Sistema de Diseño

El diseño de **Pata de Perro** sigue una estética artesanal, sobria y de alto contraste:

### Paleta de Colores Oficial
- **Verde Naturaleza (`#2E9D62`)**: Representa la biodiversidad, las reservas naturales y el desarrollo ecológico sostenible.
- **Naranja Atardecer (`#FF5722`) / Terracota (`#FF6B35`)**: Simboliza la calidez comunitaria, la energía creativa y la riqueza cultural.
- **Azul Petróleo Profundo (`#23404A` / `#162A31`)**: Transmite solidez institucional, elegancia y contraste tipográfico.
- **Fondo Neutro Cálido (`#FAF6F0` / `#FFF8F1`)**: Emula papel artesanal y texturas tradicionales para una experiencia visual relajante.
- **Texto Oscuro (`#1E293B`)**: Diseñado para cumplir con los estándares de accesibilidad WCAG AA.

### Tipografías
- **Plus Jakarta Sans**: Tipografía sans-serif moderna, equilibrada y altamente legible para cuerpos de texto, tablas e interfaces de usuario.
- **Outfit**: Tipografía display sans-serif en pesos Bold / Extra-Bold para logotipos, encabezados de impacto y títulos de sección.
- **IBM Plex Mono / Sans**: Para metadatos técnicos, códigos de reserva y etiquetas de geolocalización.

---

## 🏗️ Arquitectura y Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend Framework** | React 18+ (Functional Components & Custom Hooks) |
| **Lenguaje** | TypeScript (Modo Estricto / Tipado Completo) |
| **Estilos & UI** | Tailwind CSS (Diseño Mobile-First y Responsive Design) |
| **Animaciones** | Framer Motion / Motion |
| **Iconografía** | Lucide React |
| **Empaquetador** | Vite |
| **Backend en la Nube** | Firebase Authentication & Cloud Firestore (Sincronización en tiempo real) |
| **Base de Datos Relacional** | PostgreSQL en Google Cloud SQL con **Drizzle ORM** (3NF y esquema tipado) |
| **Arquitectura Resiliente** | Fallback automático (Cloud SQL -> Firestore -> Local Snapshot) para alta disponibilidad |
| **Almacenamiento de Archivos** | Cloud Storage / Colección de Archivos de Usuario (`user_files`) |
| **Reglas de Seguridad** | Firestore Security Rules (Row-Level Security por `request.auth.uid`) |
| **Plataformas de Despliegue** | **Vercel**, Google Cloud Run, Docker |
| **Internacionalización** | Sistema Custom i18n (Español, Inglés, Francés, Alemán) |
| **Contenedores & CI/CD** | Docker, Docker Compose, GitHub Actions |
| **Persistencia Local y Respaldo** | Sincronización híbrida Local + Nube con Exportación/Importación JSON |

---

## 📱 Módulos y Funcionalidades Principales

### 1. Exploración & Ciudades Creativas
- Vista dinámica de experiencias filtrables por ciudad creativa y categoría.
- Búsqueda contextual instantánea por nombre de experiencia, anfitrión o ubicación.
- Tarjetas interactivas con calificaciones, precios por persona, etiquetas de sostenibilidad y badges verificados.

### 2. Historias Comunitarias (Stories Reel)
- Carrusel de historias estilo redes sociales en la parte superior del explorador.
- Reproductor de video/fotos con barras de progreso segmentadas, pausa/reanudación, mute y control táctil.
- Módulo para que los usuarios y anfitriones suban sus propias historias y reseñas en vivo.

### 3. Mensajería Directa & Notas de Estado (Instagram Direct Style)
- Reel superior de **Notas de Estado Comunitarias** con avatares, emojis personalizados y pensamientos de anfitriones.
- Pestañas de filtrado de chats: *Principal, General, Solicitudes y Rutas*.
- Soporte para mensajes de texto, notas de voz simuladas, adjuntos de fotos y carrusel de sugerencias rápidas.
- Simulación de llamadas de voz y videollamadas con anfitriones.
- Diseño responsivo adaptado para pantallas estrechas (320px+) con prevención de desbordamientos y truncamiento óptimo.

### 4. Navegación en Realidad Aumentada (RA)
- Simulador de brújula y cámara RA con proyección de puntos de interés (POIs) en tiempo real.
- Cálculo de distancias mediante el algoritmo matemático de **Haversine**.
- Superposición de modelos 3D (`.gltf`/`.glb`) e insignias de puntos clave del patrimonio nicaragüense.

### 5. Motor de Reservas y Validación de Tickets
- Selector de fecha, horario y conteo de participantes con cálculo automático de totales en USD.
- Generación de códigos únicos de confirmación (`PDP-XXXXXX`).
- Enlace directo opcional para coordinar con el anfitrión vía WhatsApp.

### 6. Panel de Anfitrión Comunitario (Host Dashboard)
- Gestión completa de perfil de anfitrión y comunidad creativa.
- Publicación y edición de nuevas experiencias turísticas.
- Bandeja de reservas recibidas con métricas de ocupación e ingresos generados.

### 7. Backend en la Nube (Firebase Auth + Cloud Firestore + File Storage)
- **Autenticación Completa de Usuarios**: Registro con credenciales seguras, inicio de sesión, persistencia de sesión con Firebase Auth y cierre de sesión seguro.
- **Base de Datos NoSQL en Tiempo Real**: Persistencia en la nube de perfiles de usuario (`users`), reservas generadas (`reservations`), hilos de conversación y metadatos de archivos subidos.
- **Almacenamiento y Gestor de Archivos de Usuario (`UserFilesManager`)**: Módulo interactivo en la pestaña del Perfil que permite a los usuarios:
  - Cargar archivos y fotos con validación estricta de tamaño (máx. 800 KB por documento) y formato (JPEG, PNG, WEBP, PDF).
  - Previsualizar en vivo imágenes y documentos con fecha, tamaño formateado y tipo MIME.
  - Eliminar sus propios archivos con confirmación y control de integridad.
- **Reglas de Seguridad Estrictas (Firestore Security Rules)**:
  - Cada usuario autenticado únicamente puede crear, consultar, modificar o eliminar sus propios documentos (`request.auth.uid == userId` y `request.auth.uid == resource.data.userId`).
  - Validación de campos requeridos y tipos de datos a nivel de base de datos para impedir inyecciones o mutaciones no autorizadas.

### 8. Sistema de Habilidades (Antigravity Skills)
- Integración del framework de habilidades en `.agents/skills/`.
- Habilidad maestra `creador-de-habilidades` con plantillas (`plantilla-skill.md`), scripts y ejemplos estructurados para extender las capacidades del asistente de desarrollo.

---

## 🗄️ Modelo Relacional Normalizado (3NF)

El esquema de datos cumple con la **Tercera Forma Normal (3NF)** para asegurar integridad referencial:

```text
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
```

---

## 🚀 Guía de Instalación y Ejecución Local

### Prerrequisitos
- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior
- *(Opcional)* **Docker** & **Docker Compose**

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/pata-de-perro.git
cd pata-de-perro
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Copia el archivo de ejemplo para inicializar las credenciales locales:
```bash
cp .env.example .env
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible de inmediato en `http://localhost:3000`.

### 5. Compilar para Producción
```bash
npm run build
```

---

## ☁️ Despliegue en Vercel (Configuración Rápida)

La aplicación está completamente optimizada para ser desplegada en **Vercel**:

### 1. Variables de Entorno en Vercel
En el panel de tu proyecto en Vercel (**Project Settings > Environment Variables**), agrega las siguientes claves para habilitar la autenticación y persistencia en la nube:

| Variable | Valor | Descripción |
| :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | `AIzaSyAJqy28P5qx-Z5pIx_etY82qhuspMtSRCA` | Llave pública de cliente Firebase |
| `VITE_FIREBASE_PROJECT_ID` | `disco-rider-4n96h` | ID del proyecto de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | `disco-rider-4n96h.firebaseapp.com` | Dominio de autenticación |
| `VITE_FIREBASE_STORAGE_BUCKET` | `disco-rider-4n96h.firebasestorage.app` | Almacenamiento de archivos |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `32734321845` | ID de mensajería |
| `VITE_FIREBASE_APP_ID` | `1:32734321845:web:7b48e926bb39da829672fc` | ID de la aplicación web |

*(Opcional: Si conectas tu Cloud SQL en producción, define `SQL_HOST`, `SQL_DATABASE`, `SQL_USER` y `SQL_PASSWORD`)*.

### 2. Autorizar el Dominio de Vercel en Firebase Auth
Para que los usuarios puedan registrarse e iniciar sesión desde tu enlace de Vercel en cualquier celular o computadora:
1. Dirígete a la [Consola de Firebase](https://console.firebase.google.com/) > Proyecto `disco-rider-4n96h`.
2. Entra a **Authentication** > pestaña **Settings** (Configuración).
3. En la sección **Authorized domains** (Dominios autorizados), haz clic en **Add domain**.
4. Agrega tu dominio de Vercel (ejemplo: `tu-app.vercel.app`) y haz clic en **Guardar**.

---

## 🧪 Pruebas Unitarias Automatizadas & QA (13/13 Pasadas)

El proyecto cuenta con una suite de pruebas automatizadas ejecutables con `npm run test` o desde la pestaña **"Pruebas"** en la interfaz:

1. ✅ **Seguridad XSS (`sanitizeInput`)**: Neutralización efectiva de fragmentos maliciosos HTML/JS.
2. ✅ **Validación de Correo Electrónico**: Validación de estructura y formato RFC de emails.
3. ✅ **Cálculo de Navegación RA (Haversine)**: Precisión métrica de proximidad y rumbo hacia puntos de interés.
4. ✅ **Motor de Reservas**: Cálculo exacto de tarifas, conteo de personas y generación de hashes `PDP-XXXXXX`.
5. ✅ **Búsqueda & Catálogo Multicriterio**: Filtrado por categorías (Tierra, Agua, Aire) y Ciudades Creativas.
6. ✅ **Persistencia & Respaldo JSON**: Serialización, exportación y restauración de snapshot sin pérdida de integridad.
7. ✅ **Generación y Validación 2FA (OTP 6 dígitos)**: Flujo de doble factor con códigos temporales seguros.
8. ✅ **Control de Sesión por Inactividad**: Detección y expiración automática para protección de cuentas públicas.
9. ✅ **Firebase Auth Multi-Proveedor**: Soporte activo para Email/Password, Google, Facebook, GitHub y Apple.
10. ✅ **Google Workspace OAuth (Gmail & Docs)**: Scopes de lectura/envío y codificación RFC 2822 validados.
11. ✅ **Política de Contraseñas Robustas**: Detección de claves débiles/cortas y comprobación de alta entropía.
12. ✅ **Detección de Inyecciones SQL/XSS**: Intercepción preventiva de patrones maliciosos en formularios.
13. ✅ **Simulador RA Autónomo por Pasos**: Desplazamiento reactivo de aproximación métrica sin requerir giroscopio de hardware.

---

## 🐳 Despliegue con Docker y CI/CD

### Despliegue Local con Docker Compose
```bash
docker-compose up --build -d
```

### Pipeline de CI/CD (GitHub Actions)
Ubicado en `/.github/workflows/ci-cd.yml`, el flujo automatizado realiza:
1. `npm ci || npm install` — Instalación resiliente de dependencias con Node.js 22.
2. `npm run lint` — Validación de sintaxis y reglas de TypeScript (`tsc --noEmit`).
3. `npm run test` — Ejecución de las 13 pruebas unitarias automatizadas.
4. `npm run build` — Compilación de producción con hook `prebuild` seguro.
5. Construcción y publicación del contenedor Docker para Cloud Run / GCP.

---

## ❓ Preguntas Frecuentes (FAQ)

#### 1. ¿Las cuentas de usuario se guardan siempre, incluso desde otros dispositivos?
**Sí.** Las cuentas se registran en **Firebase Authentication** y **Cloud Firestore** en la nube. Aunque cambies de computadora o abras la aplicación desde el navegador de un teléfono móvil en Vercel, tu usuario y credenciales se validan en tiempo real contra los servidores de Firebase.

#### 2. ¿Pueden crearse y utilizarse múltiples cuentas desde diferentes dispositivos a la vez?
**Sí.** Cualquier persona que acceda al enlace de la aplicación puede pulsar en "Registrarse", seleccionar su perfil (Turista o Anfitrión) y crear su cuenta. El sistema soporta múltiples usuarios concurrentes conectados desde cualquier parte del mundo.

#### 3. ¿Cómo recuperar o cambiar la contraseña de una cuenta?
Firebase Auth cuenta con el servicio oficial de restablecimiento seguro por correo (`sendOobCode`). Al solicitar el cambio o restablecimiento, Firebase envía automáticamente un enlace con token temporal al correo del usuario para que defina su nueva clave sin exponer su cuenta.

#### 4. ¿Qué ocurre si la base de datos Cloud SQL PostgreSQL no está disponible?
La arquitectura incluye un **mecanismo de fallback inteligente**: si `SQL_HOST` no está configurado o la red no puede alcanzar la base de datos relacional, la aplicación conmuta automáticamente al almacén de Firestore y datos locales sin interrumpir la navegación, reservas ni inicio de sesión del usuario.

#### 5. ¿El mapa interactivo genera costos de Google Maps API?
No. El mapa de Ciudades Creativas utiliza renderizado de vectores SVG de alta definición y proyección matemática WGS84, lo que elimina costos de API y garantiza tiempos de respuesta instantáneos.

#### 6. ¿Cómo garantiza el Backend que cada usuario solo acceda a sus propios datos y archivos?
La plataforma implementa **Firestore Security Rules** con autenticación de Firebase (`request.auth != null`). Las reglas de seguridad impiden lecturas o escrituras cruzadas verificando `request.auth.uid == userId` tanto en `/users/{userId}` como en `/user_files/{fileId}` y `/reservations/{reservationId}`, asegurando que ningún usuario pueda consultar o manipular archivos y datos ajenos.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **Apache 2.0**. Desarrollado para la promoción y auditoría técnica del turismo comunitario en las Ciudades Creativas de Nicaragua.
