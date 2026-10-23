import { afterEach, describe, expect, it } from 'vitest';
import './login-page.js';
import type { LoginPage } from './login-page.js';

async function mount(search = ''): Promise<LoginPage> {
  window.history.replaceState({}, '', `/login${search}`);
  const el = document.createElement('login-page') as LoginPage;
  document.body.append(el);
  await el.updateComplete;
  return el;
}

describe('login-page', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  const resolveRedirectTarget = (el: LoginPage, value: string | undefined): string | undefined => {
    return (el as unknown as { resolveRedirectTarget: (value: string | undefined) => string | undefined }).resolveRedirectTarget(value);
  };

  it.each([
    'https://evil.example/phish',
    '//evil.example/phish',
    '/\\evil.example',
    'javascript:alert(1)',
  ])('LOGIN-001: rejects unsafe returnUrl %s', async (payload) => {
    const el = await mount(`?returnUrl=${encodeURIComponent(payload)}`);

    expect(resolveRedirectTarget(el, payload)).toBeUndefined();
  });

  it('LOGIN-001: keeps same-origin internal redirects valid', async () => {
    const el = await mount('?returnUrl=%2Fsecond%3Ftab%3Daccount');

    expect(resolveRedirectTarget(el, '/second?tab=account')).toBe('/second?tab=account');
  });

  it('LOGIN-001: ignores untrusted message payloads', async () => {
    const el = await mount();

    expect(resolveRedirectTarget(el, 'https://evil.example/phish')).toBeUndefined();
  });
});
