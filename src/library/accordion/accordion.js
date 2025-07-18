import '../icons/icons.js';

class Accordion extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.expanded = this.hasAttribute('expanded') && this.getAttribute('expanded') !== 'false';
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['expanded'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.expanded = newValue !== 'false';
            this.render();
        }
    }

    get styles() {
        return `
            <style>
                .accordion {
                    border: 1px solid #dcdcdc;
                    overflow: hidden;
                    width: 100%;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    color: #333;
                    font-family: sans-serif;
                }

                .accordion-header {
                    color: #343a40;
                    font-size: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.9rem 1rem;
                    background-color: #fff;
                    cursor: pointer;
                }

                :host:has([aria-expanded="true"]) .accordion-header {
                    background-color: #e4f2fe;
                }

                .accordion-header:hover {
                    box-shadow: inset 0 0 0 3px #92cdfc;
                }

                .accordion-toggle {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 10px;
                }

                .icon {
                    color: #343a40;
                    display: inline-block;
                    transition: transform 0.3s ease;
                }

                .accordion-toggle[aria-expanded="true"] .icon {
                    transform: rotate(-180deg);
                }

                .accordion-content {
                    overflow: hidden;
                    max-height: 0;
                    transition: max-height 0.4s ease;
                }

                .accordion-content-inner {
                    padding: 0.5rem 1rem;
                }

                .accordion-content p {
                    margin: 0;
                }
            </style>
        `;
    }

    get template() {
        return `
            <div class="accordion">
                <div class="accordion-header">
                    <slot name="header"></slot>
                    <button class="accordion-toggle" aria-expanded="${this.expanded ? 'true' : 'false'}">
                        <icon-elm class="icon" name="chevron-down"></icon-elm>
                    </button>
                </div>
                <div class="accordion-content" aria-expanded="${this.expanded ? 'true' : 'false'}">
                    <div class="accordion-content-inner">
                        <slot name="content"></slot>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `${this.styles}${this.template}`;
        this._bindEvents();
    }

    _bindEvents() {
        const header = this.shadowRoot.querySelector('.accordion-header');
        const toggleBtn = this.shadowRoot.querySelector('.accordion-toggle');
        const content = this.shadowRoot.querySelector('.accordion-content');
        const inner = this.shadowRoot.querySelector('.accordion-content-inner');

        const duration = 350;

        // Set initial state
        if (this.expanded) {
            const fullHeight = inner.scrollHeight;
            content.style.maxHeight = fullHeight + 'px';
        }

        // Toggle listeners init
        header.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            const newState = !isExpanded;

            toggleBtn.setAttribute('aria-expanded', String(newState));
            content.setAttribute('aria-expanded', String(newState));

            if (newState) {
                // EXPAND
                content.style.maxHeight = inner.scrollHeight + 'px';
                setTimeout(() => {
                    if (content.getAttribute('aria-expanded') === 'true') {
                        content.style.maxHeight = 'none';
                    }
                }, duration);
            } else {
                // COLLAPSE
                content.style.maxHeight = inner.scrollHeight + 'px';
                content.offsetHeight;
                content.style.maxHeight = '0px';
            }
        });
    }

}

customElements.define('accordion-elm', Accordion);
export default Accordion;
