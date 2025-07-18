class Row extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.align = this.getAttribute('align') || 'flex-start';
        this.justify = this.getAttribute('justify') || 'flex-start';
        this.nowrap = this.hasAttribute('nowrap') ? 'nowrap' : 'wrap';
        this.direction = this.getAttribute('direction') || 'row';
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['align', 'justify', 'nowrap', 'direction'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (['align', 'justify', 'direction'].includes(name)) {
            if (newValue !== oldValue) {
                this[name] = newValue;
            }
        }
        if (name === 'nowrap') {
            this.nowrap = newValue !== null && newValue !== 'false' ? 'nowrap' : 'wrap';
        }
        this.render();
    }

    get styles() {
        return `
        <style>
            .row {
                display: flex;
                flex-direction: ${this.direction};
                flex-wrap: ${this.nowrap};
                align-items: ${this.align};
                justify-content: ${this.justify};
            }
            
            ${this.nowrap !== 'nowrap' ? `
                @media (max-width: 600px) {
                    .row {
                        flex-direction: column;
                        align-items: stretch;
                    }
                }
            ` : ''}
        </style>
    `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            <div class="row">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('row-elm', Row);
export default Row;