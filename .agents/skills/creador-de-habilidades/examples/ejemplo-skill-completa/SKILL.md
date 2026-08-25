---
name: ejemplo-skill
description: >-
  Ejemplo de skill para demostración. Usa esta habilidad cuando el usuario
  necesite ver un ejemplo de cómo luce una skill bien construida.
---

# 📌 Ejemplo de Skill

Esta es una skill de ejemplo que demuestra la estructura correcta y las
mejores prácticas para crear habilidades en Antigravity.

## Requisitos Previos

- Node.js v18 o superior instalado.
- Acceso al repositorio del proyecto.

## Pasos

1.  **Preparar el entorno**:
    Ejecuta el script de preparación:
    [preparar.sh](./scripts/preparar.sh)

2.  **Ejecutar la tarea principal**:
    ```bash
    npm run mi-tarea
    ```

3.  **Revisar los resultados**:
    Verifica la salida en el archivo `output.log`.

## Verificación

- ✅ El script de preparación terminó sin errores (código de salida 0).
- ✅ El comando `npm run mi-tarea` muestra "Completado con éxito".
- ✅ El archivo `output.log` contiene los resultados esperados.

## Notas

> [!TIP]
> Si el paso 2 falla, verifica que las dependencias estén instaladas con
> `npm install`.
