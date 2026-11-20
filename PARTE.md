# Parte de trabajo — Mi Pradera

Actualizado: 20 de noviembre de 2026 · Rama de trabajo: `claude/page-review-improve-hshx7j`

Este archivo resume en qué va la página, lo que falta y cómo seguir trabajando. Sirve para retomar el trabajo en otra sesión sin perder el hilo.

---

## 1. Estado actual

- **Reglas de Firestore:** la versión del repositorio es **v51** (`tests/reglas/firestore.rules`) y la dueña ya la publicó en Firebase (14 de noviembre de 2026).
- **Pruebas:** 407 pruebas de la página (`tests/pagina/pruebas.cjs`) y 17 archivos de pruebas de reglas (v24 a v51). Las de reglas no se volvieron a correr porque las reglas no cambiaron.
- **PR:** el último fusionado es el **#163** (v439 a v441), el 20 de noviembre de 2026. Todo hasta la v441 está en `main`. La v442 (Muro) está en la rama de trabajo.
- **Administrador:** la cuenta se ve en Firebase → Authentication. Su UID es `KUowZZ25CePVc9IXGmhCLVbbSIB3`. Ese UID está en la página, en las reglas y en el worker de Cloudflare (`worker_v12_INSTALAR.js`, línea 50). Ese archivo no está en el repositorio: lo guarda la dueña.

---

## 2. Lo que se hizo en esta etapa (v392 a v442)

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
| v406 | En el panel, **Usuarios → «Roles por recuperar»**: devuelve los roles a una ficha que quedó sin ellos aunque sus códigos sigan vigentes | #145 |
| v413 | **Datos sanos:** una publicación con campos de tipo equivocado (escrita por fuera de la página) ya no tumba la página; se corrige en memoria al leerla | #145 |
| v414 | Generador del modo oscuro: «white» y «black» dentro del nombre de una variable ya no se tratan como colores. No cambia ningún color visible | #145 |
| v415 | «Mis datos» y el formulario de «Mis direcciones» también preguntan al salir con cambios | #145 |
| v416 | **Pedir y preguntar sin registro:** sin cuenta, «Pedir por WhatsApp» abre «Tus datos para el pedido» (nombre, WhatsApp, barrio, dirección, indicaciones y mensaje) en vez de «Registrarme»; preguntar por un producto, servicio o anuncio pide nombre y WhatsApp solo la primera vez. Además, las ventanas abiertas desde el carrito ya no quedan tapadas por el carrito | #146 |
| v417 | **Formularios por pasos:** «Crea tu tienda» pasa de una ventana de más de 5.000 px a 6 pasos (Tu negocio, Categoría, Contacto, Ubicación, Horario, Entregas y pagos) con «Continuar», «Omitir» y «Atrás»; «Tus datos personales» va en 2 o 3 pasos; «Editar tienda» muestra las mismas secciones como pestañas | #147 |
| v418 | **Solo WhatsApp entre usuarios:** se apagan los pagos entre usuarios (botón «Pagar con Bre-B / Nequi» junto al WhatsApp, «Pagos Bre-B y Nequi» en Mi cuenta, pestaña «Cobrar») y los pedidos por la aplicación (todos salen por WhatsApp). Los pagos de roles a Mi Pradera y «Mis códigos» no cambian | #147 |
| v419 | Medios de pago de la tienda: nuevo **«Tarjeta débito»**; van en una sola columna y cada uno lleva una casilla (vacía sin elegir, azul con el chulo al elegirlo) | #147 |
| v420 | En el último paso de los formularios por pasos, el botón de guardar («Abrir tienda», «Guardar mis datos») va arriba a todo el ancho y «Atrás» pasa debajo, junto a «Cancelar» (pedido por la dueña al verlo en su teléfono) | #148 |
| v421 | **Letrero: abrir fuera del horario.** Poner «Abierto» cuando el horario dice cerrado ahora sí abre la tienda, por hoy; después vuelve sola a seguir el horario | #148 |
| v422 | **Lista de productos:** en la ficha de la tienda, el botón «Eliminar tienda» se cambia por «Lista de productos», que abre una lista con cada producto y sus botones «Editar» y «Eliminar» (pregunta antes de borrar). «Eliminar tienda» queda como enlace pequeño debajo de los botones | #149 |
| v423 | **Preguntar antes de borrar:** la ✕ de un producto, «Quitar» en un servicio propio, quitar una sugerencia y «Borrar comentario» borraban de inmediato; ahora preguntan primero | #149 |
| v424 | **La cuenta ya no pide dirección ni mapa:** los datos personales son solo nombre, correo y teléfono. Ya no se abre sola «Tu dirección principal» con el mapa de Google y la pregunta de confirmación; «Mis direcciones» sale de Mi cuenta. Al pedir, quien tiene cuenta ve el mismo formulario corto de quien pide sin registro, con su nombre y teléfono ya puestos | #150 |
| v425 | **Para publicar hay que tener cuenta:** sin cuenta ya no se puede llenar un clasificado, una tienda, un inmueble o un vehículo, ni enviar una sugerencia; primero sale «Registrarme» con un aviso que dice por qué, y al entrar se abre solo lo que quería publicar | #151 |
| v426 | **Página «Roles y precios»** (`#/roles`): cualquiera, con o sin cuenta, ve qué ofrece cada rol y cuánto cuesta. Se ve un rol a la vez, con barra de roles, flechas y «Anterior» / «Siguiente». Enlace en el pie de la página y en el aviso de registro | #151 |
| v427 | **Movimiento:** el fondo de las ventanas se funde al abrir; al cerrar, la ventana baja y se desvanece (antes desaparecía de golpe); de una ventana a otra solo cambia el contenido; las pantallas (inicio, tienda, producto…) entran suave; los formularios por pasos traen el paso nuevo desde el lado hacia donde se va | #152 |
| v428 | **Ajustes visuales:** el inicio ya no deja un hueco en blanco bajo las pestañas (toman la altura de la pestaña abierta); el nombre del negocio sale completo en dos líneas; el producto sin foto tiene marco e ícono; en el carrusel el botón va al fondo de la tarjeta | #152 |
| v429 | **Revisión de lógica: dos errores arreglados.** «Categorías» no abría en una tienda sin categorías guardadas (toda tienda recién creada). Y al llegar al panel por el enlace del botón «Publicar» (`?panel#/clasificado`), el formulario del clasificado se abría sin cuenta, saltándose la v425 | #153 |
| v430 | **Diseño de tienda en línea y responsive:** en computador (1024 px o más) el encabezado va en una fila (logo, buscador siempre visible, cuenta, carrito) con una segunda fila de enlaces (Inicio, Clasificados, Mi cuenta, Publicar); la ficha de producto va en dos columnas con una caja de compra fija a la derecha; contenido hasta 1200 px. En todos los tamaños los productos van en tarjetas con borde y precio grande; en tableta las categorías van en 6 columnas | #155 |
| v431 | **Diseño de tienda en línea en celular** (la dueña mandó capturas de Amazon): encabezado compacto con menú, logo pequeño, cuenta y carrito en una fila y el buscador debajo, siempre visible, también en el inicio; productos de una tienda en filas (foto a la izquierda; nombre, precio y «Agregar al carrito» a la derecha). El botón flotante de emergencias queda solo con la sirena, sin las letras «SOS», y más pequeño (44 px) | #155 |
| v432 | **«Planes» en el menú principal:** la opción «Roles» del menú (☰) pasa a llamarse «Planes» y abre la página pública de precios, que se ve sin cuenta (antes abría la ventana «Roles», que pedía entrar). La página se llama ahora «Planes y precios», también en el pie y en el aviso de registro | #157 |
| v433 | **Cuadro rojo de la campana:** el número de avisos sin leer vuelve a quedar sobre la esquina de la campana; desde la v431 salía en la esquina del encabezado (se le había quitado a la campana su posición propia) | #157 |
| v434 | **«Sugerencias» se une con «Escríbenos»:** en los menús, «Sugerencias» se cambia por «Escríbenos», que abre el formulario completo del pie (nombre, correo, teléfono, asunto y mensaje) ya desplegado. La ventana pública de sugerencias deja de usarse; un enlace viejo a `#/sugerencias` también lleva a «Escríbenos» | #157 |
| v435 | **Signo de «Escríbenos» y rayas del carrusel:** el botón del pie cambia de «+» a «−» al abrir y de «−» a «+» al cerrar (antes, al primer toque, el signo se trababa en «+» y salía un error). El carrusel de banners de arriba usa rayas debajo de la imagen (verde la que se ve, grises las otras) en vez de puntos sobre la imagen, como los demás carruseles | #158 |
| v436 | **Términos y condiciones al entrar por primera vez con Google** (o Apple o Facebook): antes de quedar adentro sale una ventana con dos casillas (Términos de uso; tratamiento de datos y Política de privacidad) y «Aceptar», que solo se activa con las dos marcadas. Antes quedaba registrado sin marcar nada | #158 |
| v437 | **Términos con Google a quien no los haya aceptado:** la v436 solo preguntaba si Firebase decía que la cuenta era nueva, y a la dueña no le salió al probarla (su cuenta de Google ya había entrado antes). Ahora la fecha en que acepta queda guardada en la cuenta de Firebase y se pregunta a toda cuenta de Google que no la tenga, una vez, en cualquier teléfono | #160 |
| v438 | **Descargar la app:** la tarjeta «Instala Mi Pradera» ya no sale sola al entrar. La opción «Descargar la app» está en el menú principal (☰) y en el pie de la página, y hay un **enlace directo: mipradera.com.co/app** (página `app/index.html` → `/?app=1`) que abre la ventana con el botón «Instalar» o los pasos para Android, iPhone y computador | #161 |
| v439 | **Productos sin precio:** el precio de un producto pasa a ser opcional. Sin precio, el producto dice «Consultar precio» en la tienda, la ficha, la búsqueda y el carrito; el total del carrito y el mensaje de WhatsApp dicen «+ precios por consultar» (o «Por consultar» si ninguno tiene precio). Sin precio no sale descuento | — |
| v440 | **Tiendas vencidas: 3 meses guardadas.** Al vencer el plan (más 3 días de gracia) los productos, las fotos extra y el video se ocultan como antes, y se guardan 3 meses desde que venció; el dueño ve hasta qué fecha. Después, en el panel, **Usuarios → «Tiendas por limpiar»** borra lo pagado con un botón (pregunta antes). La tienda sigue como registro básico gratis. También en los Términos de uso | — |
| v441 | **El administrador edita la tienda completa:** en Usuarios, la tarjeta de cada persona tiene «Editar tienda y productos», que abre la tienda como la ve su dueño (editar tienda, productos, categorías, «Conoce el lugar»). Una barra abajo dice qué tienda se edita y tiene «Terminar». La tienda y los productos siguen siendo del dueño | #163 |
| v442 | **Muro estilo Facebook:** el botón «Clasificados» de abajo se llama «Muro». Arriba, «¿Deseas publicar un anuncio?» y el buscador; luego pestañas Todo, Clasificados, Tiendas, Comidas, Peluquerías, Servicios, Vehículos, Inmuebles y Noticias, que se cambian **deslizando el dedo** hacia los lados; las publicaciones van en tarjetas una debajo de otra. «+ Publicar» y la barra de arriba abren **«¿Qué quieres publicar?»** (anuncio, negocio, inmueble, vehículo, servicio, empleo, obituario, otro tipo de anuncio y planes). En Clasificados, «Filtros» abre una ventana | — |

---

## 3. Lo que tiene que hacer la dueña (fuera del código)

0. **Probar en un teléfono real** lo que las pruebas no pueden comprobar (todo hasta el PR #161 ya está fusionado):
   - hacer un pedido sin cuenta y ver que WhatsApp se abre con el mensaje (v416);
   - hacer un pedido con cuenta: debe salir «Tus datos para el pedido» con el nombre y el teléfono puestos, sin mapa (v424);
   - sin cuenta, tocar «Publicar» en la barra de abajo: debe salir «Registrarme» con el aviso, no el formulario (v425, v429);
   - abrir «Planes y precios» desde el pie de la página y revisar que los precios sean los del panel (v426, v432);
   - abrir y cerrar ventanas y entrar a una tienda: el movimiento debe sentirse rápido, no lento (v427);
   - mirar el inicio con los datos reales: las pestañas sin hueco en blanco y el carrusel (v428);
   - en una tienda recién creada, tocar «Categorías» y crear la primera (v429);
   - en una tienda propia, usar «Lista de productos» y borrar un producto con la ✕: debe preguntar antes (v422, v423);
   - en el celular: el encabezado en una fila con el buscador debajo, una tienda con los productos en filas y «Agregar al carrito», y el botón de emergencias solo con la sirena (v431);
   - en el computador: buscar desde el encabezado y abrir un producto para ver la caja de compra a la derecha (v430);
   - sin cuenta, abrir el menú y tocar «Planes»: debe abrir «Planes y precios» sin pedir registro (v432);
   - con avisos sin leer, el cuadro rojo debe quedar sobre la campana (v433);
   - tocar «Escríbenos» en el menú: debe bajar al formulario del pie, ya abierto (v434);
   - entrar con Google (con una cuenta que ya haya entrado antes también sirve): debe salir «Términos y condiciones» y entrar solo después de marcar las dos casillas; al volver a entrar, ya no debe salir (v436, v437);
   - el botón «Escríbenos» del pie: «+» cerrado y «−» abierto; el carrusel de banners de arriba con rayas debajo de la imagen (v435);
   - al entrar ya no debe salir sola la tarjeta «Instala Mi Pradera»; «Descargar la app» en el menú ☰ y en el pie; abrir `mipradera.com.co/app` desde WhatsApp: en Android con Chrome sale el botón «Instalar», en iPhone los pasos (v438);
   - agregar un producto sin precio, verlo en la tienda («Consultar precio») y pedirlo por WhatsApp junto con otro que sí tenga precio (v439);
   - en el panel, Usuarios: abrir la tarjeta de una persona, tocar «Editar tienda y productos», cambiar algo, tocar «Terminar» y revisar desde la cuenta del dueño que el cambio está y que él puede seguir editando (v441);
   - revisar «Tiendas por limpiar» en Usuarios antes de borrar la primera vez: que las tiendas de la lista de verdad no hayan renovado (v440);
   - tocar «Muro» abajo y deslizar el dedo a los lados entre las pestañas; bajar por las tarjetas; tocar «+ Publicar» y probar cada opción (v442).
1. **Instalar `worker_v12_INSTALAR.js` en Cloudflare**, si aún no está: el archivo ya trae el UID nuevo del administrador en la línea 50 (revisado el 14 de noviembre de 2026), pero falta confirmar que esa versión sea la que está publicada en Cloudflare. Sin esto no llegan los avisos de pagos de roles.
2. **Volver a poner la llave Bre-B y el número de Nequi** en el panel, pestaña Pagos. Estaban guardados con el UID anterior.
3. **Pendientes de antes:**
   - registrar la llave de App Check en Firebase y, cuando las métricas estén bien, tocar «Aplicar»;
   - agregar el secreto `FB_SA` en GitHub;
   - el ID de cliente de Google One Tap;
   - configurar WhatsApp Business.
4. **ElevenLabs:** la cuenta está en el plan gratis (10.000 créditos al mes) y el 18 de noviembre de 2026 se quedó casi sin créditos (quedan 455; se renuevan el 8 de diciembre de 2026). Además responde a veces «se detectó actividad inusual… se desactivó el acceso gratuito». Mientras tanto, la dueña genera o graba las voces por su cuenta y las manda por el chat (así se hizo el video de inmuebles). Para seguir con voces de ElevenLabs desde aquí hace falta un plan de pago.
5. **Permiso de Heladería Artesanal Gelatier** para usar su nombre, logo, fotos y producto en el video de la ensalada de frutas (sección 5, «Videos»), antes de publicarlo. Y avisarle que tiene un producto con precio de $1 («Helados Artesanales y Mucho Mas»), que parece un error.
6. **Cierre de sesión con el panel de administrador:** mientras no se arregle (sección 5), usar el panel en otro navegador o en una pestaña de incógnito, no en el mismo donde se usa la cuenta de vecina.
7. **Decidir sobre Taste Skill y cuatro skills que no aplican** (sección 6): siguen instaladas mientras la dueña no diga otra cosa.
8. **Seguridad (recomendado, ver la sección 7):** activar la verificación en dos pasos en la cuenta de administrador de Firebase/Google, en GitHub y en Cloudflare.

Ya hecho (14 de noviembre de 2026): las reglas v51 están publicadas en Firebase; los roles de `contacto@mipradera.com.co` se recuperaron con el botón de la v406; la dueña miró en la página real el mapa de un inmueble (v409) y se ve bien. El 15 de noviembre de 2026 probó en su teléfono el letrero de «Abierto» fuera del horario (v421) y creó una tienda recorriendo los 6 pasos (v417, v420); las dos cosas funcionaron.

---

## 4. Problema resuelto: roles que salían «Sin activar»

**Síntoma:** en la cuenta `contacto@mipradera.com.co`, «Mis códigos» muestra **Comerciante · Varios negocios** y **Redactor de noticias** vigentes hasta noviembre de 2027. Pero «Publicar» y «Activar un rol» dicen **«Sin activar»** en todos los roles.

**Causa (confirmada el 14 de noviembre de 2026):**
- «Mis códigos» lee los códigos usados (colección `codes`).
- Los roles, en cambio, salen de la ficha de la cuenta (`plans/<llave>.acc`).
- Si la ficha se borró y la página la volvió a crear, queda sin roles: las reglas no dejan crearla con roles, y la cuenta no puede recuperarlos sola, porque solo se guardan al usar un código nuevo.

**Arreglo publicado (v406, PR #145) y usado en la página real:** `src/codigo/v406-recuperar-roles.js`. En el panel de administrador, en **Usuarios**, muestra «Roles por recuperar» y un botón que devuelve a cada ficha el fin de cada rol. Solo sube fechas, nunca las baja.

- El fin de cada rol se calcula con los días de cada código, en el orden en que se usaron. La fecha `end` del código la escribe quien lo canjea y las reglas no la revisan, así que solo puede bajar el resultado, nunca subirlo.
- El 14 de noviembre de 2026 la dueña tocó «Recuperar el rol» en el panel para `contacto@mipradera.com.co` y funcionó: la cuenta apareció en «Roles por recuperar», así que la ficha sí había quedado sin roles.
- No evita que vuelva a pasar: si una cuenta se elimina y se vuelve a crear, su ficha nace sin roles y el administrador los recupera con el mismo botón.

---

## 5. Decisiones abiertas e ideas que no se hicieron

**Revisión de lógica del 15 de noviembre de 2026 (v429):**
- Cómo se hizo: con la skill `systematic-debugging`. Un recorrido automático abrió cada pantalla y tocó cada botón distinto una vez, anotando los errores de JavaScript: inicio y panel, con y sin cuenta, y las 12 pestañas del administrador (unos 2.000 toques). Además, dos recorridos de principio a fin en el panel: crear tienda, categorías, editar, producto nuevo y editado, carrito, pedido, calificación y los formularios de publicar.
- Error 1, «Categorías»: `mcModal` (13-af.js) leía la lista `mc` de la tienda, que solo se crea al guardar la primera categoría. En una tienda sin categorías el botón no hacía nada. Venía de antes de esta etapa. Arreglo: la lista se crea vacía al abrir la ventana.
- Error 2, clasificado sin cuenta: la v425 enganchaba `comForm` «cuando la página terminaba de cargar», pero el panel abre la ruta `#/clasificado` durante el arranque, antes de ese momento. Arreglo: lo pregunta el propio `comForm` (16-cmfeat.js) llamando a `qhPedirCuenta`.
- Lo demás pasó sin errores: el recorrido no encontró más fallas de JavaScript. Los únicos avisos fueron del Firebase falso de las pruebas (no tiene «Continuar con Google»).
- Lo que esta revisión no cubre: las reglas de Firestore (no cambiaron; siguen en la v51), el worker de Cloudflare, Google Maps, WhatsApp y el correo de verificación reales, y cómo se ve en un teléfono de verdad.
- Las pruebas de la página ahora pueden abrir el panel: `abrir({ ruta: '?panel#/clasificado' })`.
- Nota: si alguien sin cuenta toca «Publicar», se registra con correo y vuelve desde el enlace del correo en otra pestaña, no se le abre solo el formulario (la página se cargó de nuevo); tiene que tocar «Publicar» otra vez.

**Decisiones de los cambios de esta etapa que la dueña puede cambiar:**
- **Muro (v442):**
  - lo pidió la dueña con una captura de Facebook: las «categorías principales» son las del inicio (Clasificados, Tiendas, Comidas…), más «Todo» y «Noticias»;
  - la vista anterior de Clasificados no se borró: queda como `comView0`. Quitar `v442-muro.js` de `src/orden.json` la devuelve, con el «+ Publicar» directo al clasificado (v407);
  - el archivo espera a que cargue el programa principal (va al final de la página) para cambiar `comView` por el muro;
  - «Muro» abre en «Todo»; «Clasificados» desde el inicio, el menú o el carrusel abre la pestaña Clasificados;
  - las tarjetas de clasificados son las de siempre (`comCard`, con WhatsApp, Compartir, Editar…); las de tiendas, servicios, inmuebles, vehículos y noticias son nuevas, con un botón «Ver tienda», «Ver menú», «Ver anuncio», etc.;
  - se muestran 30 publicaciones y «Ver más publicaciones» agrega otras 30;
  - para cambiar de pestaña el dedo debe moverse al menos 70 px de lado y más de lado que hacia abajo; sobre la foto de un clasificado con varias fotos, deslizar sigue pasando de foto (v207);
  - «Otro tipo de anuncio» abre el formulario del clasificado, que ya es libre (título, texto, fotos, precio opcional); no se agregó un tipo nuevo para no cambiar las reglas;
  - el título «Clasificados · Gratis: 1 anuncio al día…» quedó como una línea dentro de «¿Qué quieres publicar?»; los tipos (Vendo, Arriendo…) y las 24 categorías están en «Filtros».
- **Productos sin precio (v439):**
  - se guarda `price: 0`; la página lo muestra como «Consultar precio» (`pMoney` en texto y `pMoneyH` en pantalla, en 02-news.js). Las reglas no revisan el precio, así que no cambiaron;
  - se puede agregar al carrito y pedir: en el mensaje sale «(precio por consultar)» y el total suma solo los que tienen precio, con «+ precios por consultar»;
  - al ordenar por precio, los productos sin precio quedan como los más baratos;
  - las páginas de vista previa para WhatsApp (`tools/productos.mjs`) también dicen «Consultar precio»;
  - los pedidos por la aplicación (`APP` en `v320-pedidos.js`) están apagados; si se encienden, revisar cómo guardan un producto sin precio.
- **Tiendas vencidas (v440):**
  - la dueña eligió borrar solo lo pagado (no la tienda) y hacerlo con un botón en el panel, no automático;
  - los 3 meses se cuentan desde la fecha en que venció el plan. Esa fecha es la mayor entre la ficha del dueño (`plans/<k>`) y la fecha de pago de la tienda (`pexp`), para no borrar a quien ya renovó. Si la ficha del dueño no está cargada, la tienda no sale en la lista;
  - al borrar se quitan los productos (y sus fotos de R2, con la misma limpieza de siempre), las fotos del lugar que pasan de 3 y el video. No se puede deshacer;
  - si más adelante se quiere automático, se puede hacer una acción de GitHub diaria con el secreto `FB_SA` (sigue pendiente).
- **El administrador edita tiendas (v441):**
  - usa los mismos formularios del dueño: mientras edita, la tienda entra en `S.mine` solo en la memoria del panel, y `planMsg` no le pide rol;
  - la tienda y los productos conservan `ownerKey` y `ownerUid` del dueño (los toma `want()` de la tienda), y las reglas ya dejaban escribir al administrador;
  - la edición termina sola al salir de la tienda (Inicio, otra tienda o el panel), o con «Terminar»;
  - «Editar datos» (v335, solo teléfonos, dirección y código plus) sigue igual al lado.
- **Signo de «Escríbenos» (v435):** la causa era un selector frágil en `v370-inicio-limpio.js` (`span:last-child`): el efecto de toque (v272) agrega un elemento al final del botón y el signo dejaba de ser «el último». Ahora el signo tiene su clase (`qcl-s`). Ojo para el futuro: no buscar piezas de un botón por su posición (`:last-child`), porque v272 agrega un elemento a cada botón que se toca.
- **Rayas del carrusel de banners (v435):** las rayas quedan debajo de la imagen y no se pueden tocar (igual que los puntos de antes); el carrusel se pasa deslizando.
- **Términos con Google (v436):**
  - lo pidió la dueña, con una captura de la ventana de Rappi como ejemplo: que quien entra con Google acepte los términos igual que quien marca la casilla del registro manual;
  - «primera vez» = Firebase dice que la cuenta es nueva (`additionalUserInfo.isNewUser`). Quien se registró a mano y después entra con Google ya aceptó y no se le pregunta. Las cuentas que ya entraron con Google antes de esta versión tampoco: no se les pide aceptar de nuevo;
  - si cancela, no entra; como su cuenta de Google ya quedó creada en Firebase, el teléfono recuerda (`qh_tyc_pend`) que falta aceptar y vuelve a preguntar. En otro teléfono no sabría que falta: entraría directo;
  - sirve igual para Apple y Facebook (mismo camino en `10-ed.js`) y para Google One Tap (`v369`);
  - la fecha en que acepta se guarda como antes, en `consent` de la cuenta (solo en el teléfono).
- **Términos por cuenta (v437):**
  - la dueña probó la v436 el 17 de noviembre de 2026 y no le salió: su cuenta de Google ya existía en Firebase, así que no era «nueva». Se consideró preguntar antes de abrir Google, pero ahí la página no sabe quién es y le preguntaría a todos; la dueña eligió la v437;
  - la fecha queda en el perfil de la cuenta de Firebase (`displayName`, el JSON de la v261, campo `t`). No necesita reglas nuevas;
  - no se le pregunta a quien tiene la clave de correo en su cuenta (`password`): ya marcó la casilla del registro;
  - las cuentas que ya entraron con Google, incluso las que aceptaron con la v436, verán la ventana una vez más;
  - «Mis datos» (08-pflock.js) y el cambio de teléfono (v346) reescriben ese perfil: ahora conservan `t`. Si otro código lo reescribe, debe conservarla también.
- **«Planes» en el menú (v432):**
  - lo pidió la dueña: que cualquiera, con o sin cuenta, vea los planes y sus precios antes de comprar uno;
  - quien ya tiene cuenta también llega a la página pública, y su botón «Activar un rol» abre la ventana de siempre para canjear o comprar;
  - solo cambió el nombre visible: la dirección sigue siendo `#/roles` y cada plan conserva su nombre (Comerciante, Vendedor de inmuebles…);
  - también se cambió en la barra de secciones antigua (`tabs()` en 05-mlc.js), que hoy no se muestra.
- **Campana (v433):** la v431 puso `position:static` a `#nfBtn` para acomodarla en la fila del encabezado, y su número (`#nfBtn em`, con posición absoluta) se ubicó respecto a todo el encabezado. Ahora es `position:relative`, en celular (v431) y en computador (v430). Una prueba revisa que el cuadro quede sobre la esquina de la campana.
- **«Escríbenos» en vez de «Sugerencias» (v434):**
  - lo pidió la dueña: una sola vía para comentarios, sugerencias y errores. El formulario ya traía «Sugerencia» entre los asuntos y llega al administrador (Administrador → Sugerencias → «Mensajes de Escríbenos»);
  - las sugerencias públicas viejas ya no se ven en la página, pero no se borraron: el administrador las sigue viendo en esa misma pestaña;
  - se cambió en los tres menús (☰, el menú de «Inicio, Tiendas…» y la barra de secciones antigua). `v434-escribenos-menu.js` abre el formulario y lleva a «Escríbenos» si algo intenta abrir la ventana vieja (`view='sug'`);
  - el código de la ventana vieja (`sugView`) sigue en el archivo principal, pero ya no se llega a ella.
- **Diseño de tienda en línea (v430):**
  - la dueña pidió «un mejor diseño como MercadoLibre». Se tomó la forma de un marketplace (buscador siempre arriba, ficha en dos columnas, tarjetas de producto) pero no su marca: los colores, el logo, el diseño cuadrado y el modo oscuro siguen siendo los de Mi Pradera;
  - en celular solo cambian las tarjetas de producto (borde y precio más grande); lo demás se ve igual;
  - `v430-diseno-escritorio.js` mueve tres piezas sin cambiar qué hacen: el buscador al encabezado, la barra de abajo (#bnav) al encabezado y las piezas de la ficha a dos cajas (.pvmain y .pvbuy). En celular las cajas no cuentan (display:contents) y cada pieza conserva su orden con `style.order`;
  - ojo en código y pruebas: en la ficha hay dos botones con la clase `.pvbtn` en cajas distintas; para «Comprar ahora» usar `.pvbuy .pvbtn`;
  - dentro de una tienda el encabezado sigue escondido (cada tienda tiene su barra), así que en computador ahí no salen los enlaces;
  - el botón SOS tapaba un poco las categorías a la izquierda; en la v431 quedó más pequeño (solo la sirena).
- **Diseño en celular (v431):**
  - se tomó la forma de la página de Amazon que mandó la dueña, no su marca: ni su logo ni sus colores (verde, amarillo, fucsia). Los botones siguen cuadrados y azules;
  - el buscador queda siempre en el encabezado, también en el inicio; el hueco que dejaba en el centro del inicio se esconde (`#hubsrch:empty`);
  - las filas de productos son solo para pantallas de menos de 640 px y para las cuadrículas de una tienda (`.pgrid`), no para las filas que se deslizan de lado (`.hrow`) ni para las tarjetas de ropa (`.fx`);
  - el «+» de cada producto se vuelve el botón «Agregar al carrito» solo con CSS; su nombre accesible ya decía «Agregar … al carrito»;
  - en pantallas de menos de 360 px, la cuenta muestra solo el ícono (no cabe «Iniciar sesión»); de 360 a 399 px el texto puede ir en dos líneas («Iniciar / sesión»);
  - la revisión de GitHub del PR #155 falló porque esa máquina no tiene la letra Inter: con su letra, más ancha, «Iniciar sesión» se cortaba a 360 px (en algunos teléfonos pasaría igual). Por eso el texto ahora puede ir en dos líneas, y una prueba lo revisa con una letra ancha (DejaVu Sans). Las pruebas locales tienen Inter instalada: un diseño que cabe «justo» aquí puede no caber allá;
  - las letras «SOS» siguen en el botón para los lectores de pantalla; solo se esconden a la vista.
- **Ajustes visuales (v428):**
  - la dueña aprobó los cuatro arreglos el 15 de noviembre de 2026, después de ver las hojas de «antes y después»;
  - no se cambiaron colores ni letras. Los íconos de categorías de varios colores se dejaron igual;
  - las pestañas del inicio usan un archivo pequeño (`v428-ajustes-visuales.js`) que recalcula la altura al pasar de pestaña, al girar el teléfono y cuando cargan fotos; lo demás es solo CSS;
  - el marco del producto sin foto usa `:has()`; en navegadores muy viejos se ve como antes.
- **Movimiento (v427):**
  - se usaron las skills `frontend-design` y `web-design-guidelines`. Regla seguida: solo se anima lo que responde a un toque (abrir, cerrar, pasar de pantalla o de paso); nada se mueve solo;
  - todo dura entre 170 y 260 ms y solo cambia opacidad y posición. Con «reducir movimiento» activado en el teléfono no se anima nada;
  - no se cambiaron colores, letras ni la forma de los botones;
  - al cerrar una ventana queda 170 ms una copia que se desvanece (clase `mvg`): no tiene id ni `data-*` y no se puede tocar. En las pruebas, después de cerrar una ventana hay que esperar al menos 200 ms antes de buscar algo por clase;
  - el archivo solo mira lo que la página hace y pone clases; no cambia cómo se abre ni se cierra nada. Quitar `v427-movimiento.js` y su CSS de `src/orden.json` lo apaga;
  - revisado contra la guía de interfaz: solo `transform` y `opacity`, respeta «reducir movimiento» y la página no usa `transition: all` en ningún estilo.
- **Registro para publicar (v425):**
  - activar o pagar un rol ya exigía cuenta (v232) y no cambió. Pedir y preguntar por WhatsApp sin cuenta (v416) tampoco: eso es comprar, no publicar;
  - las sugerencias también piden cuenta ahora (se publican a la vista de todos). Lo escrito no se pierde: se envía solo al entrar. Si la dueña prefiere dejarlas sin cuenta, se quita ese bloque del archivo;
  - calificar ya pedía cuenta;
  - los borradores que alguien dejó guardados sin cuenta (v308, v255) siguen esperándolo y se publican cuando entre;
  - es un archivo aparte (`v425-registro-para-publicar.js`): quitarlo de `src/orden.json` vuelve a dejar llenar sin cuenta.
- **Roles y precios (v426):**
  - es solo para mirar: no vende nada. Sin cuenta ofrece «Crear mi cuenta gratis»; con cuenta, «Activar un rol»;
  - los precios salen de los mismos datos de la ventana «Roles»: si el administrador los cambia en el panel (o pone una promoción), la página cambia sola;
  - los textos de qué ofrece cada rol están escritos en `v426-roles-y-precios.js`: si cambia lo que incluye un rol, hay que cambiarlos ahí;
  - la ventana «Roles» de quien ya tiene cuenta no cambió.
- **Sin dirección en la cuenta (v424):**
  - la dueña eligió «no pedirla nunca»: la cuenta no guarda dirección. En cada pedido la persona la escribe en «Tus datos para el pedido» (barrio, dirección, indicaciones), sin mapa ni confirmación;
  - lo que escribe queda guardado solo en su teléfono (`qh_invitado`), igual que para quien pide sin cuenta, y la próxima vez viene ya escrito. Si antes tenía una dirección principal guardada en ese teléfono, se usa para llenar el formulario la primera vez;
  - es un interruptor (`qhSinDir` en `v424-sin-direccion.js`), no código borrado: el formulario de direcciones con mapa sigue en `v322-direcciones.js`. Quitar el archivo de `src/orden.json` lo vuelve a encender;
  - el mensaje de WhatsApp ya no lleva «Ubicación en el mapa» ni código plus: solo dirección, barrio e indicaciones;
  - en el panel, las «direcciones por ubicar» de personas dejan de llegar (las de negocios e inmuebles siguen igual);
  - el mapa de la tienda y el del inmueble (v394–v396, v409) no cambian: esto es solo para los datos de las personas;
  - si se vuelven a encender los pedidos por la aplicación (`APP` en `v320-pedidos.js`), hay que decidir de dónde sale la dirección del pedido guardado.
- **Lista de productos (v422):**
  - «Eliminar tienda» no se quitó del todo: quedó como un enlace pequeño en rojo debajo de los botones, para que el dueño todavía pueda eliminar su tienda. Si la dueña no lo quiere ahí, se puede pasar a «Editar tienda» o quitar;
  - «Eliminar» en la lista pregunta antes de borrar;
  - la lista muestra todos los productos de la tienda, sin buscador ni filtro por categoría;
  - no guarda nada nuevo ni necesita reglas nuevas: usa las mismas acciones de editar y borrar de siempre;
  - las clases del CSS empiezan por `lpv`: `pls…` ya lo usaba otro módulo.
- **Preguntar antes de borrar (v423):**
  - revisión del 15 de noviembre de 2026 de todos los botones que borran: «Eliminar tienda» ya preguntaba, igual que anuncios, clasificados, noticias, categorías, cuenta, direcciones, mensajes, fotos de «Conoce el lugar» y lo del panel de administrador;
  - los cuatro que no preguntaban se arreglaron en `v423-confirmar-borrar.js`: detiene el toque, pregunta y, si la persona acepta, lo deja pasar a la acción de siempre;
  - se dejaron sin pregunta, a propósito: «Cerrar sesión»; la ✕ de una notificación; quitar de favoritos; quitar una foto dentro de un formulario (no se pierde hasta tocar «Guardar»); «Borrar mis datos» del visitante sin cuenta (solo borra lo guardado en su teléfono); «Descartar reporte» del administrador.
- **Letrero de abierto fuera del horario (v421):**
  - vale «por hoy»: hasta las 4:00 a. m. siguientes (para no cortar a los negocios que atienden pasada la medianoche). Después la tienda vuelve a seguir su horario, para que no quede abierta por olvido;
  - el menú lo ofrece ya marcado («Abrir ahora (vale por hoy)») con la alternativa «Seguir mi horario»;
  - el letrero de cerrado sigue mandando sobre todo;
  - campo nuevo de la tienda: `opn` (hasta cuándo vale, en milisegundos). No necesita reglas nuevas.
- **Letrero de cerrado (v411):**
  - no se quita solo; se queda hasta que el dueño ponga «Abierto»;
  - el cliente sigue viendo los productos y puede hacer pedidos (la pausa anterior los bloqueaba). El 14 de noviembre de 2026 se decidió dejarlo así: una tienda cerrada por horario también recibe pedidos, y el letrero se comporta igual.
- **Preguntar al salir (v412, v415):**
  - cubre tienda nueva, editar tienda, anuncio, servicio, producto, editar producto, registro, «Mis datos» y el formulario de dirección. En esos dos últimos el toque afuera tampoco cierra ya la ventana;
  - el botón «atrás» del teléfono no hace la pregunta: lo escrito queda en el borrador y aparece «Continuar»;
  - el toque afuera no cierra esos formularios; las demás ventanas sí se cierran al tocar afuera (la dueña lo pidió así).
- **Mapa del inmueble (v409):** si el dueño respondió «No lo ubica bien» y el administrador aún no puso el código plus, el mapa no se muestra.
- **Solo WhatsApp (v418):**
  - son dos interruptores apagados, no código borrado: `ITEM=false` en `v232-breb.js` (pagos entre usuarios) y `APP=false` en `v320-pedidos.js` (pedidos por la aplicación). Ponerlos en `true` los vuelve a encender;
  - quien ya tenía pagos con otros usuarios o pedidos guardados los sigue viendo en Mi cuenta para cerrarlos; no se crean nuevos;
  - los roles se siguen pagando dentro de la página (la dueña aprueba en el panel → Pagos) y los códigos gratis siguen igual;
  - «Medios de pago» de la tienda sigue: es información para el cliente y va en el mensaje de WhatsApp;
  - las reglas de Firestore siguen permitiendo crear `pagos` entre usuarios y `pedidos`: solo se quitó de la página. Cerrarlo también en las reglas sería una v52;
  - el Firebase falso de las pruebas ahora deja la app en `firebase.apps`, como el real: antes los módulos de pagos y pedidos nunca arrancaban en las pruebas.
- **Tarjeta débito (v419):** se guarda como `debit` en `pays` de la tienda. Las reglas v51 no la aceptan como forma de pago de un pedido guardado (`pedidos.pay`); no hace falta porque los pedidos por la aplicación están apagados (v418). Si se vuelven a encender, hay que agregar `'debit'` a esa lista en las reglas.
- **Por pasos (v417):**
  - no cambia los campos ni cómo se guarda: solo oculta lo que no es del paso actual. Borrar el archivo devuelve los formularios completos;
  - «Omitir» solo sale en los pasos donde todo es opcional (Ubicación y Horario); en los demás hay que llenar lo obligatorio para continuar;
  - si al guardar falta un dato, vuelve solo al paso donde está;
  - «Editar tienda» no obliga a recorrer los pasos: son pestañas y «Guardar» está siempre a la vista;
  - mientras corre el tutorial «Hazlo conmigo» el formulario se muestra completo, como antes;
  - no se aplicó a servicio, anuncio, producto ni registro. El motor (`FORMS` en `v417-por-pasos.js`) admite más formularios: cada uno necesita su lista de pasos y de etiquetas donde empieza cada paso;
  - en las pruebas, `qhPasos.ver('#campo')` muestra el paso donde está un campo.
- **Sin registro (v416):**
  - los datos del visitante se guardan solo en su teléfono (`localStorage`, `qh_invitado`), no en Firebase; el formulario trae «Borrar mis datos»;
  - el formulario del pedido se muestra cada vez (ya lleno) para confirmar la dirección; el de información solo la primera vez;
  - al preguntar, el nombre y el WhatsApp van al final del mensaje («Mi nombre», «Mi WhatsApp»), no al inicio;
  - sin cuenta, el pedido a una tienda que recibe por la aplicación sale por WhatsApp (guardar un pedido exige sesión);
  - sin cuenta no se pregunta si Google Maps ubica bien la casa ni se manda el enlace del mapa: solo dirección, barrio e indicaciones;
  - la invitación a crear cuenta sale una sola vez por teléfono, después del primer pedido;
  - quien ya tiene cuenta no ve ningún cambio.
- **Datos sanos (v413):**
  - corrige en memoria, no en Firestore. En el modo administrador sí se guarda la corrección al guardar, para que el administrador pueda ver y borrar la publicación dañada;
  - en el panel no toca las publicaciones propias;
  - un anuncio con un tipo que no existe queda como arriendo oculto;
  - cada corrección deja un aviso en la consola (`v413: publicación con datos dañados`), y las pruebas fallan si se corrige una publicación bien hecha.
- **Reglas de Firestore:** siguen en la v51. La auditoría del 14 de noviembre de 2026 encontró que las reglas no revisan el tipo de la mayoría de los campos de tiendas, productos, servicios, anuncios y clasificados. No se cambiaron: una regla de tipos mal hecha impediría guardar a los comerciantes (la página guarda `null` en varios campos), y la v413 ya protege a los visitantes. Queda como mejora posible, con pruebas en el emulador.

**Ideas ofrecidas que no se hicieron:**
- **Carga diferida de funciones poco usadas** (opción B de velocidad). No se hizo.
- **Stash viejo:** `stash@{0}` («opcion C … en pausa») ya está publicado como v393 y se puede borrar. No se borró: falta que la dueña lo confirme.
- **Otros hallazgos menores de la auditoría de reglas, sin cambiar:** cualquiera con sesión puede escribir la marca de presencia de otra persona (`presence`); los pedidos no limitan el tamaño de cada producto de la lista (`items`); el `end` de un código canjeado no se valida.
- **Guardar el worker en el repositorio** (`tools/`, que GitHub Pages no publica). No se hizo: falta saber si la dueña lo dejó fuera a propósito.
- **Pasar a Cloudflare Pages** para poder tener el repositorio privado sin pagar (ver la sección 7).
- **Sección de citas («tipo Tinder»)** (16 de noviembre de 2026): se desaconsejó por el riesgo con menores de edad, el acoso, el trabajo de moderación, los datos sensibles (Ley 1581) y la marca. Se ofrecieron tres alternativas sin hacer: una agenda de eventos del pueblo, grupos por interés con enlace a WhatsApp, y una categoría «Busco compañía para…» en Clasificados.

**Cierre de sesión «Tu sesión se cerró» (18-19 de noviembre de 2026), sin arreglar:**
- Causa confirmada: la página de vecinos, «Mi cuenta» y el panel de administrador (`?admin=`) comparten una sola sesión de Firebase en el navegador. Al entrar al panel, la sesión del vecino se reemplaza; cuando el panel la cierra (30 minutos sin uso, v222, o «Salir»), la página normal queda como visitante y sale el mensaje de la v318 (`01-cats.js:198`). Le pasa a la dueña porque usa el panel en el mismo navegador.
- Se escribió y probó un arreglo (`v438-sesion-admin-aparte.js`: en el panel, `firebase.auth()` y `firebase.firestore()` apuntan a una conexión aparte llamada «adm»). Se probó con Firebase 10.12.2 real y el emulador de Authentication: sin el arreglo la vecina quedaba como visitante; con el arreglo seguía con su sesión. **La dueña pidió descartarlo**; no está en el repositorio. Ojo: el número v438 quedó usado después por «Descargar la app».
- Para la prueba con el emulador: la CSP de `index.html` solo permite conectarse a dominios de Google (hay que agregar `http://127.0.0.1:9099` al HTML servido en la prueba) y Chromium debe lanzarse con `--no-proxy-server`.

**Videos y documentos (18-20 de noviembre de 2026):**
- Todos los videos se entregaron por el chat. Sus proyectos quedaron en la carpeta temporal de la sesión (se borra al cerrarse la sesión); no están en el repositorio.
- «La lavadora de doña Marta» (clasificados, 55 s): voces de Lina y «Cronos Paint» (ElevenLabs), placas con texto en vez de ilustraciones (ElevenLabs no dejó generarlas). Hay una versión sin música (`_v2`).
- «Las hamburguesas de don Fabio» (tienda virtual, 62 s): sin música.
- «El apartamento de doña Gloria» (inmuebles y arriendos, 52 s): hecho con la skill `cartoon-3d-short` (personajes 2D en un pueblo 3D). Tres lugares: la calle de Gloria, el paradero de buses (se construyó en 3D) y el parque. Voces que mandó la dueña (Lina - Sunny, Kind and Friendly; Fernanda) y Camilo con «Charlie». Fotos aprobadas antes del video.
- **En curso: «¿Dónde venden ensalada de frutas en Pradera?»** con una tienda real de la página (Heladería Artesanal Gelatier, Carrera 10 #10-657, Centro, de 3:00 a 10:00 p. m., solo recoger en la tienda). Personajes animados (Marcela y Sofi) sobre fotos reales de Pradera que mandó la dueña (la plaza con la iglesia, la acera y la fachada) y una sala dibujada; pantallas reales de la tienda; gancho en el primer segundo con la foto real de la ensalada; cierre para negocios («¿Tienes un negocio? … ¿Qué esperas?» y «Registrar tu negocio es gratis»). Las 11 fotos (versión 3) están **aprobadas**. Falta: las voces (la dueña las graba: Lina - Sunny para la narradora, Fernanda para Marcela, HELLEN - Natural, Suave, Juvenil o una niña real para Sofi; los textos están en el chat del 20 de noviembre), el permiso de Gelatier y armar el video.
- Documentos: propuestas de alianza para **Mercapava** ([documento](https://claude.ai/artifact/PCpqHosMJzcVReLXAUhEmC)) y **Suzuki Motos** ([documento](https://claude.ai/artifact/X7Rggnpcx8x3VedSx7Gk1F)), con PDF en tamaño carta entregados por el chat. En la firma faltan el nombre, el cargo y el WhatsApp de la dueña; confirmar el nombre exacto del concesionario Suzuki.

**Hecho fuera del repositorio (16 de noviembre de 2026):** tres videos de publicidad para TikTok (verticales, de unos 20 segundos): uno con la página real en un teléfono y la voz «Lina»; uno animado para compradores (con voz de «Lina», con voz de «Brayan Jackson» y sin voz); y uno animado para comerciantes con la voz de «Lina» y música de fondo. Las voces y la música se hicieron con ElevenLabs (unos 2.500 créditos en total). Los videos se entregaron a la dueña en el chat; no están en el repositorio. Los negocios y productos que aparecen en ellos son de ejemplo.

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
  - desde la v424 ya no se abre sola «Tu dirección principal» a una cuenta de prueba sin dirección. Antes (v322) se abría cada 2,5 segundos y hacía fallar a ratos las pruebas que cerraban ventanas; las pruebas `borradores`, `letrero`, `salirMisDatos`, `sinRegistro` y `soloWhatsapp` todavía agregan un elemento oculto con la clase `qtour` (oculto, para que los formularios por pasos no lo tomen por el tutorial);
  - los formularios por pasos (v417) ocultan los campos de los otros pasos: antes de tocar un campo, la prueba llama `qhPasos.ver('#campo')`;
  - Google Maps no carga en el entorno de pruebas: se comprueba la dirección que se le pide al mapa, no el dibujo.
- **Skills instaladas** en `.claude/skills/` (se cargan solas en las sesiones nuevas):
  - `find-skills`: buscar e instalar otras skills. Su buscador usa `skills.sh`, que la red de las sesiones en la nube bloquea; se puede listar un repositorio conocido con `npx skills add <dueño/repositorio> --list`;
  - `systematic-debugging`: método para buscar la causa de un error antes de arreglarlo;
  - `frontend-design` y `web-design-guidelines`: guía de diseño y revisión de la interfaz. Las preferencias de la dueña mandan sobre lo que digan.
  - `firebase-security-rules-auditor` y `firestore-rules-creation` (de `firebase/agent-skills`): auditar y escribir reglas de Firestore. La segunda pide empezar negando todo y no dejar lecturas públicas; aquí las lecturas públicas de tiendas y anuncios son a propósito.
  - `workers-best-practices` (de `cloudflare/skills`): revisar el worker de Cloudflare.
  - Para instalar otra: `npx skills add <dueño/repositorio> --skill <nombre> --agent claude-code -y`, leerla completa antes de hacer commit, y dejar `skills-lock.json` fuera de GitHub Pages (ya está en `_config.yml`).
  - No instalar `design-mobile-apps`: es un conector al servicio de pago sleek.design, pensado para React Native.
  - `cartoon-3d-short` (de `mromidev/claude-animated-shorts`, MIT; instalada el 19 de noviembre de 2026 a pedido de la dueña, que la llamó «claude animated short»): videos cortos animados con personajes 2D en un mundo 3D (three.js + Remotion). Se instaló **sin** `references/frames/` ni `references/sheets/` (58 imágenes de videos de otro canal, solo para estudio privado; el repositorio es público). Revisada: sus programas solo usan ffmpeg y Remotion en la máquina, sin conexiones a internet. Remotion y `@remotion/three` no están instalados: se instalan al hacer el primer video.
  - **Reglas de la dueña para todo video** (escritas también al principio de esa skill): la historia pasa en **al menos 3 lugares diferentes** (más si la historia lo necesita); tiene **personaje(s) y un problema** que Mi Pradera resuelve; **antes del video final se le mandan fotos** de cada escena para que corrija, y el video se hace solo después de que las apruebe; en español, con Lina de narradora (ElevenLabs).
  - ElevenLabs: el plan gratis se quedó sin créditos el 18 de noviembre de 2026 (cuota de 10.000) y además avisa «actividad inusual». Para más videos con voz hace falta un plan de pago o esperar la renovación.
- **Servidores MCP** (17 de noviembre de 2026):
  - **Figma:** es un conector de claude.ai, no vive en el repositorio. Ya está conectado a la cuenta de Figma de la dueña;
  - **Playwright:** está en `.mcp.json`, en la raíz del repositorio, y se carga en las sesiones nuevas. Usa la versión fija `@playwright/mcp@0.0.85`, sin ventana, con el Chromium que ya trae la máquina de la nube (`/opt/pw-browsers/chromium`): no instalar otro navegador. Probado: arranca, ofrece 25 herramientas y abre páginas. Si una sesión nueva pide permiso para usarlo, hay que aceptarlo una vez. Las pruebas de la página (`tests/pagina/pruebas.cjs`) no lo usan: siguen con Playwright directo.
  - **Instaladas el 17 de noviembre de 2026, a pedido de la dueña:**
    - de `emilkowalski/skills` (20): `animate`, `animation-performance`, `animation-vocabulary`, `apple-design`, `ask-emil`, `break-ui`, `choreograph`, `emil-design-eng`, `find-animation-opportunities`, `gestures`, `improve-animations`, `learn-taste`, `mobile-native`, `prototype`, `remove-animations`, `review-animations`, y cuatro que no aplican a esta página pero vienen en el repositorio: `write-swift` (Swift, iOS), `animate-expo` (React Native), `ask-sonner` y `pick-ui-library` (librerías de React). Solo traen instrucciones, sin programas;
    - `impeccable` (de `pbakaus/impeccable`, 2,4 MB): diseño y revisión de interfaz con comandos (`critique`, `audit`, `polish`, `animate`, `layout`…). Su script `scripts/impeccable` descarga la primera vez un programa desde las versiones publicadas en GitHub y lo verifica con sumas de control. Tiene un «gancho» opcional que revisa cada archivo editado; solo se enciende si se pide (`impeccable hooks on`). Pide archivos PRODUCT.md y DESIGN.md en la raíz si se usa a fondo: no se han creado;
    - `design-taste-frontend` (de `Leonxlnx/taste-skill`, unos 40 MB y 1.631 archivos, casi todo imágenes y ejemplos): hecha para construir sitios de empresa desde cero, con fotos de muestra y su propio sistema de diseño. Mientras se usa, al final de cada respuesta corre una comprobación con Node (`scripts/gate.mjs`); si no hay un trabajo suyo armado (`.taste-skill/build.json`), termina al instante. Varias de sus reglas chocan con esta página (pide contactos en `.example`, sin teléfonos reales, fotos en cada sección, bordes redondeados): mandan las preferencias de la dueña. Sus scripts abren Chrome sin ventana y descargan fotos de Wikimedia y tipografías;
    - revisadas antes de guardarlas: no encontré órdenes ocultas ni envío de datos a terceros; varias advierten justamente contra textos que intenten dar órdenes. GitHub Pages no las publica (las carpetas que empiezan con punto no se publican).
- **Cómo se hacen los videos** (sesiones del 19 y 20 de noviembre de 2026):
  - Reglas de la dueña al principio de `.claude/skills/cartoon-3d-short/SKILL.md`: al menos 3 lugares (más si la historia lo necesita), personaje(s) y un problema, fotos para aprobar antes del video final, español, captar la atención desde el primer segundo.
  - Proyecto de Remotion fuera del repositorio: `remotion@4`, `@remotion/three@4`, `three@0.169`, `@react-three/fiber@8`, `@react-three/postprocessing@2`, `postprocessing@6`, React 18; copiar `templates/bridge/` a `src/videos/<nombre>/`. En esta máquina: Chromium de Playwright con `gl: "swangle"` y **una sola pestaña** (con 3 pestañas falla); unos 4,3 s por cuadro a 1080×1920; renderizar por tomas para no perder trabajo si algo falla.
  - Arreglos a la plantilla: `Bridge.tsx` llamaba `fx.ink.dispose()`, que con `postprocessing` 6.x no existe y tumbaba el render en los cambios de toma; el culler de líneas de mira quita las casas si el punto al que mira la cámara queda detrás de un personaje pegado a una fachada (mirar a un punto delante de él).
  - Para personajes sobre fotos reales: `toon.ts` se empaqueta con esbuild y se dibuja en un canvas transparente (Playwright) para sacar PNG de cada pose; luego se arma cada escena en HTML y se anima con ffmpeg.
  - Pantallas reales de una tienda: los datos públicos se leen de Firestore por REST (`firestore.googleapis.com`, lectura pública de `stores` y `products`), se cargan en el Firebase falso de las pruebas y se captura la página del repositorio con la hora y la zona horaria que convengan (por ejemplo, 4:30 p. m. en `America/Bogota` para que salga «Abierto»). Las imágenes de la tienda están en `pub-419ea53b95de40199910716cc66fd035.r2.dev` (se agregó al entorno de red el 20 de noviembre de 2026), pero el sistema de permisos de la sesión bloquea descargarlas: la dueña las manda por el chat.
  - Sin modelos de reconocimiento de voz en esta red (Hugging Face y otros bloqueados): las frases de un audio se ubican por sus pausas (`ffmpeg silencedetect`) y su duración.
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
