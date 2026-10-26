// Validación de URLs dinámicas. Lit escapa el texto, pero NO bloquea `javascript:` en atributos como href o src:
// `<a href=${url}>` con url = 'javascript:alert(1)' ejecuta código al hacer clic.

// Allowlist, no denylist: una lista de esquemas prohibidos siempre se queda corta (javascript:, vbscript:, data:...).
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function currentOrigin(): string {
  return window.location.origin;
}

/**
 * Devuelve la URL normalizada si su esquema está permitido, o `undefined` si no.
 * Pensado para usarse con `ifDefined()` de Lit: si la URL no es válida, el atributo ni siquiera se pinta.
 */
export function safeUrl(value: unknown, base: string = currentOrigin()): string | undefined {
  if (typeof value !== 'string' || value.trim() === '') return undefined;
  try {
    // El parser de URL elimina tabs/saltos de línea y normaliza mayúsculas: 'Java\tScript:' se detecta igual.
    const url = new URL(value.trim(), base);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Para redirecciones construidas desde parámetros (returnTo, next, redirect...): solo acepta destinos del mismo origen
 * y devuelve la ruta relativa. Evita open redirects hacia webs de phishing y `javascript:` en navegaciones.
 */
export function safeRedirectPath(value: unknown, base: string = currentOrigin()): string | undefined {
  if (typeof value !== 'string' || value.trim() === '') return undefined;
  try {
    const origin = new URL(base).origin;
    // '//evil.com' y '/\evil.com' son rutas "relativas" que el navegador resuelve a otro dominio: la comparación
    // de origen tras parsear las descarta.
    const url = new URL(value.trim(), origin);
    return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : undefined;
  } catch {
    return undefined;
  }
}
