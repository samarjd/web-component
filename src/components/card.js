
class Card extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._dropdown = [];
        this.type = this.getAttribute('type') || '';
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['type'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'type' && newValue !== oldValue) {
            this.type = newValue;
            this.render();
        }
    }

    get styles() {
        return `
            <style>
                :host {
                    transition: transform 0.1s ease-in-out;
                }

                @media screen and (max-width: 300px) {
                    :host {
                        width: 100%;
                    }
                }
                .card {
                    border-radius: max(0.5vw, 0.5rem);
                    padding: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    font-family: sans-serif;
                    background: white;
                    margin: 0 0 1rem;
                }
                .card:hover{
                    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                    transform: translateY(-2px);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .card-default { border-left: 4px solid #6c757d; }
                .card-primary { border-left: 4px solid #007bff; }
                .card-success { border-left: 4px solid #2fab67; }
                .card-warning { border-left: 4px solid #ffc107; }
                .card-danger  { border-left: 4px solid #dc3545; }
                .card-dark    { border-left: 4px solid #343a40; }
                .card-light   { border-left: 4px solid #f8f9fa; }

                .card-header {
                    width:100%;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                    font-size: 1.2rem;
                    color: #2e3741;
                }
                
                .card-body {
                    margin-bottom: 0.5rem;
                    font-size: 0.8rem;
                }

                .card-footer {
                    border-top: 1px solid #eee;
                    margin-top: 0.5rem;
                    padding-top: 0.5rem;
                    text-align: right;
                    font-size: 0.8rem;
                    color: #9d9d9d;
                }

            </style>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            <div class="card ${this.type}">
                ${this.querySelector('[slot="card-header"]') ? `
                <div class="card-header">
                    <slot name="card-header"></slot>
                </div>` : ''}
                <div class="card-body">
                    <slot name="card-body"></slot>
                </div>
                ${this.querySelector('[slot="card-footer"]') ? '<div class="card-footer"><slot name="card-footer"></slot></div>' : ''}
            </div>
        `;

        
    }
}

customElements.define('card-elm', Card);
export default Card;
