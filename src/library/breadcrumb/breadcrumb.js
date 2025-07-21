import '../navbar/nav-link.js';
class Breadcrumb extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.items = [];
        this.separator = this.getAttribute('separator') || '>';
    }

    connectedCallback() {
        this.collectItems();
        this.render();
    }

    static get observedAttributes() {
        return ['separator'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            this[name] = newValue;
            this.render();
        }
    }

    collectItems() {
        const rawItems = this.querySelectorAll('.breadcrumb-item');
        this.items = Array.from(rawItems).map(item => ({
            value: item.textContent.trim(),
            link: item.getAttribute('link') || '',
            active: item.hasAttribute('active'),
        }));
    }

    stripTags(text) {
        const stripped = text.replace(/<\/?[^>]+(>|$)/g, "");
        return stripped.replace(/(["'\\])/g, '\\$1');
    }

    get usage() {
        return `        &lt;breadcrumb-elm&gt;
            &lt;span class=&quot;breadcrumb-item&quot; link=&quot;view-count&quot;&gt;Home&lt/span&gt;
            &lt;span class=&quot;breadcrumb-item&quot; link=&quot;view-components&quot;&gt;Components&lt/span&gt;
            &lt;span class=&quot;breadcrumb-item&quot; active&gt;View Components&lt/span&gt;
            ...
        &lt;/breadcrumb-elm&gt;`;
    }

    get styles() {
        return `
        <style>
            :host {
                display: block;
                padding: 0.5rem;
            }
            .breadcrumb {
                display: flex;
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .breadcrumb li {
                color: #0066ff;
                font-size: 0.875rem;
                font-weight: normal;
                margin-right: 0.5rem;
            }
            .breadcrumb li::after {
                color: #6c757d;
                content: '${this.stripTags(this.separator)}';
                margin-left: 0.5rem;
            }
            .breadcrumb li:last-child::after {
                content: '';
            }
            .breadcrumb li.active {
                color: #6c757d;
            }
            nav-link:hover {
                color: #0066ff;
                border-bottom-color: #0066ff;
            }
            nav-link {
                border-bottom: 1px solid #cccccc00;
            }
        </style>
        `;
    }

    get template() {
        return `
        <ul class="breadcrumb">
            ${this.items.map(item =>
                item.link
                    ? `<li class="${item.active ? 'active' : ''}">
                        <nav-link navigate="${item.link}">${item.value}</nav-link>
                       </li>`
                    : `<li class="${item.active ? 'active' : ''}">${item.value}</li>`
            ).join('')}
        </ul>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;
        this.collectItems();
    }
}

customElements.define('breadcrumb-elm', Breadcrumb);
export default Breadcrumb;
