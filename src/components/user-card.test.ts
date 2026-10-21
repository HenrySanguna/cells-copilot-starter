import { afterEach, describe, expect, it } from 'vitest';
import './user-card.js';
import type { UserCard } from './user-card.js';

async function mount(props: Partial<Pick<UserCard, 'name' | 'bio' | 'website'>>): Promise<UserCard> {
  const el = document.createElement('user-card') as UserCard;
  Object.assign(el, props);
  document.body.append(el);
  await el.updateComplete;
  return el;
}

const shadow = (el: UserCard) => el.shadowRoot as ShadowRoot;

describe('user-card', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('EXAMPLE-001: renders <img src=x onerror=alert(1)> in the name as text, not as a node', async () => {
    const el = await mount({ name: '<img src=x onerror=alert(1)>' });
    const heading = shadow(el).querySelector('h3');
    expect(heading?.textContent).toBe('<img src=x onerror=alert(1)>');
    expect(heading?.querySelector('img')).toBeNull();
  });

  it('EXAMPLE-001: strips the onerror handler from <img src=x onerror=alert(1)> in the bio', async () => {
    const el = await mount({ bio: '<img src=x onerror=alert(1)>' });
    const img = shadow(el).querySelector('.bio img');
    expect(img?.hasAttribute('onerror')).toBe(false);
  });

  it('EXAMPLE-001: removes "><svg onload=alert(1)> from the bio', async () => {
    const el = await mount({ bio: '"><svg onload=alert(1)>' });
    expect(shadow(el).querySelector('.bio svg')).toBeNull();
    expect(shadow(el).querySelector('[onload]')).toBeNull();
  });

  it('EXAMPLE-001: does not render a javascript:alert(1) website as a link target', async () => {
    const el = await mount({ name: 'Ana', website: 'javascript:alert(1)' });
    expect(shadow(el).querySelector('a')).toBeNull();
  });

  it('keeps safe bio formatting', async () => {
    const el = await mount({ bio: 'Hola <b>Ana</b>' });
    expect(shadow(el).querySelector('.bio b')?.textContent).toBe('Ana');
  });

  it('keeps a valid https website as a safe external link', async () => {
    const el = await mount({ name: 'Ana', website: 'https://example.com/ana' });
    const link = shadow(el).querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://example.com/ana');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
