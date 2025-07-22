class SkeletonLoader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.header = this.getAttribute('header') !== false && this.getAttribute('header') !== null;
        this.body = this.getAttribute('body') !== false && this.getAttribute('body') !== null;
        this.footer = this.getAttribute('footer') !== false && this.getAttribute('footer') !== null;
        this.image = this.getAttribute('image') !== false && this.getAttribute('image') !== null;
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['header', 'body', 'footer', 'image'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue != null && newValue !== 'false';
            this.render();
        }
    }

    get gridTemplate() {
        const areas = [];
        if (this.header) areas.push('"header header header" auto');
        if (this.image && this.body) {
            areas.push('"image body body" auto');
        } else if (this.image) {
            areas.push('"image image image" auto');
        } else if (this.body) {
            areas.push('"body body body" auto');
        }
        if (this.footer) areas.push('"footer footer footer" auto');
        return areas.join('\n');
    }

    get styles() {
        return `
        <style>
            :host {
                display: block;
                width: 100%;
            }
            .skeleton-container {
                display: grid;
                grid-template: ${this.gridTemplate};
                gap: 0.5rem;
            }
            .skeleton-header, .skeleton-body *, .skeleton-footer, .skeleton-image {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.25s infinite;
                border-radius: 2px;
                width: 100%;
                height: 1.5rem;
            }
            .skeleton-header {
                grid-area: header;
            }
            .skeleton-body {
                grid-area: body;
                display: flex;
                flex-direction: column;
            }
            .skeleton-body *:not(:last-child) {
                margin: 0 0 0.5rem;
            }
            .skeleton-body *:nth-child(odd){
                height: 1rem;
            }
            .skeleton-body *:nth-child(even){
                height: 2rem;
            }
            .skeleton-body *:nth-child(3n+3){
                height: 3rem;
            }
            .skeleton-body *:nth-child(3n+4){
                height: 4rem;
            }
            .skeleton-footer {
                grid-area: footer;
            }
            .skeleton-image {
                grid-area: image;
                height: 100%;
                min-height: 4rem;
            }
            @keyframes loading {
                0% {
                    background-position: 0% 0%;
                }
                100% {
                    background-position: 200% 0%;
                }
            }
            img {
                width: 100%;
                height: auto;
                display: block;
            }
        </style>
        `;
    }

    get template() {
        let bodyContent = '';
        if (this.body) {
            let bodyLines = this.getAttribute('body-lines') || 3;
            bodyContent = Array.from({ length: bodyLines })
            .map(() => `<div class="skeleton-block"></div>`)
            .join('');
        }
        return `
            <div class="skeleton-container">
                ${this.image ? '<div class="skeleton-image"></div>' : ''}
                ${this.header ? '<div class="skeleton-header"></div>' : ''}
                ${this.body ? `<div class="skeleton-body">${bodyContent}</div>` : ''}
                ${this.footer ? '<div class="skeleton-footer"></div>' : ''}
            </div>
        `;
    }

    render(){
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;
    }
}
customElements.define('skeleton-loader', SkeletonLoader);
export default SkeletonLoader;