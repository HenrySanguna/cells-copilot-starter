import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './login-page.js';
import type { LoginPage } from './login-page.js';

const unsafeTargets = ['https://evil.example/phish', '//evil.example/phish', '/\\evil.example', 'javascript:alert(1)'];

async function mount(search = ''): Promise<LoginPage> {
  window.history.replaceState({}, '', `/login${search}`);
  const el = document.createElement('login-page') as LoginPage;
  document.body.append(el);
  await el.updateComplete;
  vi.spyOn(el, 'redirectTo').mockImplementation(() => undefined);
  vi.spyOn(el.pageController, 'navigate').mockImplementation(() => undefined);
  return el;
}

async function submitLogin(el: LoginPage): Promise<void> {
  el.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true }));
  await vi.waitFor(() => {
    expect(vi.mocked(el.redirectTo).mock.calls.length + vi.mocked(el.pageController.navigate).mock.calls.length).toBe(1);
  });
}

function postSession(returnUrl: string): void {
  window.dispatchEvent(
    new MessageEvent('message', {
      data: { type: 'session', token: 'test-token', returnUrl },
      origin: window.location.origin,
    }),
  );
}

describe('login-page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ token: 'test-token' }) }));
  });

  afterEach(() => {
    document.body.replaceChildren();
    localStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each(unsafeTargets)('LOGIN-001: does not redirect to returnUrl %s after login and falls back to home', async (payload) => {
    const el = await mount(`?returnUrl=${encodeURIComponent(payload)}`);

    await submitLogin(el);

    expect(el.redirectTo).not.toHaveBeenCalled();
    expect(el.pageController.navigate).toHaveBeenCalledWith('home');
  });

  it('LOGIN-001: still redirects to a same-origin returnUrl after login', async () => {
    const el = await mount(`?returnUrl=${encodeURIComponent('/second?tab=account')}`);

    await submitLogin(el);

    expect(el.redirectTo).toHaveBeenCalledWith('/second?tab=account');
    expect(el.pageController.navigate).not.toHaveBeenCalled();
  });

  it('LOGIN-001: navigates home after login when there is no returnUrl', async () => {
    const el = await mount();

    await submitLogin(el);

    expect(el.redirectTo).not.toHaveBeenCalled();
    expect(el.pageController.navigate).toHaveBeenCalledWith('home');
  });

  it.each(unsafeTargets)('LOGIN-001: does not redirect to returnUrl %s received by postMessage', async (payload) => {
    const el = await mount();

    postSession(payload);

    expect(el.redirectTo).not.toHaveBeenCalled();
  });

  it('LOGIN-001: still redirects to a same-origin returnUrl received by postMessage', async () => {
    const el = await mount();

    postSession('/second');

    expect(el.redirectTo).toHaveBeenCalledWith('/second');
  });
});
