import '../icons/icons.js';
class Offcanvas extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	static get observedAttributes() {
		return ['open', 'position', 'backdrop'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (newValue !== oldValue) {
			if (name === 'open') {
				this._updateVisibility();
			}else if (name === 'position' || name === 'backdrop') {
				this.render();
			}
        }
	}

	open() {
		this.setAttribute('open', '');
	}

	close() {
		const container = this.shadowRoot.querySelector('.offcanvas-container');
		const backdrop = this.shadowRoot.querySelector('.backdrop');

		container?.classList.remove('show');
		backdrop?.classList.remove('show');
		document.body.classList.remove('offcanvas-open');

		const onTransitionEnd = () => {
			container.removeEventListener('transitionend', onTransitionEnd);
			this.removeAttribute('open');
		};

		container?.addEventListener('transitionend', onTransitionEnd);
	}

	_updateVisibility() {
		const isOpen = this.hasAttribute('open');
		const container = this.shadowRoot.querySelector('.offcanvas-container');
		const backdrop = this.shadowRoot.querySelector('.backdrop');

		if (isOpen) {
			this.style.display = 'block';
			document.body.classList.add('offcanvas-open');

			void container.offsetWidth; // Trigger reflow to restart the transition

			container.classList.add('show');
			backdrop?.classList.add('show');
		} else {
			this.style.display = 'none';
		}
	}

	_bindEvents() {
		const closeButton = this.shadowRoot.querySelector('.close-btn');
		const backdrop = this.shadowRoot.querySelector('.backdrop');

		closeButton?.addEventListener('click', () => this.close());
		backdrop?.addEventListener('click', () => this.close());
	}

	get styles() {
		return `
			<style>
				:host {
					display: none;
					position: fixed;
					top: 0;
					left: 0;
					width: 100vw;
					height: 100vh;
					z-index: var(--zindex-offcanvas, 1050);
					overflow: hidden;
				}
				:host([open]) {
					display: block;
				}
				.backdrop {
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 0, 0.5);
					z-index: calc(var(--zindex-offcanvas, 1050) - 1);
					opacity: 0;
					transition: opacity 0.3s ease;
				}
				.backdrop.show {
					opacity: 1;
				}
				.offcanvas-container {
					position: fixed;
					top: 0;
                    ${this.getAttribute('position') === 'right' ? 'right' : 'left'}: 0;
					width: min(30vw, 100%);
					height: 100%;
					background-color: #fff;
					box-shadow: -2px 0 20px 0px rgb(0, 0, 0, 0.15);
					z-index: var(--zindex-offcanvas, 1050);
					transform: translateX(${this.getAttribute('position') === 'right' ? '100%' : '-100%'});
					transition: transform 0.3s ease;
				}
				.offcanvas-container.show {
					transform: translateX(0);
				}
				.header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0.5rem 1rem;
					font-weight: bold;
					border-bottom: 1px solid #ddd;
				}
				.body {
					padding: 1rem;
					overflow-y: auto;
					height: calc(100% - 60px);
				}
				.offcanvas-container:has(.footer) .body {
					height: calc(100% - 120px);
				}
				.close-btn {
					background: none;
					border: none;
					cursor: pointer;    
                    line-height: 1;
				}
                .footer {
                    padding: 0.5rem 1rem;
                    border-top: 1px solid #ddd;
                    text-align: right;
                    height: 60px;
                    color: gray;
                }
			</style>
		`;
	}

	render() {
		this.shadowRoot.innerHTML = `
			${this.styles}
			<div class="offcanvas">
				${this.getAttribute('backdrop') !== 'false' ? `<div class="backdrop ${this.hasAttribute('open') ? 'show' : ''}"></div>` : ''}
				<aside class="offcanvas-container ${this.hasAttribute('open') ? 'show' : ''}">
					<div class="header">
						<slot name="header">Panel</slot>
						<button class="close-btn" aria-label="Close">
                            <icon-elm name="x" size="12"></icon-elm>
                        </button>
					</div>
					<div class="body">
						<slot></slot>
					</div>
                    <!-- Optional footer slot -->
                    ${this.innerHTML.includes('slot="footer"') ? '<div class="footer"><slot name="footer"></slot></div>' : ''}
				</aside>
			</div>
		`;
		this._bindEvents();
	}
}

customElements.define('off-canvas', Offcanvas);
export default Offcanvas;