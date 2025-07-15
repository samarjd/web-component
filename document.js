class MyElement extends HTMLElement {
  constructor() {
    super(); // Call the parent constructor
    // Initialize the shadow DOM
    console.log('constructor: initializing shadow DOM');
    this.attachShadow({ mode: 'open' }); // Create a shadow root for encapsulation
    this._count = 0;

    console.log('constructor: element created');
  }

  // Called every time the element is inserted into the DOM
  connectedCallback() {
    console.log('connectedCallback: element added to DOM');
    this.render();
    this.shadowRoot.querySelector('button').addEventListener('click', this.increment.bind(this));
  }

  // Called every time the element is removed from the DOM
  disconnectedCallback() {
    console.log('disconnectedCallback: element removed from DOM');
    this.shadowRoot.querySelector('button').removeEventListener('click', this.increment.bind(this));
  }

  // Called when the element is moved to a new document
  adoptedCallback() {
    console.log('adoptedCallback: element moved to new document');
  }

  // List of attributes to watch for changes
  static get observedAttributes() {
    return ['count'];
  }

  // Called when one of the observed attributes changes
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`attributeChangedCallback: ${name} changed from ${oldValue} to ${newValue}`);
    if (name === 'count') {
      this._count = Number(newValue);
      this.updateCountDisplay();
    }
  }

  increment() {
    this._count++;
    this.setAttribute('count', this._count); // this triggers attributeChangedCallback
  }

  updateCountDisplay() {
    const countSpan = this.shadowRoot.querySelector('#count');
    if (countSpan) {
      countSpan.textContent = this._count;
    }
  }

  // Getter for count property: this allows access to the count value
  // using myElement.count instead of myElement.getAttribute('count')
  get count() {
    return this._count;
  }

  // Setter for count property: this allows setting the count value
  // using myElement.count = value instead of myElement.setAttribute('count', value)
  set count(value) {
    this._count = Number(value);
    this.setAttribute('count', this._count); // this triggers attributeChangedCallback
  }
  render() {


    this.dispatchEvent(new CustomEvent('dropdown-select', {
      detail: this._items[index],
      bubbles: true,
      composed: true
    }));
    this.shadowRoot.innerHTML = `
      <style>
        button {
          font-size: 1.2rem;
          padding: 0.5em 1em;
        }
      </style>
      <div>
        Count: <span id="count">${this._count}</span>
        <button>Increment</button>
      </div>
    `;
  }
}

customElements.define('document-card', MyElement); // Register the custom element
export default MyElement; // Export the class for use in other modules
