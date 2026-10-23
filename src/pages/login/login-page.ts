import { html, LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';
import { customElement, state } from 'lit/decorators.js';

interface SessionMessage {
  type: 'session';
  token: string;
  returnUrl?: string;
}

@customElement('login-page')
export class LoginPage extends LitElement {
  pageController = new PageController(this);

  @state() private username = '';

  @state() private password = '';

  private readonly params = new URLSearchParams(window.location.search);

  private readonly onMessage = (event: MessageEvent<SessionMessage>) => {
    if (event.data?.type !== 'session') {
      return;
    }
    this.storeSession(event.data.token);
    if (event.data.returnUrl) {
      window.location.href = event.data.returnUrl;
    }
  };

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('message', this.onMessage);
  }

  disconnectedCallback(): void {
    window.removeEventListener('message', this.onMessage);
    super.disconnectedCallback();
  }

  private storeSession(token: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('lastUser', JSON.stringify({ username: this.username, password: this.password }));
  }

  private async login(event: Event): Promise<void> {
    event.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: this.username, password: this.password }),
    });
    const { token } = (await response.json()) as { token: string };
    this.storeSession(token);

    const returnUrl = this.params.get('returnUrl');
    if (returnUrl) {
      window.location.href = returnUrl;
      return;
    }
    this.pageController.navigate('home');
  }

  render() {
    const helpUrl = this.params.get('help') ?? 'https://www.opencells.dev/docs/index.html';
    return html`
      <div class="page-header">
        <h1>Sign in</h1>
        <p>Welcome back, ${this.params.get('name') ?? 'guest'}.</p>
      </div>
      <form @submit=${this.login}>
        <label>
          Username
          <input name="username" .value=${this.username} @input=${(e: Event) => (this.username = (e.target as HTMLInputElement).value)} />
        </label>
        <label>
          Password
          <input name="password" type="password" .value=${this.password} @input=${(e: Event) => (this.password = (e.target as HTMLInputElement).value)} />
        </label>
        <button type="submit">Sign in</button>
      </form>
      <a class="link-arrow" href=${helpUrl} target="_blank">Need help?</a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'login-page': LoginPage;
  }
}
