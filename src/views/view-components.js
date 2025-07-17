import "../components/card.js";
import '../components/tab.js';
import '../components/button.js';
import '../components/tooltip/tooltip.js';
import '../components/caroussel/caroussel.js';
import '../components/icons.js';

class CompView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._families = [];
    this.fetchInterval = null;
  }

  connectedCallback() {
    this._fetchFamilies();
    this.fetchInterval = setInterval(() => this._fetchFamilies(), 30000);

    this.render();

    const data = [
      {
        img: 'https://fontawesome.com/images/icons/packs/notdog/notdog-mockup-01.png',
        content: 'Notdog icon from FontAwesome.',
      },
      {
        img: 'https://fontawesome.com/images/icons/features/feature-chisel.png',
        content: 'Chisel icon from FontAwesome.',
      },
      {
        img: 'https://fontawesome.com/images/icons/packs/jelly/jelly-mockup-05.png',
        content: 'Jelly icon pack from FontAwesome.',
      },
      {
        img: 'https://fontawesome.com/images/icons/packs/sharp-duotone/sharp-duotone-mockup-05.png',
        content: 'Sharp Duotone icon pack from FontAwesome.',
      },
      {
        img: 'https://fontawesome.com/images/icons/packs/thumbprint/thumbprint-mockup-04.png',
        content: 'Thumbprint icon pack from FontAwesome.',
      },
      {
        img: 'https://fontawesome.com/images/icons/packs/slab/slab-mockup-04.png',
        content: 'Slab icon pack from FontAwesome.',
      },
      {
        img: 'https://fontawesome.com/images/icons/packs/classic/classic-mockup-04.png',
        content: 'Classic icon pack from FontAwesome.',
      },
      {
        img: 'https://fontawesome.com/images/icons/packs/whiteboard/whiteboard-mockup-01.png',
        content: 'Whiteboard icon pack from FontAwesome.',
      },
      {
        img: 'https://fontawesome.com/images/icons/packs/whiteboard/whiteboard-mockup-05.png',
        content: 'Whiteboard pack continued.',
      },
      {
        img: 'https://fontawesome.com/images/icons/packs/whiteboard/whiteboard-mockup-06.png',
        content: 'More from the Whiteboard pack.',
      }
    ];
    const carousel = this.shadowRoot.querySelector('carousel-elm');
    if (carousel) {
      carousel.data = data;
    }
  }

  disconnectedCallback() {
    clearInterval(this.fetchInterval);
  }

  get families() {
    return this._families;
  }

  set families(data) {
    this._families = data;
    this.shadowRoot.querySelector('.button-container').innerHTML = this._families.length > 0
      ? this._families.map(family => `
        <button-elm id="${family.id}" color="dark" border shadow margin="0.25rem" title="${family.text}">
          ${family.text}
        </button-elm>
      `).join('')
      : `<p class="text-muted">No families data available.</p>`;
  }

  get styles() {
    return `
      <style>
        @import url('src/css/code.css');
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #6c757d;
          text-transform: lowercase;
          font-size: 13px;
        }

        label::first-letter {
          text-transform: uppercase;
        }
      </style>
    `;
  }

  get template() {
    const tabUsage = `    &lt;tab-elm justify=&quot;center&quot; type=&quot;primary&quot;&gt;
        &lt;div class=&quot;tab-panel&quot; label=&quot;Tab 1&quot; active&gt;
            This is a tab panel n°1.
            ...
        &lt;/div&gt;
        &lt;div class=&quot;tab-panel&quot; label=&quot;Tab 2&quot;&gt;
            This is a tab panel n°2.
            ...
        &lt;/div&gt;
    &lt;/tab-elm&gt;`;

    const btnUsage = `    &lt;button-elm id=&quot;btn1&quot; color=&quot;dark&quot; border shadow margin=&quot;0.25rem&quot; title=&quot;Button 1&quot;&gt;Button 1&lt;/button-elm&gt;`;

    const notFoundUsage = `    &lt;not-found&gt;&lt;/not-found&gt;`;

    const tooltipUsage = `    &lt;tooltip-elm position=&quot;top&quot; trigger=&quot;hover&quot;&gt;
      Hover over me
    &lt;/tooltip-elm&gt;`;

    const carouselUsage = `    &lt;carousel-elm items-visible=&quot;3&quot; autoplay&gt;&lt;/carousel-elm&gt;
    Attributes:
    - items-visible: Number of items visible at once (default: 3)
    - autoplay: Enable automatic scrolling (default: false)

    Properties:
    - data: [{ img: 'image_url', content: 'Description' }, ...]`;

    return `
    <section class="input-view">
      <card-elm type="primary">
        <div slot="card-header">
          Tab example
        </div>
        <div slot="card-body">
          <tab-elm justify="center" type="primary">
            <div class="tab-panel" label="Syntax" active>
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
              <span class="code">${tabUsage}</span>
              </div>
            </div>
            <div class="tab-panel" label="Dynamic Data fetch">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
              <span class="code">${btnUsage}</span>
              </div>
              <div class="button-container">
              ${this.families.length > 0 ?
                this.families.map(family => `
                  <button-elm id="${family.id}" color="dark" border shadow margin="0.25rem" title="${family.text}">
                    ${family.text}
                  </button-elm>
                `).join('') :
                `<p class="text-muted">No families data available.</p>`
              }
              </div>
            </div>
            <div class="tab-panel" label="Not found">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
              <span class="code">${notFoundUsage}</span>
              </div>
              <hr>
              <not-found></not-found>
            </div>
            <div class="tab-panel" label="Tooltip">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
              <span class="code">${tooltipUsage}</span>
              </div>
              <hr>
              <tooltip-elm position="top" trigger="hover">
              <button-elm color="primary" border shadow margin="0.25rem">Hover over me</button-elm>
              <span slot="tooltip-content">This is a tooltip triggered by hover</span>
              </tooltip-elm>
              <tooltip-elm position="bottom" trigger="click">
              <button-elm color="primary" border shadow margin="0.25rem">Click me</button-elm>
              <span slot="tooltip-content">You clicked me!</span>
              </tooltip-elm>
            </div>
            <div class="tab-panel" label="Caroussel" active>
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
                <span class="code">${carouselUsage}</span>
              </div>
              <carousel-elm items-visible="3" autoplay></carousel-elm>
            </div>
          </tab-elm>
        </div>
      </card-elm>
    </section>
    `;
  }

  _fetchFamilies() {
    fetch('http://localhost/smoft2/application/api/website/sub_api/famille.php?id_company=10')
      .then(res => res.json())
      .then(data => {
        this.families = data.data || [];
      })
      .catch(error => {
        console.error('Error fetching families data:', error);
      });
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styles}
      ${this.template}
    `;
  }
}

customElements.define('view-components', CompView);
export default CompView;
