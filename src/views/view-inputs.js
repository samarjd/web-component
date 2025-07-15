import "../components/row.js";
import "../components/col.js";
import "../components/card.js";
import '../components/tab.js';
import "../components/select.js";
import '../components/button.js';
import '../components/text-editor/text-editor.js';

import '../components/icons.js';

class InputsView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._families = [];
    this.fetchInterval = null;
  }

  connectedCallback() {
    this._fetchFamilies();
    this.fetchInterval = setInterval(() => this._fetchFamilies(), 30000); // Fetch data every 30 seconds

    this.render();
  }

  disconnectedCallback() {      
    clearInterval(this.fetchInterval); // Clear the interval when the element is removed
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
    const selectUsage = `   &lt;select-elm placeholder=&quot;Type request&quot; name=&quot;single-select&quot;&gt;
        &lt;option value=&quot;request&quot; data-foo=&quot;this is a lil text&quot;&gt;Request&lt;/option&gt;
        &lt;option value=&quot;quote&quot;&gt;Quote&lt;/option&gt;
        &lt;option value=&quot;information&quot;&gt;Information&lt;/option&gt;
        ...
    &lt;/select-elm&gt;`;

    const multiSelectUsage = `    &lt;select-elm type=&quot;multiple&quot; allow-clear=&quot;true&quot; placeholder=&quot;Source&quot; name=&quot;source&quot; required&gt;
        &lt;option&gt;Email&lt;/option&gt;
        &lt;option selected&gt;Phone&lt;/option&gt;
        &lt;option data-avatar=&quot;/src/images/pf_1.jpg&quot;&gt;Chat&lt;/option&gt;
        ...
    &lt;/select-elm&gt;`;

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

    const editorUsage = `    &lt;text-editor placeholder=&quot;Start typing&quot;&gt;&lt;/text-editor&gt;`;

    const btnUsage = `    &lt;button-elm id=&quot;btn1&quot; color=&quot;dark&quot; border shadow margin=&quot;0.25rem&quot; title=&quot;Button 1&quot;&gt;Button 1&lt;/button-elm&gt;`;

    return `
    <section class="input-view">
        <row-elm>
            <col-elm class="col-6">
                <card-elm type="primary">
                    <div slot="card-header">
                        Single option select element
                    </div>
                    <div slot="card-body">
                        <label for="single-select">Type of request</label>
                        <select-elm placeholder="Select a type" name="single-select" id="single-select">
                            <option value="request" data-foo="this is a lil text">Request</option>
                            <option value="quote">Quote</option>
                            <option value="information">Information</option>
                            <option value="support">Support</option>
                            <option value="feedback">Feedback</option>
                            <option value="other" data-foo="additional info needed">Other</option>
                        </select-elm>
                        <p class="text-muted">Usage:</p>
                        <div class="code-wrapper">
                          <span class="code">${selectUsage}</span>
                        </div>
                    </div>
                </card-elm>
            </col-elm>
            <col-elm class="col-6">
            <card-elm type="primary">
                <div slot="card-header">
                    Multiple options select element
                </div>
                <div slot="card-body">
                    <label for="multi-select">Source request</label>
                    <select-elm type="multiple" placeholder="Select a source" name="source" close-on-select="false" required id="multi-select" allow-clear="true">
                        <option data-avatar="src/images/pf_1.jpg">Email</option>
                        <option data-avatar="src/images/pf_2.png">Phone</option>
                        <option data-avatar="src/images/pf_3.jpg">Chat</option>
                        <option data-avatar="src/images/pf_4.png">Social Media</option>
                        <option>Website</option>
                        <option>In Person</option>
                        <option>Referral</option>
                        <option>Advertisement</option>
                        <option>Event</option>
                        <option data-avatar="src/images/pf_1.jpg">Newsletter</option>
                        <option>Survey</option>
                        <option>Forum</option>
                        <option>Community</option>
                        <option data-avatar="src/images/pf_3.jpg">Blog</option>
                        <option>Other</option>
                    </select-elm>
               
                    <p class="text-muted">Usage:</p>
                    <div class="code-wrapper">
                      <span class="code">${multiSelectUsage}</span>
                    </div>
                </div>
            </card-elm>
            </col-elm>
            <col-elm class="col-12">
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
                        <div class="tab-panel" label="Text Editor">
                          <p class="text-muted">Usage:</p>
                          <div class="code-wrapper">
                            <span class="code">${editorUsage}</span>
                          </div>
                          <hr>
                          <text-editor placeholder="Start typing"></text-editor>
                        </div>
                      </tab-elm>
                    </div>
                </card-elm>
            </col-elm>
        </row-elm>
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

customElements.define('view-inputs', InputsView);
export default InputsView;
