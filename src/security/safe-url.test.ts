import { describe, expect, it } from 'vitest';
import { safeRedirectPath, safeUrl } from './safe-url.js';

const BASE = 'https://app.example.com';

describe('safeUrl', () => {
  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    ' javascript:alert(1)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
  ])('blocks %s', (value) => {
    expect(safeUrl(value, BASE)).toBeUndefined();
  });

  it.each([
    ['https://bank.example.com/a', 'https://bank.example.com/a'],
    ['http://bank.example.com/', 'http://bank.example.com/'],
    ['mailto:help@example.com', 'mailto:help@example.com'],
    ['tel:+34900000000', 'tel:+34900000000'],
    ['/accounts?id=1', 'https://app.example.com/accounts?id=1'],
  ])('allows %s', (value, expected) => {
    expect(safeUrl(value, BASE)).toBe(expected);
  });

  it('blocks empty, non-string and malformed values', () => {
    expect(safeUrl('', BASE)).toBeUndefined();
    expect(safeUrl(42, BASE)).toBeUndefined();
    expect(safeUrl('http://[::1', BASE)).toBeUndefined();
  });
});

describe('safeRedirectPath', () => {
  it('keeps same-origin paths with query and hash', () => {
    expect(safeRedirectPath('/accounts?id=1#top', BASE)).toBe('/accounts?id=1#top');
  });

  it.each([
    'https://evil.example.net/phish',
    '//evil.example.net/phish',
    '/\\evil.example.net',
    'javascript:alert(1)',
  ])('rejects off-origin or scriptable target %s', (value) => {
    expect(safeRedirectPath(value, BASE)).toBeUndefined();
  });

  it('rejects non-string values', () => {
    expect(safeRedirectPath(null, BASE)).toBeUndefined();
  });
});
