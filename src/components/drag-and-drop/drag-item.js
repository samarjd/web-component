class Dragitem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
            this.render();
        }
    }

    _setUpListeners() {
        this.setAttribute('draggable', 'true');
        this.addEventListener('dragstart', this._DragStart.bind(this));
        this.addEventListener('dragend', this._DragEnd.bind(this));

        this.querySelectorAll('img, a').forEach(el => {
            el.setAttribute('draggable', 'false');
        });
    }

    _DragStart(e) {
        this.dispatchEvent(new CustomEvent('drag-item-start', {
            bubbles: true,
            composed: true,
            detail: {
                item: this
            }
        }));        
    }

    _DragEnd(e) {
        this.dispatchEvent(new CustomEvent('drag-item-end', {
            bubbles: true,
            composed: true,
            detail: {
                item: this
            }
        }));
    }

    get styles() {
        return `
        <style>
            :host {
                display: block;
            }

            .drag-item {
                cursor: grab;
                user-select: none;
                -moz-user-select: none; // Firefox
                -webkit-user-drag: none; // Safari
                -webkit-user-select: none; // Chrome
                -ms-user-select: none; // IE
                margin-bottom: 10px;
            }

            :host(.dragging) {
                filter: blur(1px);
                transform: rotate(-5deg);
                opacity: 0.8;
                overflow: hidden;
            }
        </style>
        `;
    }

    get template() {
        return `
        <div class="drag-item">
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

customElements.define('drag-item', Dragitem);
export default Dragitem;