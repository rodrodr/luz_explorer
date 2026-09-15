# Luz Explorer

Explorador, en el navegador, de los Diarios de Sesiones de las Cortes de la Segunda República Española (1931–1945), a partir del conjunto de datos *Luz y Taquígrafos* publicado en Harvard Dataverse. Es la versión web de 2REP Standalone.

**Abrir la web: https://rodrodr.github.io/luz_explorer/**

## Cómo se usa

1. Descargue `2REP_Diaries.csv` del conjunto de datos en Harvard Dataverse: https://doi.org/10.7910/DVN/THQCMI
2. Abra la web y cargue el archivo, arrastrándolo o con el botón. La primera vez el navegador construye el índice de búsqueda, lo que tarda unos segundos.
3. Si quiere, marque «Recordar el corpus en este navegador» para no tener que volver a cargarlo.

Búsqueda por palabras: `palabra`, `"frase exacta"`, `A + B` (las dos), `A | B` (una u otra) y paréntesis.

## Privacidad

- El CSV se procesa dentro de su navegador y **nunca se sube a ningún servidor**.
- La web no usa analítica, cookies ni recursos externos.
- Las bibliotecas se guardan en su navegador. Expórtelas como `.2replib` si quiere conservarlas o compartirlas.

## Requisitos

Navegador de escritorio actual: Chrome o Edge 103 o posterior, Firefox 115 o posterior, o Safari 16.4 o posterior. Con el corpus cargado, la pestaña usa unos 600 MB de memoria.

## Cómo citar

Los datos que explora esta web son los del conjunto publicado en Harvard Dataverse. Cítelo siempre:

> Rodrigues-Silveira, Rodrigo; García-Díez, Fátima; Llamazares, Iván; Martínez-Barahona, Elena; Barreto Martín, Eduardo, 2026, "Luz y Taquígrafos: Parliamentary Debates in the Second Spanish Republic, 1931–1945", https://doi.org/10.7910/DVN/THQCMI, Harvard Dataverse, V2

La web reconoce también la V1, la versión anterior del CSV: al cargarla corrige las fechas de 7 sesiones, así que el corpus es el mismo que con la V2. Más detalles en [CITA.md](CITA.md).

## Contenido del repositorio

Solo la web ya construida, sin los datos:

- `index.html`: la aplicación completa en un único archivo, con el motor SQLite en WebAssembly.
- `sw.js` y `manifest.webmanifest`: permiten usarla sin conexión tras la primera visita.
- `CITA.md` y `LICENCIAS.md`.

## Licencias

- Datos: CC BY 4.0.
- Componentes de terceros (SQLite, Emscripten y las fuentes EB Garamond, GFS Didot y DejaVu): véase [LICENCIAS.md](LICENCIAS.md).
