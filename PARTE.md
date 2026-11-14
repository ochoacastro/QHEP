# Parte de trabajo — Mi Pradera

Actualizado: 14 de noviembre de 2026 · Rama de trabajo: `claude/page-review-improve-hshx7j`

Este archivo resume en qué va la página, lo que falta y cómo seguir trabajando. Sirve para retomar el trabajo en otra sesión sin perder el hilo.

---

## 1. Estado actual

- **Reglas de Firestore:** la versión del repositorio es **v51** (`tests/reglas/firestore.rules`) y la dueña ya la publicó en Firebase (14 de noviembre de 2026).
- **Pruebas:** 123 pruebas de la página (`tests/pagina/pruebas.cjs`) y 17 archivos de pruebas de reglas (v24 a v51). Todas pasan.
- **PR abierto:** ninguno. El último fusionado es el **#144** (v410 a v412); antes, el **#143** (skills y v409). Todo hasta la v412 está en `main`. En la rama solo quedan cambios de este parte, sin PR.
- **Administrador:** la cuenta se ve en Firebase → Authentication. Su UID es `KUowZZ25CePVc9IXGmhCLVbbSIB3`. Ese UID está en la página, en las reglas y en el worker de Cloudflare (`worker_v12_INSTALAR.js`, línea 50). Ese archivo no está en el repositorio: lo guarda la dueña.

---

## 2. Lo que se hizo en esta etapa (v392 a v412)

| Versión | Qué cambió | PR |
|---|---|---|
| v392 | Íconos de categorías y de pagos pasan a archivos en `img/` (la página pesa menos) | #133 |
| v393 | Carga rápida: el primer dibujo baja de 3,0 s a 0,6 s en celular lento | #135 |
| v394–v395 | El código plus del negocio solo lo pone el administrador; el dueño ve el mapa de Google Maps y responde si su negocio está bien ubicado | #134 |
| v396 | Arriendos y ventas piden la dirección del inmueble, con mapa y la misma pregunta; los «Inmuebles por ubicar» llegan al administrador | #135 |
| v397 | La entrada del administrador dice el motivo real del error y tiene «Olvidé mi clave» | #136 |
| v398 | Nuevo UID del administrador (la cuenta se volvió a crear); se pide verificar el correo | #137 |
| v399 | Borradores: si un formulario se cierra sin guardar, se puede retomar con «Continuar» | #138 |
| v400 | Enter no inicia sesión (hay que tocar el botón); sin sesión no hay campana; «Escríbenos» más visible | #138 |
| v401 | Horario de la tienda solo por día, con listas de horas iguales en celular y computadora, y «Aplicar este horario a los días marcados» | #138 |
| v402 | La pregunta «¿Google Maps muestra bien…?» usa botones Sí/No en el negocio y en el inmueble | #138 |
| v403 | Se quita la portada de la tienda; nueva sección **«Conoce el lugar»**: gratis 3 fotos, con el rol Comerciante 10 fotos y un video de YouTube; reglas **v50** | #139 |
| v404 | Se quita la tarjeta digital; el botón es «Copiar enlace»; los enlaces y QR viejos abren la tienda | #139 |
| v405 | Los botones de WhatsApp y SOS solo aparecen en la página principal | #140 |
| v407 | «Publicar» de la barra de abajo abre directo el formulario de clasificado | #141 |
| v408 | En Clasificados, las categorías van dentro de un botón «Ver categorías» que se abre y se cierra | #142 |
| v409 | El anuncio de un inmueble muestra al visitante «Ubicación»: el mapa de Google Maps de su dirección y «Abrir en Google Maps» | #143 |
| v410 | Nuevo medio de pago **Sistecrédito** (con su logo) en la tienda y en los pedidos; reglas **v51** | #144 |
| v411 | Se quita la pausa de la tienda (v310). En su lugar, **letrero Abierto / Cerrado** que el dueño pone a mano, con nota opcional; el de cerrado manda sobre el horario | #144 |
| v412 | Al salir de un formulario con cambios se pregunta «Guardar cambios», «No guardar» o «Seguir editando»; un toque afuera no cierra los formularios; «Continuar» (v399) queda solo para emergencias | #144 |

---

## 3. Lo que tiene que hacer la dueña (fuera del código)

1. **Mirar en la página real el mapa del inmueble (v409):** abrir un arriendo o una venta que tenga dirección y confirmar que «Ubicación» muestra el mapa en el lugar correcto. En las pruebas Google Maps no carga, así que el mapa dibujado no se ha visto.
2. **Instalar `worker_v12_INSTALAR.js` en Cloudflare**, si aún no está: el archivo ya trae el UID nuevo del administrador en la línea 50 (revisado el 14 de noviembre de 2026), pero falta confirmar que esa versión sea la que está publicada en Cloudflare. Sin esto no llegan los avisos de pagos de roles.
3. **Volver a poner la llave Bre-B y el número de Nequi** en el panel, pestaña Pagos. Estaban guardados con el UID anterior.
4. **Pendientes de antes:**
   - registrar la llave de App Check en Firebase y, cuando las métricas estén bien, tocar «Aplicar»;
   - agregar el secreto `FB_SA` en GitHub;
   - el ID de cliente de Google One Tap;
   - configurar WhatsApp Business.
5. **Seguridad (recomendado, ver la sección 7):** activar la verificación en dos pasos en la cuenta de administrador de Firebase/Google, en GitHub y en Cloudflare.

Ya hecho: las reglas v51 están publicadas en Firebase (14 de noviembre de 2026).

---

## 4. Problema abierto: roles que salen «Sin activar»

**Síntoma:** en la cuenta `contacto@mipradera.com.co`, «Mis códigos» muestra **Comerciante · Varios negocios** y **Redactor de noticias** vigentes hasta noviembre de 2027. Pero «Publicar» y «Activar un rol» dicen **«Sin activar»** en todos los roles.

**Causa probable:**
- «Mis códigos» lee los códigos usados (colección `codes`).
- Los roles, en cambio, salen de la ficha de la cuenta (`plans/<llave>.acc`).
- Si la ficha se borró y la página la volvió a crear, queda sin roles: las reglas no dejan crearla con roles, y la cuenta no puede recuperarlos sola, porque solo se guardan al usar un código nuevo.

**Arreglo preparado, sin probar ni publicar:** `pendiente/v406-recuperar-roles.js`. En el panel de administrador, en **Usuarios**, muestra «Roles por recuperar» y un botón que devuelve a cada ficha el fin de cada rol según sus códigos vigentes. Solo sube fechas, nunca las baja.

**Para activarlo:**
1. Copiar `pendiente/v406-recuperar-roles.js` a `src/codigo/`.
2. Agregarlo a `src/orden.json` después de `codigo/v403-conoce-el-lugar.js`.
3. En `src/codigo/principal/11-profilemodal.js`, en la pestaña `usr`, agregar al inicio de `body=`: `(typeof admRolesFix==='function'?admRolesFix():'')+`.
4. Armar la página, probarla con datos de prueba (una ficha sin `acc` y códigos usados con `usedBy` igual a esa ficha) y publicar.

**Mientras tanto:** la dueña puede revisar la tarjeta de esa cuenta en el panel (Usuarios) para confirmar que la ficha no tiene roles.

---

## 5. Decisiones abiertas e ideas que no se hicieron

**Decisiones de los cambios de esta etapa que la dueña puede cambiar:**
- **Letrero de cerrado (v411):**
  - no se quita solo; se queda hasta que el dueño ponga «Abierto»;
  - el cliente sigue viendo los productos y puede hacer pedidos (la pausa anterior los bloqueaba). Se ofreció bloquear los pedidos con el letrero de cerrado; falta que la dueña decida.
- **Preguntar al salir (v412):**
  - cubre tienda nueva, editar tienda, anuncio, servicio, producto, editar producto y registro. «Mis direcciones» y «Mis datos» todavía se cierran sin preguntar;
  - el botón «atrás» del teléfono no hace la pregunta: lo escrito queda en el borrador y aparece «Continuar»;
  - el toque afuera no cierra esos formularios; las demás ventanas sí se cierran al tocar afuera (la dueña lo pidió así).
- **Mapa del inmueble (v409):** si el dueño respondió «No lo ubica bien» y el administrador aún no puso el código plus, el mapa no se muestra.

**Ideas ofrecidas que no se hicieron:**
- **Generador del modo oscuro (v219):** tiene un error (`\bwhite\b` toca nombres de variables). Arreglarlo cambia algunos colores; falta que la dueña decida.
- **Carga diferida de funciones poco usadas** (opción B de velocidad). No se hizo.
- **Stash viejo:** `stash@{0}` («opcion C … en pausa») ya está publicado como v393 y se puede borrar.
- **Skills que se recomendaron y no se instalaron:** `firebase-security-rules-auditor` y `firestore-rules-creation` (de `firebase/agent-skills`) y `workers-best-practices` (de `cloudflare/skills`). Sirven para auditar las reglas y el worker.
- **Guardar el worker en el repositorio** (`tools/`, que GitHub Pages no publica). No se hizo: falta saber si la dueña lo dejó fuera a propósito.
- **Pasar a Cloudflare Pages** para poder tener el repositorio privado sin pagar (ver la sección 7).

---

## 6. Cómo trabajar en el repositorio

- **El código vive en `src/`.** `index.html` se arma con `node tools/armar.mjs`, en el orden de `src/orden.json`. No hay que editar `index.html` a mano.
  - Revisar que coincidan: `node tools/armar.mjs --revisar` (lo hace también la CI).
- **Pruebas de la página:** `node tests/pagina/pruebas.cjs`, o el nombre de una prueba para correr solo esa. Usan un Firebase falso (`tests/pagina/firebase-falso.js`).
- **Pruebas de reglas (emulador):** desde `tests/`, correr `npx firebase-tools@13 emulators:exec --only firestore --project demo-mipradera --config reglas/firebase.json "node reglas/correr.mjs"`.
- **Comparación visual:**
  - capturar: `node tests/visual/capturar.cjs <carpeta>`;
  - comparar: `node tests/visual/comparar.cjs <antes> <después>`.

  Toma unos 30 minutos para las 50 pantallas. La pantalla «Mi cuenta» varía sola entre capturas.
- **Patrón de ampliaciones (v389):** la función original se llama `X0`. `X` llama a `window.XExt` si existe y, si no, a `X0`. Los avisos (`toast`) pasan por `window.toastHooks`.
- **Cada cambio nuevo va en su propio archivo** `src/codigo/vNNN-nombre.js`, con un comentario arriba que diga qué hace y cómo quitarlo.
- **Al publicar:** commit con el pie de coautoría, push a la rama y un PR que la dueña fusiona. Si el PR anterior ya está fusionado, antes de seguir hay que poner la rama al día con `main`.
- **Notas para las pruebas:**
  - a una cuenta de prueba sin dirección se le abre sola «Tu dirección principal» cada 2,5 segundos cuando no hay otra ventana abierta (v322). Si una prueba cierra ventanas y luego revisa la pantalla, puede fallar a ratos; la prueba `borradores` lo evita agregando un elemento oculto con la clase `qtour`;
  - Google Maps no carga en el entorno de pruebas: se comprueba la dirección que se le pide al mapa, no el dibujo.
- **Skills instaladas** en `.claude/skills/` (se cargan solas en las sesiones nuevas):
  - `find-skills`: buscar e instalar otras skills. Su buscador usa `skills.sh`, que la red de las sesiones en la nube bloquea; se puede listar un repositorio conocido con `npx skills add <dueño/repositorio> --list`;
  - `systematic-debugging`: método para buscar la causa de un error antes de arreglarlo;
  - `frontend-design` y `web-design-guidelines`: guía de diseño y revisión de la interfaz. Las preferencias de la dueña mandan sobre lo que digan.
  - Para instalar otra: `npx skills add <dueño/repositorio> --skill <nombre> --agent claude-code -y`, leerla completa antes de hacer commit, y dejar `skills-lock.json` fuera de GitHub Pages (ya está en `_config.yml`).
  - No instalar `design-mobile-apps`: es un conector al servicio de pago sleek.design, pensado para React Native.
- **Preferencias de la dueña:**
  - respuestas en español, con las líneas cambiadas y capturas;
  - diseño cuadrado y modo oscuro;
  - sin emojis en la página, solo íconos de línea;
  - cambios mínimos y exactos;
  - nunca compartir claves en el chat;
  - las reglas de Firestore se le entregan para que ella las publique.

---

## 7. Seguridad y repositorio público

**Revisión del 14 de noviembre de 2026:** se revisó el historial completo (675 cambios desde el 23 de octubre de 2026, 869 versiones de archivos) y **no hay claves secretas en ninguna versión**.

- **Lo que aparece y es público por diseño:** la clave de Firebase de la página y cuatro llaves de sitio de reCAPTCHA (dos ya no se usan).
- **Lo único personal:** dos correos personales de Gmail en versiones antiguas de `eliminar-datos.html` y de este parte. Hoy no están en ningún archivo. Quitarlos del historial exigiría reescribirlo entero; no se recomienda.
- **Dónde viven los secretos:** en Cloudflare (Telegram, Resend, copias de seguridad) y en los secretos de GitHub (`FB_SA`). Nunca en el repositorio ni en el chat.
- **Límites de la revisión:** cubre las dos ramas que existen en GitHub y busca por formato de clave; no ve ramas borradas ni copias (forks) del repositorio.

**Repositorio público o privado:**
- Con el plan gratis de GitHub, GitHub Pages solo publica repositorios públicos. Si se pone privado, la página se cae, con o sin dominio propio.
- Con GitHub Pro (unos 4 dólares al mes) el repositorio puede ser privado y la página sigue visible.
- Hacerlo privado oculta `src/`, las pruebas, las reglas, este parte y el historial. No oculta el código de la página, que se entrega completo a cada visitante, ni cambia la seguridad real, que está en las reglas de Firestore.
- Conclusión: el riesgo de dejarlo público es bajo. Lo que más protege es la verificación en dos pasos (sección 3) y terminar App Check.
