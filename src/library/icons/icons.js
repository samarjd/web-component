class Icon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.name  = this.getAttribute('name') || '';
        this.size  = this.getAttribute('size') || '16';
        this.title = this.getAttribute('title') || '';
        this.fill  = this.getAttribute('fill') || 'currentColor';
        this.class = this.getAttribute('class') || '';
        this.type  = this.getAttribute('type') || 'solid';

        if (!window._svgCache) {
            window._svgCache = new Map();
        }
    }

    static get observedAttributes() {
        return ['name', 'size', 'title', 'fill', 'class', 'type'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal !== newVal) {
            if (name === 'type') {
                this.type = ['regular', 'solid', 'brands'].includes(newVal) ? newVal : 'regular';
            } else {
                this[name] = newVal;
            }
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    get styles() {
        return `
            <style>
                :host, .icon {
                    display: inline-block;
                }

                .icon svg {
                    fill: ${this.fill};
                    width: ${this.size}px;
                    height: ${this.size}px;
                    display: block;
                }

                .icon.spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
    }

    async render() {
        const path = `./src/library/icons/svgs/${this.type}/${this.name}.svg`;

        // Check cache first
        if (window._svgCache.has(path)) {
            this.updateIcon(window._svgCache.get(path));
            return;
        }

        try {
            const res = await fetch(path);
            const text = res.ok ? await res.text() : '<!-- icon not found -->';
            window._svgCache.set(path, text);
            this.updateIcon(text);
        } catch {
            const fallback = '<!-- icon not found -->';
            window._svgCache.set(path, fallback);
            this.updateIcon(fallback);
        }
    }

    updateIcon(svgContent) {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            <span class="icon ${this.class}" title="${this.title}">
                ${svgContent}
            </span>
        `;
    }
}

customElements.define('icon-elm', Icon);
export default Icon;
