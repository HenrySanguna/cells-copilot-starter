import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { renderSanitizedHtml } from '../security/sanitize.js';
import { safeUrl } from '../security/safe-url.js';

// Componente del hallazgo de ejemplo EXAMPLE-001 (ver specs/EXAMPLE-001/). Antes pintaba `bio` con unsafeHTML
// y `website` en href sin validar; ahora usa los wrappers de src/security/.
@customElement('user-card')
export class UserCard extends LitElement {
  @property() name = '';

  // Texto enriquecido que viene del perfil del usuario: no confiable.
  @property() bio = '';

  @property() website = '';

  static styles = css`
    :host {
      display: block;
      padding: 1rem 1.25rem;
      border: 1px solid var(--color-grey-mid, #d9d9d9);
      border-radius: 4px;
      max-width: 560px;
    }

    h3 {
      margin: 0 0 0.5rem;
      color: var(--color-core-blue, #004481);
    }

    a {
      color: var(--color-blue, #1973b8);
    }
  `;

  render() {
    const website = safeUrl(this.website);
    return html`
      <h3>${this.name}</h3>
      <div class="bio">${renderSanitizedHtml(this.bio)}</div>
      ${website
        ? html`<a href=${ifDefined(website)} target="_blank" rel="noopener noreferrer">Web personal</a>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-card': UserCard;
  }
}
