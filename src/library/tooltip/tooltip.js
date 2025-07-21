class Tooltip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.position = this.getAttribute('position') || 'auto';
        this.trigger = this.getAttribute('trigger') || 'hover';

        this._outsideClickHandler = this._outsideClickHandler.bind(this);
    }

    static get observedAttributes() {
        return ['position', 'trigger'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            this[name] = newValue;
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._outsideClickHandler);
    }

    get styles() {
        return `
      <style>
        :host {
          position: relative;
          display: inline-block;
        }

        .tooltip-box {
          position: absolute;
          padding: 5px 10px;
          background: #333;
          color: white;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: var(--zindex-tooltip, 1050);
        }

        .tooltip-box.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .tooltip-box.top {
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-5px);
        }

        .tooltip-box.bottom {
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(5px);
        }

        .tooltip-box.left {
          right: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(-5px);
        }

        .tooltip-box.right {
          left: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(5px);
        }
      </style>
    `;
    }

    get template() {
        return `
      <slot></slot>
      <div class="tooltip-box ${this.position}" role="tooltip" part="tooltip">
        <slot name="tooltip-content"></slot>
      </div>
    `;
    }

    render() {
        this.shadowRoot.innerHTML = `${this.styles}${this.template}`;
        this._bindEvents();
    }

    _bindEvents() {
        const tooltip = this.shadowRoot.querySelector('.tooltip-box');
        const triggerElement = this.shadowRoot.querySelector('slot');

        if (!tooltip || !triggerElement) return;

        // Remove previous event listeners to avoid duplicates
        this._removeAllListeners();

        if (this.trigger === 'hover') {
            this._enterHandler = () => tooltip.classList.add('visible');
            this._leaveHandler = () => tooltip.classList.remove('visible');

            this.addEventListener('mouseenter', this._enterHandler);
            this.addEventListener('mouseleave', this._leaveHandler);
        } else if (this.trigger === 'click') {
            this._clickHandler = () => tooltip.classList.toggle('visible');
            this.addEventListener('click', this._clickHandler);
            document.addEventListener('click', this._outsideClickHandler);
        }
    }

    _removeAllListeners() {
        this.removeEventListener('mouseenter', this._enterHandler);
        this.removeEventListener('mouseleave', this._leaveHandler);
        this.removeEventListener('click', this._clickHandler);
        document.removeEventListener('click', this._outsideClickHandler);
    }


    _outsideClickHandler(e) {
        if (!e.composedPath().includes(this)) {
            const tooltip = this.shadowRoot.querySelector('.tooltip-box');
            tooltip?.classList.remove('visible');
        }
    }
}

customElements.define('tooltip-elm', Tooltip);
export default Tooltip;
