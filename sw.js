/* 2REP_Standalone · service worker de la versión web (plantilla: build/build.mjs --web sustituye los marcadores)
 *
 * Guarda en caché SOLO la página (index.html) y el manifiesto de ESTA versión, identificada por el sha256 de index.html
 * (se comprueba al instalar), y los sirve primero desde la caché, también sin red. Todo lo demás (sw.js, LICENCIAS.md,
 * CITA.md, datos/…) va a la red: la base que acompaña a la página son 111 MB y la guarda el propio motor (OPFS), no esta caché.
 *
 * Prototipo M0b (spike/build_spike.mjs, RESULTADOS_M0b.md §3.1 y §11.4.4):
 *   - WebKit puede terminar cache.put sin error y sin guardar nada: se comprueba con match y, si no está, la página se
 *     guarda en IndexedDB («2rep-web-sw», clave = versión); fetch busca en Cache Storage, luego en IndexedDB y luego en la red;
 *   - no se activa solo si ya había otra versión: espera a que la página pida «saltar_espera» (aviso «Nueva versión»);
 *   - activate borra las cachés y las copias de otras versiones.
 */
'use strict';
const VERSION = '3b0ba61d76c149c3b86af09b2c3e66139aa11a6cfd434ff2bbd59082a009b239';   // sha256 de index.html
const BUILD_ID = '1857031ae8c04b3d';
const CACHE = '2rep-web-' + VERSION.slice(0, 16);
const IDB = '2rep-web-sw';
const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

const abrirIdb = () => new Promise((res, rej) => {
  const rq = indexedDB.open(IDB, 1);
  rq.onupgradeneeded = () => rq.result.createObjectStore('paginas');
  rq.onsuccess = () => res(rq.result);
  rq.onerror = () => rej(rq.error);
  rq.onblocked = () => rej(new Error('IndexedDB bloqueada'));
});
const idb = async (modo, fn) => {
  const db = await abrirIdb();
  try {
    return await new Promise((res, rej) => {
      const t = db.transaction('paginas', modo);
      const rq = fn(t.objectStore('paginas'));
      t.oncomplete = () => res(rq && rq.result);
      t.onerror = () => rej(t.error);
      t.onabort = () => rej(t.error || new Error('transacción abortada'));
    });
  } finally { db.close(); }
};
let almacen = null; // 'cache' | 'indexeddb'

async function dondeEsta() {
  if (almacen) return almacen;
  if (await (await caches.open(CACHE)).match('./index.html')) return (almacen = 'cache');
  try { if (await idb('readonly', (st) => st.count(VERSION))) return (almacen = 'indexeddb'); } catch (e) { /* sin IndexedDB */ }
  return null;
}

self.addEventListener('install', (ev) => {
  ev.waitUntil((async () => {
    const resp = await fetch(new Request('./index.html', { cache: 'reload' }));
    if (!resp.ok) throw new Error('index.html: HTTP ' + resp.status);
    const cuerpo = await resp.arrayBuffer();
    const sha = hex(await crypto.subtle.digest('SHA-256', cuerpo));
    if (sha !== VERSION) throw new Error('index.html (' + sha.slice(0, 12) + ') no es la versión de este service worker (' + VERSION.slice(0, 12) + ')');
    const tipo = resp.headers.get('Content-Type') || 'text/html; charset=utf-8';
    const man = await fetch(new Request('./manifest.webmanifest', { cache: 'reload' })).catch(() => null);
    const manifiesto = man && man.ok ? await man.arrayBuffer() : null;
    const cache = await caches.open(CACHE);
    await cache.put('./index.html', new Response(cuerpo, { headers: { 'Content-Type': tipo } }));
    if (manifiesto) await cache.put('./manifest.webmanifest', new Response(manifiesto, { headers: { 'Content-Type': 'application/manifest+json' } }));
    if (await cache.match('./index.html')) { almacen = 'cache'; return; }
    await caches.delete(CACHE);
    await idb('readwrite', (st) => st.put({ tipo, cuerpo, manifiesto, guardado: Date.now() }, VERSION));
    const g = await idb('readonly', (st) => st.get(VERSION));
    if (!g || !g.cuerpo || g.cuerpo.byteLength !== cuerpo.byteLength) throw new Error('no se pudo guardar la página ni en Cache Storage ni en IndexedDB');
    almacen = 'indexeddb';
  })());
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('2rep-web-') && k !== CACHE) await caches.delete(k);
    try {
      const claves = await idb('readonly', (st) => st.getAllKeys());
      for (const k of claves) if (k !== VERSION) await idb('readwrite', (st) => st.delete(k));
    } catch (e) { /* sin IndexedDB */ }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (ev) => {
  const d = ev.data || {};
  if (d.tipo === 'saltar_espera') self.skipWaiting();
  else if (d.tipo === 'version' && ev.source) {
    const p = dondeEsta().catch(() => null).then((a) => ev.source.postMessage({ tipo: 'version_sw', version: VERSION, build_id: BUILD_ID, cache: CACHE, almacen: a }));
    if (ev.waitUntil) ev.waitUntil(p);
  }
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const base = new URL('./', self.location.href);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return;
  const rel = url.pathname.slice(base.pathname.length);
  const esPagina = rel === '' || rel === 'index.html';
  if (!esPagina && rel !== 'manifest.webmanifest') return; // solo la página y el manifiesto
  ev.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const r = await cache.match(esPagina ? './index.html' : './manifest.webmanifest');
    if (r) return r;
    try {
      const g = await idb('readonly', (st) => st.get(VERSION));
      const cuerpo = g && (esPagina ? g.cuerpo : g.manifiesto);
      if (cuerpo) return new Response(cuerpo, { headers: { 'Content-Type': esPagina ? g.tipo : 'application/manifest+json', 'X-2REP-Copia': 'indexeddb' } });
    } catch (e) { /* sin IndexedDB: a la red */ }
    return fetch(req);
  })());
});
