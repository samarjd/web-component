class NavLink extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    this.navigate = this.getAttribute('navigate') || '';
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['navigate'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[name] = newValue;
    this.render();
  }

  _bindEvents() {
    this.addEventListener('click', (event) => {
      event.stopPropagation();
      if (this.navigate) {
        this.dispatchEvent(new CustomEvent('navigate', { 
          bubbles: true,
          composed: true,
          detail: { navigate: this.navigate } 
        }));
      }
    });
  }

  render(){
    this.shadowRoot.innerHTML = `
      <style>
      :host.active {
        font-weight: bold;
  }
        a {
          text-decoration: none;
          color: inherit;
        }
      </style>
      <a navigate="${this.navigate}" part="link"></a>
      <slot></slot>
    `;
    this._bindEvents();
  }
}

customElements.define('nav-link', NavLink);
export default NavLink;