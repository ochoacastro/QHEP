# Pruebas de Mi Pradera

Se corren solas en GitHub en cada pull request (pestaña **Actions → Pruebas**). Si algo sale en rojo, no fusiones hasta revisarlo.

| Carpeta | Qué prueba |
|---|---|
| `pagina/pruebas.cjs` | La página en un navegador de verdad, con un Firebase falso (`pagina/firebase-falso.js`): inicio claro y oscuro, panel del administrador (12 pestañas), registro, pedido por WhatsApp, dirección, ubicación del anuncio, notificaciones y un celular por cuenta. |
| `reglas/` | Las reglas de seguridad de Firestore (`reglas/firestore.rules`) en el emulador: unos 250 casos de lo que se debe permitir y lo que se debe rechazar. |

**`reglas/firestore.rules` es la versión vigente de las reglas.** Cuando cambien, se actualiza aquí y se publica la misma en la consola de Firebase.

Para correrlas en un computador: `cd tests && npm install && npx playwright install chromium && node pagina/pruebas.cjs`
(las de reglas necesitan Java: `npm run reglas`). Una sola parte: `node pagina/pruebas.cjs registro`.
