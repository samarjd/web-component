class Dragzone extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['label'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
        }
    }

    _setUpListeners() {
        this.addEventListener('dragover', this._DragOver.bind(this));
        this.addEventListener('drop', this._Drop.bind(this));
        this.addEventListener('dragleave', this._DragLeave.bind(this));
    }

    _DragOver(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('drag-zone-over', {
            bubbles: true,
            composed: true,
            detail: {
                zone: this,
                after: e.clientY
            }
        }));
    }

    _Drop(e) {
        e.preventDefault();        
        this.dispatchEvent(new CustomEvent('drag-zone-drop', {
            bubbles: true,
            composed: true,
            detail: {
                zone: this,
            }
        }));
    }

    _DragLeave(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('drag-zone-leave', {
            bubbles: true,
            composed: true,
            detail: {
                zone: this
            }
        }));
    }

    get styles() {
        return `
        <style>
            :host {
                min-height: 50vh;
                border: 1px dashed #ffffff00;
                border-radius: 5px;
                box-shadow: 0 4px 5px 0px rgb(0 0 0 / 8%);
                background: #fcfcfc;
            }

            .drag-zone {
                padding: 10px;
                height: 100%;
            }

            :host(.dragged-over) {
                border-color: #007bff;
            }

            h5{
                color: #3c4650;
                font-size: 0.9rem;
                padding: 0.25rem 0.5rem;
                margin: 0;
                font-style: italic;
                background: #e4e5ea78;
                border-radius: 5px 5px 0 0;
                border-bottom: 1px solid #ccc
            }
        </style>
        `;
    }

    get template() {
        return `
            ${this.label ? `<h5>${this.label}</h5>` : ''}
            <div class="drag-zone">
                <slot></slot>
            </div>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;
        this._setUpListeners();
    }
}

customElements.define('drag-zone', Dragzone);
export default Dragzone;