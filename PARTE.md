# Parte de trabajo — Mi Pradera

Actualizado: 27 de noviembre de 2026 · Rama de trabajo: `claude/page-review-improve-hshx7j`

Este archivo resume en qué va la página, lo que falta y cómo seguir trabajando. Sirve para retomar el trabajo en otra sesión sin perder el hilo.

---

## 1. Estado actual

- **Reglas de Firestore:** la versión del repositorio es **v52** (`tests/reglas/firestore.rules`, 27 de noviembre de 2026: inventario de ferretería) y la dueña ya la publicó en Firebase (27 de noviembre de 2026).
- **Inventario de ferretería (v472, 27 de noviembre de 2026):** página aparte, `ferreteria.html` (se abre en `mipradera.com.co/ferreteria`). No toca `index.html`. Pruebas de reglas: 293 casos, todos bien (26 nuevos en `v52.test.mjs`).
- **Pruebas:** 535 pruebas de la página en la última pasada completa (`tests/pagina/pruebas.cjs`, 22 de noviembre de 2026, con todo hasta la v470; la v471 agregó revisiones que pasan) y 17 archivos de pruebas de reglas (v24 a v51). Las de reglas no se volvieron a correr porque las reglas no cambiaron.
- **PR:** el 27 de noviembre de 2026 se fusionó el **#178** (v472, inventario de ferretería, y reglas v52). El 22 de noviembre de 2026 se fusionaron el **#175** (skill hallmark y v462–v466), el **#176** (v467–v470) y el **#177** (v471). Todo hasta la v472 está en `main`, también las notas de los dos videos nuevos (sección 5). La v461 (estilo «Vitrina») se probó y se descartó (sección 5).
- **Red del entorno de la nube:** el 21 de noviembre de 2026, con permiso de la dueña, se agregaron `co.addi.com` y `framerusercontent.com` para estudiar el diseño de esa página (v457). Ya no hacen falta; se pueden quitar en la configuración del entorno.
- **Administrador:** la cuenta se ve en Firebase → Authentication. Su UID es `KUowZZ25CePVc9IXGmhCLVbbSIB3`. Ese UID está en la página, en las reglas y en el worker de Cloudflare (`worker_v13_INSTALAR.js`, línea 57; instalado el 27 de noviembre de 2026). Ese archivo no está en el repositorio: lo guarda la dueña.

---

## 2. Lo que se hizo en esta etapa (v392 a v471)

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
| v442 | **Muro estilo Facebook:** el botón «Clasificados» de abajo se llama «Muro». Arriba, «¿Deseas publicar un anuncio?» y el buscador; luego pestañas Todo, Clasificados, Tiendas, Comidas, Peluquerías, Servicios, Vehículos, Inmuebles y Noticias, que se cambian **deslizando el dedo** hacia los lados; las publicaciones van en tarjetas una debajo de otra. «+ Publicar» y la barra de arriba abren **«¿Qué quieres publicar?»** (anuncio, negocio, inmueble, vehículo, servicio, empleo, obituario, otro tipo de anuncio y planes). En Clasificados, «Filtros» abre una ventana | #164 |
| v443 | **Registro sin terminar después de entrar:** si alguien llenaba «Registrarme» por error y entraba por «Iniciar sesión», abajo le seguía saliendo «Tienes tu registro sin terminar · Continuar». Ahora, con la sesión abierta, ese borrador se borra solo (v399) | #165 |
| v444 | **Productos como Amazon en todas las tiendas (celular):** las tiendas con categorías («Para ti», cada categoría, «Otros productos») seguían en tarjetas de dos columnas porque la v431 dejó afuera sus filas deslizables (`.pgrid.hrow`). Ahora todas muestran un producto por fila: foto a la izquierda (con «Verificado» arriba y el corazón abajo); nombre, descripción, precio grande (el precio anterior tachado al lado) y «Agregar al carrito» a la derecha. Solo CSS (`v444-productos-amazon.css`) | #165 |
| v445 | **Mapa de arriendos e inmuebles:** en «Mapa», el selector «Mostrar» cambia entre Tiendas (como antes), Arriendos e inmuebles en venta, Solo arriendos y Solo ventas. Los inmuebles con punto salen con un pin de casa (verde azulado arriendo, morado venta); al tocarlo, título, precio, barrio y «Ver anuncio». Debajo, la lista y cuántos no tienen punto. En el panel, «Inmuebles por ubicar» ahora lista también los que no tienen punto, para ponerles el código plus | #166 |
| v446 | **Buscador con retardo:** el buscador de arriba busca 220 ms después de la última letra, no en cada letra; Enter busca en el momento | #167 |
| v447 | **Fuentes propias:** la letra Rubik sale de `fuentes/` (el mismo archivo de Google, byte a byte, 35 KB, todos los grosores) y no de Google Fonts; Inter ya no se descarga (era solo reserva). El service worker la guarda en el teléfono | #167 |
| v448 | **Esqueletos de carga:** al abrir el inicio ya no sale la pantalla del logo: se ve la página enseguida y lo que espera datos sale en cajas grises (las listas de «Lo más reciente» y las pestañas, el lugar de «Negocios»; antes del primer dibujo, la forma del inicio). Ya no dice «Todavía no hay publicaciones» mientras carga. Si se entra a otra sección antes de los datos, sale una lista gris. Los enlaces directos (tienda, producto, panel) siguen con la pantalla del logo | #168 |
| v449 | **Esqueletos sin parpadeo:** `tools/armar.mjs` dejaba `v448-esqueletos-inicio.js` al final del cuerpo (después de la pantalla del logo, que podía verse un instante); ahora va en la cabecera (`EN_CABECERA`) | #169 |
| v450 | **Modo oscuro bajo demanda:** el generador del modo oscuro (v219) ya no trabaja en modo claro; se activa al pasar a oscuro. En un celular lento, la ejecución del código al abrir baja de unos 650 ms a unos 350 ms | #169 |
| v451 | **Noticias livianas:** los comentarios y reacciones (`nwFb`) se piden solo para las noticias que están en pantalla (antes, cada visitante bajaba todos los de todas las noticias al abrir la página). El aviso de noticias nuevas usa la misma consulta de la lista (60), así Firebase la pide una sola vez | #170 |
| v452 | **Opiniones livianas:** las opiniones de la comunidad («¿Te sirvió este anuncio?» y comentarios, `cmFb`) se piden solo para los anuncios que están en pantalla; antes, cada visitante bajaba todas las de todos los anuncios al abrir la página | #171 |
| v453 | **Negocios en fila (celular):** en las pestañas del inicio (Tiendas, Comidas, Peluquerías) cada negocio va en una fila como los productos (v444): el logo en un cuadro a la izquierda; a la derecha la categoría, el nombre, la zona, las estrellas, la descripción (2 líneas) y WhatsApp y «Ver más». Pedido por la dueña con capturas de su teléfono. Solo CSS (`v453-negocios-en-fila.css`) | #171 |
| v454 | **Muro en fila:** en el Muro, los negocios, servicios, vehículos, inmuebles y noticias van en fila como en el inicio (v453): el logo (o la foto, o el ícono) a la izquierda; a la derecha qué es, el nombre o título, las estrellas, el precio, la descripción y los botones (WhatsApp en los negocios). Los clasificados siguen como en Facebook. Pedido por la dueña | #172 |
| v455 | **Inicio solo con «Lo más reciente»:** en la página principal se quitan las pestañas de categorías (Clasificados, Tiendas, Comidas, Peluquerías, Vehículos, Inmuebles, Servicios); queda «Lo más reciente» y al lado el botón «Ver el muro», que abre el Muro. Pedido por la dueña con una captura | #172 |
| v456 | **Sin «Ver por categorías»:** en la página principal también se quita el botón «Ver por categorías →» de debajo de «Lo más reciente» (en `v455-inicio-solo-reciente.js`). Pedido por la dueña | #173 |
| v457 | **Estilo redondeado (referencia co.addi.com):** letras Outfit (texto) y Onest (títulos, más livianos y con las letras juntas); botones y etiquetas en píldora, tarjetas e imágenes con esquinas de 18 px, ventanas de 24 px; botones sin mayúsculas forzadas ni franja oscura. En el inicio, la parte de presentación aparece al llegar a ella y la foto de publicidad tiene parallax. Se quitaron de `src/orden.json` v273, v276 y v277 (diseño cuadrado). Pedido por la dueña | #173 |
| v458 | **Teléfono en la ficha de la tienda:** la ficha (v337) mostraba solo «Otro teléfono» (`wa2`), nunca el número principal (`wa`, el de WhatsApp). Ahora sale «Teléfono» con el número escrito 300 123 4567; al tocarlo se llama (`tel:+57…`). Pedido por la dueña con una captura | #174 |
| v459 | **Servicios de la vivienda (arriendo):** campo nuevo «Servicios públicos con los que cuenta la vivienda» (Agua, Energía, Gas natural, Internet), con casillas. El de antes, «Servicios incluidos en el canon», ahora se llama «Servicios que ya están pagos en el valor del arriendo (el inquilino no los paga aparte)» para no confundirlos. El anuncio muestra los dos. Pedido por la dueña | #174 |
| v460 | **Mismas palabras en los dos campos de servicios:** «Servicios que ya están pagos…» usa Energía y Gas natural (antes Luz y Gas), igual que «Servicios públicos con los que cuenta la vivienda». Los anuncios viejos con «Luz» o «Gas» se leen con las palabras nuevas (`v460-servicios-nombres.js`, enganchado a `docFix` de la v413) y no pierden su marca | #174 |
| v462 | **Dirección sin mapa:** al escribir la dirección del negocio (crear o editar tienda) o del inmueble (arriendo o venta) ya no sale el mapa de Google Maps ni la pregunta «¿Google Maps muestra bien…?». Debajo de la dirección va «Referencia de la dirección (opcional)», que se ve en la ficha de la tienda y en el anuncio. El código plus lo pone solo el administrador: «Negocios por ubicar» lista ahora todo negocio con dirección y sin punto, y las dos listas muestran la referencia. Pedido por la dueña | #175 |
| v463 | **El administrador corrige la dirección:** «Corregir dirección o código plus» (en «Negocios por ubicar» e «Inmuebles por ubicar») y «Corregir dirección» (en Publicaciones, para toda tienda y todo arriendo o venta, aunque ya esté ubicado) abren una ventana con barrio, dirección, referencia y código plus. En el inmueble el código plus ahora es opcional: vacío conserva el punto que ya tenía. La publicación sigue siendo del dueño. Pedido por la dueña | #175 |
| v464 | **Subcategorías de tiendas en el panel:** Administrador → Categorías → «Categorías de tiendas» va por grupos (Comidas, Belleza, Salud…), escalonado: cada grupo se abre y muestra debajo, con sangría, sus subcategorías (nombre, color, imagen, «Eliminar») y «+ Agregar» para crear una nueva dentro de ese grupo. Antes la lista era plana y lo nuevo caía siempre en «Otros». Pedido por la dueña | #175 |
| v465 | **El administrador edita los anuncios de los usuarios:** en Publicaciones, cada arriendo, venta y vehículo tiene «Editar», que abre el mismo formulario del dueño (fotos, precio, habitaciones, servicios, dirección…); dentro del anuncio sale «Editar anuncio (administrador)». Cada tienda tiene «Editar», que abre la edición completa de la v441. El anuncio sigue siendo del dueño, con su nombre, WhatsApp y fecha. Pedido por la dueña | #175 |
| v466 | **Ícono del Muro:** el botón «Muro» de la barra de abajo cambia el megáfono (que era de Clasificados) por una lista con cuadros a la izquierda y líneas a la derecha, como se ven las publicaciones del Muro (v454). Es «layout-list» de Lucide, la misma familia de íconos de línea. Cambio en `v442-muro.js` (`MURO_IC` y `nombre()`). Pedido por la dueña | #175 |
| v467 | **Ícono de «Ver el muro»:** el botón «Ver el muro», al lado de «Lo más reciente» en el inicio (v455), todavía tenía el megáfono; ahora usa el mismo ícono de lista de la barra de abajo (v466). Cambio en `v455-inicio-solo-reciente.js` (línea 7). Los megáfonos que quedan son de Clasificados y de «Publica un anuncio», no del Muro. Pedido por la dueña | #176 |
| v468 | **Más espacio para «Documentación requerida»** (arriendo): pasa de una línea de 120 letras a una caja de varias líneas de hasta 400 letras, como la descripción; en el anuncio se ve con sus renglones. Cambio en `12-s.js` (línea 33, `t:'area'`; línea 99, `white-space:pre-line` para los campos de varias líneas). Pedido por la dueña con una captura | #176 |
| v469 | **«Verificado» solo en la tienda:** las tarjetas de producto de una tienda verificada ya no llevan el sello «Verificado» sobre la foto (v124, `cardOv` en `07-cardov.js`); la tienda sigue mostrando «Vecino verificado» en su ficha y su tarjeta. Pedido por la dueña | #176 |
| v470 | **Publicaciones plegables:** en Administrador → Publicaciones, cada tienda, anuncio y clasificado muestra solo su nombre con «+»; al tocarlo aparecen sus botones (Destacar, Verificar, Bloquear, Editar, Corregir dirección, Eliminar) y el signo pasa a «−», que los oculta. Se recuerda cuál quedó abierta al volver a dibujar el panel. Archivo `v470-publicaciones-plegables.js`. Pedido por la dueña con una captura | #176 |
| v471 | **Arreglo: las subcategorías nuevas no se guardaban.** La v464 metía la nueva en medio de la lista y había que reescribir el orden de unas 30 categorías; mientras eso se guardaba, cada aviso de Firebase rehacía la lista y la ficha del sitio con la copia del servidor, y se perdía lo agregado en ese rato (una segunda subcategoría desaparecía y el grupo de la primera pasaba a «Otros» por un momento). Ahora la nueva va antes de «Otros», el panel muestra «Guardando…» y no deja otro cambio hasta que el servidor confirma la subcategoría y su grupo. Reproducido y comprobado con Firebase 10.12.2 real contra el emulador. Reportado por la dueña | #177 |
| v472 | **Inventario de ferretería en Mi Pradera:** la página de inventario que se hizo en Claude (`inventario_ferreteria_v9.html`) queda como página aparte, `ferreteria.html` (`mipradera.com.co/ferreteria`), y guarda en el Firebase de Mi Pradera en vez de la base de Claude. Se entra con la misma cuenta de Mi Pradera (si ya entró en la página principal, entra sola) y hace falta el rol **Comerciante** vigente. Cada cuenta tiene su inventario aparte. El catálogo para clientes se publica en `mipradera.com.co/ferreteria?t=<uid>`. Las fotos van a R2 con el worker de siempre. Reglas **v52**. Pedido por la dueña | #178 |
| v473 | **Inventario solo para ferreterías, dentro de «Mis tiendas»:** en Mi cuenta → Mis tiendas, cada tienda de la categoría «Ferreterías» (o el nombre viejo «Ferretería») tiene el botón «Inventario», al lado de «Editar», que abre `mipradera.com.co/ferreteria`. Las tiendas que no son ferretería no lo tienen. La página de ferretería también lo exige: a un comerciante con otro tipo de negocio le dice que es para ferreterías y lo manda a Mi cuenta. Archivo `v473-enlace-ferreteria.js` (envuelve `shopTableHTML` de la v284, no la cambia). Pedido por la dueña | #179 |
| v474 | **Una sola tienda para las ferreterías:** la tienda de una ferretería en Mi Pradera es su vitrina, con los productos que se publican desde el inventario y los colores de ferretería que eligió el dueño (amarillo y negro, naranja, azul, rojo, acero o madera). «Publicar tienda» del inventario escribe en Mi Pradera el nombre, el precio, la foto y si está agotado. La primera vez que se abre el inventario, los productos puestos a mano en la tienda pasan al inventario (con existencias en 0) y conservan sus calificaciones. El botón «Inventario» de Mis tiendas va directo al patrón. En su tienda, el dueño ya no ve «+ Producto», «Lista de productos», «Categorías» ni editar o quitar productos: sale un aviso con «Abrir inventario». Los enlaces viejos `ferreteria?t=` llevan a la tienda de Mi Pradera. Archivos `v474-ferreteria-tienda.js` y `.css`, y `ferreteria.html`. Las reglas no cambian. Pedido por la dueña | #180 |
| v475 | **Subcategorías de tiendas: el aviso se ve y Enter funciona.** La dueña reportó que al crear una subcategoría en el panel «no crea nada». Con el Firebase de prueba sí se crea; lo que fallaba era el aviso. Si el nombre ya existía (por ejemplo «Ferreterías») o era un nombre viejo («Ferretería» la página lo cambia solo a «Ferreterías»), el error salía al final de la lista de grupos, fuera de la pantalla. Además, «Ir»/Enter del teclado no hacía nada. Ahora el error sale en rojo justo debajo del campo de ese grupo, y Enter agrega la subcategoría. Cambio en `v464-subcategorias-tiendas.js` (líneas 58, 70-71 y 96-97). Reportado por la dueña | #181 |
| v476 | **Mover subcategorías a otro grupo:** en Administrador → Categorías → «Categorías de tiendas», cada subcategoría tiene «Mover a» con la lista de grupos. Al cambiarlo pasa a ese grupo, también si es de fábrica, y sus tiendas se van con ella (el grupo sale del nombre de la categoría). Se guarda en `S.site.catGrp` (meta/site) con la misma espera de confirmación de la v471 («Guardando…»). «Otros» no se mueve. Cambio en `v464-subcategorias-tiendas.js` (líneas 21-23, 26, 79-86 y 108-110). Pedido por la dueña | #182 |
| v477 | **El inventario y la tienda de ferretería para todo «Hogar y construcción»:** antes solo las tiendas de «Ferreterías». Ahora cuenta cualquier subcategoría del grupo: Ferreterías, Hogar y decoración, Cacharrerías y misceláneas, los nombres viejos (Ferretería, Hogar, Muebles y decoración, Cacharrerías) y las que el administrador cree o mueva a ese grupo (v464, v476). Las que saque del grupo dejan de contar. Esto aplica al botón «Inventario» de Mis tiendas, a los colores de ferretería en la tienda y al ingreso en `ferreteria.html`, que lee los grupos de `meta/site.catGrp`. Mi Pradera usa `window.qhFerCat(cat)` (en `v473-enlace-ferreteria.js`, con `catGroupOf`); la página de ferretería usa `esHogar(cat)`, con la misma regla. Las reglas no cambian. Pedido por la dueña | — |

---

## 3. Lo que tiene que hacer la dueña (fuera del código)

0. **Probar en un teléfono real** lo que las pruebas no pueden comprobar (todo hasta el PR #177 ya está fusionado):
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
   - tocar «Muro» abajo y deslizar el dedo a los lados entre las pestañas; bajar por las tarjetas; tocar «+ Publicar» y probar cada opción (v442);
   - con la sesión abierta, ya no debe salir abajo «Tienes tu registro sin terminar» (v443);
   - abrir una tienda con categorías (por ejemplo, Gelatier): cada producto en su fila, con la foto a la izquierda y «Agregar al carrito» a la derecha (v444);
   - en «Mapa», elegir «Mostrar: Arriendos e inmuebles en venta» y tocar el pin de la casa; en el panel, Usuarios → «Inmuebles por ubicar», ponerles el código plus a los que falten (v445).
   - escribir rápido en el buscador de arriba: no se traba y la lista sale al terminar de escribir; Enter abre el resultado correcto (v446);
   - abrir mipradera.com.co: sale la página de una vez, con cajas grises que se cambian por las publicaciones (sin la pantalla del logo); el enlace de una tienda desde WhatsApp sí muestra la pantalla del logo y abre la tienda (v448, v449);
   - pasar a modo oscuro con la luna y volver: todo se ve igual que antes (v450);
   - abrir «Noticias» y una noticia: se ven sus reacciones y comentarios; abrir un clasificado: «¿Te sirvió este anuncio?» funciona (v451, v452);
   - el Muro en «Todo»: negocios, servicios, vehículos e inmuebles en fila con el logo a la izquierda; los clasificados como en Facebook (v454);
   - la página principal: solo «Lo más reciente» y al lado «Ver el muro», sin «Ver por categorías» (v455, v456);
   - el estilo redondeado: letra nueva, botones y tarjetas redondeados; al bajar, las secciones de arriba aparecen suaves y la foto de publicidad se mueve un poco; con «reducir movimiento» nada se mueve (v457);
   - la ficha de una tienda: «Teléfono» con el número, que al tocarlo llama (v458);
   - publicar un arriendo: marcar los servicios que tiene la vivienda y, aparte, los que ya están pagos en el arriendo; en el anuncio salen los dos (v459, v460);
   - crear una tienda y publicar un arriendo: en la dirección no sale el mapa ni la pregunta, sí la referencia; en el panel, Usuarios → «Negocios por ubicar» e «Inmuebles por ubicar» muestran la referencia y se les pone el código plus (v462);
   - en el panel, Publicaciones → «Corregir dirección» en una tienda y en un arriendo: cambiar la dirección y la referencia, guardar y revisar desde la cuenta del dueño que el cambio está (v463);
   - en el panel, Categorías → «Categorías de tiendas»: abrir un grupo, agregar una subcategoría, cambiarle el nombre y eliminarla; al crear una tienda, la nueva sale dentro de su grupo (v464);
   - en el panel, Publicaciones → «Editar» en un arriendo: cambiar algo, guardar y revisar desde la cuenta del dueño que el cambio está y que él puede seguir editando (v465);
   - el botón «Muro» de abajo y «Ver el muro» del inicio con el ícono de lista (v466, v467);
   - publicar un arriendo con varios renglones en «Documentación requerida» y verlos en el anuncio (v468);
   - una tienda verificada: «Vecino verificado» en la tienda y sus productos sin el sello (v469);
   - en el panel, Publicaciones: cada publicación con «+»; al tocarlo salen sus botones y con «−» se ocultan (v470);
   - en el panel, Categorías → «Categorías de tiendas»: agregar dos subcategorías, una después de otra, esperando a que desaparezca «Guardando…»; recargar y revisar que las dos sigan en su grupo (v471). Volver a crear las que se perdieron antes del arreglo.
1. **Worker de Cloudflare:** hecho. El 27 de noviembre de 2026 la dueña instaló `worker_v13_INSTALAR.js`, que incluye todo lo de la v12 (UID nuevo del administrador en la línea 57, avisos de pagos de roles). Falta comprobar que llegue un aviso de Telegram con el próximo pago de rol.
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
9. **Guardar los videos nuevos** («Todos venden, nadie compra» e «Info al inbox», sección 5): solo se entregaron por el chat; los proyectos quedaron en la carpeta temporal de la sesión y se borran al cerrarla.
10. **Tarea programada «Revisar PR #175»:** ya no hace falta porque ese PR se fusionó. Se puede borrar (o pedirle a Claude que la borre).
11. **Inventario de ferretería (v472):**
    - probar en el teléfono: con una cuenta con el rol Comerciante y una tienda de la categoría «Ferreterías», entrar por Mi cuenta → Mis tiendas → «Inventario» (debe salir el patrón directo), revisar que los productos que tenía la tienda pasaron al inventario y ponerles existencias, crear un producto con foto, hacer una salida, elegir los colores en Opciones, tocar «Publicar tienda» y abrir la tienda en Mi Pradera sin sesión: los productos, los precios, «Agotado» y los colores (v474);
    - al subir la primera foto, revisar en Cloudflare → R2 → `imagenes-qhep` que quedó en la carpeta `f/` (worker v13).

Ya hecho (27 de noviembre de 2026): las reglas v52 (inventario de ferretería) están publicadas en Firebase, el PR #178 está fusionado y el worker v13 está instalado en Cloudflare. Ya hecho (14 de noviembre de 2026): las reglas v51 están publicadas en Firebase; los roles de `contacto@mipradera.com.co` se recuperaron con el botón de la v406; la dueña miró en la página real el mapa de un inmueble (v409) y se ve bien. El 15 de noviembre de 2026 probó en su teléfono el letrero de «Abierto» fuera del horario (v421) y creó una tienda recorriendo los 6 pasos (v417, v420); las dos cosas funcionaron.

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

**Inventario de ferretería (v472, 27 de noviembre de 2026):**
- La dueña eligió: solo cuentas con el rol **Comerciante** vigente (`acc.merc` o `acc.merc1`), mantener el catálogo para clientes y guardar las fotos en R2 con el worker.
- Archivo `ferreteria.html` en la raíz, fuera de `src/` y de `tools/armar.mjs`: es una página aparte. No va en una carpeta (`ferreteria/`) porque el service worker (`sw.js`) guarda como «copia del inicio» cualquier dirección que termine en `/`, y la página nueva la pisaría.
- El programa de la página es el de Claude casi sin cambios (7 líneas: líneas 608, 633, 673, 749, 1396, 1399 y 1693 de `ferreteria.html`). Va como `<script type="text/plain" id="ferMain">`; al final, el cargador `qh-ferreteria` conecta Firebase (mismo proyecto, misma sesión, App Check igual que la v379/v385), revisa la sesión y el rol, carga el catálogo publicado y le entrega al programa `window.claude.use(...)` con: la base de datos (Firestore, en `fer/<uid>/…`), el usuario, las fotos (R2), las descargas (CSV) y «Publicar tienda» (guarda `ferPub/<uid>` y recarga).
- Datos: `fer/<uid>/productos/<id>`, `fer/<uid>/dias/<aaaa-mm-dd>` (los movimientos de cada día en un documento), `fer/<uid>/sys/config`, `sys/acceso` (patrón, con PBKDF2) y `sys/lock` (turno para registrar movimientos, con una transacción). Catálogo público: `ferPub/<uid>`.
- Rol vencido: la persona ve su inventario en solo lectura, con el aviso de la fecha en que venció. Sin rol y sin inventario: «necesitas el rol Comerciante» y «Ver planes y precios».
- El inventario va por el **uid** de la cuenta: si la cuenta se borra y se vuelve a crear, el inventario queda en el uid viejo (el administrador lo puede leer y copiar).
- Entrar: correo o celular y clave, o Google (ventana emergente). Crear cuenta y «Olvidé mi clave» llevan a la página principal. «Cerrar sesión» cierra también la sesión de la página principal (es la misma).
- **Fotos en R2 y worker v13:** revisado el worker v12 (27 de noviembre de 2026). El riesgo real era la **limpieza semanal** del worker (`cleanup`, los domingos con el Cron Trigger): lista todo `u/` y borra lo que tenga más de 7 días y no aparezca en las colecciones públicas (`PUBLIC_COLS`). El inventario es privado y el worker no lo puede leer, así que habría borrado las fotos de todas las ferreterías. «Imágenes huérfanas» del panel no era el problema: `/list` y `DELETE` solo tocan `u/<uid de quien llama>/`. Arreglo, **worker v13**: con `POST /?carpeta=fer` la foto se guarda en `f/<uid>/…`, que ni la limpieza semanal ni el panel tocan; el límite de 40 fotos al día se cuenta aparte. `ferreteria.html` sube con `?carpeta=fer` (línea 1888). Con el v12 instalado, el parámetro se ignora y la foto va a `u/` como antes, sin errores. Probado en Node con un R2 simulado y un token firmado: 11 de 11 con el v13 (con el v12, las 4 comprobaciones de `f/` fallan, como se esperaba).
- El worker no está en el repositorio: la dueña guarda `worker_v13_INSTALAR.js`. La regla de `collectionGroup('productos')` para el administrador (reglas v52) queda por si más adelante se quiere limpiar también `f/`.
- Borrar o cambiar una foto en el inventario no la borra de R2 (en R2 solo borra el administrador, y solo en `u/`): esas fotos se quedan en `f/` ocupando espacio. Si algún día pesa, se puede hacer una limpieza de `f/` que compare con `fer/*/productos`.
- Prueba de punta a punta (no está en el repositorio ni en la CI): Firebase real de npm contra los emuladores de Firestore (reglas v52) y Authentication, con Playwright: entrar, patrón, producto con foto, salida, publicar, catálogo sin sesión y pedido por WhatsApp, cuenta sin rol y rol vencido. 23 de 23 bien, sin errores de JavaScript.
- Enlace desde la página principal (v473, la dueña lo pidió después): botón «Inventario» en Mi cuenta → Mis tiendas, solo en las tiendas de ferretería. Primero se probó como fila aparte en Mi cuenta y la dueña pidió que fuera dentro de Mis tiendas. El botón sale aunque la persona no tenga el rol Comerciante; en ese caso la página le dice que lo necesita y le muestra «Ver planes y precios». También se llega escribiendo `mipradera.com.co/ferreteria`.
- **Solo ferreterías (v473):** la cuenta debe tener una tienda propia (por `ownerUid` o por `ownerKey`) cuya categoría diga «ferreter…» («Ferreterías», «Ferretería» o una subcategoría que el administrador cree con esa palabra). El administrador entra siempre. Si alguien ya tiene inventario y su tienda deja de ser ferretería, lo ve en solo lectura. **Esto lo revisa solo la página, no las reglas:** un comerciante con otro negocio que escriba a Firestore por la consola del navegador podría guardar su propio inventario privado o publicar un catálogo. Cerrarlo en las reglas (v53) pide guardar el id de la tienda en `fer/<uid>/sys/config` y revisarlo en cada escritura (dos lecturas más). No se hizo porque el daño es bajo: solo afecta los datos de esa misma cuenta, que ya pagó el rol.
- **Una sola tienda (v474):** la dueña eligió, entre tres opciones, que la tienda de Mi Pradera de una ferretería sea su vitrina («Una sola tienda»), y que los productos los mande el inventario.
  - Por qué «Inventario» abría la vitrina: no se pudo reproducir; en la simulación el enlace llegaba con `#inventario`. Ahora la página de ferretería, sin `?t=`, siempre entra a «Acceso del equipo» (patrón), y cualquier parte de la vitrina (`#productos`, «Volver a la tienda», «Ver tienda») lleva a la tienda de Mi Pradera.
  - Los productos: un producto del inventario y el de Mi Pradera tienen el **mismo id** (`products/<tienda>__<id>`). Al abrir el inventario, los productos de la tienda que no tienen la marca `fer:1` pasan al inventario (nombre, precio, categoría interna `c1`, primera foto `https`, existencias en 0) y quedan marcados `fer:1`; así conservan sus calificaciones, sus otras fotos y su descripción. Sale un aviso: ponerles existencias antes de publicar, porque sin existencias salen como «Agotado».
  - «Publicar tienda»: crea o actualiza en Mi Pradera `name`, `price`, `imgs` (la foto del inventario primero; `ferF` recuerda cuál puso), `out` (agotado), `fer:1` y `ownerUid`; borra de Mi Pradera los productos `fer:1` que ya no se muestran (ocultos o eliminados en el inventario; pierden sus calificaciones). Guarda `ferTema` en la tienda y el id de la tienda en `fer/<uid>/sys/config.sid`. `ferPub/<uid>` se sigue guardando (lo usa «cambios pendientes»).
  - La tienda que se une: la del botón «Inventario» (`?s=<id>`), si no la guardada en `sys/config.sid`, si no la primera ferretería de la cuenta. Con varias ferreterías, cada una se publica desde su botón, pero el inventario es uno solo por cuenta.
  - En la pestaña «Tienda» del inventario se ocultó «Datos de la tienda» (WhatsApp, dirección, horario): esos datos son los de la tienda de Mi Pradera (Mis tiendas → Editar). El aviso «Falta el WhatsApp» no sale si la tienda es de Mi Pradera (línea 1373 de `ferreteria.html`, `window.qhFer?.tienda`).
  - Colores (`v474-ferreteria-tienda.css`): el letrero con el nombre sobre el tablero perforado, la raya de arriba, los botones de la ficha, la raya de «Productos» y «Agregar al carrito». Van en variables `--fza…--fzq` (sin palabras como ink, bg o line) para que el modo oscuro automático (v219) no las cambie; el modo oscuro tiene sus colores a mano. La marca `<i class="qhfer-m">` se antepone a la vista de la tienda y los estilos usan `body:has(.qhfer-m)`.
  - Para el dueño se esconden con CSS «+ Producto», «Lista de productos», «Categorías», «Editar» y la ✕ de los productos en la vista de su tienda. **No** se escondió «Editar» en la ficha de un producto (otra vista): si lo cambia ahí, «Publicar tienda» lo vuelve a poner como está en el inventario.
  - Las categorías internas de la tienda (`c1`) no se escriben al publicar: los importados conservan la suya y los nuevos quedan en «Otros productos».
  - Probado: prueba de punta a punta con el emulador (32 de 32, en la carpeta temporal de la sesión) y pruebas `enlaceFerreteria` y `ferreteriaTienda` en `tests/pagina/pruebas.cjs`.

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
- **Lista de velocidad (21 de noviembre de 2026, v446–v447):** la dueña mandó una lista general de 30 consejos de velocidad. Medido ese día: la base tiene 7 tiendas, 2 productos, 1 anuncio y 0 noticias, y la página pesa 1,36 MB (unos 425 KB comprimida). Se hicieron el retardo del buscador y las fuentes propias. Ya estaban: imágenes subidas en WebP, CDN (GitHub Pages y R2 de Cloudflare), compresión (la pone GitHub Pages), reCAPTCHA, Google Maps y Leaflet cargados solo al usarse, caché del logo e íconos en el service worker, «Ver más» de 30 en 30 en el Muro y en noticias. No aplican porque no hay servidor propio ni base SQL: cola de trabajos, pool de conexiones, acercar el servidor a la base, repartir entre instancias, pedir solo columnas, consultas N+1 de SQL. Encabezados de caché: GitHub Pages no deja cambiarlos. Esqueletos de carga: hechos en la v448 (ver abajo). **Dividir el JavaScript: medido y descartado.** En un celular lento simulado (CPU 4 veces más lenta, 4G lenta de 1,6 Mbps, 150 ms) la página empieza a verse a los 0,76 s, termina de bajar a los 2,65 s y ejecuta unos 650 ms de código. Los módulos que solo usa el administrador suman unos 30 KB (9 KB comprimidos, menos de 0,1 s); el resto del código del panel está mezclado dentro del código principal (17 pedazos cortados a mitad de función) y separarlo sería rehacerlo. El trabajo más grande era el generador del modo oscuro (v219): 200 a 300 ms en cada carga, también en modo claro. La v450 lo deja trabajar solo con el modo oscuro encendido: el código baja a unos 350 ms. El script para medir está descrito en la v450 (abajo). Noticias: hechas en la v451 (ver abajo). Pendientes para decidir: medir usuarios reales con Firebase Performance Monitoring.
- **Estilo «Vitrina» (v461), descartado:** el 22 de noviembre de 2026 la dueña pidió 3 estilos para un rediseño; con el catálogo de temas de la skill hallmark se propusieron Pradera Verde (tema Squeeze), Vitrina (Ink) y Feria (Sticker), con maquetas del inicio en celular. Eligió Vitrina, se aplicó (commit 88fdd6b: letra Epilogue, botones negros, acento verde azulado #00746d) y después pidió olvidar los cambios: se deshizo con `git revert` y la página sigue con el estilo de la v457. Si se retoma, el commit 88fdd6b tiene todo (y la nota del modo oscuro: las variables no pueden llamarse «ink», «paper» ni «rule», porque el generador v219 las reemplaza).
- **El administrador edita anuncios (v465):**
  - `v465-admin-edita-anuncios.js` abre `adForm(tipo, anuncio)` con los datos del dueño; al guardar, `Object.assign` solo cambia los campos del formulario, así que `ownerKey`, `ownerUid` y `ts` no cambian (lo revisa la prueba `adminEditaAnuncios`);
  - después de guardar, el administrador queda viendo el anuncio; vuelve al panel por el menú;
  - **no incluidos:** los servicios (oficios), porque no tienen formulario de edición ni siquiera para el dueño, y los clasificados, porque al guardar `QH.comPut` pone como dueño a quien guarda (`ownerUid`): editados desde el panel quedarían a nombre del administrador. Para hacerlos hay que cambiar eso primero.
- **Por qué no se guardaban las subcategorías nuevas (v471):**
  - causa: `flush()` (01-cats.js) escribe documento por documento con `await`; cada escritura dispara un aviso de Firebase (`onSnapshot`) y, si lo del servidor no coincide con la memoria, `rebuild()` rehace `CATS` y `S.site` con la copia del servidor. Lo cambiado y aún no enviado se pierde. La v464 insertaba en medio, el orden (`_o`) de casi todas cambiaba y la ventana duraba varios segundos;
  - el Firebase falso de las pruebas no lo muestra (avisa distinto). Se reprodujo con el Firebase real de npm (`firebase@10.12.2`, porque `www.gstatic.com` está bloqueado en la nube) contra los emuladores de Firestore (8089, con las reglas v51) y Authentication (9099), con la cuenta del administrador creada con su mismo UID. Script en la carpeta temporal de la sesión (`emu/repro-emu*.cjs`): `useEmulator` en `index.html`, la CSP abierta a 127.0.0.1 y Chromium con `--no-proxy-server`;
  - el mismo riesgo existe en cualquier cambio hecho mientras otro se está guardando (es de cómo sincroniza la página, no solo de categorías); con categorías ya no pasa porque el panel espera la confirmación.
- **Subcategorías de tiendas (v464):**
  - los grupos son los de fábrica (`CAT_GRP` en v215) y no se crean ni se borran desde el panel; las subcategorías son las categorías de `CATS` de siempre;
  - el grupo de cada subcategoría creada en el panel se guarda en `S.site.catGrp` (`{nombre: grupo}`, en meta/site). `catGroupOf()` mira primero esa lista; las reglas no cambian;
  - cambiar el nombre conserva el grupo (también para las de fábrica); eliminar usa el `catDel` de siempre (pregunta y pasa sus tiendas a «Otros»);
  - no se puede crear con un nombre viejo de `CAT_MAP` (la página lo cambiaría solo) ni con `< > " \``;
  - el bloque viejo de `11-profilemodal.js` (línea 27) sigue ahí: si se quita `v464-subcategorias-tiendas.js` de `src/orden.json`, vuelve la lista plana y lo creado pasa a «Otros».
- **Dirección sin mapa (v462):**
  - lo pidió la dueña el 22 de noviembre de 2026: «a los nuevos usuarios no les muestres el mapa cuando escriben sus direcciones, solo dirección y abajo la referencia; quitar la pregunta de si la dirección está bien; solo el administrador pone el código plus»;
  - es un interruptor (`window.qhSinMapa` en `v462-direccion-sin-mapa.js`), que leen v395 (no dibuja el mapa), v396 (no pone el mapa ni el aviso), v402 (no pone los botones Sí/No) y v335 (lista de negocios). Quitar el archivo de `src/orden.json` vuelve a como estaba;
  - la pregunta vieja no se borra: queda oculta en el formulario y conserva la respuesta que ya tenía cada tienda (`mapfix`) o inmueble (`f.mapok`), así lo pendiente sigue pendiente;
  - campo nuevo: `ref` en la tienda (en `09-rateform.js`, `#x-ref`, máximo 120 letras; sale en la ficha, v337) y `f.ref` en el arriendo y la venta (se agrega a `ADT` al cargar la página, porque el programa principal carga después de los archivos vNNN). Las reglas no cambian;
  - «Negocios por ubicar» (v335) lista también los negocios con dirección y sin código plus ni punto, no solo los que el dueño marcó; «Inmuebles por ubicar» ya los listaba (v445);
  - no cambió: el mapa que ve el visitante en el anuncio del inmueble (v409) y en la tienda. Si el administrador no ha puesto el código plus, ese mapa se arma con la dirección escrita y podría marcar otro lugar; antes se ocultaba si el dueño decía «No lo ubica bien», y ahora nadie lo dice. Si se quiere, se puede mostrar solo cuando el administrador ya puso el punto;
  - «Mis direcciones» de la cuenta (v322, v358) sigue apagada desde la v424, y «Tus datos para el pedido» ya no tenía mapa.
- **Servicios de la vivienda (v459):**
  - en `ADT.arr.F` (12-s.js): campo nuevo `svc` (multi: Agua, Energía, Gas natural, Internet) antes de `inc`. Se guarda en `a.f.svc`; las reglas no limitan los campos de `f`, así que no cambian;
  - `inc` cambió de nombre y, en la v460, de palabras: Agua, Energía, Gas natural, Internet, TV por cable. `v460-servicios-nombres.js` (después de v413 en `src/orden.json`) envuelve `window.docFix` y al leer un anuncio cambia «Luz» → «Energía» y «Gas» → «Gas natural» en `f.inc` (solo en memoria; el dueño guarda la versión nueva cuando edita);
  - solo en arriendo; la venta de casas no tiene este campo.
- **Estilo redondeado (v457):**
  - lo pidió la dueña el 21 de noviembre de 2026: «copiar la fuente, estilos y diseños de co.addi.com, sus transiciones, imágenes con esquinas redondeadas e imágenes que parecen tener movimiento al hacer scroll». Cambia la preferencia anterior de «diseño cuadrado»;
  - se estudió co.addi.com con Playwright (se agregaron `co.addi.com` y `framerusercontent.com` a la red del entorno, con permiso de la dueña). Es un sitio de Framer: letras Outfit y Onest (Google Fonts, licencia OFL), esquinas de 32/18/7 px y píldoras, fondos blancos y grises claros, y movimiento hecho con el código de Framer (parallax de 70 a 210 px, giros de 4-5°, entrada que crece de 0,8 a 1);
  - se tomó la forma, no la marca: los colores, el logo, los textos y las fotos siguen siendo de Mi Pradera. Las letras se sirven desde `fuentes/` (`outfit-latin.woff2`, `onest-latin.woff2` y sus latin-ext, con su licencia OFL). Rubik sigue en `fuentes/` pero ya no se pide primero (la precarga es de Outfit);
  - `v457-estilo-redondeado.css`: letras, esquinas (`--r-s` 14, `--r-m` 18, `--r-l` 24 px; píldora 999 px) y las piezas que quedaban rectas (revisadas pantalla por pantalla con un script que lista cajas sin esquinas redondeadas). Los títulos necesitan una selección más específica que `v269` (que pone la letra del texto a todo con `!important`) y que `v370` (título del inicio en 800);
  - `v274` (colores de «¿Qué quieres publicar?») sigue; solo se le redondean las esquinas. El verde de `.hhr.hhrf` (venía en `v273`) se conserva en la v457;
  - `v457-movimiento.js`: con la skill `animate` se decidió mover solo la parte de presentación del inicio (título, íconos, carrusel de anuncios, publicidad y «Negocios»), no las listas que se usan a diario. Aparecer: una vez, 600 ms, `cubic-bezier(.23,1,.32,1)`, sube 16 px; lo que ya se ve al abrir no espera. Parallax: la foto de publicidad (`.bns img`) se mueve hasta 18 px. Con «reducir movimiento» no hace nada;
  - para volver al diseño cuadrado: quitar los dos archivos v457 de `src/orden.json` y volver a poner v273, v276 y v277 (siguen en `src/estilos/`).
- **Inicio solo con «Lo más reciente» (v455):**
  - lo pidió la dueña el 21 de noviembre de 2026, marcando en una captura las pestañas al lado de «Lo más reciente»;
  - `v455-inicio-solo-reciente.js` quita del inicio las pestañas 2 a 8 de `hubSwipe` (06-cattitle.js) con su contenido, las flechas y el aviso «Desliza…», y agrega «Ver el muro» (hace clic en el botón Muro de la barra de abajo, que abre el Muro en «Todo»). No cambia 06-cattitle.js;
  - no se quitaron: los íconos de categorías de arriba (Tiendas, Comidas…) ni «Negocios». El botón «Ver por categorías →» se quitó después, en la v456;
  - las tarjetas de la v453 (negocios en fila) solo salían en esas pestañas, así que hoy no se ven en el inicio; el CSS sigue por si vuelven;
  - con `window.qhInicioCompleto=true` vuelven todas las pestañas (lo usan las pruebas de la v453). Quitar los dos archivos v455 de `src/orden.json` las devuelve.
- **Muro en fila (v454):**
  - lo pidió la dueña el 21 de noviembre de 2026: en el Muro, todo con el logo a un lado y los datos al lado, menos los clasificados, que siguen como en Facebook;
  - cambio en `card()` de `v442-muro.js` (las tarjetas que no son clasificados) y estilos en `v454-muro-en-fila.css`. Va en todos los tamaños de pantalla (el Muro es una sola columna). Para volver a la tarjeta anterior: poner `window.qhMuroViejo=true` o borrar el bloque marcado «v454» en `card()`;
  - los negocios ahora tienen WhatsApp (`data-act="hubWa"`, el mismo del inicio) y sus estrellas; antes solo «Ver tienda»;
  - en vehículos, inmuebles y noticias la línea grande es el título y debajo va el nombre de quien publica;
  - el logo va sobre blanco, también en modo oscuro (igual que la v453).
- **Negocios en fila (v453):**
  - lo pidió la dueña el 21 de noviembre de 2026, con capturas de la pestaña Tiendas del inicio: «que muestre su logo a un lado y la información básica al lado, como en los productos»;
  - es la tarjeta `hubSC` (06-cattitle.js, clase `.hsc`), que solo usan las pestañas del inicio. «Ver todos» (lista de tiendas, `shopCard`) ya tenía el logo a la izquierda y no cambió;
  - con logo y portada se muestra el logo (la portada se oculta con `:has()`; en navegadores muy viejos se vería la portada con el logo encima, como antes); solo logo: el logo; sin logo: la portada; sin nada: el ícono;
  - el logo va siempre sobre blanco, también en modo oscuro, para que un logo de letras oscuras con fondo transparente no se pierda;
  - solo en celular (menos de 640 px), igual que la v444; en computador las tarjetas siguen con la foto arriba. Las de servicios (sin foto) ocupan todo el ancho.
- **Noticias livianas (v451):**
  - cambios en `v250-noticias-blog.js`: la escucha de toda la colección `nwFb` se cambió por `subs()`, que pone una escucha `where('nw','==',id)` por cada noticia en pantalla (`.nwfb[data-nw]` en la noticia abierta, `.nwcnt[data-nwc]` en las tarjetas) y la quita cuando la noticia sale de la pantalla. Se llama desde el MutationObserver que ya había;
  - mientras no llegan los comentarios de una noticia, su caja queda vacía (antes salía «Aún no hay comentarios» un instante);
  - la consulta del aviso de noticias nuevas pasó de `limit(10)` a `limit(60)`, igual que `nwLim` en 02-news.js: Firebase junta las consultas idénticas y la pide una sola vez; `latest()` sigue usando solo las 10 primeras. Si se cambia `nwLim`, cambiar también ese 60;
  - las reglas no cambian (`nwFb` ya se puede leer completa);
  - `cmFb` (opiniones de la comunidad, v225) se arregló igual en la v452: `subs()` en `v225-opiniones.js` pone una escucha `where('ad','==',id)` por cada `.cmfb[data-ad]` en pantalla (sin contar las de `.cwz-card`);
  - en las pruebas, el Firebase falso anota las consultas en `window.__fbQ` y `window.__fbOyentes('colección')` dice cuántas escuchas tiene.
- **Modo oscuro bajo demanda (v450):**
  - dos cambios en `v219-modo-oscuro.js`: `scanAll()` no hace nada si `<html>` no tiene la clase `dark`, y al cambiar esa clase se llama `scanAll()`. Al pasar a oscuro, la hoja se genera en ese momento (una vez, unos 250 ms en un celular lento) antes de que se dibuje;
  - comparado pixel a pixel: pasar a oscuro con el botón se ve igual que abrir la página ya en oscuro (inicio y tienda, 0 pixeles distintos);
  - para medir el arranque: Playwright con `Emulation.setCPUThrottlingRate` (4) y `Network.emulateNetworkConditions`, un servidor que manda la página comprimida, y una traza con `browser.startTracing` sumando los eventos `EvaluateScript` por bloque `<script>` (por su número de línea en index.html).
- **Esqueletos de carga (v448):**
  - tres archivos: `v448-esqueletos-inicio.js` (en el `<head>`, decide si es el inicio), `v448-esqueletos.css` y `v448-esqueletos.js` (al final). Quitar los tres de `src/orden.json` vuelve a la pantalla del logo;
  - el aviso de que llegaron los datos es `hideSplash`. Lo define `splash.js`, que va después de los archivos vNNN: el enganche se pone al cargar la página (DOMContentLoaded), no antes, o `splash.js` lo pisa;
  - los enlaces directos siguen con la pantalla del logo porque la página espera los datos para abrir la tienda o el producto (`rtWait`); sin datos mostraría el inicio un momento;
  - mientras carga se oculta la barra de anuncio de arriba (`#annc`): sale o no según los datos y, si se mostraba, la página saltaba;
  - las cajas grises son cuadradas y con el mismo brillo de las fotos que cargan (v13); con «reducir movimiento» no brillan; el modo oscuro las oscurece solo (v219);
  - en las pruebas, `window.__fbDemora` (en milisegundos) hace que el Firebase falso tarde en entregar los datos. Para recargar la página en una prueba hay que cambiar la dirección (`?r=1`): si solo cambia lo que va después de «#», no se recarga.

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

**Videos y documentos (18-21 de noviembre de 2026):**
- Todos los videos se entregaron por el chat. Sus proyectos quedaron en la carpeta temporal de la sesión (se borra al cerrarse la sesión); no están en el repositorio.
- «La lavadora de doña Marta» (clasificados, 55 s): voces de Lina y «Cronos Paint» (ElevenLabs), placas con texto en vez de ilustraciones (ElevenLabs no dejó generarlas). Hay una versión sin música (`_v2`).
- «Las hamburguesas de don Fabio» (tienda virtual, 62 s): sin música.
- «El apartamento de doña Gloria» (inmuebles y arriendos, 52 s): hecho con la skill `cartoon-3d-short` (personajes 2D en un pueblo 3D). Tres lugares: la calle de Gloria, el paradero de buses (se construyó en 3D) y el parque. Voces que mandó la dueña (Lina - Sunny, Kind and Friendly; Fernanda) y Camilo con «Charlie». Fotos aprobadas antes del video.
- **Terminado (20 de noviembre de 2026): «¿Dónde venden ensalada de frutas en Pradera?»** (47 s, sin música) con una tienda real de la página (Heladería Artesanal Gelatier, Carrera 10 #10-657, Centro, de 3:00 a 10:00 p. m., solo recoger en la tienda). Personajes animados (Marcela y Sofi) sobre fotos reales de Pradera que mandó la dueña (la plaza con la iglesia, la acera y la fachada) y una sala dibujada; pantallas reales de la tienda; gancho en el primer segundo con la foto real de la ensalada; cierre para negocios («¿Tienes un negocio? … ¿Qué esperas?» y «Registrar tu negocio es gratis»). Voces que grabó la dueña: Lina - Colombian Warm, Confident (narradora), Fernanda - Conversational (Marcela) y Hellen - Natural Soft Youthful (Sofi). **Antes de publicarlo falta el permiso de Gelatier.**
- **«Negocios cerca de mí»** (21 de noviembre de 2026, 22 s, sin música): con el estilo de un video de referencia que mandó la dueña (una animación tipo mapa de navegación), pero con los colores y el ícono de Mi Pradera, no los de Google Maps. Pradera en 3D desde arriba; se escribe «Negocios cerca de mí»; aparece el punto azul y un círculo de cercanía donde se encienden los pines de los negocios (un color e ícono por categoría); la cámara baja y sigue al punto por las calles, con la ruta azul y avisos de giro («Calle 5», «Carrera 10», «Calle 7»); llega a un pin de Comidas y sube la ficha («Abierto», horario, «Cómo llegar», WhatsApp); la cámara sube y se ven todos los pines; cierre con el ícono y el logo. Voces: Fernanda (la pregunta) y Yorman Zapata - Podcast Ads (narrador). Las calles, los pines y «Panadería del Parque» son de ejemplo. Por esta vez la dueña pidió omitir la regla de los 3 lugares.
- **«Arriendos en Pradera»** (21 de noviembre de 2026, 22 s, sin música): el mismo estilo y movimientos, con pines de casas (verde azulado para arriendo, morado para venta) y la ficha de una casa de ejemplo ($900.000/mes, 3 habitaciones, 2 baños, «Ver fotos», WhatsApp). Cierre: «¿Arriendas o vendes? Publícalo en Mi Pradera». Mismas voces. La foto de la ficha es un dibujo; se puede cambiar por una foto real con permiso del dueño.
- **«Todos venden, nadie compra»** (22 de noviembre de 2026, 68 s, sin música): historia sacada de la experiencia real de la dueña en un grupo de WhatsApp de vendedores de Pradera (todos venden, casi nadie compra, quien necesita algo espera a que alguien conteste y no todo el pueblo está en el grupo).
  - Personajes inventados: Carmen (almuerzos), Andrés (busca una droguería de noche) y Lucía (la sobrina). Lugares: la cocina, la casa de Andrés de noche, el pueblo, la plaza y la puerta de Carmen. El grupo, los nombres y los mensajes son inventados; nada de las capturas reales.
  - Estilo pedido por la dueña con un video de referencia de otro canal (2D plano, subtítulos grandes palabra por palabra, letreros «UN MES DESPUÉS» y contadores). Se tomó la forma, no los personajes ni el guion de ese canal.
  - Voces que generó la dueña en ElevenLabs y mandó por el chat: Lina - Sunny, Kind and Friendly (narradora), Yorman Zapata - Podcast Ads (Andrés), Fernanda - Conversational (Carmen) y Hellen - Natural Soft Youthful (Lucía). Se cortaron por las pausas en 15 clips.
  - Cómo se hizo (sin Remotion): una página HTML con canvas 1080x1920 y `frame(t)`; los personajes salen de `toon.ts` de la skill `cartoon-3d-short` empaquetado con esbuild (se le agregó un celular en la mano); los fondos se dibujan en el canvas; las pantallas del celular son capturas reales de la página con datos de ejemplo (buscar «droguería», la droguería con «Abierto», el Muro con el botón de WhatsApp, «Crea tu tienda» y la tienda con el letrero). Los tiempos de los subtítulos se cuadran con las pausas de cada clip. Playwright saca los cuadros del canvas y los manda a ffmpeg (1 minuto para 2.055 cuadros). Proyecto en la carpeta temporal de la sesión (`video-grupo/`).
  - Lo que el video dice de la página se revisó en el código: no hay botón de WhatsApp dentro de la tienda (solo «Teléfono»), por eso se muestra el de la tarjeta del Muro; no hay categoría de taxis ni «droguería de turno».
- **«Info al inbox»** (22 de noviembre de 2026, 64 s, sin música): los problemas de los grupos de Facebook para arrendar (publicar en 12 grupos, el anuncio enterrado entre perros perdidos, rifas y memes, «Info al inbox» sin canon ni barrio, 80 comentarios de «¿Precio?», anuncios viejos que siguen circulando). Personajes inventados: Don Hernán, Valentina y su hijo, la vecina y Lucía (nieta de Don Hernán). Lugares: la casa de Don Hernán, la pieza de Valentina, su sala y la calle.
  - Mismo sistema que «Todos venden, nadie compra» (`video-arriendo/` en la carpeta temporal; `web/base.js` son las funciones compartidas). El muro de grupo va dibujado, sin logos; Facebook solo se nombra en la voz.
  - Pantallas reales con datos de ejemplo: el formulario de arriendo (canon obligatorio, servicios, documentación, dirección y referencia), el anuncio con fotos y mapa, «Coordinar visita», los filtros (3+ hab., precio máximo), el mapa de arriendos (v445) y «Marcar como arrendado». Desde la nube no cargan Google Maps, OpenStreetMap ni cdnjs: Leaflet se sirvió desde npm y los cuadros del mapa se dibujaron (los pines y las fichas son los de la página).
  - Voces de la dueña: Lina - Sunny, Kind and Friendly; Fernanda - Conversational (Valentina); Diana García - Sales Warm & Persuasive (la vecina); Hellen - Natural Soft Youthful (Lucía); Yorman Zapata - Podcast Ads (Don Hernán).
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
  - `hallmark` (de `Nutlope/hallmark`, commit 04977e1, 7,2 MB; instalada el 22 de noviembre de 2026 a pedido de la dueña): guía de diseño para páginas NUEVAS que se vean diseñadas y no generadas («Powered by Together AI»). Su propia regla: no se usa sobre un diseño que ya existe salvo que se nombre (`/hallmark redesign <ruta>` o `/hallmark audit <ruta>`). Revisada antes de guardarla: sin órdenes ocultas ni envío de datos. Sus programas solo corren si se llaman: `sloplint.mjs` (revisa la página), `theme.mjs` (temas y fotos de Wikimedia), `capture.mjs` (capturas con Puppeteer), `imagegen.mjs` (imágenes con la API de Together, solo con `TOGETHER_API_KEY`, que este entorno no tiene) e `install-hook.mjs`, que agregaría un gancho a `.claude/settings.json` después de cada edición: **no se instaló** el gancho. Sus «reglas mínimas» (colores y letras solo por variables, sin etiquetas en mayúsculas espaciadas, sin «·» entre datos…) chocan con partes del diseño actual de Mi Pradera: mandan las preferencias de la dueña.
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
  - **Videos con estilo de mapa** (21 de noviembre de 2026; no usan Remotion): una página HTML con three.js (`three@0.169` del proyecto de Remotion) arma una ciudad de ejemplo (cuadras, edificios blancos, árboles, parques), los pines como sprites con un ícono por categoría, el punto azul, la ruta y el círculo de cercanía. Una función `frame(t)` dibuja el cuadro del segundo `t` (cámara, pines y letreros en HTML encima); los tiempos de cada escena van en `TL` y se ajustan a lo que dura cada frase del audio. Playwright toma los cuadros (Chromium con `--use-angle=swiftshader --enable-unsafe-swiftshader`, unos 0,3 s por cuadro a 1080×1920, 660 cuadros para 22 s) y ffmpeg los junta con las voces. La niebla se ajusta a la distancia de la cámara, porque si no, desde arriba tapa la ciudad. Los proyectos quedaron en la carpeta temporal de la sesión (`scratchpad/mapa`: `web/mapa.html` y `web/casas.html`).
  - Antes del video final se le mandan a la dueña las fotos de cada escena y, si hace falta, un clip corto del movimiento. Ella genera las voces en ElevenLabs con los diálogos que se le proponen y las manda por el chat.
- **Preferencias de la dueña:**
  - respuestas en español, con las líneas cambiadas y capturas;
  - diseño redondeado desde la v457 (antes pedía cuadrado; el 21 de noviembre de 2026 pidió el estilo de co.addi.com) y modo oscuro;
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
