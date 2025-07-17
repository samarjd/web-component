import "../components/row.js";
import "../components/col.js";
import "../components/card.js";
import '../components/tab.js';
import "../components/select.js";
import '../components/button.js';
import '../components/text-editor/text-editor.js';
import '../components/tooltip/tooltip.js';

import '../components/icons.js';

class InputsView extends HTMLElement {
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

    const editorUsage = `    &lt;text-editor placeholder=&quot;Start typing&quot;&gt;&lt;/text-editor&gt;`;

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
                      Editor element
                    </div>
                    <div slot="card-body">
                      <p class="text-muted">Usage:</p>
                      <div class="code-wrapper">
                        <span class="code">${editorUsage}</span>
                      </div>
                      <hr>
                      <text-editor placeholder="Start typing"></text-editor>
                    </div>
                </card-elm>
            </col-elm>
        </row-elm>
    </section>
    `;
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
