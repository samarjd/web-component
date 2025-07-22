import {Row, Col, Card, DragContainer, DragZone, DragItem} from '../library/index.js';

class DragAndDrop extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    get styles() {
        return `
        <style>
            @import url('src/css/code.css');
        </style>
        `;
    }

    render() {
        let dragContainerUsage = `      &lt;drag-container&gt;
            &lt;drag-zone label=&quot;Zone 1&quot;&gt;
                &lt;drag-item&gt;
                    &lt;card-elm type=&quot;card-primary&quot;&gt;
                        &lt;div slot=&quot;card-body&quot;&gt;Drag and drop items between zones 1&lt;/div&gt;
                    &lt;/card-elm&gt;
                &lt;/drag-item&gt;
                &lt;drag-item&gt;
                    &lt;card-elm type=&quot;card-primary&quot;&gt;
                        &lt;div slot=&quot;card-body&quot;&gt;Drag and drop items between zones 2&lt;/div&gt;
                    &lt;/card-elm&gt;
                &lt;/drag-item&gt;
                ...
            &lt;/drag-zone&gt;
            &lt;drag-zone label=&quot;Zone 2&quot;&gt;&lt;/drag-zone&gt;
            &lt;drag-zone label=&quot;Zone 3&quot;&gt;&lt;/drag-zone&gt;
            ...
        &lt;/drag-container&gt;`;

        this.shadowRoot.innerHTML = `
        ${this.styles}
        <drag-container>
            <drag-zone label="Zone 1">
                <drag-item>
                    <card-elm type="card-primary">
                        <div slot="card-body">Drag and drop items between zones 1</div>
                    </card-elm>
                </drag-item>
                <drag-item>
                    <card-elm type="card-primary">
                        <div slot="card-body">Drag and drop items between zones 2</div>
                    </card-elm>
                </drag-item>
                <drag-item>
                    <card-elm type="card-primary">
                        <div slot="card-header">Full width</div>
                        <div slot="card-body">This card takes the 12/12 of the row.</div>
                        <div slot="card-footer">This is a full width card</div>
                    </card-elm>
                </drag-item>
            </drag-zone>
            <drag-zone label="Zone 2"></drag-zone>
            <drag-zone label="Zone 3"></drag-zone>
            <drag-zone label="Zone 4">
                <drag-item>
                    <card-elm type="card-warning">
                        <div slot="card-header">Placeholder Slot Component in Figma</div>
                        <div slot="card-body">
                        <img src="src/images/backgrounds/hq720.webp" alt="Placeholder Image" loading="lazy" style="width: 100%; height: 10rem; object-fit: cover;">
                        </div>
                        <div slot="card-footer">This is a one-quarter width card</div>
                    </card-elm>
                </drag-item>
            </drag-zone>
            <drag-zone label="Zone 5"></drag-zone>
        </drag-container>
       
        <card-elm type="primary" title="Usage">
            <div slot="card-header">Drag and Drop Usage</div>
            <div slot="card-body">
                <p class="text-muted">Usage:</p>
                <div class="code-wrapper">
                    <span class="code">${dragContainerUsage}</span>
                </div>
            </div>
        </card-elm>
        `;
    }
}

customElements.define('view-drag', DragAndDrop);
export default DragAndDrop;