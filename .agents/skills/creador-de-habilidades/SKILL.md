---
name: creador-de-habilidades
description: >-
  Guía experta para crear, estructurar y validar nuevas habilidades (skills)
  de Antigravity. Usa esta habilidad cuando el usuario solicite crear, generar,
  diseñar o configurar una nueva skill para su workspace o configuración global.
  También es útil cuando se necesite modificar o mejorar una skill existente.
---

# 🛠️ Creador de Habilidades para Antigravity

Esta habilidad te guía paso a paso para crear nuevas skills (habilidades)
de Antigravity que sean correctas, bien estructuradas y sigan las mejores
prácticas de la documentación oficial.

> **IMPORTANTE**: Todo el proceso de creación y las interacciones con el usuario
> deben realizarse en **español**.

--------------------------------------------------------------------------------

## 📋 Requisitos Previos

Antes de crear cualquier skill, confirma lo siguiente:

1.  **Ubicación**: Determina si la skill será:
    -   **De proyecto** (compartida con el equipo): se ubica en
        `.agents/skills/<nombre>/` en la raíz del workspace.
    -   **Global** (solo para esta máquina): se ubica en
        `~/.gemini/config/skills/<nombre>/`.
2.  **Nombre**: El nombre debe ser en **minúsculas y separado por guiones**
    (kebab-case). Ejemplo: `mi-habilidad-especial`.
3.  **Propósito claro**: Debes entender claramente **qué hace** la skill y
    **cuándo debe activarse**.

--------------------------------------------------------------------------------

## 📁 Estructura de Directorios

Toda skill debe seguir esta estructura de carpetas:

```text
skills/<nombre-de-la-skill>/
├── SKILL.md          # Obligatorio: Archivo principal con instrucciones y frontmatter YAML
├── scripts/          # Opcional: Scripts auxiliares y utilidades
├── examples/         # Opcional: Implementaciones de referencia
├── resources/        # Opcional: Plantillas, activos adicionales
└── references/       # Opcional: Documentación detallada adicional
```

### Reglas de la estructura

-   El archivo `SKILL.md` es **obligatorio** y debe estar en la raíz de la
    carpeta de la skill.
-   Las subcarpetas (`scripts/`, `examples/`, `resources/`, `references/`) son
    **opcionales** y solo deben crearse si se necesitan.
-   Usa **enlaces relativos** desde `SKILL.md` para referenciar archivos
    auxiliares (por ejemplo: `[mi-script.sh](./scripts/mi-script.sh)`).

--------------------------------------------------------------------------------

## 📝 Formato del Archivo SKILL.md

El archivo `SKILL.md` debe empezar **siempre** con un bloque de frontmatter
YAML seguido de las instrucciones en Markdown.

### Plantilla Base

```markdown
---
name: nombre-de-la-skill
description: >-
  Descripción clara de cuándo el agente debe usar esta skill. Escrita en
  tercera persona. Ejemplo: "Usa esta habilidad cuando el usuario pida
  ejecutar pruebas de integración del servicio XYZ."
---

# Título de la Habilidad

Descripción general de lo que hace esta habilidad.

## Requisitos Previos

Lista de lo que se necesita antes de ejecutar esta habilidad.

## Pasos

1.  Paso uno: descripción clara.
2.  Paso dos: descripción clara.
3.  Paso tres: descripción clara.

## Verificación

Instrucciones sobre cómo verificar que todo se completó correctamente.
```

### Campos del Frontmatter

| Campo           | Tipo   | Requerido | Descripción                                                                                       |
| :-------------- | :----- | :-------- | :------------------------------------------------------------------------------------------------ |
| **`name`**      | string | ✅ Sí     | Identificador único en kebab-case (minúsculas y guiones). Ejemplo: `mi-habilidad`.                |
| **`description`**| string | ✅ Sí     | Texto que el agente lee para decidir si activar la skill. Debe indicar **qué hace** y **cuándo usarla**. |

> [!CAUTION]
> El campo `description` es **crítico**. Si está mal escrito, el agente no
> sabrá cuándo activar la skill. Sé específico y claro.

--------------------------------------------------------------------------------

## 🔄 Flujo de Trabajo para Crear una Skill

Sigue estos pasos en orden:

### Paso 1: Recopilar Información

Pregunta al usuario (si no se ha proporcionado):

1.  **¿Cuál es el propósito de la skill?** — Qué problema resuelve o qué flujo
    de trabajo automatiza.
2.  **¿Cuándo debe activarse?** — En qué situaciones o con qué tipo de
    solicitudes del usuario.
3.  **¿Cuándo NO debe activarse?** — Casos en los que esta skill no aplica.
4.  **¿Necesita scripts auxiliares?** — Si requiere ejecutar comandos o scripts.
5.  **¿Dónde se ubica?** — ¿De proyecto (`.agents/skills/`) o global
    (`~/.gemini/config/skills/`)?
6.  **¿Necesita documentación de referencia adicional?** — Para el directorio
    `references/`.

### Paso 2: Crear la Estructura de Archivos

1.  Crea el directorio de la skill en la ubicación elegida.
2.  Crea el archivo `SKILL.md` con el frontmatter y las instrucciones.
3.  Si es necesario, crea las subcarpetas opcionales (`scripts/`, `examples/`,
    `resources/`, `references/`).

### Paso 3: Redactar el SKILL.md

Sigue estas directrices al escribir el contenido:

-   **Sé conciso en el archivo principal**: Mantén `SKILL.md` lo más breve
    posible. Usa `references/` para documentación extensa (divulgación
    progresiva).
-   **Instrucciones paso a paso**: Usa listas numeradas para los pasos que el
    agente debe seguir.
-   **Incluye verificación**: Siempre incluye una sección que explique cómo
    verificar que cada paso fue exitoso.
-   **No dupliques conocimiento**: No incluyas instrucciones sobre prácticas
    generales de programación que el agente ya conoce. Enfócate en lo
    específico de tu flujo de trabajo.
-   **Scripts ejecutables**: Encapsula secuencias de comandos complejas en
    scripts dentro de `scripts/` y enlázalos con rutas relativas.

### Paso 4: Validar la Skill

Después de crear la skill, verifica:

1.  **Estructura correcta**: El archivo `SKILL.md` existe en la raíz de la
    carpeta de la skill.
2.  **Frontmatter válido**: Contiene los campos `name` y `description` dentro
    del bloque `---`.
3.  **Nombre consistente**: El `name` del frontmatter coincide con el nombre
    del directorio.
4.  **Descripción clara**: La `description` indica claramente cuándo activar
    la skill.
5.  **Enlaces válidos**: Todos los enlaces relativos a scripts, ejemplos o
    referencias apuntan a archivos existentes.
6.  **Sin duplicación**: No repite instrucciones que el agente ya conoce de
    forma nativa.

### Paso 5: Confirmar al Usuario

Muestra al usuario un resumen de lo creado:

-   Ruta completa de la skill.
-   Contenido del `SKILL.md`.
-   Archivos auxiliares creados (si los hay).
-   Instrucciones de cómo será descubierta por el agente.

--------------------------------------------------------------------------------

## ✅ Mejores Prácticas

| Práctica                         | Descripción                                                                                                 |
| :------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **Divulgación progresiva**       | Mantén `SKILL.md` conciso. Usa `references/` para documentación voluminosa.                                 |
| **Scripts auxiliares**           | Usa `scripts/` para encapsular comandos complejos. Enlaza con rutas relativas.                               |
| **Pasos de verificación**        | Incluye siempre cómo verificar el éxito de cada paso.                                                       |
| **Sin duplicación**              | No instruyas al agente sobre cosas que ya sabe. Enfócate en lo único de tu flujo.                            |
| **Descripción precisa**         | La `description` del frontmatter debe ser tan específica que el agente sepa exactamente cuándo activar la skill. |
| **Idioma español**              | Tanto las instrucciones como las interacciones con el usuario deben ser en español.                          |

--------------------------------------------------------------------------------

## 📂 Ubicaciones de Descubrimiento

El agente descubre skills automáticamente en estas ubicaciones:

| Prioridad | Ubicación                            | Alcance                    |
| :-------- | :----------------------------------- | :------------------------- |
| 1 (Alta)  | `.agents/skills/` en el workspace    | Específica del proyecto    |
| 2         | Configuraciones declaradas en JSON   | Registradas explícitamente |
| 3         | `~/.gemini/config/skills/`           | Global (toda la máquina)   |
| 4 (Baja)  | Skills incorporadas de Antigravity   | Por defecto del sistema    |

> [!NOTE]
> Las skills de proyecto (`.agents/skills/`) tienen **mayor prioridad** que
> las globales. Si hay un conflicto de nombres, la de proyecto prevalece.

--------------------------------------------------------------------------------

## 🚫 Errores Comunes a Evitar

1.  **Olvidar el frontmatter YAML**: Sin los campos `name` y `description`,
    la skill no será reconocida.
2.  **Descripción vaga**: Escribir "Usa esta skill para cosas generales" no
    ayuda al agente a decidir cuándo activarla.
3.  **Archivo SKILL.md demasiado largo**: Satura el contexto del agente. Usa
    `references/` para el contenido extenso.
4.  **Enlaces rotos**: Verificar que todos los enlaces relativos apunten a
    archivos reales.
5.  **Nombre del directorio diferente al `name`**: Mantén consistencia entre
    el nombre del directorio y el campo `name` del frontmatter.
