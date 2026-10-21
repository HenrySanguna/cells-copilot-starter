import { describe, expect, it } from 'vitest';
import { render } from 'lit';
import { renderSanitizedHtml, sanitizeHtml } from './sanitize.js';

describe('sanitizeHtml', () => {
  it('strips event handlers from <img src=x onerror=alert(1)>', () => {
    const clean = sanitizeHtml('<img src=x onerror=alert(1)>');
    expect(clean).not.toMatch(/onerror/i);
  });

  it('removes svg payloads like "><svg onload=alert(1)>', () => {
    const clean = sanitizeHtml('"><svg onload=alert(1)>');
    expect(clean).not.toMatch(/<svg|onload/i);
  });

  it('removes javascript: links', () => {
    const clean = sanitizeHtml('<a href="javascript:alert(1)">x</a>');
    expect(clean).not.toMatch(/javascript:/i);
  });

  it('removes script, style and form elements', () => {
    const clean = sanitizeHtml('<script>alert(1)</script><style>*{}</style><form><input></form>ok');
    expect(clean).toBe('ok');
  });

  it('keeps basic formatting', () => {
    expect(sanitizeHtml('<b>bold</b> <em>em</em>')).toBe('<b>bold</b> <em>em</em>');
  });

  it('forces rel="noopener noreferrer" on links opened in a new tab', () => {
    const clean = sanitizeHtml('<a href="https://example.com" target="_blank">x</a>');
    expect(clean).toContain('rel="noopener noreferrer"');
  });

  it('returns an empty string for nullish input', () => {
    expect(sanitizeHtml(undefined)).toBe('');
    expect(sanitizeHtml(null)).toBe('');
  });
});

describe('renderSanitizedHtml', () => {
  it('renders sanitized markup as DOM without executable attributes', () => {
    const host = document.createElement('div');
    render(renderSanitizedHtml('<b>hi</b><img src=x onerror=alert(1)>'), host);
    expect(host.querySelector('b')?.textContent).toBe('hi');
    expect(host.querySelector('img')?.hasAttribute('onerror')).toBe(false);
  });
});
