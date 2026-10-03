# CHANGELOG — Repostería Mentor · Prototipo Hi-Fi

## Mentor UI v4 (2026-10-03) — Backup: pop-up recordatorio + frecuencia
- **Pop-up recordatorio de respaldo** (bilingüe, inglés por defecto): "momento" cálido estilo clay/dorado con motivo de **disquete** (SVG clay: cuerpo crema con highlight, shutter metálico, etiqueta dorada con llave, chispas; leve inclinación -8°), copy con voz de mentor. Botones: Respaldar ahora / Recordarme después (Back up now / Remind me later). Overlay con blur glassmorphism; cierra con overlay, Escape o botones.
- **Ajustes → nueva fila "Recordatorio de respaldo"** (badge v4): selector día/semana/mes/nunca (default: semana), persiste en `localStorage`; botón fantasma "Vista previa" abre el pop-up para revisarlo.
- JS mínimo de previsualización (abrir/cerrar, persistencia del selector, toast de confirmación). **Sin lógica real de programación del recordatorio** — queda para funcionalidad futura.
- Alcance: solo Ajustes + componente pop-up (todo aditivo). Ninguna otra pantalla tocada. Cero CDNs; claro/oscuro intactos; respeta `prefers-reduced-motion`.

## Mentor UI v4 (2026-10-03) — S3: arte welcome back del mentor
- S3 Bienvenido de nuevo (recurrente): reemplaza el avatar+texto viejo por el **arte welcome back a sangre** del mentor elegido. 4 variantes: `img/welcome-back-{sofi,matt}-{en,es}.jpg`.
- Sofi EN/ES: finales enviadas por Diego esta noche (1284×2935), integradas como están.
- Matt EN: `files/prototipo-mentor-hifi/img/mentor-matt-welcomeback.jpg` (sin gafas, verificado visualmente) — 1008×2304.
- Matt EN/ES: **regenerados esta noche y aprobados por Diego** — sin gafas (Matt no usa gafas), cara ajustada a la referencia oficial del personaje. La versión con gafas quedó rechazada y eliminada. Fallback Matt+ES→EN removido de `renderBack()`.
- La variante se elige sola según mentor (S2) + idioma actual (patrón `renderBack()`, como `renderHello()` en S7); al cambiar idioma con S3 visible se re-renderiza. Toque/tecla en el arte → S12 (home).
- Nuevas claves i18n ES/EN: `onb.back.alt`, `onb.back.aria` (paridad 295/295, 0 faltantes). Etiqueta visible "Mentor UI v4 (2026-10-03)".
- Alcance: solo S3 (+ CSS/JS/i18n aditivos). Ninguna otra pantalla tocada. Cero CDNs; claro/oscuro intactos.

## Mentor UI v4 (2026-10-03) — S9–S11: ronda de diseño
- S9 Disclaimer: la caja pasa a "momento bóveda" — chips visuales de las dos llaves (código de recuperación + pregunta de respuesta secreta) con ícono propio `#i-key` (nuevo símbolo en el sprite, dorado); el aviso final ahora es un callout de advertencia (warn-soft + borde ámbar). Copy intacto, ES/EN.
- S10 Código de recuperación: las 6 palabras ahora viven en una "vault card" dorada con encabezado "Guárdalo como oro" / "Guard it like gold" (nueva clave `onb.rec.vault` ES/EN).
- S11 Pregunta secreta: sin cambios estructurales; solo etiqueta de versión.
- Las tres pantallas llevan etiqueta visible "Mentor UI v4 (2026-10-03)". Navegación S8→S9→S10→S11→S12 sin cambios.
- Alcance: solo se tocó S9–S11 (+ estilos e i18n aditivos). S1–S8 y S12+ intactos. Cero CDNs; claro/oscuro intactos.

## 2026-09-27 — S7: saludo del mentor (corrección de flujo)
- El saludo del mentor pasa a ser **S7** (antes S19 provisional): el prototipo abre en S1 y el flujo queda **S1 → S2 → S7 → S8**. El "Jump to" muestra S7 como el saludo.
- Se elimina la pantalla explicativa genérica (`onb-app`, "Qué es la app"): S7 ya no es esa pantalla, por decisión del usuario.
- S7 estilo UI v1: retrato fotográfico cuadrado del mentor elegido saludando (Sofi/Matt generados por el usuario, fondo cálido tipo cortina, sin texto quemado) + título dinámico "Hola, soy {nombre}." / "Hi, I'm {name}." + mensaje de la v1 (ES/EN).
- Matt v2: retrato más masculino (el v1 parecía tener senos en el recorte), corrección pedida por el usuario.
- Nueva pantalla S19 (`onb-hello`) tras elegir mentor: foto del mentor elegido en tarjeta cálida + título dinámico "Hola, soy {nombre}." / "Hi, I'm {name}." (nombre personalizado o Matt/Sofi por defecto) + mensaje de la v1 (ES/EN).
- El nombre es texto vivo (plantilla), no imagen: funciona con cualquier nombre ("Doña María", "Marcus") sin generar assets nuevos.
- Copy ES con "tu guía" (neutro en género) en vez de "tu mentor".
- Flujo: S2 → S19 → S8 (PIN). CTA "Continuar".
- Fix S2: recorte del transparente lateral de los PNG (Sofi 764x1266, Matt 578x1262) para que ambos quepan lado a lado sin desbordar (Matt salía cortado a la derecha).

## Mentor UI v3 (2026-09-27)
- S1 a sangre (revisión con el usuario): hero full-bleed hasta el borde superior con fundido inferior integrado (receta v1), mentores completos visibles; chip de idioma "Español | English" arriba-derecha sobre zona limpia; solo wordmark "mentor" + un botón Empezar.
- Orden de onboarding corregido: Bienvenida (S1) → Qué es la app → Elige tu mentor → PIN → Disclaimer → Código de recuperación → Pregunta de respuesta secreta.
- Elegir mentor = solo avatar, sin FOMO: se quitó el copy diferenciador; Sofi y Matt guían igual, solo cambia quién te acompaña.
- Pantalla explicativa con el texto canónico de la UI v1 (avatar-neutral; se mantiene "deliciosos" — "ricos" queda pendiente de curaduría con Nati).
- Hub "Más": Colaboraciones incluida + etiquetas visibles Herramienta / Guía / Información en cada tarjeta.
- Etiqueta de versión visible en Ajustes: "Mentor UI v3 (2026-09-27)".

## Mentor UI v2 (2026-09-27)
- Piel de la UI v1: paleta crema/terracota/ciruela, clay equilibrado, iconos de línea propios.
- Mentores 3D originales (Sofi/Matt), home-top con Ajustes siempre visible y accesos rápidos.
- Convertidor tazas→gramos funcional, Colaboraciones, tour guiado con dedito animado (respeta prefers-reduced-motion), Ajustes reales.
- 17 pantallas, ES/EN (271 claves por locale), claro/oscuro, cero CDN.

## Mentor UI v1 (2026-09-21)
- Primer mockup navegable: welcome, elegir mentor, home, recetas, costeo, precios.
- 12 pantallas, ES/EN, claro/oscuro, onboarding con PIN.

## v3 (2026-09-27) — S2 elige tu mentor (revisión en preview)
- Layout compacto sin scroll: mentores lado a lado (Sofi izq., Matt der.) con fotos solo nuevas (`img/mentor-sofi-solo.jpg`, `img/mentor-matt-solo.jpg`) en avatar circular.
- Copy neutral: lede "El mismo mentor, la misma guía — solo cambia quién te acompaña." (sin personalidades).
- CTA "Empezar" deshabilitado (40% opacidad) hasta elegir mentor; al elegir se activa y el otro mentor se atenúa.
- Campo "Ponle el nombre que quieras" + disclaimer "Podrás cambiar de mentor en Ajustes" (nueva clave `onb.w.change` ES/EN).
- Placeholder EN: "E.g.: Mrs. Rosa".

## 2026-09-27 — S2: PNG sin fondo
- S2 usa img/mentor-sofi-solo.png y img/mentor-matt-solo.png (fondo removido con rembg/u2netp).
- Nuevas poses archivadas: mentor-*-calc.png (con calculadora, fondo removido) para pantallas de costeo.
- Preview: commit 9f25c47 en 2pixels-store/preview-mentor-v3.

## 2026-09-27 — S2: mentores de cuerpo entero
- S2 ahora muestra los PNG de cuerpo entero sin fondo lado a lado (Sofi izq saludando, Matt der brazos cruzados), 162px de alto, con halo terracota suave detrás.
- Selección: anillo/borde terracota + wash + halo intensificado en el elegido; el otro se atenúa; Continuar deshabilitado hasta elegir.
- Se mantiene compacto sin scroll: campo "Ponle el nombre que quieras", disclaimer y Continuar visibles en una pantalla.
- Preview: commit 95cdbbc en 2pixels-store/preview-mentor-v3.

## 2026-09-27 — S2: mentores más grandes + título ronda 2
- Figuras de cuerpo entero de 162px → 210px (halo 124 → 152px). Presupuesto vertical estimado ~615px: sigue sin scroll.
- Título vuelve al de ronda 2: EN "Who do you want in your corner?" / ES "¿A quién quieres en tu esquina?" (clave onb.w.title).
- Preview: commit e167780 en 2pixels-store/preview-mentor-v3.
