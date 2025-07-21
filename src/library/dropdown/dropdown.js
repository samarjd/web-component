class Dropdown extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._items = [];
        this._selectedIndex = -1;
    }

    connectedCallback() {
        this.render();
    }

    get data() {
        return this._items;
    }

    set data(items) {
        if (!Array.isArray(items)) {
            console.error('Dropdown.data expects an array, received a '+ typeof items+ ' instead.');
            return;
        }
        this._items = items;
        this.render();
    }

    get styles() {
        return `
        <style>
            :host {
                position: relative;
                display: inline-block;
                font-family: sans-serif;
                user-select: none;
                color: #343a40;
            }
            .trigger {
                background-color: #f6f9ffaa;
                border: 1px solid #ccc;
                padding: 0.4rem 0.8rem;
                border-radius: 0.3rem;
                cursor: pointer;
                font-size: 0.8rem;
            }
            .menu {
                font-weight: normal;
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                background: white;
                border: 1px solid #ccc;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                border-radius: 0.3rem;
                margin-top: 0.2rem;
                z-index: var(--zindex-dropdown, 1000);
                min-width: 92px;
                max-height: 200px;
                overflow-y: auto;
                text-align: left;
            }
            .menu.show {
                display: block;
            }
            .menu-item {
                padding: 0.5rem 1rem;
                cursor: pointer;
                white-space: nowrap;
                font-size: 0.8rem;
            }
            .menu-item:hover,
            .menu-item.selected {
                background-color:rgba(208, 224, 255, 0.5);
            }

            .menu-item.selected {
                font-weight: bold;
            }
        </style>
    `;
    }

    render() {
        
        const labelAttr = this.getAttribute('label') || 'Menu';

        let selectedIndex = this._items.findIndex(item => item.selected);
        if (selectedIndex === -1 && this._items.length > 0) selectedIndex = -1;
        this._selectedIndex = selectedIndex;

        const triggerLabel = this._items[selectedIndex]?.label || labelAttr;

        this.shadowRoot.innerHTML = `
        ${this.styles}
        <div class="trigger" role="button" aria-haspopup="true" aria-expanded="false">${triggerLabel} ▼</div>
        <div class="menu" role="menu">
            ${this._items.map((item, index) =>
            `<div class="menu-item${index === this._selectedIndex ? ' selected' : ''}" data-index="${index}" data-value="${item.value}" role="menuitem">${item.label}</div>`
        ).join('')}
        </div>
        `;

        this._setupEventListeners();
    }

    _setupEventListeners() {
        const trigger = this.shadowRoot.querySelector('.trigger');
        const menu = this.shadowRoot.querySelector('.menu');
        const items = this.shadowRoot.querySelectorAll('.menu-item');

        if (!trigger || !menu) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();

            const isOpening = !menu.classList.contains('show');

            if (isOpening) {
                if (Dropdown._openDropdown && Dropdown._openDropdown !== this) {
                    Dropdown._openDropdown._closeMenu();
                }
                Dropdown._openDropdown = this;
            } else {
                Dropdown._openDropdown = null;
            }

            const isOpen = menu.classList.toggle('show');
            trigger.setAttribute('aria-expanded', isOpen);

            if (isOpen) {
                // Add outside click listener
                this._outsideClickHandler = (event) => {
                    const path = event.composedPath();
                    if (!path.includes(this)) {
                        this._closeMenu();
                    }
                };
                window.addEventListener('click', this._outsideClickHandler);
            } else {
                this._removeOutsideClickHandler();
            }
        });

        items.forEach(item => {
            item.addEventListener('click', () => {
                this._selectItem(parseInt(item.dataset.index));
                this._closeMenu();
            });
        });
    }

    _closeMenu() {
        const trigger = this.shadowRoot.querySelector('.trigger');
        const menu = this.shadowRoot.querySelector('.menu');
        if (menu && trigger) {
            menu.classList.remove('show');
            trigger.setAttribute('aria-expanded', 'false');
        }
        this._removeOutsideClickHandler();
        if (Dropdown._openDropdown === this) {
            Dropdown._openDropdown = null;
        }
    }

    _removeOutsideClickHandler() {
        if (this._outsideClickHandler) {
            window.removeEventListener('click', this._outsideClickHandler);
            this._outsideClickHandler = null;
        }
    }

    _selectItem(index) {
        if (index < 0 || index >= this._items.length) return;

        this._selectedIndex = index;

        const trigger = this.shadowRoot.querySelector('.trigger');
        trigger.textContent = `${this._items[index].label} ▼`;
        this.shadowRoot.querySelectorAll('.menu-item').forEach((el, i) => {
            el.classList.toggle('selected', i === index);
        });

        this.dispatchEvent(new CustomEvent('dropdown-select', {
            detail: this._items[index],
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('dropdown-elm', Dropdown);
export default Dropdown;