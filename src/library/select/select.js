import {Icon, Row, Col} from '../index.js';
class SelectElm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.initialized = false;

        this.type = this.getAttribute('type') === 'multiple' ? 'multiple' : 'single';
        this.allowClear = this.getAttribute('allow-clear') === 'true';
        this.closeOnSelect = this.getAttribute('close-on-select') !== 'false';
        this.placeholder = this.getAttribute('placeholder') || 'Select...';
        this.required = this.hasAttribute('required');

        this.options = [];
        this.selectedValues = [];
        this.filteredOptions = [];
        this.value = null;
    }

    static get observedAttributes() {
        return ['type', 'allow-clear', 'placeholder', 'required', 'close-on-select'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (name === 'type') {
            this.type = newValue === 'multiple' ? 'multiple' : 'single';
        } else if (name === 'allow-clear') {
            this.allowClear = newValue === 'true';
        } else if (name === 'placeholder') {
            this.placeholder = newValue || 'Select...';
        } else if (name === 'required') {
            this.required = newValue !== null && newValue !== 'false';
        } else if (name === 'close-on-select') {
            this.closeOnSelect = newValue !== null && newValue !== 'false';
        }

        if (this.initialized) {
            this._renderPills();
            this._updateDropdown();
            this._toggleError();
        }
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;
        this._initOptions();
        this._renderPills();
        this._updateDropdown();
        this._bindEvents();

        this.initialized = true;
    }

    disconnectedCallback() {
        if (!this.initialized) return;
        window.removeEventListener('click', this._outsideClickHandler);
    }

    get styles() {
        return `
            <style>
                * { 
                    box-sizing: border-box; 
                }
                .select2-container { 
                    position: relative; width: 100%;
                }
                .selected-box { 
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    border: 1px solid #cccccc;
                    padding: 4px;
                    border-radius: 4px;
                    min-height: 30px;
                    align-items: center;
                    cursor: text;
                }
                .selected-box.error { 
                    border-color: red; 
                }
                .pill { 
                    background: #eaebef;
                    padding: 5px 10px;
                    border-radius: 40px; 
                    display: flex; 
                    align-items: center; 
                    font-size: 13px; 
                    color: #3c4650; 
                }
                :host(:not([type="multiple"])) .pill {
                    background: transparent;
                }

                .pill:has(.avatar) {
                    padding: 4px 8px 4px 4px;
                }   

                .pill span.remove { 
                    margin-left: 6px;
                    cursor: pointer; 
                }
                input.search-input { 
                    border: none; 
                    flex: 1; 
                    font-size: 13px; 
                    padding: 4px; 
                    outline: none; 
                    width: fit-content; 
                    background: transparent; 
                    cursor: pointer;
                }
                .dropdown { 
                    position: absolute; 
                    top: 100%; 
                    left: 0; 
                    right: 0; 
                    background: white; 
                    border: 1px solid #ccc; 
                    border-top: none; 
                    max-height: min(200px, 40vh); 
                    overflow-y: auto; 
                    z-index: var(--zindex-dropdown, 1000);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
                .dropdown div { 
                    color: #333;
                    padding: 8px; 
                    cursor: pointer; 
                }
                .dropdown div:hover { 
                    background: #f0f0f0; 
                }
                .dropdown-option .option-foo {
                    display: block;
                    color: #6c757d;
                    font-size: 12px;
                    padding: 4px 0;
                }
                .dropdown::-webkit-scrollbar {
                    width: 13px;
                }
                .dropdown::-webkit-scrollbar-track {
                    background-color:rgba(0, 134, 224, 0.05);
                }
                .dropdown::-webkit-scrollbar-thumb {
                    background-color: #04a9f5;
                    border-radius: 20px;
                    border: 4px solid transparent;
                    background-clip: content-box;
                }
                .dropdown::-webkit-scrollbar-thumb:hover {
                    background-color: #0086e0;
                }
                .clear-btn, .select-all-btn { 
                    padding: 8px; 
                    font-size: 13px; 
                    background: transparent; 
                    border: none; 
                    cursor: pointer;
                }
                .clear-btn { 
                    color: #ff0000;
                    text-align: right; 
                }
                .select-all-btn { 
                    color: #0066ff;
                    text-align: left; 
                }                
                .clear-btn:hover { 
                    color: #cc0000;
                }
                .select-all-btn:hover {
                    color: #0056b3;
                }
                .error-msg { 
                    display: none; 
                    color: red; 
                    margin-top: 4px;
                }
                col-elm{
                    padding: 0;
                }
                .pill .avatar {
                    width: 18px; 
                    height: 18px; 
                    border-radius: 50%; 
                    margin-right: 4px;
                }

                .controllers{
                    position: sticky;
                    top: -1px;
                }

                row-elm::slotted(.row) {
                    background: white;
                }

            </style>
        `;
    }

    get template() {
        return `
            <div class="select2-container">
                <div class="selected-box"></div>
                <div class="dropdown" style="display: none;"></div>
            </div>
            <div class="error-msg">${this.required ? 'This field is required.' : ''}</div>
        `;
    }

    _initOptions() {
        const optionElements = Array.from(this.querySelectorAll('option'));
        this.options = optionElements.map(option => ({
            value: option.value || option.textContent.trim(),
            label: option.textContent.trim(),
            selected: option.selected,
            foo: option.dataset.foo,
            avatar: option.dataset.avatar
        }));
        if (!this.initialized) {
            this.selectedValues = this.options.filter(option => option.selected).map(option => option.value);

            // if no options are selected and allowClear is false, set the first option as selected
            if (this.selectedValues.length === 0 && this.options.length > 0 && !this.allowClear) {
                this.selectedValues = [this.options[0].value];
            }
        }
        this.filteredOptions = [...this.options];
    }

    _renderPills() {
        const selectedBox = this.shadowRoot.querySelector('.selected-box');
        const pillsHTML = this.selectedValues.map(val => {
            const option = this.options.find(option => option.value === val);
            if (!option) return '';
            return `
                <div class="pill" data-value="${option.value}" title="${option.label}">
                    ${option.avatar ? `<img src="${option.avatar}" alt="" class="avatar" onerror="this.remove();" lazyload="true" />` : ''}
                    ${option.label}
                    ${(this.type == 'single' && this.allowClear) || (this.type == 'multiple') ? 
                    `<span class="remove" title="Remove">
                        <icon-elm name="x" size="6"></icon-elm>
                    </span>`
                    : ''}
                </div>
            `;
        }).join('');
        selectedBox.innerHTML = `${pillsHTML}<input name="search-input" class="search-input" placeholder="${this.placeholder && this.selectedValues.length === 0 ? this.placeholder + '...' : ''}" type="search" autocomplete="off" />`;
    }

    _updateDropdown() {
        const dropdown = this.shadowRoot.querySelector('.dropdown');
        const clearHTML = this.selectedValues.length && this.type === 'multiple'
            ? `<button class="clear-btn"><icon-elm name="trash" size="12"></icon-elm> Clear all</button>`
            : '';
        const selectAllHTML = this.type === 'multiple' && this.selectedValues.length < this.options.length
            ? `<button class="select-all-btn"><icon-elm name="check" size="12"></icon-elm> Select all</button>`
            : '';
        const optionsHTML = this.filteredOptions.map(option => {
            const isSelected = this.selectedValues.includes(option.value);
            return `
                <div class="dropdown-option" data-value="${option.value}" style="${isSelected ? 'opacity:0.5;pointer-events:none;' : ''}">
                    ${option.label}
                    ${option.foo ? `<span class="option-foo" title="${option.foo}">${option.foo}</span>` : ''}
                </div>
            `;
        }).join('');
        dropdown.innerHTML = `
            <row-elm class="controllers" nowrap>
                <col-elm class="col-6" nowrap>${selectAllHTML}</col-elm>
                <col-elm class="col-6" nowrap align="right">${clearHTML}</col-elm>
            </row-elm>
            ${optionsHTML}
        `;

        const controllers = this.shadowRoot.querySelector('.controllers');
        if (controllers) {
            controllers.shadowRoot.querySelector('.row').style.background = 'white';
            controllers.shadowRoot.querySelector('.row').style.padding = '2px 0';
        }
    }

    _bindEvents() {
        const selectedBox = this.shadowRoot.querySelector('.selected-box');
        const dropdown = this.shadowRoot.querySelector('.dropdown');

        // Selected box click events
        selectedBox.addEventListener('click', e => {

            // Unselect a pill
            const removeEl = e.target.closest('.remove');
            if (removeEl) {
                const removeElValue = removeEl.parentElement.getAttribute('data-value');
                this.selectedValues = this.selectedValues.filter(value => value !== removeElValue);
                this._renderPills();
                this._updateDropdown();
                this._toggleError();
                this._emitChange();
                
                if(this.closeOnSelect) this._hideDropdown();
                return;
            }

            // Show dropdown on click
            if (e.target.matches('.search-input')) {
                e.target.value = '';
                this.filteredOptions = [...this.options];
                this._updateDropdown();
                this._showDropdown();

                return;
            }
        });

        // Search options
        selectedBox.addEventListener('input', e => {
            if (!e.target.matches('.search-input')) return;
            const term = e.target.value.toLowerCase();
            this.filteredOptions = this.options.filter(option =>
                option.label.toLowerCase().includes(term)
            );
            if (this.filteredOptions.length === 0) this.filteredOptions = [{ value: '', label: 'No options found' }];
            this._updateDropdown();
            this._showDropdown();
        });

        // Dropdown click events
        dropdown.addEventListener('click', e => {

            // Clear all selected options
            if (e.target.closest('.clear-btn')) {
                this.selectedValues = [];
                this._renderPills();
                this._updateDropdown();
                this._toggleError();
                this._emitChange();

                if(this.closeOnSelect) this._hideDropdown();
                return;
            }

            // Select all options
            if (e.target.closest('.select-all-btn')) {
                this.selectedValues = this.filteredOptions.map(option => option.value);
                this._renderPills();
                this._updateDropdown();
                this._toggleError();
                this._emitChange();

                if(this.closeOnSelect) this._hideDropdown();
                return;
            }

            // Select an option
            const optionEl = e.target.closest('.dropdown-option');
            if (optionEl) {
                const value = optionEl.getAttribute('data-value');
                if (this.type === 'multiple' && !this.selectedValues.includes(value)) {
                    this.selectedValues.push(value);
                } else if (this.type !== 'multiple') {
                    this.selectedValues = [value];
                }
                this._renderPills();
                this._updateDropdown();
                this._toggleError();
                this._emitChange();

                if(this.closeOnSelect) this._hideDropdown();
                return;
            }
        });

        if(!this.initialized) {
            window.addEventListener('click', this._outsideClickHandler);
        }
    }

    _showDropdown() {
        const dropdown = this.shadowRoot.querySelector('.dropdown');
        if (dropdown) dropdown.style.display = 'block';
    }

    _hideDropdown() {
        const dropdown = this.shadowRoot.querySelector('.dropdown');
        if (dropdown) dropdown.style.display = 'none';
    }

    // Toggle error message
    _toggleError() {
        const errorEl = this.shadowRoot.querySelector('.error-msg');
        const selectedBox = this.shadowRoot.querySelector('.selected-box');
        if (!errorEl || !selectedBox) return;

        let showError = false;
        let message = '';

        if (this.required && this.selectedValues.length === 0) {
            showError = true;
            message = 'This field is required.';
        }

        errorEl.textContent = message;
        errorEl.style.display = showError ? 'block' : 'none';
        selectedBox.classList.toggle('error', showError);
    }

    // Emit select value change event
    _emitChange() {
        this.value = this.type === 'multiple' ? this.selectedValues : this.selectedValues[0] || null;
        this.dispatchEvent(new CustomEvent('select-change', {
            bubbles: true,
            composed: true,
            detail: { 
                select: this, 
                value: this.value
            }
        }));
    }

    // Outside clicks handler
    _outsideClickHandler = (event) => {
        if (!event.composedPath().includes(this)) this._hideDropdown();
    };
}

customElements.define('select-elm', SelectElm);
export default SelectElm;