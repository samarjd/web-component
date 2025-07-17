class Carousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.items = [];
        this.currentIndex = 0;
        this.itemsVisible = 1;
        this.autoplay = false;
        this.delay = 2000;
        this.interval = null;

        this._onPrevClick = this.prev.bind(this);
        this._onNextClick = this.next.bind(this);
        this._onDotClick = this._onDotClickHandler.bind(this);
        this._onKeyDown = this._onKeyDownHandler.bind(this);
        this._onMouseEnter = this.stopAutoScroll.bind(this);
        this._onMouseLeave = this.startAutoScroll.bind(this);

        this._dragging = false;
        this._startX = 0;
        this._prevTranslate = 0;

        this._onPointerDown = this._onPointerDown.bind(this);
        this._onPointerMove = this._onPointerMove.bind(this);
        this._onPointerUp = this._onPointerUp.bind(this);
    }

    static get observedAttributes() {
        return ['items-visible', 'autoplay'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'items-visible') {
            const val = parseInt(newValue);
            this.itemsVisible = !isNaN(val) && val > 0 ? val : 1;
            this.render();
        }
        if (name === 'autoplay') {
            this.autoplay = newValue !== null && newValue !== 'false';
            if (this.autoplay) this.startAutoScroll();
            else this.stopAutoScroll();
        }
    }

    set data(val) {
        if (Array.isArray(val)) {
            this.items = val;
            this.currentIndex = 0;
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        this.stopAutoScroll();
        this._removeEventListeners();
    }

    startAutoScroll() {
        this.stopAutoScroll();
        if (!this.autoplay || this.items.length <= this.itemsVisible) return;
        this.interval = setInterval(() => {
            this.next();
        }, this.delay || 3000);
    }

    stopAutoScroll() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    _onDotClickHandler(e) {
        if (!e.target.dataset.index) return;
        const idx = parseInt(e.target.dataset.index);
        if (!isNaN(idx)) {
            this.currentIndex = idx;
            this.updateView();
        }
    }

    _onKeyDownHandler(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.next();
        }
    }

    _removeEventListeners() {
        const prevBtn = this.shadowRoot.querySelector('.prev');
        const nextBtn = this.shadowRoot.querySelector('.next');
        if (prevBtn) prevBtn.removeEventListener('click', this._onPrevClick);
        if (nextBtn) nextBtn.removeEventListener('click', this._onNextClick);

        this.shadowRoot.querySelectorAll('.dot').forEach(dot => {
            dot.removeEventListener('click', this._onDotClick);
        });

        const wrapper = this.shadowRoot.querySelector('.wrapper');
        if (wrapper) {
            wrapper.removeEventListener('mouseenter', this._onMouseEnter);
            wrapper.removeEventListener('mouseleave', this._onMouseLeave);
            wrapper.removeEventListener('keydown', this._onKeyDown);
            wrapper.removeEventListener('pointerdown', this._onPointerDown);
        }

        this.shadowRoot.removeEventListener('pointermove', this._onPointerMove);
        this.shadowRoot.removeEventListener('pointerup', this._onPointerUp);
        this.shadowRoot.removeEventListener('pointercancel', this._onPointerUp);
    }

    updateView() {
        const carousel = this.shadowRoot.querySelector('.carousel');
        if (!carousel) return;
        if (this.items.length === 0) return;

        const maxIndex = Math.max(this.items.length - this.itemsVisible, 0);
        this.currentIndex = Math.min(Math.max(this.currentIndex, 0), maxIndex);

        const itemWidth = carousel.offsetWidth / this.itemsVisible;
        carousel.style.transition = ''; 
        carousel.style.transform = `translateX(-${this.currentIndex * itemWidth}px)`;

        this.shadowRoot.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
            dot.setAttribute('aria-selected', i === this.currentIndex ? 'true' : 'false');
            dot.tabIndex = i === this.currentIndex ? 0 : -1;
        });
    }

    next() {
        const maxIndex = Math.max(this.items.length - this.itemsVisible, 0);
        this.currentIndex = this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
        this.updateView();
    }

    prev() {
        const maxIndex = Math.max(this.items.length - this.itemsVisible, 0);
        this.currentIndex = this.currentIndex <= 0 ? maxIndex : this.currentIndex - 1;
        this.updateView();
    }

    _onPointerDown(event) {
        this._dragging = true;
        this._startX = event.clientX;
        const carousel = this.shadowRoot.querySelector('.carousel');
        if (!carousel) return;
        const itemWidth = carousel.offsetWidth / this.itemsVisible;
        this._prevTranslate = -this.currentIndex * itemWidth;

        this.stopAutoScroll();

        this.shadowRoot.addEventListener('pointermove', this._onPointerMove);
        this.shadowRoot.addEventListener('pointerup', this._onPointerUp);
        this.shadowRoot.addEventListener('pointercancel', this._onPointerUp);

        event.preventDefault();
    }

    _onPointerMove(event) {
        if (!this._dragging) return;
        const currentX = event.clientX;
        const diffX = currentX - this._startX;
        const carousel = this.shadowRoot.querySelector('.carousel');
        if (!carousel) return;

        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(${this._prevTranslate + diffX}px)`;
    }

    _onPointerUp(event) {
        if (!this._dragging) return;
        this._dragging = false;
        const endX = event.clientX;
        const diffX = endX - this._startX;

        const carousel = this.shadowRoot.querySelector('.carousel');
        if (!carousel) return;
        const itemWidth = carousel.offsetWidth / this.itemsVisible;
        const threshold = itemWidth / 4; 

        carousel.style.transition = ''; 

        if (diffX > threshold) {
            this.prev();
        } else if (diffX < -threshold) {
            this.next();
        } else {
            this.updateView();
        }

        this.shadowRoot.removeEventListener('pointermove', this._onPointerMove);
        this.shadowRoot.removeEventListener('pointerup', this._onPointerUp);
        this.shadowRoot.removeEventListener('pointercancel', this._onPointerUp);

        if (this.autoplay) this.startAutoScroll();
    }

    render() {
        if (!this.shadowRoot) return;

        this.stopAutoScroll();
        this._removeEventListeners();

        const maxIndex = Math.max(this.items.length - this.itemsVisible, 0);
        const dotsCount = maxIndex + 1;

        const content = `
        <div class="wrapper" tabindex="0" aria-label="Carousel" role="region">
            <button class="nav-btn prev" aria-label="Previous Slide">‹</button>
            <div class="carousel" style="--items-visible: ${this.itemsVisible}">
                ${this.items.map((item) => `
                    <div class="carousel-item">
                    <img src="${item.img}" alt="Image" loading="lazy" />
                    <div class="carousel-content">${item.content}</div>
                    </div>`)
                .join('')}
            </div>
            <button class="nav-btn next" aria-label="Next Slide">›</button>
        </div>
        <div class="dots" role="tablist" aria-label="Carousel navigation dots">
            ${Array(dotsCount).fill(0).map((_, i) =>
                `<button class="dot${i === 0 ? ' active' : ''}" role="tab" aria-selected="${i === 0}" aria-controls="slide-${i}" tabindex="${i === 0 ? '0' : '-1'}" data-index="${i}"></button>`)
            .join('')}
        </div>
        `;

        this.shadowRoot.innerHTML = `${this.styles}${content}`;

        this.shadowRoot.querySelector('.prev').addEventListener('click', this._onPrevClick);
        this.shadowRoot.querySelector('.next').addEventListener('click', this._onNextClick);

        this.shadowRoot.querySelectorAll('.dot').forEach((dot) => {
            dot.addEventListener('click', this._onDotClick);
        });

        const wrapper = this.shadowRoot.querySelector('.wrapper');
        wrapper.addEventListener('mouseenter', this._onMouseEnter);
        wrapper.addEventListener('mouseleave', this._onMouseLeave);
        wrapper.addEventListener('keydown', this._onKeyDown);

        wrapper.addEventListener('pointerdown', this._onPointerDown);

        if (this.autoplay) {
            this.startAutoScroll();
        }

        this.updateView();
    }

    get styles() {
        return `
        <style>
            :host {
                display: block;
                position: relative;
                overflow: hidden;
                font-family: Arial, sans-serif;
                user-select: none;
                box-sizing: border-box;
            }

            .wrapper {
                position: relative;
                outline: none;
            }

            .carousel {
                display: flex;
                transition: transform 0.5s ease-in-out;
                width: 100%;
                gap: 0.5rem;
                padding: 1rem 0 1rem 0.5rem;
            }

            .carousel-item {
                flex: 0 0 auto;
                width: calc(100% / var(--items-visible, 1) - 0.5rem);
                box-sizing: border-box;
                padding: 10px 15px;
                text-align: center;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.10);
                transition: transform 0.3s ease;
            }

            .carousel-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.20);
            }

            .carousel-item img {
                width: 100%;
                height: 15rem;
                border-radius: 10px;
                object-fit: cover;
                max-height: 220px;
            }

            .carousel-content {
                margin-top: 12px;
                font-size: 15px;
                color: #444;
                line-height: 1.4;
            }

            .nav-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.4);
                border: none;
                color: white;
                font-size: 2rem;
                width: 36px;
                height: 46px;
                cursor: pointer;
                border-radius: 6px;
                user-select: none;
                transition: background 0.3s ease;
                z-index: 10;
            }
            .nav-btn:hover {
                background: rgba(0, 0, 0, 0.7);
            }
            .nav-btn.prev {
                left: 10px;
            }
            .nav-btn.next {
                right: 10px;
            }

            .dots {
                display: flex;
                justify-content: center;
                margin: 1.5rem 0 0.5rem;
                gap: 10px;
            }

            .dot {
                width: 12px;
                height: 12px;
                background-color: #ccc;
                border-radius: 50%;
                cursor: pointer;
                border: none;
                transition: background-color 0.3s ease;
            }

            .dot.active{
                background-color: #737373;
                outline: none;
            }
        </style>
    `;
    }
}

customElements.define('carousel-elm', Carousel);
export default Carousel;
