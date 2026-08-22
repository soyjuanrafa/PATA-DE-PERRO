# 🐾 Pata de Perro - Plataforma de Turismo Auténtico y Sostenible

> **Ciudades Creativas de Nicaragua** • Navegación en Realidad Aumentada (RA) • Reservas Directas y Comercio Comunitario.

![Pata de Perro Brand Logo](https://raw.githubusercontent.com/patadeperro/assets/main/banner.png)

---

## 📌 Visión General del Proyecto

**Pata de Perro** es una solución digital integral diseñada para promover el turismo auténtico, sostenible y comunitario en la Red de Ciudades Creativas de Nicaragua (León, Granada, Masaya, Matagalpa, Ometepe, Estelí, San Juan del Sur, entre otras).

La plataforma permite a los **Turistas** descubrir actividades auténticas (talleres de artesanía, senderismo volcánico, rutas del cacao y gastronomía ancestral), explorar destinos mediante un **Simulador de Navegación con Realidad Aumentada (RA)** y agendar experiencias directamente con **Anfitriones Locales** vía WhatsApp sin intermediarios abusivos.

---

## 🎨 Paleta de Colores Minimalista y Tipografía Moderna

Cumpliendo con los lineamientos de diseño de la marca:

- **Paleta de Colores Primaria**:
  - `Verde Naturaleza (#2E9D62)`: Representa la riqueza natural y el desarrollo sostenible.
  - `Naranja Atardecer (#FF5722)`: Refleja la calidez comunitaria, la cultura e intensidad folklórica.
  - `Fondo Neutro Cálido (#FAF6F0)`: Papel artesanal ligero, ofreciendo una experiencia visual de descanso.
  - `Texto Oscuro (#1E293B)`: Alto contraste para máxima legibilidad.
- **Estilo Tipográfico**:
  - `Plus Jakarta Sans`: Tipografía sans-serif limpia, legible e intuitiva para cuerpo de texto y controles UI.
  - `Outfit`: Display moderno sans-serif en fuentes de peso extra-bold para títulos y la identidad gráfica del logo.

---

## 📤 Cómo Subir el Proyecto a tu Propio Repositorio de GitHub

Si descargaste el código o deseas conectar este proyecto a tu propia cuenta de GitHub:

1. **Crea un nuevo repositorio vacío en GitHub** (sin README ni .gitignore inicial).
2. **Ejecuta los siguientes comandos en tu terminal:**

```bash
# 1. Enlazar tu repositorio remoto (reemplaza 'tu-usuario' y 'tu-repositorio')
git remote add origin https://github.com/tu-usuario/tu-repositorio.git

# 2. Asegurar que estás en la rama principal
git branch -M main

# 3. Subir todos los archivos y commits a GitHub
git push -u origin main
```

> **Nota para Exportación desde AI Studio**:
> Si utilizas el menú de configuración de Google AI Studio (**Export to GitHub** o **Download ZIP**), el proyecto ya contiene `.gitignore`, `package-lock.json`, configuraciones de TypeScript y el pipeline de CI/CD listo para ejecutarse sin errores.

---

## 🚀 Guía de Configuración e Instalación Local

Asegura la **portabilidad total** entre estaciones de trabajo mediante Node.js, Vite y Docker.

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
La aplicación estará disponible inmediatamente en `http://localhost:3000`.

---

## 🐳 Despliegue con Docker y CI/CD en la Nube

El proyecto incluye contenedores optimizados multi-etapa y pipelines de integración continua.

### Iniciar con Docker Compose
```bash
docker-compose up --build -d
```

### Pipeline de CI/CD (GitHub Actions)
Ubicado en `/.github/workflows/ci-cd.yml`, el pipeline ejecuta automáticamente:
1. Instalación limpia de dependencias (`npm ci`).
2. Validación tipográfica y de sintaxis (`npm run lint`).
3. Ejecución de la suite de pruebas unitarias automatizadas (`npm run test`).
4. Compilación del artefacto de producción (`npm run build`).
5. Construcción de la imagen Docker para despliegue en Cloud Run / GCP.

---

## 🗄️ Modelo Relacional Normalizado (3NF)

El motor de base de datos está diseñado bajo la Tercera Forma Normal (3NF) para garantizar la integridad referencial y evitar redundancias.

```
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

## 🧪 Pruebas Unitarias Automatizadas

El proyecto cuenta con una suite de pruebas accesible directamente desde la interfaz en la pestaña **"Pruebas"** o ejecutando los módulos de validación en `src/__tests__/unitTests.ts`:

- **Seguridad XSS**: Desinfección de fragmentos `<script>` con `sanitizeInput()`.
- **Validación de Correos**: Verificación de expresiones regulares para usuarios.
- **Geolocalización RA**: Algoritmo Haversine para cálculo de distancias en metros.
- **Motor de Reservas**: Verificación de totales y generación de tokens de confirmación `PDP-XXXXXX`.
- **Restauración de Respaldo**: Importación y exportación de snapshots de datos en JSON.

---

## ❓ Preguntas Frecuentes para Desarrolladores (FAQ)

### 1. ¿Cómo se gestionan las imágenes y modelos 3D de la Realidad Aumentada?
Los recursos 3D utilizan formato estándar `.gltf` / `.glb` almacenados en CDN y referenciados mediante el campo `recurso_ra_url` en la entidad `EXPERIENCIA`.

### 2. ¿Cómo mantengo la persistencia de datos si cambio de computadora?
Puedes usar el botón **Exportar Respaldo** en el encabezado de la app para descargar un snapshot completo de los datos en formato `.json`. Luego, puedes importarlo en tu nueva estación de trabajo.

### 3. ¿El mapa requiere una clave de API de Google Maps paga?
No. El componente del mapa de Ciudades Creativas utiliza renderizado de vector dinámico SVG y proyección de coordenadas WGS84, reduciendo costos de infraestructura y garantizando respuesta instantánea.

---

## 📄 Licencia

Licenciado bajo Apache 2.0. Desarrollado para la auditoría técnica de las Ciudades Creativas de Nicaragua.
