class Timeline extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.class = this.getAttribute('class') || '';
        this.align = this.getAttribute('align') || 'left';
        this._events = [];
    }

    connectedCallback() {
        this.render();

        if (!this.events.length) {
            this.events = Array.from(this.children)
                .filter(child => child.classList.contains('timeline-item'))
                .map(child => ({
                    avatar: child.getAttribute('avatar') || null,
                    title: child.getAttribute('title') || 'Event',
                    description: child.textContent.trim() || null,
                    time: child.getAttribute('data-time') || null,
                }));
        }
    }

    static get observedAttributes() {
        return ['class', 'align'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            this[name] = newValue;
            this.render();
        }
    }

    get events() {
        return this._events;
    }

    set events(value) {
        this._events = value;
        this.render();
    }

    get styles() {
        return `
        <style>
            :host {
                display: block;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }

            .timeline {
                position: relative;
                display: grid;
                ${this.align === 'center' ? `
                    grid-template-columns: 1fr 40px 1fr;
                ` : `
                    grid-template-columns: ${this.align === 'right' ? '1fr 2rem' : '2rem 1fr'};
                `}
                align-items: start;
                gap: 1rem;
                margin: 2rem 0;
            }

            .timeline::before {
                content: '';
                position: absolute;
                top: 0;
                ${this.align === 'center' ? 'left: 50%; transform: translateX(-50%);' : this.align === 'right' ? 'right: 1rem;' : 'left: 1rem;'}
                width: 2px;
                height: 100%;
                background-color: #d0d7de;
                z-index: 0;
            }

            .timeline-item {
                position: relative;
                display: contents;
            }

            .timeline-bullet {
                grid-column: ${this.align === 'center' ? '2' : (this.align === 'right' ? '2' : '1')};
                position: relative;
            }

            .timeline-bullet::after {
                content: '';
                position: absolute;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                width: 10px;
                height: 10px;
                background: #0969da;
                border-radius: 50%;
                box-shadow: 0 0 0 3px #f6f8fa;
                z-index: 1;
            }

            .timeline-content {
                background: #ffffff;
                border: 1px solid #e5eaef;
                border-radius: 6px;
                padding: 0.75rem 1rem;
                position: relative;
            }

            .timeline-content h3 {
                margin: 0 0 0.3rem;
                font-size: 1rem;
            }

            .timeline-content p {
                margin: 0;
                font-size: 0.875rem;
                color: #57606a;
                text-align: left;
            }

            .timeline-content time {
                font-size: 0.75rem;
                color: #8c939d;
                display: block;
                text-align: right;
            }

            .title-container {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.25rem;
            }

            .avatar {
                width: 20px;
                height: 20px;
                border-radius: 50%;
            }

            /* Alternate for center mode */
            .alternate-left .timeline-content {
                grid-column: 1;
                text-align: right;
            }

            .alternate-right .timeline-content {
                grid-column: 3;
                text-align: left;
            }

            .alternate-right .timeline-content, .alternate-right .timeline-bullet {
                margin-top: 5rem;
            }
        </style>
        `;
    }

    get template() {
        let counter = 0;
        return `
        <div class="timeline ${this.class}">
            ${this.events.map(event => {
                const altClass = this.align === 'center'
                    ? (counter++ % 2 === 0 ? 'alternate-left' : 'alternate-right')
                    : '';
                return `
                <div class="timeline-item ${altClass}" data-time="${this._formatTime(event.time)}">
                    <div class="timeline-bullet"></div>
                    <div class="timeline-content">
                        ${event.time ? `<time>${this._formatTime(event.time)}</time>` : ''}
                        <div class="title-container">
                            ${event.avatar ? `<img src="${event.avatar}" class="avatar" />` : ''}
                            <h3>${event.title}</h3>
                        </div>
                        ${event.description ? `<p>${event.description}</p>` : ''}
                    </div>
                </div>
                `;
            }).join('')}
        </div>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;
    }

    _formatTime(time) {
        if (!time) return '';
        const date = new Date(time);
        if (isNaN(date)) return time;
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return 'just now';
        if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
        if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
        if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
        return date.toLocaleDateString('fr-FR', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
}

customElements.define('timeline-elm', Timeline);
export default Timeline;
