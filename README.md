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
| **Backend & Cloud DB** | Firebase Firestore (Base de datos NoSQL en la nube con RLS) |
| **Autenticación** | Firebase Authentication (Registro, Inicio de Sesión y Cierre) |
| **Almacenamiento de Archivos** | Cloud Storage / Colección de Archivos de Usuario (`user_files`) |
| **Reglas de Seguridad** | Firestore Security Rules (Row-Level Security por `request.auth.uid`) |
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

## 🧪 Pruebas Unitarias Automatizadas & QA

El proyecto cuenta con un módulo de verificación y suite de pruebas accesibles desde la interfaz en la pestaña **"Pruebas"** o ejecutando `src/__tests__/unitTests.ts`:

- ✅ **Seguridad XSS**: Desinfección de fragmentos potencialmente maliciosos con `sanitizeInput()`.
- ✅ **Validación de Correos**: Verificación rigurosa de formato RFC para cuentas de usuario.
- ✅ **Geolocalización RA**: Algoritmo Haversine de precisión para distancias métricas.
- ✅ **Motor de Reservas**: Verificación de cálculos de tarifa y generación de códigos `PDP-XXXXXX`.
- ✅ **Restauración de Respaldo**: Serialización y deserialización JSON sin pérdida de datos.
- ✅ **Auditoría Visual & Responsive**: Validación de no-desbordamiento y soporte desde 320px hasta monitores de escritorio.

---

## 🐳 Despliegue con Docker y CI/CD

### Despliegue Local con Docker Compose
```bash
docker-compose up --build -d
```

### Pipeline de CI/CD (GitHub Actions)
Ubicado en `/.github/workflows/ci-cd.yml`, el flujo automatizado realiza:
1. `npm ci` — Instalación limpia de dependencias.
2. `npm run lint` — Validación de sintaxis y reglas de TypeScript.
3. `npm run test` — Ejecución de suite de pruebas unitarias.
4. `npm run build` — Compilación y optimización de bundles.
5. Construcción y publicación del contenedor Docker para Cloud Run / GCP.

---

## ❓ Preguntas Frecuentes (FAQ)

#### 1. ¿Cómo se gestionan los modelos 3D e imágenes de Realidad Aumentada?
Los recursos 3D utilizan formatos estándar `.gltf` / `.glb` servidos de forma optimizada y referenciados en el campo `recurso_ra_url` de cada experiencia.

#### 2. ¿Cómo mantengo la persistencia de datos al cambiar de dispositivo?
En el menú superior de la aplicación puedes utilizar **"Exportar Respaldo"** para descargar una copia completa en formato `.json` e importarla en cualquier otra estación de trabajo.

#### 3. ¿El mapa interactivo genera costos de Google Maps API?
No. El mapa de Ciudades Creativas utiliza renderizado de vectores SVG de alta definición y proyección matemática WGS84, lo que elimina costos de API y garantiza tiempos de respuesta instantáneos.

#### 4. ¿Cómo garantiza el Backend que cada usuario solo acceda a sus propios datos y archivos?
La plataforma implementa **Firestore Security Rules** con autenticación de Firebase (`request.auth != null`). Las reglas de seguridad impiden lecturas o escrituras cruzadas verificando `request.auth.uid == userId` tanto en `/users/{userId}` como en `/user_files/{fileId}` y `/reservations/{reservationId}`, asegurando que ningún usuario pueda consultar o manipular archivos y datos ajenos.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **Apache 2.0**. Desarrollado para la promoción y auditoría técnica del turismo comunitario en las Ciudades Creativas de Nicaragua.
