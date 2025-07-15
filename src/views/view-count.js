import "../components/row.js";
import "../components/col.js";
import "../components/card.js";
import '../components/count.js';
import '../components/icons.js';

class Count extends HTMLElement {
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

    get template() {
        let cards = [
            {
                type: 'primary',
                step: 1,
                info: 'This is a default +1 counter.',
                allowReset: true,
                footer: true,
                dropdown: true
            },
            {
                type: 'warning',
                step: 50,
                info: 'This is a +2 steps counter.',
                footer: true,
                dropdown: true
            }
        ];

        let counterUsage = `        &lt;count-elm type=&quot;primary&quot; step=&quot;1&quot; info=&quot;This is a default +1 counter.&quot; allow-reset=&quot;true&quot; footer=&quot;true&quot; dropdown=&quot;true&quot;&gt;&lt;/count-elm&gt;
        &lt;count-elm type=&quot;warning&quot; step=&quot;50&quot; info=&quot;This is a +2 steps counter.&quot; footer=&quot;true&quot; dropdown=&quot;true&quot;&gt;&lt;/count-elm&gt;`;

        let modalUsage = `      &lt;modal-elm title=&quot;Counter Modal&quot; size=&quot;lg&quot;&gt;
            &lt;div slot=&quot;modal-header&quot;&gt;
                ...
            &lt;/div&gt;
            &lt;div slot=&quot;modal-body&quot;&gt;
                ...
            &lt;/div&gt;
            &lt;div slot=&quot;modal-footer&quot;&gt;
                ...
            &lt;/div&gt;
        &lt;/modal-elm&gt;
        
        Properties:
        - width: ['small', 'medium', 'large', 'full'],
        - color: ['default', 'primary', 'success', 'danger', 'warning', 'dark', 'light'],
        - backdropClose: true || false,
        - backdrop: true || false`;

        let dropDownUsage = `        &lt;dropdown-elm label=&quot;Placeholder&quot;&gt;&lt;/dropdown-elm&gt;
        
        Properties:
        - items: [
            { label: 'Item 1', value: 'item1', selected: true },
            { label: 'Item 2', value: 'item2' }
        ],
        `;

        return `
        <row-elm>
            ${cards.map(card => `
            <col-elm class="col-6">
                <count-elm
                    type="${card.type}" 
                    step="${card.step}" 
                    info="${card.info}" 
                    ${card.allowReset ? 'allow-reset="true"' : ''}
                    ${card.footer ? 'footer="true"' : ''}
                    ${card.dropdown ? 'dropdown="true"' : ''}>
                </count-elm>
            </col-elm>
            `).join('')}
           
            <col-elm class="col-12">
                <card-elm type="primary" title="Usage">
                    <div slot="card-body">
                        <p class="text-muted">Count usage:</p>
                        <div class="code-wrapper">
                            <span class="code">${counterUsage}</span>
                        </div>
                        
                        <p class="text-muted">Modal Usage:</p>
                        <div class="code-wrapper">
                            <span class="code">${modalUsage}</span>
                        </div>
                        
                        <p class="text-muted">Dropdown Usage:</p>
                        <div class="code-wrapper">
                            <span class="code">${dropDownUsage}</span>
                        </div>
                    </div>
                </card-elm>
            </col-elm>
        </row-elm>
        `;
    }
    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;
    }
}

customElements.define('view-count', Count);
export default Count;


