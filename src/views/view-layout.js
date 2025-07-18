import "../library/layout/row.js";
import "../library/layout/col.js";
import "../library/layout/card.js";
import '../library/icons/icons.js';

class Layout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styles}
      ${this.template}
    `;
  }

  get styles() {
    return `
      <style>
        @import url('src/css/code.css');
      </style>
    `;
  }

  get template() {
    let cardUsage = `   &lt;card-elm type=&quot;card-primary&quot;&gt;
      &lt;div slot=&quot;card-header&quot;&gt;Card Header&lt;/div&gt;
      &lt;div slot=&quot;card-body&quot;&gt;This is the body of the card.&lt;/div&gt;
      &lt;div slot=&quot;card-footer&quot;&gt;Card Footer&lt;/div&gt;
    &lt;/card-elm&gt;`;

    let rowUsage = `    &lt;row-elm&gt; justify=&quot;space-between&quot; align=&quot;center&quot; nowrap=&quot;true&quot;&gt;
      ...
    &lt;/row-elm&gt;`;

    let colUsage = `    &lt;col-elm class=&quot;col-6&quot;&gt;
      ...
    &lt;/col-elm&gt;`;

    return `
    <section class="layout-view">
      <row-elm>
        <col-elm class="col-6">
          <card-elm type="card-default">
            <div slot="card-header">What is Lorem Ipsum?</div>
            <div slot="card-body">
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>
            </div>
            <div slot="card-footer">This is a half width card</div>
          </card-elm>
        </col-elm>
        <col-elm class="col-6">
          <card-elm type="card-success">
            <div slot="card-header">FA Chisel</div>
            <div slot="card-body">
              <row-elm>
                <col-elm class="col-3">
                  <img src="https://fontawesome.com/images/icons/features/feature-chisel.png" alt="Chisel Icon" loading="lazy" style="width: 100%; height: 4.9rem; object-fit: cover;">
                </col-elm>
                <col-elm class="col-9">
                  <p>FA Chisel is sharp, bold, and full of character - like a sculptor's finest work. In this case, the sculptor is the amazing designer Laura Bohill. With its thick and thin strokes, this pack cuts through the noise and inscribes its way into the spotlight.</p>
                </col-elm>
              </row-elm>
            </div>
            <div slot="card-footer">This is another half width card</div>
          </card-elm>
        </col-elm>
        <col-elm class="col-4">
          <card-elm type="card-danger">
            <div slot="card-header">
              <row-elm>
                <col-elm class="col-11"> Coding Icons</col-elm>
                <col-elm class="col-1">
                  <icon-elm name="code" fill="red"></icon-elm>
                </col-elm>
              </row-elm>
            </div>
            <div slot="card-body">
              <p>More than 50 icons for developers, designers, and anyone who loves to code. These icons are designed to be simple, clean, and easy to use in your projects.</p>
              <row-elm align="center" justify="space-between" nowrap="true">
                <col-elm class="col-2" align="center">
                  <icon-elm name="code" fill="lightsteelblue" size="20" title="Code"></icon-elm>
                </col-elm>
                <col-elm class="col-2" align="center">
                  <icon-elm name="bug" fill="lightsteelblue" size="20" title="Bug"></icon-elm>
                </col-elm>
                <col-elm class="col-2" align="center">
                  <icon-elm name="user-secret" fill="lightsteelblue" size="20" title="Secret user"></icon-elm>
                </col-elm>
                <col-elm class="col-2" align="center">
                  <icon-elm name="keyboard" fill="lightsteelblue" size="20" title="Keyboard"></icon-elm>
                </col-elm>
                <col-elm class="col-2" align="center">
                  <icon-elm name="code-fork" fill="lightsteelblue" size="20" title="Code fork"></icon-elm>
                </col-elm>
                <col-elm class="col-2" align="center">
                  <icon-elm name="terminal" fill="lightsteelblue" size="20" title="Terminal"></icon-elm>
                </col-elm>
              </row-elm>
              <h3>More icons</h3>
              <p>The easiest way to get icons on your website is with a Kit. It's your very own custom version of Font Awesome, all bundled up with only the icons, tools, and settings you need.</p>
            </div>
            <div slot="card-footer">This is a one-third width card</div>
          </card-elm>
        </col-elm>
        <col-elm class="col-5">
          <card-elm>
            <div slot="card-body">
              <img src="https://images.ctfassets.net/s600jj41gsex/3bPe6bHCAho65XqaEGG4Uy/42b0e7c931d7b59f5eee83cca5ff58b4/_TinyMCE__Blog__What_is_Placeholder_Text_in_Web_Development_.png?w=768&q=80&fit=scale" alt="Placeholder Image" loading="lazy" style="width: 100%;height: 14.7rem;object-fit: cover;">
            </div>
          </card-elm>
        </col-elm>
        <col-elm class="col-3">
          <card-elm type="card-warning">
            <div slot="card-header">Placeholder Slot Component in Figma</div>
            <div slot="card-body">
              <img src="https://i.ytimg.com/vi/3AXLubczRoY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC52LFmAEQ2SOcO5wpl2jfJwxmynQ" alt="Placeholder Image" loading="lazy" style="width: 100%; height: 10rem; object-fit: cover;">
            </div>
            <div slot="card-footer">This is a one-quarter width card</div>
          </card-elm>
        </col-elm>
        <col-elm class="col-12">
          <card-elm type="card-primary">
            <div slot="card-header">Row / Col / Card Usage</div>
            <div slot="card-body">
              <p class="text-muted">Row usage:</p>
              <div class="code-wrapper">
                <span class="code">${rowUsage}</span>
              </div>
              <p class="text-muted">Col usage:</p>
              <div class="code-wrapper">
                <span class="code">${colUsage}</span>
              </div>
              <p class="text-muted">Card usage:</p>
              <div class="code-wrapper">
                <span class="code">${cardUsage}</span>
              </div>
            </div>
          </card-elm>
        </col-elm>
      </row-elm>
    </section>
    `;
  }
}

customElements.define('view-layout', Layout);
export default Layout;
