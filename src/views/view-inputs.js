import { Row, Col, Card, Tab, Select, Button, TextEditor, Switch, Tooltip, Input, Icon } from '../library/index.js';

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
        &lt;option data-avatar=&quot;/src/images/users/pf_1.jpg&quot;&gt;Chat&lt;/option&gt;
        ...
    &lt;/select-elm&gt;`;

    const editorUsage = `    &lt;text-editor placeholder=&quot;Start typing&quot;&gt;&lt;/text-editor&gt;`;

    const switchUsage = `    &lt;switch-box type=&quot;primary&quot; checked&gt;Primary switch&lt;/switch-box&gt;`;

    const InputUsage = `    &lt;input-elm type=&quot;text&quot; id=&quot;input-text&quot; name=&quot;input-text&quot; label=&quot;Enter text&quot;&gt;&lt;/input-elm&gt;
    Attributes:
    - type: text, email, password, number, date, tel, etc...
    - id: unique identifier for the input
    - name: name of the input
    - label: floating label text
    - placeholder: placeholder text
    - required: makes the input mandatory
    - disabled: disables the input
    - pattern: regex pattern for validation
    - value: initial value of the input
    - min: minimum value for number inputs
    - max: maximum value for number inputs
    - step: step value for number inputs`;

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
                        <option data-avatar="src/images/users/pf_1.jpg">Email</option>
                        <option data-avatar="src/images/users/pf_2.png">Phone</option>
                        <option data-avatar="src/images/users/pf_3.jpg">Chat</option>
                        <option data-avatar="src/images/users/pf_4.png">Social Media</option>
                        <option>Website</option>
                        <option>In Person</option>
                        <option>Referral</option>
                        <option>Advertisement</option>
                        <option>Event</option>
                        <option data-avatar="src/images/users/pf_1.jpg">Newsletter</option>
                        <option>Survey</option>
                        <option>Forum</option>
                        <option>Community</option>
                        <option data-avatar="src/images/users/pf_3.jpg">Blog</option>
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
            <col-elm class="col-12">
                <card-elm type="primary">
                    <div slot="card-header">
                      Switch element
                    </div>
                    <div slot="card-body">
                      <p class="text-muted">Usage:</p>
                      <div class="code-wrapper">
                        <span class="code">${switchUsage}</span>
                      </div>
                      <hr>                        
                      <h2>Switches with different background colors</h2>
                      <row-elm>
                        <col-elm class="col-3">
                          <switch-box type="primary" checked>Primary switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="danger" checked>Danger switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="warning" checked>Warning switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="success" checked>Success switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="info" checked>Info switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="dark" checked>Dark switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="light" checked>Light switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="secondary" checked>Secondary switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="danger" disabled checked>Disabled switch</switch-box>
                        </col-elm>
                      </row-elm>
                      <h2 class="col-12">Switches with different outlines</h2>
                      <row-elm>
                        <col-elm class="col-3">
                          <switch-box type="outline-primary" checked>Primary switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="outline-danger" checked>Danger switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="outline-warning" checked>Warning switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="outline-success" checked>Success switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="outline-info" checked>Info switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="outline-dark" checked>Dark switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="outline-light" checked>Light switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="outline-secondary" checked>Secondary switch</switch-box>
                        </col-elm>
                        <col-elm class="col-3">
                          <switch-box type="outline-danger" disabled checked>Disabled switch</switch-box>
                        </col-elm>
                      </row-elm>
                    </div>
                </card-elm>
            </col-elm>
            <col-elm class="col-12">
              <card-elm type="primary">
                <div slot="card-header">
                  Input element
                </div>
                <div slot="card-body">
                  <p class="text-muted">Usage:</p>
                  <div class="code-wrapper">
                    <span class="code">${InputUsage}</span>
                  </div>
                  <row-elm>
                    <col-elm class="col-6">
                      <h2>Default inputs</h2>
                      <label for="input-date">Date input</label>
                      <input-elm type="date" id="input-date" placeholder="Select date" name="input-date"></input-elm>
                      <label for="input-number">Number input</label>
                      <input-elm type="number" id="input-number" placeholder="Enter number" name="input-number" min="0" step="2"></input-elm>
                      <label for="input-tel">Telephone input</label>
                      <input-elm type="tel" id="input-tel" placeholder="+(216)** *** ***" name="input-tel" pattern="^(\\+216\\s?)?[0-9]{2}([\\s]?[0-9]{2}){3}$"></input-elm>
                    </col-elm>
                    <col-elm class="col-6">
                      <h2>Floating label inputs</h2>
                      <input-elm type="text" id="input-text" name="input-text" label="Enter text"></input-elm>
                      <input-elm type="email" id="input-email" name="input-email" label="Enter email"></input-elm>
                      <input-elm type="password" id="input-password" name="input-password" label="Password input"></input-elm>
                    </col-elm>
                  </row-elm>
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
