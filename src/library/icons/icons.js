import icons from './icons-collection.js';

class Icon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.name  = this.getAttribute('name') || '';
        this.size  = this.getAttribute('size') || getComputedStyle(this).fontSize || '10';
        this.title = this.getAttribute('title') || '';
        this.fill  = this.getAttribute('fill') || 'currentColor';   
        this.class = this.getAttribute('class') || '';
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'size', 'color', 'name', 'fill', 'class'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(newValue !== oldValue) {
            this[name] = newValue;
        }
        this.render();
    }

    get styles() {
        return `
            <style>
                :host, .icon {
                    display: inline-block;
                    position: relative;
                    top: 10%;
                    left: 0;
                    fill: ${this.fill};
                }

                .icon svg {
                    fill: ${this.fill};
                    font-size: ${this.size}px;
                    width: ${this.size}px;
                    height: ${this.size}px;
                }

                .icon.spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .icon.pulse {
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }

                .icon.blink {
                    animation: blink 1.5s infinite;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }

                .icon.shake {
                    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) infinite;
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            </style>
        `;
    }

    get template() {
        const iconSvg = icons[this.name] || '';
        return `<span class="icon ${this.class}" title="${this.title}">${iconSvg || ''}</span>`;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;
    }
}

customElements.define('icon-elm', Icon);
export default Icon;