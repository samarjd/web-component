import Placeholder from "./drag-placeholder.js";
class DragContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this._dragItem = null;
        this._dragZone = null;
        this._allZones = [];
    }

    connectedCallback() {
        this.render();

        this.addEventListener('drag-item-start', (e) => this._onDragStart(e));
        this.addEventListener('drag-item-end', (e) => this._onDragEnd(e));

        let dragZones = this.querySelectorAll('drag-zone');
        dragZones.forEach(zone => {
            zone.addEventListener('drag-zone-over', (e) => this._onDragOver(e));
            zone.addEventListener('drag-zone-drop', (e) => this._onDrop(e));
            zone.addEventListener('drag-zone-leave', (e) => this._onDragLeave(e));
        });

        this._allZones = [...dragZones];
    }

    get dragItem() {
        return this._dragItem;
    }

    set dragItem(item) {
        this._dragItem = item;
    }

    get dragZone() {
        return this._dragZone;
    }

    set dragZone(zone) {
        this._dragZone = zone;
    }

    _onDragStart(e) {
        e.stopPropagation();
        if (!e.detail.item) return;

        this.dragItem = e.detail.item;
        this.dragItem.classList.add('dragging');
    }

    _onDragEnd(e) {
        e.stopPropagation();
        if (!e.detail.item) return;

        this.dragItem = e.detail.item;
        this.dragItem.classList.remove('dragging');
    }


    _onDragOver(e) {
        e.preventDefault();
        const zone = e.detail.zone;
        this.dragZone = zone.shadowRoot.querySelector('.drag-zone');
        const y = e.detail.after;

        if (!this.dragZone || !y) return;

        zone.classList.add('dragged-over');

        let placeholder = this.dragZone.querySelector('drop-placeholder');

        if (!placeholder) {
            placeholder = new Placeholder();
            this.dragZone.appendChild(placeholder);
        }

        const afterEl = this._getDragAfterElement(this.dragZone, y);

        if (afterEl && afterEl !== placeholder.nextSibling) {
            this.dragZone.insertBefore(placeholder, afterEl);
        } else if (!afterEl && placeholder !== this.dragZone.lastChild) {
            this.dragZone.appendChild(placeholder);
        }
    }

    _onDrop(e) {
        e.preventDefault();
        const zone = e.detail.zone;
        this.dragZone = zone.shadowRoot.querySelector('.drag-zone');
        if (!this.dragZone || !this.dragItem) return;

        zone.classList.remove('dragged-over');

        const placeholder = this.dragZone.querySelector('drop-placeholder');

        if (placeholder) {
            this.dragZone.insertBefore(this.dragItem, placeholder);
            placeholder.remove();
        } else {
            this.dragZone.appendChild(this.dragItem);
        }

        this.dragItem.classList.remove('dragging');

        this._allZones.forEach(zone => {
            const placeholder = zone.shadowRoot.querySelector('drop-placeholder');
            if (placeholder) placeholder.remove();
        });
    }

    _onDragLeave(e) {
        this.dragZone = e.detail.zone.shadowRoot.querySelector('.drag-zone');
        if (!this.dragZone) return;
        e.detail.zone.classList.remove('dragged-over');

        const placeholder = this.dragZone.querySelector('drop-placeholder');
        if (placeholder) placeholder.remove();
    }

    _getDragAfterElement(zoneEl, y) {
        const items = [...zoneEl.querySelectorAll('drag-item:not(.dragging):not(drop-placeholder)')];
        return items.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - (box.top + box.height / 2);
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: -Infinity, element: null }).element;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    width: 100%;
                    height: 100%;
                }

                .drag-container {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 1vw;
                    width: 100%;
                    height: 100%;
                    transition: background-color 0.3s ease-in-out;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                @media (max-width: 1200px) {
                    .drag-container {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .drag-container {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 600px) {
                    .drag-container {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 480px) {
                    .drag-container {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="drag-container">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('drag-container', DragContainer);
export default DragContainer;