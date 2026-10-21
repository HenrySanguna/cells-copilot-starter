import DOMPurify, { type Config } from 'dompurify';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

// Wrapper ÚNICO de DOMPurify. Un solo punto de entrada significa una sola política que auditar y ajustar;
// si cada componente llamara a DOMPurify con su propia configuración, cada uno sería un hallazgo potencial.

// Instancia propia: los hooks de abajo no afectan a otros usos de DOMPurify (p. ej. de una dependencia).
const purifier = DOMPurify(window);

const POLICY: Config = {
  // Solo perfil HTML: SVG y MathML amplían mucho la superficie de mutation XSS y no se necesitan para texto enriquecido.
  USE_PROFILES: { html: true },
  // Formularios dentro de contenido no confiable permiten phishing visual y "DOM clobbering".
  FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
  // style inline rompería una CSP estricta (style-src sin 'unsafe-inline') y permite superponer UI falsa.
  FORBID_ATTR: ['style'],
  // target se permite (enlaces de contenido que abren en pestaña nueva) solo porque el hook de abajo añade rel.
  ADD_ATTR: ['target'],
  ALLOW_DATA_ATTR: false,
};

// Un enlace con target="_blank" sin rel deja a la página abierta controlar window.opener (reverse tabnabbing).
purifier.addHook('afterSanitizeAttributes', (node) => {
  if (node instanceof Element && node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/** Devuelve el HTML saneado como string. Úsalo para datos que no se pintan con Lit (p. ej. tests o exportaciones). */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (dirty == null) return '';
  return purifier.sanitize(dirty, POLICY);
}

/**
 * Única forma permitida de pintar HTML no confiable dentro de una plantilla Lit.
 * Es el único uso de unsafeHTML del proyecto (ESLint lo prohíbe fuera de src/security/) y siempre recibe HTML ya saneado.
 */
export function renderSanitizedHtml(dirty: string | null | undefined): ReturnType<typeof unsafeHTML> {
  return unsafeHTML(sanitizeHtml(dirty));
}
