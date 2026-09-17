# Luz Explorer

Explorador, en el navegador, de los Diarios de Sesiones de las Cortes de la Segunda República Española (1931–1945), a partir del conjunto de datos *Luz y Taquígrafos* publicado en Harvard Dataverse. Es la versión web de 2REP Standalone.

**Abrir la web: https://rodrodr.github.io/luz_explorer/**

## Cómo se usa

No hay que descargar ni cargar nada: **el corpus viaja con la web**. Al abrirla se descarga una vez la base ya construida (111 MB), se comprueba su huella y se guarda en su navegador; las siguientes visitas abren en un par de segundos y sin pedir nada a la red.

Búsqueda por palabras: `palabra`, `"frase exacta"`, `A + B` (las dos), `A | B` (una u otra) y paréntesis.

El filtro **«Solo lo que se habla»**, el primero del panel, deja fuera el sumario de cada sesión y el material que el Diario imprime dentro del acta —listas de votación, ruegos por escrito, dictámenes leídos, el relato de la Mesa—: 121.700 filas se quedan en 108.291 de habla.

Quien prefiera explorar otro archivo puede seguir abriendo el CSV publicado en Dataverse (https://doi.org/10.7910/DVN/THQCMI) desde la pantalla de carga.

## Privacidad

- Todo se procesa dentro de su navegador: **nada se sube a ningún servidor**.
- La web no usa analítica, cookies ni recursos externos.
- Las bibliotecas se guardan en su navegador. Expórtelas como `.2replib` si quiere conservarlas o compartirlas.

## Requisitos

Navegador de escritorio actual: Chrome o Edge 103 o posterior, Firefox 115 o posterior, o Safari 16.4 o posterior. Con el corpus cargado, la pestaña usa unos 600 MB de memoria.

## Cómo citar

Los datos que explora esta web son los del conjunto publicado en Harvard Dataverse. Cítelo siempre:

> Rodrigues-Silveira, Rodrigo; García-Díez, Fátima; Llamazares, Iván; Martínez-Barahona, Elena; Barreto Martín, Eduardo, 2026, "Luz y Taquígrafos: Parliamentary Debates in the Second Spanish Republic, 1931–1945", https://doi.org/10.7910/DVN/THQCMI, Harvard Dataverse, V2

La base que viaja con la web se construye a partir de una **matriz resegmentada** de ese conjunto: cada orador en su fila, el material que no es habla en filas `COMENTARIOS` y el sumario de cada sesión en una fila `SUMARIO`. Esa matriz todavía no está publicada en Dataverse; la web la identifica como versión `v3` y lo dice en «Sobre este corpus». Más detalles en [CITA.md](CITA.md).

## Contenido del repositorio

La web ya construida y los datos que la acompañan:

- `index.html`: la aplicación completa en un único archivo, con el motor SQLite en WebAssembly.
- `datos/`: la base del corpus, comprimida y partida en tres (ningún archivo pasa de los 100 MB que admite GitHub). La página las encadena, las descomprime y comprueba su SHA-256 antes de abrirlas.
- `sw.js` y `manifest.webmanifest`: permiten usarla sin conexión tras la primera visita.
- `CITA.md` y `LICENCIAS.md`.

## Licencias

- Datos: CC BY 4.0.
- Componentes de terceros (SQLite, Emscripten y las fuentes EB Garamond, GFS Didot y DejaVu): véase [LICENCIAS.md](LICENCIAS.md).
