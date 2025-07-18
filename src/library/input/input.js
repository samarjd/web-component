class Input extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this._internals = this.attachInternals();
        this._onInput = this._onInput.bind(this);
    }

    static get formAssociated() {
        return true;
    }

    static get observedAttributes() {
        return ['type', 'placeholder', 'value', 'disabled', 'required', 'pattern', 'name', 'label', 'min', 'max', 'step'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'value') {
                this.value = newValue;
            } else {
                this.render();
            }
        }
    }

    get value() {
        return this._input ? this._input.value : '';
    }
    set value(val) {
        if (this._input) {
            this._input.value = val;
            this._internals.setFormValue(val);
            this._validate();
        }
    }

    get name() {
        return this.getAttribute('name') || '';
    }
    set name(val) {
        this.setAttribute('name', val);
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }
    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get required() {
        return this.hasAttribute('required');
    }
    set required(val) {
        if (val) {
            this.setAttribute('required', '');
        } else {
            this.removeAttribute('required');
        }
    }

    get pattern() {
        return this.getAttribute('pattern') || null;
    }
    set pattern(val) {
        if (val) {
            this.setAttribute('pattern', val);
        } else {
            this.removeAttribute('pattern');
        }
    }

    get label() {
        return this.getAttribute('label') || '';
    }
    set label(val) {
        this.setAttribute('label', val);
    }

    get min() {
        return this.getAttribute('min') || null;
    }
    set min(val) {
        if (val) {
            this.setAttribute('min', val);
        } else {
            this.removeAttribute('min');
        }

    }

    get max() {
        return this.getAttribute('max') || null;
    }
    set max(val) {
        if (val) {
            this.setAttribute('max', val);
        }
        else {
            this.removeAttribute('max');
        }
    }

    get step() {
        return this.getAttribute('step') || null;
    }
    set step(val) {
        if (val) {
            this.setAttribute('step', val);
        } else {
            this.removeAttribute('step');
        }
    }

    get styles() {
        return `
      <style>
        :host {
            display: inline-block;
            font-family: inherit;
            position: relative;
            width: 100%;
        }
        input {
            font: inherit;
            height: 38px;
            padding: 0.25rem 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            outline: none;
            width: 100%;
            box-sizing: border-box;
            background: transparent;
            margin-bottom: 0.5rem;
        }
        input:focus {
            border-color: #68b1ff;
            box-shadow: 0 0 0 3px #a6d1ff;
        }
        input:invalid {
            border-color: red;
        }
        input:invalid:focus {
            border-color: red;
            box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.2);
        }
        input:disabled {
            background: #eee;
            cursor: not-allowed;
        }
        :host:has(label) input{
            margin-bottom: 1rem;
        }
        label {
            position: absolute;
            left: 1.5rem;
            top: 11px;
            color: #898989;
            font-size: 14px;
            pointer-events: none;
            transition: all 0.2s ease, color 0.2s ease;
            background: white;
            padding: 0 0.15rem;
            user-select: none;
        }
        input:focus + label,
        input:not(:placeholder-shown) + label {
            top: -8px;
            left: 0.5rem;
            font-size: 12px;
            color: #68b1ff;
        }
        input:disabled + label {
            color: #aaa;
        }
        input:invalid + label {
            color: red;
        }
        .visually-hidden{
            display: none;
            color: red;
            font-size: 0.875rem;
            padding: 0.25rem 0;        
        }

        .visually-hidden.show {
            display: block;
        }
      </style>
    `;
    }

    render() {
        const type = this.getAttribute('type') || 'text';
        const value = this.getAttribute('value') || '';
        const disabled = this.hasAttribute('disabled');
        const required = this.hasAttribute('required');
        const pattern = this.getAttribute('pattern');
        const labelText = this.label;

        this._inputId = this.getAttribute('id') || `input-${Math.random().toString(36).slice(2, 9)}`;

        this.shadowRoot.innerHTML = `
        ${this.styles}
        <input
            id="${this._inputId}"
            type="${type}"
            value="${value}"
            ${disabled ? 'disabled' : ''}
            ${required ? 'required' : ''}
            ${pattern ? `pattern="${pattern}"` : ''}
            aria-required="${required}"
            aria-disabled="${disabled}"
            placeholder="${!labelText ? this.getAttribute('placeholder') || '' : ''}"
            min="${this.min || ''}"
            max="${this.max || ''}"
            step="${this.step || ''}"
        >
        ${labelText ? `<label for="${this._inputId}">${labelText}</label>` : ''}
        <div class="visually-hidden" role="alert"></div>
        `;

        this._input = this.shadowRoot.querySelector('input');

        this._internals.setFormValue(this._input.value);

        this._input.addEventListener('input', this._onInput);
        this._input.addEventListener('focus', this._onFocus);
        this._input.addEventListener('blur', this._onBlur);

        this._validate();
    }

    _onInput(e) {
        const val = e.target.value;
        this._internals.setFormValue(val);
        this._validate();

        if (val !== this.getAttribute('value')) {
            this.setAttribute('value', val);
        }
    }

    _validate() {
        const alertDiv = this.shadowRoot.querySelector('.visually-hidden');
        alertDiv.classList.remove('show');
        if (!this._input.checkValidity()) {
            this._internals.setValidity(this._input.validity, this._input.validationMessage, this._input);
            if (this._input.validationMessage) {
                alertDiv.textContent = this._input.validationMessage;
                alertDiv.classList.add('show');
            }
        } else {
            this._internals.setValidity({});
            alertDiv.textContent = '';
            alertDiv.classList.remove('show');
        }
    }

    formResetCallback() {
        this.value = '';
        this._internals.setFormValue('');
        this._validate();
    }

    formStateRestoreCallback(state) {
        this.value = state;
        this._internals.setFormValue(state);
        this._validate();
    }
}

customElements.define('input-elm', Input);
export default Input;
