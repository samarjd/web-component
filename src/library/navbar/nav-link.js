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
        :host {
          cursor: pointer;
        }
        :host.active {
          font-weight: bold;
        }
        button{
          padding: 0;
          border: none;
          outline: none;
          background: transparent;
          text-decoration: none;
          color: inherit;          
        }
      </style>
      <button navigate="${this.navigate}" part="link" aria-label="Navigate to ${this.navigate}"></button>
      <slot></slot>
    `;
    this._bindEvents();
  }
}

customElements.define('nav-link', NavLink);
export default NavLink;