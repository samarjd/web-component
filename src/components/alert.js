let alertsGlobal = [];
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
        alertsGlobal.push(this);
        this.render();
    }

    disconnectedCallback() {
        const index = alertsGlobal.indexOf(this);
        if (index > -1) {
            alertsGlobal.splice(index, 1);
        }
    }

    get styles() {
        return `
            <style>
                .alert {
                    position: fixed;
                    z-index: 2000;
                    padding: 0.75rem 1rem;
                    border-radius: 0.2rem;
                    box-shadow: -2px 2px 5px 0px rgba(0, 0, 0, 0.15);
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
                    background-color: #ffffffff;
                    color: #212529;
                }
                .alert-primary {
                    background-color: #007bff;
                    color: #ffffff;
                }
                .alert-success {
                    background-color: #28a745;
                    color: #ffffff;
                }
                .alert-warning {
                    background-color: #ffc107;
                    color: #212529;
                }
                .alert-danger {
                    background-color: #dc3545;
                    color: #ffffff;
                }
                .alert-info {
                    background-color: #17a2b8;
                    color: #ffffff;
                }
                .alert-dark {
                    background-color: #343a40;
                    color: #ffffff;
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
        const alerts = alertsGlobal.filter(alert => alert.position === this.position);
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