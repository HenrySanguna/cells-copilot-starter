import { html, LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';
import { customElement } from 'lit/decorators.js';
import '../../components/user-card.js';

// Datos de demostración de EXAMPLE-001: los payloads deben verse neutralizados en pantalla.
const DEMO_PROFILE = {
  name: '<img src=x onerror=alert(1)>',
  bio: 'Hola, soy <b>Ana</b>. "><svg onload=alert(1)>',
  website: 'javascript:alert(1)',
};

@customElement('home-page')
export class HomePage extends LitElement {
  pageController = new PageController(this);

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  render() {
    return html`
      <div class="hero">
        <p class="pretitle">OPEN CELLS BLANK APP</p>
        <h1>Build something remarkable</h1>
        <p>A minimal yet powerful scaffold to start your next web application with the Open Cells framework.</p>
      </div>
      <div class="features">
        <div class="feature">
          <div class="feature-icon">🧩</div>
          <div class="feature-text">
            <strong>Web Components</strong>
            <span>Built with LitElement &amp; standards</span>
          </div>
        </div>
        <div class="feature">
          <div class="feature-icon">🎨</div>
          <div class="feature-text">
            <strong>Customisable</strong>
            <span>CSS custom properties throughout</span>
          </div>
        </div>
        <div class="feature">
          <div class="feature-icon">⚡</div>
          <div class="feature-text">
            <strong>Fast Routing</strong>
            <span>Client-side navigation with lazy loading</span>
          </div>
        </div>
        <button class="btn" @click="${() => this.pageController.navigate('second')}">Continue exploring</button>
      </div>
      <section class="demo">
        <p class="pretitle">EXAMPLE-001 · XSS REMEDIADO</p>
        <user-card
          .name=${DEMO_PROFILE.name}
          .bio=${DEMO_PROFILE.bio}
          .website=${DEMO_PROFILE.website}
        ></user-card>
      </section>
    `;
  }
}
