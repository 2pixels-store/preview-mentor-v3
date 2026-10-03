# CHANGELOG — Repostería Mentor · Prototipo Hi-Fi

## Mentor UI v4 (2026-10-03) — S23/S24/S25: sección Ingredientes (idea de Diego)
- S23 Ingredientes (catálogo): 7 insumos (harina, azúcar, mantequilla, huevos, leche, vainilla, chocolate) con precio de compra + unidad, costo unitario automático ($/kg, $/100 g, $/u, $/L, $/100 ml) y semáforo de stock (En stock verde · Bajo ámbar · Agotado rojo); buscador; botón "+ Nuevo" (toast); tarjeta final "Lista de compras" → S25. Se entra desde el hub (S18) — la tarjeta Ingredientes ya no dice "Próximamente".
- S24 Ficha de ingrediente: hero con costo unitario destacado + stock; compra (presentación, proveedor actual); comparativa de 2 proveedores (mejor precio marcado); mini-histórico de precios con barras (ago/sep/oct 2026 + aviso ámbar "Subió 9% en 2 meses"); equivalencias/sustitutos con delta de costo; stock con punto de reorden. Ronda estática: todos los insumos abren a Harina (precedente S20/Doña Rosa).
- S25 Lista de compras: insumos de los pedidos de la semana agrupados (Secos · Lácteos y huevos · Otros) con checkboxes visuales (1 marcado de ejemplo).
- i18n ES/EN completo (inglés por defecto), paridad 73/73 en claves nuevas. Etiqueta visible "Mentor UI v4 (2026-10-03)". `SCREENS` en app.js extendido a S25 (fuente única del jump-row).
- Alcance: solo S23/S24/S25 (+ CSS/i18n/JS aditivos: `.hist-row`, `.hist-bar`, `.hist-note`). Ninguna otra pantalla tocada. Cero CDNs; claro/oscuro intactos.

## Mentor UI v4 (2026-10-03) — S21/S22: sección Canjes (idea nueva de Diego)
- S21 Canjes (lista): tarjeta por trato con aliado, tipo (influencer/proveedor/negocio local), "Yo doy / Recibo", fecha límite y píldora de estado (Pendiente ámbar · Cumplido verde · Vencido rojo); buscador; botón "+ Nuevo". Se entra desde el hub (S18) con tarjeta nueva "Canjes".
- S22 Nuevo canje: formulario (aliado, tipo con selector, qué doy, qué recibo, fecha límite, notas; Guardar → ronda 2). Ronda de diseño estática.
- Datos de ejemplo ficticios: 3 tratos de repostería (@dulcesdemaria·influencer pendiente, Don Pedro·Harinas El Trigal·proveedor cumplido, Café La Esquina·negocio local vencido).
- NUEVA y distinta de S15 `colab` (equipo): canjes = trueques con influencers/proveedores, no roles de equipo.
- i18n ES/EN completo (inglés por defecto), paridad 376/376. Etiqueta visible "Mentor UI v4 (2026-10-03)".
- Alcance: solo S21/S22 (+ CSS/i18n/JS aditivos: `.status-pill`, `.deal-lines`, `segPick()`). Ninguna otra pantalla tocada. Cero CDNs; claro/oscuro intactos.

## Mentor UI v4 (2026-10-03) — S19/S20: sección Clientes
- S19 Clientes (lista): tarjetas con avatar de inicial, última compra y total gastado; buscador; botón "+ Nueva" (toast). Se entra desde el hub (S18) — la tarjeta Clientes ya no dice "Próximamente".
- S20 Ficha de cliente: encabezado con nombre; resumen "Total comprado + nº de pedidos" (semilla de lifetime value, solo números, sin proyecciones); datos: contacto, alergias (aviso ámbar), preferencias, cumpleaños; historial de pedidos ordenado por fecha.
- Datos de ejemplo ficticios: 3 clientas de repostería (Doña Rosa, María Fernanda, Lucía). Ronda de diseño estática: el detalle muestra a Doña Rosa (precedente receta-detalle); la selección dinámica por clienta viene en la ronda funcional.
- i18n ES/EN completo (inglés por defecto), paridad 337/337. Etiqueta visible "Mentor UI v4 (2026-10-03)".
- Alcance: solo S19/S20 (+ CSS/i18n aditivos). Ninguna otra pantalla tocada. Cero CDNs; claro/oscuro intactos.

## Mentor UI v4 (2026-10-03) — Backup: pop-up recordatorio + frecuencia
- **Pop-up recordatorio de respaldo** (bilingüe, inglés por defecto): "momento" cálido estilo clay/dorado con motivo de **disquete** (SVG clay: cuerpo crema con highlight, shutter metálico, etiqueta dorada con llave, chispas; leve inclinación -8°), copy con voz de mentor. Botones: Respaldar ahora / Recordarme después (Back up now / Remind me later). Overlay con blur glassmorphism; cierra con overlay, Escape o botones.
- **Ajustes → nueva fila "Recordatorio de respaldo"** (badge v4): selector día/semana/mes/nunca (default: semana), persiste en `localStorage`; botón fantasma "Vista previa" abre el pop-up para revisarlo.
- JS mínimo de previsualización (abrir/cerrar, persistencia del selector, toast de confirmación). **Sin lógica real de programación del recordatorio** — queda para funcionalidad futura.
- Línea de privacidad/offline pedida por Diego dentro del pop-up (con ícono shield): "Tus recetas, clientes y costos viven en tu teléfono — el backup es tu red de seguridad." / "Your recipes, clients and costs live on your phone — backup is your safety net." Con esto queda cubierto el disclaimer, sin pantalla separada.
- Alcance: solo Ajustes + componente pop-up (todo aditivo). Ninguna otra pantalla tocada. Cero CDNs; claro/oscuro intactos; respeta `prefers-reduced-motion`.
## Mentor UI v4 (2026-10-03) — Accesibilidad: tamaño del texto
- Ajustes → nueva sección "Accesibilidad": selector "Tamaño del texto" (Normal / Grande / Extra grande), bilingüe ES/EN, inglés por defecto.
- Toda la tipografía migrada de px a rem (37 reglas en styles.css + 3 inline en index.html + tokens --t-*); la escala vive en `html[data-textsize]` (Normal 16px · Grande 19px · XL 22px). Layouts flex/scroll se adaptan sin romperse; el toast puede envolverse en XL.
- El selector aplica en vivo en el preview (demo funcional) para validar cada tamaño.
- Alcance: tokens.css, styles.css, index.html (solo Ajustes), app.js, i18n.js (6 claves nuevas ES/EN). Tipografía del sibling (Clientes/backup) también migrada a rem para que la escala aplique en todo. Ninguna otra pantalla tocada. Cero CDNs; claro/oscuro intactos.

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
