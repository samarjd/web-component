import '../icons/icons.js';

class Modal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._width = 'medium';
        this._border = '';
        this._color = 'default';
        this._backdropClose = false;
        this._backdrop = false;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        const validWidths = ['small', 'medium', 'large', 'full'];
        this._width = validWidths.includes(value) ? value : 'medium';
        this.render();
    }

    get border() {
        return this._border;
    }

    set border(value) {
        this._border = value ? '1px solid' : '';
        this.render();
    }

    get color() {
        return this._color;
    }

    set color(value) {
        const validColors = ['default', 'primary', 'success', 'danger', 'warning', 'dark', 'light'];
        this._color = validColors.includes(value) ? value : 'default';
        this.render();
    }

    get backdropClose() {
        return this._backdropClose;
    }

    set backdropClose(value) {
        this._backdropClose = value ? true : false;
        this.render();
    }

    get backdrop() {
        return this._backdrop;
    }

    set backdrop(value) {
        this._backdrop = value ? true : false;
        this.render();
    }

    connectedCallback() {
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
        return colors[color] || colors.primary;
    }

    getTextColor(color) {
        if (color === 'light') return '#212529';
        return '#ffffff';
    }

    getComputedWidth(width) {
        const widths = {
            small: '30vw',
            medium: '50vw',
            large: '70vw',
            full: '100vw'
        };
        return widths[width] || widths.medium;
    }

    get styles() {
        const bgColor = this.getColor(this.color);
        const textColor = this.getTextColor(this.color);
        const border = this.border ? `1px solid ${bgColor}` : 'none';
        const contentWidth = this.getComputedWidth(this.width) || '50vw';
        return `
            <style>
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal.show {
                    display: flex;
                }
                .modal.hide {
                    display: none;
                }
                .modal-header {
                    background: ${bgColor};
                    color: ${textColor};
                    padding: 0.5rem 1rem;
                    border: ${border};
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 5px 5px 0 0;
                }

                .modal-header h2 {
                    margin: 0;
                    font-size: 1rem;
                }
                .modal-header .close{
                    cursor: pointer;
                }

                .modal-header .close:hover {
                    opacity: 0.75;
                }
                
                .modal-header .close:active {
                    opacity: 0.75;
                }
                .modal-content {
                    margin-top: 1rem;
                    font-size: 1rem;
                    color: ${textColor};
                    background: white;
                    width: ${contentWidth};
                    overflow: auto;
                    border-radius: 5px;
                    z-index: 1000;
                }
                .modal-body {
                    padding: 1rem;
                    font-size: 0.9rem;
                    color: #333;
                }  
                .modal-footer {    
                    border-top: 1px solid #eee;
                    padding: 1rem;
                    font-size: 0.9rem;
                    color: #9d9d9d;
                    text-align: right;
                }

                .modal-backdrop {
                    background: rgba(0, 0, 0, 0.5);
                    width: 100%;
                    height: 100%;
                    position: fixed;
                    z-index: 999;
                    top: 0;
                    left: 0;
                }

                .shake {
                    animation: shake 0.5s;
                }

                @keyframes shake {
                    0% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    50% { transform: translateX(10px); }
                    75% { transform: translateX(-10px); }
                    100% { transform: translateX(0); }
                }
            </style>
        `;
    }

    get template() {
        return `
        <div class="modal hide">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="modal-header"></slot>
                    <span class="close" title="Close Modal">
                        <icon-elm name="close" size="10" color="#fff" title="Settings"></icon-elm>
                    </span>
                </div>
                <div class="modal-body">
                    <slot name="modal-body"></slot>
                </div>
                ${this.innerHTML.includes('slot="modal-footer"') ? `
                    <div class="modal-footer">
                        <slot name="modal-footer"></slot>
                    </div>
                ` : ''}
            </div>
            ${this.backdrop ? `<div class="modal-backdrop show"></div>` : ''}
        </div>
        `;
    }

    show() {
        const modal = this.shadowRoot.querySelector('.modal');
        const modalContent = this.shadowRoot.querySelector('.modal-content');
        const backdrop = this.shadowRoot.querySelector('.modal-backdrop');
        if (modal) {
            modal.classList.remove('hide');
            modal.classList.add('show');
        }
        if (modalContent) {
            modalContent.style.opacity = 0;
            modalContent.style.transform = 'translateY(-30px)';
            setTimeout(() => {
                modalContent.style.transition = 'opacity 0.3s, transform 0.3s';
                modalContent.style.opacity = 1;
                modalContent.style.transform = 'translateY(0)';
            }, 20);
        }
        if (backdrop) {
            backdrop.classList.remove('hide');
            backdrop.classList.add('show');
            backdrop.style.opacity = 0;
            setTimeout(() => {
                backdrop.style.transition = 'opacity 0.3s';
                backdrop.style.opacity = 1;
            }, 20);
        }
    }

    hide() {
        const modal = this.shadowRoot.querySelector('.modal');
        const modalContent = this.shadowRoot.querySelector('.modal-content');
        const backdrop = this.shadowRoot.querySelector('.modal-backdrop');
        if (modalContent) {
            modalContent.style.transition = 'opacity 0.3s, transform 0.3s';
            modalContent.style.opacity = 0;
            modalContent.style.transform = 'translateY(-30px)';
        }
        if (backdrop) {
            backdrop.style.transition = 'opacity 0.3s';
            backdrop.style.opacity = 0;
        }
        setTimeout(() => {
            if (modal) {
                modal.classList.add('hide');
                modal.classList.remove('show');
            }
            if (backdrop) {
                backdrop.classList.add('hide');
                backdrop.classList.remove('show');
            }
        }, 200);
    }

    _setupEventListeners() {
        const denyClosure = () => {
            const modal = this.shadowRoot.querySelector('.modal-content');
            if (modal) {
                modal.classList.add('shake');
                setTimeout(() => {
                    modal.classList.remove('shake');
                }, 500);
            }
        };

        const closeBtn = this.shadowRoot.querySelector('.close');
        if (closeBtn) closeBtn.addEventListener('click', this.hide.bind(this));

        const backdrop = this.shadowRoot.querySelector('.modal-backdrop');
        if (backdrop) {
            if (this.backdropClose) {
                backdrop.addEventListener('click', this.hide.bind(this));
            } else {
                backdrop.addEventListener('click', denyClosure);
            }
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;
        this._setupEventListeners();
    }
}

customElements.define('modal-elm', Modal);
export default Modal;