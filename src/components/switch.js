class switchBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.disabled = this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false';
        this.type = this.getAttribute('type') || '';
        this.isChecked = this.hasAttribute('checked') && this.getAttribute('checked') !== 'false';
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['disabled', 'type'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'disabled') {
                this.disabled = newValue !== 'false';
            }else if (name === 'type') {
                console.warn('The "type" attribute is deprecated. Use class names instead.');
                this.type = newValue;
            }else if (name === 'checked') {
                this.isChecked = newValue !== 'false';
            }
            this.render();
        }
    }

    get styles() {
        return `
            <style>
                .switch-box {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                .switch-box.disabled {
                    cursor: not-allowed;
                    opacity: 0.5;
                }
                .switch-box.disabled * {
                    pointer-events: none;
                }
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 43px;
                    height: 20px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ebebeb;
                    transition: .4s;
                }
                .switch-box.disabled .slider {
                    background-color: #ffc0c0 !important;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 12px;
                    width: 12px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    box-shadow: -1px 0px 5px 0 #00000030;
                    transition: transform .4s ease-in-out;
                }

                input:not([class^="outline-"]):focus + .slider{
                    box-shadow: 0 0 0 .2rem rgb(124 144 174 / 20%);
                }
                /* Color variations for different types */
                input:not([class^="outline-"]):checked + .slider {
                    background-color: #2196F3;
                }
                input.primary:checked + .slider {
                    background-color: #2196F3;
                }
                input.danger:checked + .slider{
                    background-color: #f44336;
                }
                input.warning:checked + .slider {
                    background-color: #ff9800;
                }
                input.success:checked + .slider {
                    background-color: #13d285;
                }
                input.info:checked + .slider {
                    background-color: #00bcd4;
                }
                input.dark:checked + .slider {
                    background-color: #333;
                }
                input.light:checked + .slider {
                    background-color: #f1f1f1;
                }
                input.secondary:checked + .slider {
                    background-color: #6c757d;
                }

                /* Outline variations for different types */
                input.outline-primary:checked + .slider {
                    box-shadow: inset 0px 0px 0px 1px #2196F3, 0px 0px 0px 1px #2196F3
                }
                input.outline-danger:checked + .slider {
                    box-shadow: inset 0px 0px 0px 1px #f44336, 0px 0px 0px 1px #f44336;
                }
                input.outline-warning:checked + .slider {
                    box-shadow: inset 0px 0px 0px 1px #ff9800, 0px 0px 0px 1px #ff9800;
                }
                input.outline-success:checked + .slider {
                    box-shadow: inset 0px 0px 0px 1px #13d285, 0px 0px 0px 1px #13d285;
                }
                input.outline-info:checked + .slider {
                    box-shadow: inset 0px 0px 0px 1px #00bcd4, 0px 0px 0px 1px #00bcd4;
                }
                input.outline-dark:checked + .slider {
                    box-shadow: inset 0px 0px 0px 1px #333, 0px 0px 0px 1px #333;
                }
                input.outline-light:checked + .slider {
                    box-shadow: inset 0px 0px 0px 1px #f1f1f1, 0px 0px 0px 1px #f1f1f1;
                }
                input.outline-secondary:checked + .slider {
                    box-shadow: inset 0px 0px 0px 1px #6c757d, 0px 0px 0px 1px #6c757d;
                }

                input:checked + .slider:before {
                    transform: translateX(23px);
                }
                .slider.round {
                    border-radius: 5rem;
                }
                .slider.round:before {
                    border-radius: 50%;
                }
                .label-text {
                    margin-left: 10px;
                    font-size: 14px;
                    color: #595959;
                    font-weight: 100;
                    cursor: pointer;
                }
                
            </style>
        `;
    }

    get template() {
        return `
            <div class="switch-box ${this.disabled ? 'disabled' : ''}">
                <label class="switch">
                    <input type="checkbox" id="toggle" class="${this.type}" ${this.isChecked ? 'checked' : ''}>
                    <span class="slider round"></span>
                </label>
                <span class="label-text">
                    <slot></slot>
                </span>
            </div>
        `;
    }

    render(){
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;
        this._bindEvents();
    }

    _bindEvents() {
        const label = this.shadowRoot.querySelector('.label-text');
        label.addEventListener('click', () => {
            if (this.state !== 'disabled') {
                this.isChecked = !this.isChecked;
                this.classList.toggle('checked', this.isChecked);

                const input = this.shadowRoot.querySelector('input[type="checkbox"]');
                input.checked = this.isChecked;
                input.dispatchEvent(new Event('change'));        
            }
        });
    }
}

customElements.define('switch-box', switchBox);
export default switchBox;