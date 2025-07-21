import "../library/layout/card.js";
import "../library/button/button.js";
import Modal from '../library/modal/modal.js';
import '../library/icons/icons.js';
import "../library/dropdown/dropdown.js";
import "../library/layout/row.js";
import "../library/layout/col.js";

class Counter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._count = 0;
    this.step = parseInt(this.getAttribute('step')) || 1;
    this.info = this.getAttribute('info') || 'This is a counter card';
    this.allowReset = this.hasAttribute('allow-reset');
    this.showFooter = this.hasAttribute('footer');
    this.showDropdown = this.hasAttribute('dropdown');
    this.type = this.getAttribute('type') || 'default';
  }

  connectedCallback() {
    this.render();
  }

  get count() {
    return this._count;
  }

  set count(value) {
    this._count = value;
    const countDiv = this.shadowRoot.querySelector('.count');
    if (countDiv) {
      countDiv.textContent = `Count: ${value}`;
      const card = this.shadowRoot.querySelector('card-elm');
      if (card) {
        card.style.transform = 'translateY(2px)';
        setTimeout(() => {
          card.style.transform = 'translateY(-2px)';
        }, 100);
      }
    }
  }

  _setupListeners() {
    const button = this.shadowRoot.querySelector('.increment-btn');
    const countDiv = this.shadowRoot.querySelector('.count');
    const resetButton = this.shadowRoot.querySelector('.reset-btn');
    // increment listener
    if (button && countDiv) button.addEventListener('click', () => { this.count += parseInt(this.step) });

    // reset listener
    if (resetButton) resetButton.addEventListener('click', () => { this.count = 0 });

    // dropdown listener
    this.shadowRoot.addEventListener('dropdown-select', (e) => {
      const selectedStep = parseInt(e.detail.value);
      if (!isNaN(selectedStep)) this.step = selectedStep;
      const incrementInfo = this.shadowRoot.querySelector('.increment-info');
      if (incrementInfo) {
        incrementInfo.textContent = `This is a +${this.step} steps counter`;
      }
    });
  }

  render() {

    const resetButton = this.allowReset ? `
      <button-elm class="reset-btn" color="danger" border shadow title="Reset count">
        Reset
      </button-elm>
    ` : '';

    this.shadowRoot.innerHTML = `
      <card-elm type="card-${this.type}">
        <div slot="card-header">
        <row-elm align="center" justify="space-between" nowrap="true">
          <col-elm class="col-8">
            <span class="count">Count: ${this.count}</span>
          </col-elm>
          <col-elm class="col-4" align="right">
            <dropdown-elm label="Options"></dropdown-elm>
          </col-elm>
        </row-elm>
        </div>
        <div slot="card-body">
          <p class="increment-info">${this.info}</p>
          <button-elm class="increment-btn" color="${this.type}" border shadow title="Increment count">
            Increment
          </button-elm>
          ${resetButton}
        </div>
        ${this.showFooter ? `
          <div slot="card-footer">
            <small>
              💡<i>Check all counter params</i>     
                <button-elm id="counterModalTrigger" color="primary" border shadow is-icon title="Add a new counter">
                  <icon-elm type="solid" name="gear" size="15" title="Settings"></icon-elm>
                </button-elm>
            </small>
          </div>
        ` : ''}
      </card-elm>
    `;

    const drop = this.shadowRoot.querySelector('dropdown-elm');
    if (drop) {
      const steps = [1, 2, 5, 10, 50, 100].map(step => ({
        label: `step = ${step}`,
        value: String(step),
        selected: this.step === step
      }));
      drop.data = steps;
    }

    this._setupListeners();

    this.shadowRoot.querySelector('#counterModalTrigger').addEventListener('click', () => {
      let modal = this.shadowRoot.querySelector('modal-elm');

      if (!modal) {
        modal = new Modal();
        modal.innerHTML = `
          <style>
            input[type="number"], textarea {
              padding: 5px 10px; 
              border: 1px solid #ccc; 
              border-radius: 4px; 
              outline: 1px solid #007bff; 
              width: 100%; 
              box-sizing: border-box;
            }
            .text-right {
              text-align: right;
            }
            .mt-1{
              margin-top: 1rem;
            }
          </style>
          <div slot="modal-header">
            Counter Modal
          </div>
          <div slot="modal-body">
            <form>
              <label for="stepInput">Count:</label>
              <input type="number" name="count" value="${this.count}" step="${this.step}" min="0">
              <label for="infoInput">Info:</label>
              <textarea name="info" rows="3">${this.info}</textarea>
              <label for="allowResetInput">Allow Reset:</label>
              <input type="checkbox" name="allowReset" ${this.allowReset ? 'checked' : ''}>
              <label for="footerInput">Show Footer:</label>
              <input type="checkbox" name="footer" ${this.showFooter ? 'checked' : ''}>
              <label for="dropdownInput">Show Dropdown:</label>
              <input type="checkbox" name="dropdown" ${this.showDropdown ? 'checked' : ''}>
              <input type="hidden" name="type" value="${this.type}">
              <div class="text-right mt-1">
                <button-elm type="submit" class="increment-btn" color="${this.type}" border shadow title="Set step value">
                  <icon-elm type="solid" name="edit" size="15" title="Settings"></icon-elm> Save 
                </button-elm>
              </div>
            </form>
          </div>
          ${this.type === 'primary' ? `<div slot="modal-footer">
            <small>💡<i>Click the close button to dismiss this modal or click outside of the modal.</i></small>
          </div>` : ''}
        `;
        this.shadowRoot.appendChild(modal);

        Object.assign(modal, {
          width: 'small',
          color: this.type,
          backdropClose: this.type === 'primary',
          backdrop: true
        });

        modal.querySelector('form').addEventListener('submit', (e) => {
          e.preventDefault();
          modal.hide();
          var formData = new FormData(e.target);
          this.count = parseInt(formData.get('count'));
          this.info = formData.get('info') || 'This is a counter card';
          this.allowReset = formData.get('allowReset') === 'on';

          this.render();
        });
      }
      modal.show();
    });
  }
}

customElements.define('count-elm', Counter);
export default Counter;
