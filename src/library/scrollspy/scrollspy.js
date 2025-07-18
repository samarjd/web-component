class ScrollSpy extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._observer = null;
        this._navLinks = [];
        this._sections = [];
    }

    connectedCallback() {
        this.render();
        this.initSpy();
    }

    disconnectedCallback() {
        this._observer?.disconnect();
    }

    get styles() {
        return `
      <style>
        :host {
          display: block;
          font-family: system-ui, sans-serif;
        }
        .scrollspy-layout {
          display: flex;
          max-height: 500px;
          border: 1px solid #ddd;
          border-radius: 6px;
          overflow: hidden;
        }
        nav {
          width: 220px;
          padding: 1rem;
          background: #f8f9fa;
          overflow-y: auto;
          border-right: 1px solid #dee2e6;
        }
        nav a {
          display: block;
          padding: 0.5rem 1rem;
          color: #000;
          text-decoration: none;
          border-left: 3px solid transparent;
          transition: 0.2s ease-in-out;
          cursor: pointer;
        }
        nav a:hover {
          background: #e9ecef;
        }
        nav a.active {
          font-weight: 600;
          color: #0d6efd;
          border-left-color: #0d6efd;
          background: #e7f1ff;
        }
        .content {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          max-height: 400px;
          scroll-behavior: smooth;
        }
        ::slotted(section) {
          padding: 2rem 1rem 3rem;
          border-bottom: 1px solid #ddd;
          scroll-margin-top: 1rem;
        }
      </style>
    `;
    }

    get template() {
        return `
      <div class="scrollspy-layout">
        <nav aria-label="Section navigation"></nav>
        <div class="content" tabindex="0">
          <slot></slot>
        </div>
      </div>
    `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            ${this.template}
        `;
    }

    initSpy() {
        const nav = this.shadowRoot.querySelector("nav");
        const content = this.shadowRoot.querySelector(".content");
        const slot = this.shadowRoot.querySelector("slot");

        const setup = () => {
            const sections = slot.assignedElements().filter(el => el.classList.contains("scrollspy-section")); 
            if (!sections.length) return;

            this._sections = sections;
            this._navLinks = [];

            nav.innerHTML = "";

            sections.forEach(section => {
                const id = section.id;
                const title = section.querySelector("h1, h2, h3, h4, h5, h6")?.textContent.trim() || section.textContent.trim().slice(0, 30) || id;
                const link = Object.assign(document.createElement("a"), {
                    href: `#${id}`,
                    textContent: title,
                });
                nav.appendChild(link);
                this._navLinks.push(link);
            });

            // Clean observer if it exists
            this._observer?.disconnect();

            // Create a new observer for the sections
            this._observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    const index = sections.indexOf(entry.target);
                    if (entry.isIntersecting && this._navLinks[index]) {
                        this._navLinks.forEach(l => l.classList.remove("active"));
                        this._navLinks[index].classList.add("active");
                    }
                });
            }, {
                root: content, // Observe within the content area
                threshold: 0.5, // Trigger when 50% of the section is visible
                
            });

            // Observe each section
            sections.forEach(section => this._observer.observe(section));

            this._navLinks.forEach(link => {
                link.onclick = e => {
                    e.preventDefault();
                    const id = link.getAttribute("href").slice(1);
                    const target = sections.find(section => section.id === id);
                    if (target) {
                        content.scrollTo({
                            top: target.offsetTop - content.offsetTop,
                            behavior: "smooth",
                        });
                    }
                };
            });
        };

        // Initial setup
        setup();

        // Watch for dynamically added/removed <section> via slot
        slot.addEventListener("slotchange", () => {
            setup();
        });
    }
}

customElements.define("scroll-spy", ScrollSpy);
export default ScrollSpy;
