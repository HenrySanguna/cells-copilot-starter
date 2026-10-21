import { defineConfig } from 'vite';

// Cabeceras de seguridad. La CSP debe enviarse como cabecera HTTP: frame-ancestors se ignora en un <meta>.
// En el banco estas cabeceras las pone el hosting/CDN; aquí se replican en `vite preview` para probar la build.
// Se usa Report-Only: el navegador no bloquea, solo avisa en consola de lo que bloquearía (ver skill csp-hardening).
// Las excepciones de Google Fonts y del logo de opencells.dev vienen del scaffold; en un proyecto real se alojan en local.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://www.opencells.dev",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = {
  'Content-Security-Policy-Report-Only': contentSecurityPolicy,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export default defineConfig({
  build: {
    // Explícito aunque sea el valor por defecto: los sourcemaps en producción exponen el código fuente completo.
    sourcemap: false,
  },
  // Solo en preview: en dev Vite inyecta estilos inline y usa WebSocket, y una CSP estricta lo rompería.
  preview: { headers: securityHeaders },
});
