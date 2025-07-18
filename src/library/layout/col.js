class Col extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.class = this.getAttribute('class') || '';
        this.align = this.getAttribute('align') || 'left';
        this.nowrap = this.hasAttribute('nowrap') ? 'nowrap' : 'wrap';
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['class', 'align', 'nowrap'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ((name === 'class' || name === 'align') && newValue !== oldValue) {
            this.class = newValue;
        }
        if (name === 'nowrap') {
            this.nowrap = newValue !== null && newValue !== 'false' ? 'nowrap' : 'wrap';
        }
        this.render();
    }
   
    get styles() {
        return `
            <style>
                :host {
                    box-sizing: border-box;
                    display: block;
                    padding-left: 0.5rem;
                    padding-right: 0.5rem;
                }

                .col {
                    flex-shrink: 0;
                    max-width: 100%;      
                    text-align: ${this.align}; 
                }

                :host(.col-12) { flex: 0 0 100%; max-width: 100%; }
                :host(.col-11) { flex: 0 0 91.6667%; max-width: 91.6667%; }
                :host(.col-10) { flex: 0 0 83.3333%; max-width: 83.3333%; }
                :host(.col-9)  { flex: 0 0 75%; max-width: 75%; }
                :host(.col-8)  { flex: 0 0 66.6667%; max-width: 66.6667%; }
                :host(.col-7)  { flex: 0 0 58.3333%; max-width: 58.3333%; }
                :host(.col-6)  { flex: 0 0 50%; max-width: 50%; }
                :host(.col-5)  { flex: 0 0 41.6667%; max-width: 41.6667%; }
                :host(.col-4)  { flex: 0 0 33.3333%; max-width: 33.3333%; }
                :host(.col-3)  { flex: 0 0 25%; max-width: 25%; }
                :host(.col-2)  { flex: 0 0 16.6667%; max-width: 16.6667%; }
                :host(.col-1)  { flex: 0 0 8.3333%; max-width: 8.3333%; }

                ${this.nowrap !== 'nowrap' ? `
                    @media (max-width: 600px) {
                        :host {
                            flex: 0 0 100% !important;
                            max-width: 100% !important;
                        }
                    }
                ` : ''}
            </style>
        `;
    }

    render() {

        this.shadowRoot.innerHTML = `
            ${this.styles}
            <div class="col ${this.class}">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('col-elm', Col);
export default Col;