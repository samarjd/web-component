class notFound extends HTMLElement {
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
                :host {
                    display: block;
                    text-align: center;
                    padding: 4rem 2rem;
                    font-family: Arial, sans-serif;
                }
                h1 {
                    font-size: 3rem;
                    color: #ff0000;
                    margin: 1rem 0;
                }
                p {
                    font-size: 1.25rem;
                    color: #333333;
                    margin-top: 0;
                }
                img{
                    mix-blend-mode: darken;
                    width: 100%;
                    max-width: 400px;
                    height: auto;
                }
            </style>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <img src="/src/images/not-found.gif" alt="Not Found Image" />
        `;
    }
}
customElements.define('not-found', notFound);
export default notFound;