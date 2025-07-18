
import "./nav-link.js";
class NavBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.direction = this.getAttribute('direction') || 'horizontal';
    this.type = this.getAttribute('type') || 'default';
    this.justify = this.getAttribute('justify') || 'start';
  }

  static get observedAttributes() {
    return ['direction', 'type', 'justify'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[name] = newValue;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  getColor(type) {
    const color = {
      default: {
        color: '#212529',
        backgroundColor: '#ffffff',
        backgroundHoverColor: '#f4f4f4',
      },
      light: {
        color: '#212529',
        backgroundColor: '#ffffff',
        backgroundHoverColor: '#f4f4f4',
      },
      dark: {
        color: '#ffffff',
        backgroundColor: '#343a40',
        backgroundHoverColor: '#ffffff20',
      },
      primary: {
        color: '#ffffff',
        backgroundColor: '#0e82ff',
        backgroundHoverColor: '#f4f4f460',
      },
      secondary: {
        color: '#ffffff',
        backgroundColor: '#6c757d',
        backgroundHoverColor: '#f4f4f460',
      },
      success: {
        color: '#ffffff',
        backgroundColor: '#28a745',
        backgroundHoverColor: '#f4f4f460',
      },
      danger: {
        color: '#ffffff',
        backgroundColor: '#dc3545',
        backgroundHoverColor: '#f4f4f460',
      },
      warning: {
        color: '#212529',
        backgroundColor: '#ffc107',
        backgroundHoverColor: '#f4f4f460',
      },
      info: {
        color: '#ffffff',
        backgroundColor: '#17a2b8',
        backgroundHoverColor: '#f4f4f460',
      },
    };
    return color[type] || color.default;
  }

  get styles() {
    const { color, backgroundColor, backgroundHoverColor } = this.getColor(this.type);
    const directionStyle = this.direction === 'vertical' ? 'flex-direction: column;' : 'flex-direction: row;';
    return `
     <style>
        :host { 
          position: fixed;
          width: ${this.direction === 'vertical' ? 'max(20vw,200px)' : '100%'};
          top: 0;
          left: 0;
          z-index: 1001;
        }
        ul {
          ${this.direction === 'vertical' 
            ? `height: 100vh; 
              width: -webkit-fill-available; 
              overflow-y: auto;
              display: block;`
            : `
            display: flex;
            justify-content: ${this.justify};
            overflow-x: auto;
            width: 100%;`
          }
         
          padding: ${this.direction === 'vertical' ? '0.5rem 0 0.5rem 0.5rem' : '0.5rem'};
          margin: 0;
          ${directionStyle}
          background-color: ${backgroundColor};
          color: ${color};
          gap: 0.5rem;
          box-shadow: 0px 0px 10px #00000010;
          font-size: 15px;
        }

        li{
          list-style: none;
          margin: ${this.direction === 'vertical' ? '0 0 0.25rem' : '0'};
          cursor: pointer;
          color: inherit;
          border-radius: ${this.direction === 'vertical' ? ' 5rem 0 0 5rem' : '5rem'};
          transition: background-color 0.3s;
        }

        li nav-link {
          display: block;
          padding: 0.5rem 1rem;
        }

        li:not(:has(nav-link)) {
          padding: 0.5rem 1rem;
        }

        li.active, li:hover {
          background-color: ${backgroundHoverColor};
        }
        li.active nav-link {
          pointer-events:none;
        }
      </style>
    `;
  }

  get template() {
    return `
      ${this._renderNavItems()}
    `;
  }

  _renderNavItems() {
    const items = Array.from(this.querySelectorAll('.nav-item'));
  
    if (!items.some(item => item.hasAttribute('active'))) {
      const firstItem = items[0];
      if (firstItem) firstItem.setAttribute('active', '');
    }
    
    const itemsHtml = items.map(item => {
      const active = item.hasAttribute('active') ? 'active' : '';
      const navigate = item.getAttribute('navigate') || '';
      return `
      <li class="${active}" ${navigate ? `navigate="${navigate}"` : ''}>
        ${navigate 
          ? `<nav-link navigate="${navigate}">${item.innerHTML}</nav-link>` 
          : item.innerHTML}
      </li>`;  
    }).join('');
    return itemsHtml;
  }

  _bindEvents() {
    this.shadowRoot.querySelectorAll('li').forEach(item => {
      item.addEventListener('navigate', (e) => {
        this.shadowRoot.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styles}
      <ul>
        ${this.template}
      </ul>
    `;
    this._bindEvents();
  }
}

customElements.define('nav-bar', NavBar);
export default NavBar;
