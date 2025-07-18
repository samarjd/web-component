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

    loadView(viewName, showLoader = true) {
        if (!this.shadowRoot) return;
        const loader = this.shadowRoot.querySelector('.loader');
        
        if (showLoader) {
            !loader ? this.view += `
            <div class="loader">
                <icon-elm class="spin" name="spinner" size="10" title="Loading view"></icon-elm>
                <span>Loading ${viewName}...</span>
            </div>`
            : loader.innerHTML = `
            <icon-elm class="spin" name="spinner" size="25" title="Loading view"></icon-elm>
            <span>Loading ${viewName}...</span>`;
        }

        import(`./src/views/${viewName}.js`)
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
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.5rem;
                width: 100%;
                height: 100vh;
                font-size: 1.25rem;
                color: #4c4c4c;
                background-color: #52565e40;
                z-index: 1000;
            }

            .loader icon-elm {
                top: 0;
                margin-right: 0.5rem;
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
