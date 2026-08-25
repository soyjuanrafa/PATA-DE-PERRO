# Plantilla para crear una nueva Skill

Copia esta plantilla y personalízala para tu caso de uso.

## Plantilla del SKILL.md

```markdown
---
name: nombre-de-tu-skill
description: >-
  Descripción clara y específica de cuándo debe activarse esta habilidad.
  Ejemplo: "Usa esta habilidad cuando el usuario solicite [acción específica]
  en el contexto de [dominio o servicio]."
---

# [Título de la Habilidad]

Breve descripción de lo que hace esta habilidad.

## Cuándo Usar

- Cuando el usuario solicite [acción 1].
- Cuando se necesite [acción 2].

## Cuándo NO Usar

- Cuando [situación no aplicable 1].
- Cuando [situación no aplicable 2].

## Requisitos Previos

- [Requisito 1]
- [Requisito 2]

## Pasos

1.  **[Nombre del paso 1]**:
    Descripción detallada de lo que hacer.

2.  **[Nombre del paso 2]**:
    Descripción detallada de lo que hacer.

3.  **[Nombre del paso 3]**:
    Descripción detallada de lo que hacer.

## Verificación

- ✅ [Condición de éxito 1].
- ✅ [Condición de éxito 2].
```

## Plantilla de Estructura de Carpetas

```text
skills/nombre-de-tu-skill/
├── SKILL.md              # Obligatorio
├── scripts/              # Si necesitas scripts auxiliares
│   └── mi-script.sh
├── examples/             # Si necesitas ejemplos
│   └── ejemplo.md
├── resources/            # Si necesitas plantillas o activos
│   └── plantilla.json
└── references/           # Si necesitas documentación extensa
    └── guia-detallada.md
```

## Lista de Verificación

Antes de finalizar, asegúrate de:

- [ ] El archivo `SKILL.md` existe en la raíz de la carpeta.
- [ ] El frontmatter tiene los campos `name` y `description`.
- [ ] El `name` está en kebab-case y coincide con el nombre del directorio.
- [ ] La `description` es clara y específica.
- [ ] Todos los enlaces relativos apuntan a archivos existentes.
- [ ] El contenido no duplica conocimiento general del agente.
- [ ] Se incluye una sección de verificación.
