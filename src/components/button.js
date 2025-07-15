class Button extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.color = this.getAttribute('color') || 'default';
        this.title = this.getAttribute('title') || '';
        this.border = this.hasAttribute('border');
        this.shadow = this.hasAttribute('shadow');
        this.rounded = this.hasAttribute('rounded');
        this.isIcon = this.hasAttribute('is-icon');
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        this.shadowRoot.removeEventListener('click', this.handleClick);
    }

    static get observedAttributes() {
        return ['color', 'type', 'title', 'border', 'shadow', 'rounded', 'is-icon', 'margin'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
            this.render();
        }
    }

    getColor(color) {
        const colors = {
            default: '#6c757d',
            primary: '#007bff',
            success: '#198754',
            danger: '#dc3545',
            warning: '#ffc107',
            dark: '#343a40',
            light: '#f8f9fa',
            secondary: '#e9e9e9'
        };
        return colors[color] || '';
    }

    getTextColor(color) {
        if (color === 'light') return '#212529';
        return '#fff';
    }

    handleClick = (e) => {
        if (this.type === 'submit') {
            const form = this.closest('form');
            if (form) {
                e.preventDefault();
                form.requestSubmit ? form.requestSubmit() : form.submit();
            }
        }
    };

    get styles() {
        const colorAttr = this.color;
        const bgColor = this.getColor(colorAttr);
        const textColor = this.getTextColor(colorAttr);
        const border = this.border ? `1px solid ${bgColor}` : 'none';
        const shadow = this.shadow ? '0 2px 5px 2px rgba(0, 0, 0, 0.1)' : 'none';
        const isIcon = this.isIcon;
        const rounded = this.rounded ? '10rem;' : 'max(0.25vw, 0.25rem)';
        return `
        <style>
            button {
                border: ${border};
                box-shadow: ${shadow};
                background: ${bgColor};
                color: ${textColor};
                padding: ${isIcon ? '2px 5px' : 'max(0.25vw, 0.4rem) max(1vw, 1.5rem)'};
                border-radius: ${rounded};
                font-size: max(0.75vw, 0.8rem);
                cursor: pointer;
                transition: background 0.2s;
                margin: ${this.getAttribute('margin') || '0 0.2rem;'};
                text-transform: lowercase;
            }
            button::first-letter {
                text-transform: uppercase;
            }
            button:hover {
                background: ${this.getColor(colorAttr)}cc;
            }
            button:active {
                filter: brightness(0.95);
            }

      </style>
    `;
    }

    render() {
        const title = this.title;

        this.shadowRoot.innerHTML = `
            ${this.styles}
            <button title="${title}">
                <slot></slot>
            </button>
        `;
    }
}

customElements.define('button-elm', Button);
export default Button;