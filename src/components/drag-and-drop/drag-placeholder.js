class Placeholder extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open' });

    }

    connectedCallback() {
        this.render();
    }

    get styles() {
        return `
        <style>
            :host {
                pointer-events: none; /* Allow events to pass through */
            }
            .placeholder {
                text-align: center;
                color: #007bff;
                background-color:rgba(138, 159, 236, 0.2);
                border: 1px dashed #007bff;
                border-radius: 5px;
                padding: 0.5rem 1rem;
                margin-bottom: 1rem;
            }
        </style>
        `;
    }

    get template() {
        return `
        <div class="placeholder">
            Drop here
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

customElements.define('drop-placeholder', Placeholder);
export default Placeholder;