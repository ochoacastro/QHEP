# src/ — la página por partes

`index.html` (lo que se publica) **se arma** juntando estos archivos. No se edita `index.html` directo:
se edita aquí y luego se corre

```
node tools/armar.mjs
```

GitHub revisa en cada pull request que `index.html` sea exactamente lo que arman estos archivos (y corre las pruebas de `tests/`).

## Cómo está organizado

| Carpeta | Qué hay |
|---|---|
| `codigo/principal/` | El programa principal de la página (antes un solo bloque de casi 500 KB), en 17 partes en orden: `01-…`, `02-…`. Se juntan en un solo `<script>`. |
| `codigo/` | Cada mejora en su propio archivo, con el nombre de su versión: por ejemplo `v321-notificaciones.js`, `v368-registro-un-paso.js`. 87 archivos. |
| `estilos/` | Las hojas de estilo, una por archivo (`base.css` es la principal). 70 archivos. |
| `html/` | El HTML de la página (encabezado, cuerpo) entre bloque y bloque. |
| `orden.json` | El orden en que se juntan las piezas. Si agregas un archivo nuevo, se agrega aquí en su lugar. |

Para encontrar dónde está algo: busca el texto en `src/` (por ejemplo «Lo más reciente») y edita ese archivo.
