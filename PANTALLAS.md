# Mapa de pantallas — Repostería Mentor · Prototipo Hi-Fi

**Contrato de referencia para correcciones.** Cuando el usuario dice "en la S5 quítala",
esta tabla dice de qué pantalla habla. La numeración es **estable entre versiones**:
si en v4 se añade una pantalla, se agrega al final (S19, S20…); **nunca** se renumeran
las existentes. S1–S6 conservan el significado de la UI v1.

| S# | id (código) | Nombre | Qué contiene / propósito |
|----|-------------|--------|--------------------------|
| S1 | `onb-welcome` | Bienvenida | Pantalla inicial: ambos mentores, título de marca, botón "Empezar". |
| S2 | `onb-mentor` | Elige tu mentor | Elegir avatar (Sofi o Matt) — ambos guían igual, sin FOMO. Nombre renombrable. Paso 1 de 5. |
| S3 | `onb-back` | Bienvenido de nuevo | Demo de usuaria recurrente: saludo del mentor + "Entrar". |
| S4 | `costeo` | Costeo · Tres cajones | Costo de ingredientes + merma + mano de obra + empaque; cajones 1–3; costo total. |
| S5 | `precios` | Precios · Calculadora | Calculadora con margen: precio sugerido, slider de margen, ganancia. Anti-precio-bajo-costo. |
| S6 | `convertidor` | Convertidor de medidas | Tazas ↔ gramos funcional por ingrediente (harina, azúcar, mantequilla, leche, cacao). |
| S7 | `onb-hello` | Saludo del mentor | Tras elegir mentor: retrato fotográfico del elegido saludando (estilo v1, fondo cálido) + "Hola, soy {nombre}." (nombre dinámico: personalizado o Matt/Sofi) + mensaje v1. ES/EN. Va después de S2, antes del PIN. |
| S8 | `onb-pin` | Crear PIN | PIN de 4 dígitos + opción Face ID. Paso 2 de 5. |
| S9 | `onb-disclaimer` | Disclaimer de privacidad | Los datos viven en el teléfono; dos llaves de recuperación. Paso 3 de 5. |
| S10 | `onb-recovery` | Código de recuperación | 6 palabras para anotar/tomar pantallazo. Paso 4 de 5. |
| S11 | `onb-question` | Pregunta de respuesta secreta | Segunda llave: pregunta + respuesta secreta. Paso 5 de 5. |
| S12 | `home` | Inicio · Panel | Home-top v1 (mentor + Ajustes siempre visible), accesos rápidos, panel del negocio, checklist, temporada. |
| S13 | `recetas` | Recetas | Lista de recetas con costo/precio/margen, buscador y filtros. |
| S14 | `receta-detalle` | Detalle de receta | Hero, escalado A/B, sub-recetas, tabla de ingredientes y costo. |
| S15 | `colab` | Colaboraciones | Compartir recetas/costos con el equipo; roles; todo queda en el teléfono. |
| S16 | `tour` | Tour guiado | Tres gestos (tocar, deslizar, mantener) con dedito animado; respeta prefers-reduced-motion. |
| S17 | `ajustes` | Ajustes | Idioma, apariencia claro/oscuro, respaldo, tour; sello de versión "Mentor UI v3 (2026-09-27)". |
| S18 | `mas` | Más · Hub | Tarjetas Negocio, Clientes, Colaboraciones, Ingredientes, Imprimibles, Aprender, Ajustes — cada una con etiqueta Herramienta / Guía / Información. |

## Flujo de onboarding (orden vigente)
S1 → S2 → S7 → S8 → S9 → S10 → S11 → S12 (home)

## Notas
- El "Jump to: S1…S18" del chrome del prototipo se genera desde `SCREENS` en `app.js` (fuente única).
- Pantallas marcadas "Próximamente" (toast) en S18: Negocio, Clientes, Ingredientes, Imprimibles, Aprender — son placeholders etiquetados, no callejones.
- Versión del mapa: v3 (2026-09-27).
