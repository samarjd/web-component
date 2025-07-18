class Alert extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.type = this.getAttribute('type') || 'default';
        this.dismissible = this.hasAttribute('dismissible') && this.getAttribute('dismissible') !== 'false';
        this.position = this.getAttribute('position') || 'bottom-right';
    }

    static get observedAttributes() {
        return ['type', 'dismissible', 'position'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'dismissible') {
                this.dismissible = newValue !== 'false';
            } else {
                this[name] = newValue;
            }
            this.render();
        }
    }

    connectedCallback() {
        if (!window.alertsGlobal) window.alertsGlobal = [];
        window.alertsGlobal.push(this);

        this.render();
    }

    disconnectedCallback() {
        if (window.alertsGlobal) {
            window.alertsGlobal = window.alertsGlobal.filter(a => a !== this);
        }
    }

    get styles() {
        return `
            <style>
                :host{
                    --alert-color: #495057;
                    --alert-bg: #fcfcfd;
                    --alert-border: #e9ecef;
                    --alert-shadow: rgba(0, 0, 0, 0.15);

                    --alert-bg-primary: #cfe2ff;
                    --alert-bg-success: #d1e7dd;
                    --alert-bg-warning: #fff3cd;
                    --alert-bg-danger: #f8d7da;
                    --alert-bg-info: #cff4fc;
                    --alert-bg-dark: #e2e3e5;
                    --alert-bg-light: #fcfcfd;

                    --alert-color-primary: #052c65;
                    --alert-color-success: #0a3622;
                    --alert-color-warning: #664d03;
                    --alert-color-danger: #58151c;
                    --alert-color-info: #055160;
                    --alert-color-dark: #495057;
                    --alert-color-light: #495057;

                    --alert-border-primary: #9ec5fe;
                    --alert-border-success: #a3cfbb;
                    --alert-border-warning: #ffe69c;
                    --alert-border-danger: #f1aeb5;
                    --alert-border-info: #9eeaf9;
                    --alert-border-dark: #adb5bd;
                    --alert-border-light: #e9ecef;

                    --alert-spadding: 0.75rem 1rem;
                    --alert-radius: 0.2rem;
                    --alert-shadow: -2px 2px 5px 0px rgba(0, 0, 0, 0.15);
                }
                .alert {
                    position: fixed;
                    z-index: 2000;
                    padding: var(--alert-spadding);
                    border-radius: var(--alert-radius);
                    box-shadow: var(--alert-shadow);
                    border: 1px solid var(--alert-border);
                    font-family: sans-serif;
                    width: min(300px, 25vw);
                    transition: transform 0.2s ease-in-out;
                }
                .alert:hover {
                    transform: translateY(-2px);
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: inherit;
                }
                .alert {
                    background-color: var(--alert-bg);
                    color: var(--alert-color);
                    border-color: var(--alert-border);
                }
                .alert-primary {
                    background-color: var(--alert-bg-primary);
                    color: var(--alert-color-primary);
                    border-color: var(--alert-border-primary);
                }
                .alert-success {
                    background-color: var(--alert-bg-success);
                    color: var(--alert-color-success);
                    border-color: var(--alert-border-success);
                }
                .alert-warning {
                    background-color: var(--alert-bg-warning);
                    color: var(--alert-color-warning);
                    border-color: var(--alert-border-warning);
                }
                .alert-danger {
                    background-color: var(--alert-bg-danger);
                    color: var(--alert-color-danger);
                    border-color: var(--alert-border-danger);
                }
                .alert-info {
                    background-color: var(--alert-bg-info);
                    color: var(--alert-color-info);
                    border-color: var(--alert-border-info);
                }
                .alert-dark {
                    background-color: var(--alert-bg-dark);
                    color: var(--alert-color-dark);
                    border-color: var(--alert-border-dark);
                }
                .alert-bottom-right {
                    bottom: 1rem;
                    right: 1rem;
                }
                .alert-top-right {
                    top: 1rem;
                    right: 1rem;
                }
                .alert-top-left {
                    top: 1rem;
                    left: 1rem;
                }
                .alert-bottom-left {
                    bottom: 1rem;
                    left: 1rem;
                }
                .alert-body:has(.close-btn) {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                }
                .close-btn:hover {
                    opacity: 0.8;
                }
            </style>
        `;
    }

    get template() {
        return `
            <div class="alert alert-${this.type} alert-${this.position}">
                <div class="alert-body">
                    <slot></slot>
                    ${this.dismissible ? `<button class="close-btn" @click="${this.dismiss}">&times;</button>` : ''}
                </div>
            </div>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;

        this._bindEvents();
    }

    _bindEvents() {
        const alerts = window.alertsGlobal.filter(alert => alert.position === this.position);
        const previousAlerts = alerts.filter(alert => alert !== this);

        if (previousAlerts.length > 0) {
            const isTop = this.position.includes('top');
            let offset = 0;

            previousAlerts.forEach(prevAlert => {
                const el = prevAlert.shadowRoot?.querySelector('.alert');
                if (el) {
                    offset += el.offsetHeight + 10;
                }
            });

            const thisAlert = this.shadowRoot.querySelector('.alert');
            if (thisAlert) {
                thisAlert.style.transform = `translateY(${isTop ? offset : -offset}px)`;
            }
        }

        if (this.dismissible) {
            this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => {
                this._dismiss();
            });
        }else{
            setTimeout(() => {
                this._dismiss();
            }, 2000);
        }
    }

    _dismiss() {
        const alertEl = this.shadowRoot.querySelector('.alert');
        if (alertEl) {
            alertEl.style.transition = 'opacity 0.4s, transform 0.4s';
            alertEl.style.opacity = '0';
            alertEl.style.transform = 'translateY(20px)';
            setTimeout(() => this.remove(), 400);
        } else {
            this.remove();
        }
    }
}

customElements.define('alert-elm', Alert);
export default Alert;