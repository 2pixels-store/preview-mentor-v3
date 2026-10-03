# Mapa de pantallas — Repostería Mentor · Prototipo Hi-Fi

**Contrato de referencia para correcciones.** Cuando el usuario dice "en la S5 quítala",
esta tabla dice de qué pantalla habla. La numeración es **estable entre versiones**:
si en v4 se añade una pantalla, se agrega al final (S19, S20…); **nunca** se renumeran
las existentes. S1–S6 conservan el significado de la UI v1.

| S# | id (código) | Nombre | Qué contiene / propósito |
|----|-------------|--------|--------------------------|
| **Configuración inicial** (primera vez que se abre la app) | | | |
| S1 | `onb-welcome` | Bienvenida | Pantalla inicial: ambos mentores, título de marca, botón "Empezar". |
| S2 | `onb-mentor` | Elige tu mentor | Elegir avatar (Sofi o Matt) — ambos guían igual, sin FOMO. Nombre renombrable. Paso 1 de 5. |
| S3 | `onb-back` | Bienvenido de nuevo | **Regreso** (segunda vez en adelante): arte welcome back a sangre del mentor elegido (Sofi/Matt × EN/ES, variante automática) — toque → S12. |
| **La app** | | | |
| S4 | `costeo` | Costeo · Tres cajones | Costo de ingredientes + merma + mano de obra + empaque; cajones 1–3; costo total. |
| S5 | `precios` | Precios · Calculadora | Calculadora con margen: precio sugerido, slider de margen, ganancia. Anti-precio-bajo-costo. |
| S6 | `convertidor` | Convertidor de medidas | Tazas ↔ gramos funcional por ingrediente (harina, azúcar, mantequilla, leche, cacao). |
| S7 | `onb-hello` | Saludo del mentor | Tras elegir mentor: retrato fotográfico del elegido saludando (estilo v1, fondo cálido) + "Hola, soy {nombre}." (nombre dinámico: personalizado o Matt/Sofi) + mensaje v1. ES/EN. Va después de S2, antes del PIN. |
| S8 | `onb-pin` | PIN (opcional) | Pregunta "¿Proteger con PIN?": Crear PIN → teclado → S9 · Omitir → S12 directo. Paso 2 de 5. |
| S9 | `onb-disclaimer` | Disclaimer de privacidad | Los datos viven en el teléfono; dos llaves de recuperación. Paso 3 de 5. |
| S10 | `onb-recovery` | Código de recuperación | 6 palabras para anotar/tomar pantallazo. Paso 4 de 5. |
| S11 | `onb-question` | Pregunta de respuesta secreta | Segunda llave: pregunta + respuesta secreta. Paso 5 de 5. |
| S12 | `home` | Inicio · Panel | Home-top v1 (mentor + Ajustes siempre visible), accesos rápidos, panel del negocio, checklist, temporada. |
| S13 | `recetas` | Recetas | Lista de recetas con costo/precio/margen, buscador y filtros. |
| S14 | `receta-detalle` | Detalle de receta | Hero, escalado A/B, sub-recetas, tabla de ingredientes y costo. |
| S15 | `colab` | Colaboraciones | Compartir recetas/costos con el equipo; roles; todo queda en el teléfono. |
| S16 | `tour` | Tour guiado | Tres gestos (tocar, deslizar, mantener) con dedito animado; respeta prefers-reduced-motion. |
| S17 | `ajustes` | Ajustes | Idioma, apariencia claro/oscuro, accesibilidad (tamaño del texto: Normal/Grande/Extra grande), respaldo + recordatorio (frecuencia día/semana/mes/nunca con vista previa del pop-up), tour; sello de versión "Mentor UI v4 (2026-10-03)". |
| S18 | `mas` | Más · Hub | Tarjetas Negocio, Clientes, Colaboraciones (equipo), Canjes, Ingredientes, Imprimibles, Aprender, Ajustes — cada una con etiqueta Herramienta / Guía / Información. |
| S19 | `clientes` | Clientes · Lista | Lista de clientas: avatar de inicial, última compra y total gastado; buscador; botón + Nueva. Se entra desde el hub (S18). |
| S20 | `cliente-detalle` | Ficha de cliente | Encabezado con nombre; resumen total comprado + nº de pedidos (semilla de lifetime value); datos: contacto, alergias, preferencias, cumpleaños; historial de pedidos ordenado por fecha. |
| S21 | `canjes` | Canjes · Lista | Canjes con influencers y proveedores: tarjeta por trato (aliado, tipo, qué doy / qué recibo, fecha límite, estado pendiente · cumplido · vencido), buscador, + Nuevo. Se entra desde el hub (S18). NUEVA — distinta de S15 `colab` (equipo). |
| S22 | `canje-detalle` | Nuevo canje | Formulario: aliado, tipo (influencer/proveedor), qué doy, qué recibo, fecha límite, notas. Estático (Guardar → ronda 2). |
| S23 | `ingredientes` | Ingredientes · Catálogo | Lista de insumos con buscador: precio de compra + unidad, costo unitario automático (ej. $0.70/kg) y semáforo de stock (En stock verde · Bajo ámbar · Agotado rojo); botón + Nuevo; tarjeta final enlaza a S25. Se entra desde el hub (S18). |
| S24 | `ingrediente-detalle` | Ficha de ingrediente | Detalle del insumo (ronda estática: todos abren a Harina): costo unitario destacado + stock en hero; compra (presentación, proveedor actual); comparativa simple de 2 proveedores; mini-histórico de precios con barras (3 puntos + nota “subió 9%”); equivalencias/sustitutos con delta de costo; stock con punto de reorden. |
| S25 | `lista-compras` | Lista de compras | Insumos sumados de los pedidos de la semana, agrupados (Secos · Lácteos y huevos · Otros) con checkboxes visuales (1 marcado de ejemplo). Se entra desde tarjeta al final de S23. |

## Flujos vigentes
- **Primera vez:** S1 → S2 → S7 → S8 (¿proteger con PIN?) → con PIN: S9 → S10 → S11 → S12 · sin PIN (omitir): S12 directo.
- **Regreso:** S3 → S12 (home).

## Notas
- El "Jump to: S1…S18" del chrome del prototipo se genera desde `SCREENS` en `app.js` (fuente única).
- Pantallas marcadas "Próximamente" (toast) en S18: Negocio, Imprimibles, Aprender — son placeholders etiquetados, no callejones. (Clientes dejó de ser placeholder en v4: S19/S20.)
- Versión del mapa: v4 (2026-10-03) + S23/S24/S25.
