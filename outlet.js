import './src/component/notfound.js';    
import './src/library/icons/icons.js';
class Outlet extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this._view = '';
    }

    get view() {
        return this._view;
    }

    set view(value) {
        this._view = value;
        this.render();
    }

    loadView(viewName, showLoader = true, prefix = '') {
        if (!this.shadowRoot) return;
        const loader = this.shadowRoot.querySelector('.loader');
        
        if (showLoader) {
            if(!loader) this.view += `<div class="loader"></div>`;
        }

        import(`${prefix}${viewName}.js`)
        .then(() => {
            this.view = `<${viewName}></${viewName}>`;
        })
        .catch((error) => {
            this.view = `<not-found></not-found>`;
            console.error(`Error loading view ${viewName}:`, error);
        });
       
    }

    get styles() {
        return `
        <style>
            .layout {
                padding: 1.25rem 1rem;
                font-family: sans-serif;
            }

            .loader {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background-color: #52565e30;
                z-index: var(--zindex-loader, 1060);
            }
        </style>
    `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            <div class="layout">
                ${this.view}
            </div>
        `;
    }
}

customElements.define('outlet-content', Outlet);
export default Outlet;
