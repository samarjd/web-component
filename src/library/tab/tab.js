import Button from '../button/button.js';

class Tab extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.tabs = [];
        this.panels = [];
        this.active = 0;
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['align', 'justify', 'direction', 'active', 'type'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) this[name] = newValue;
        this.render();
    }

    getColor(color) {
        const colors = {
            default: '#6c757d',
            primary: '#007bff',
            success: '#198754',
            danger: '#dc3545',
            warning: '#ffc107',
            dark: '#343a40',
            light: '#f8f9fa'
        };
        return colors[color] || '';
    }

    get styles() {
        return `
        <style>
            :host {
                display: block;
                font-family: sans-serif;
            }

            .tab-list {
                background-color: ${this.getColor(this.type || 'primary')};
                color: white;
                padding: 5px 2px;
                border-radius: 2rem;
                display: flex;
                flex-direction: ${this.direction || 'row'};
                justify-content: ${this.justify || 'flex-start'};
                align-items: ${this.align || 'center'};
                list-style: none;
                margin: ${this.justify === 'center' ? '1rem auto' : (this.justify === 'end' ? '1rem 0 1rem auto' : '1rem 0')};
                width: fit-content;
                gap: 5px;
                flex-wrap: wrap;
            }

            .tab-item {
                cursor: pointer;
                transition: border-bottom 0.3s, color 0.3s;
                transition: opacity 0.3s ease-in-out;
            }

            .tab-item.active {
                opacity: 1;
            }

            ::slotted(.tab-panel) {
                display: none;
            }

            ::slotted(.tab-panel.active) {
                display: block;
            }
            </style>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            <ul class="tab-list"></ul>
            <slot></slot>
        `;
        this.initTabs();
    }

    initTabs() {
        const slot = this.shadowRoot.querySelector('slot');
        const assignedElements = slot.assignedElements().filter(el => el.tagName);

        this.tabs = [];
        this.panels = [];

        const tabList = this.shadowRoot.querySelector('.tab-list');
        tabList.innerHTML = '';

        assignedElements.forEach((panel, index) => {
            const label = panel.getAttribute('label') || `Tab ${index + 1}`;
            if (panel.hasAttribute('active')) this.active = index;

            const tabItemBtn = new Button();
            Object.assign(tabItemBtn, {
                type: 'li',
                rounded: true,
                title: label + ' tab',
                margin: 0,
                innerHTML: `${label}`,
            }).addEventListener('click', () => {
                this.selectTab(index);
            });

            tabList.appendChild(tabItemBtn);

            this.tabs.push(tabItemBtn);
            this.panels.push(panel);
        });

        this.selectTab(this.active);
    }

    selectTab(index) {
        this.active = index;

        this.tabs.forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
            tab.setAttribute('color', i === index ? 'light' : (this.type || 'primary'));
        });

        this.panels.forEach((panel, i) => {
            panel.classList.toggle('active', i === index);
        });
    }
}

customElements.define('tab-elm', Tab);
export default Tab;
