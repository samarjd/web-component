class Badge extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.type = this.getAttribute('type') || 'primary';
        this.pill = this.hasAttribute('pill') && this.getAttribute('pill') !== 'false';
    }

    static get observedAttributes() {
        return ['type', 'pill'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'pill') {
                this.pill = newValue !== 'false';
            } else {
                this[name] = newValue;
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
        :host {
            display: inline-block;
            font-weight: lighter;
            color: #fff;
            background-color: var(--badge-bg, #0d6efd);
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            border-radius: var(--badge-border-radius, 0.375rem);
            user-select: none;
            vertical-align: baseline;
            white-space: nowrap;
            margin: 0.15rem;
            text-transform: lowercase;
        }
        :host::first-letter {text-transform: uppercase;}
        :host([pill]) { --badge-border-radius: 10rem; }

        /* Badge types */

        :host([type="primary"])   { --badge-bg: #0d6efd; color: #fff; }
        :host([type="secondary"]) { --badge-bg: #6c757d; color: #fff; }
        :host([type="success"])   { --badge-bg: #198754; color: #fff; }
        :host([type="danger"])    { --badge-bg: #dc3545; color: #fff; }
        :host([type="warning"])   { --badge-bg: #ffc107; color: #212529; }
        :host([type="info"])      { --badge-bg: #0dcaf0; color: #212529; }
        :host([type="light"])     { --badge-bg: #f8f9fa; color: #212529; }
        :host([type="dark"])      { --badge-bg: #212529; color: #fff; }

        /* Badge light types */
        :host([type="light-primary"])   { --badge-bg: #cfe2ff; color: #052c65; }
        :host([type="light-secondary"]) { --badge-bg: #d3d3d3; color: #212529; }
        :host([type="light-success"])   { --badge-bg: #d1e7dd; color: #0a3622; }
        :host([type="light-danger"])    { --badge-bg: #f8d7da; color: #58151c; }
        :host([type="light-warning"])   { --badge-bg: #fff3cd; color: #664d03; }
        :host([type="light-info"])      { --badge-bg: #cff4fc; color: #055160; }
        :host([type="light-dark"])      { --badge-bg: #e2e3e5; color: #495057; }
        :host([type="light-light"])     { --badge-bg: #fcfcfd; color: #495057; }
      </style>
    `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            <slot></slot>
        `;
    }
}

customElements.define('badge-elm', Badge);
export default Badge;