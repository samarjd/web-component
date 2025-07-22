import "../library/layout/card.js";
import '../library/tab/tab.js';
import '../library/button/button.js';
import '../library/tooltip/tooltip.js';
import '../library/caroussel/caroussel.js';
import '../library/breadcrumb/breadcrumb.js';
import '../library/icons/icons.js';
import "../library/breadcrumb/breadcrumb.js";
import Alert from "../library/alert/alert.js";
import '../library/accordion/accordion.js';
import '../library/scrollspy/scrollspy.js';
import '../library/icons/icons.js';
import '../library/badge/badge.js'
import '../library/offcanvas/offcanvas.js';
import '../library/skeleton-loader/skeleton-loader.js';

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
        img: 'src/images/backgrounds/notdog-mockup-01.webp',
        content: 'Notdog icon from FontAwesome.',
      },
      {
        img: 'src/images/backgrounds/feature-chisel.webp',
        content: 'Chisel icon from FontAwesome.',
      },
      {
        img: 'src/images/backgrounds/jelly-mockup-05.webp',
        content: 'Jelly icon pack from FontAwesome.',
      },
      {
        img: 'src/images/backgrounds/sharp-duotone-mockup-05.webp',
        content: 'Sharp Duotone icon pack from FontAwesome.',
      },
      {
        img: 'src/images/backgrounds/thumbprint-mockup-04.webp',
        content: 'Thumbprint icon pack from FontAwesome.',
      },
      {
        img: 'src/images/backgrounds/slab-mockup-04.webp',
        content: 'Slab icon pack from FontAwesome.',
      },
      {
        img: 'src/images/backgrounds/classic-mockup-04.webp',
        content: 'Classic icon pack from FontAwesome.',
      },
      {
        img: 'src/images/backgrounds/whiteboard-mockup-01.webp',
        content: 'Whiteboard icon pack from FontAwesome.',
      },
      {
        img: 'src/images/backgrounds/whiteboard-mockup-05.webp',
        content: 'Whiteboard pack continued.',
      },
      {
        img: 'src/images/backgrounds/whiteboard-mockup-06.webp',
        content: 'More from the Whiteboard pack.',
      }
    ];
    const carousel = this.shadowRoot.querySelector('carousel-elm');
    if (carousel) {
      carousel.data = data;
    }

    // Handle alert triggers
    const alertTriggers = this.shadowRoot.querySelectorAll('.alert-trigger');
    alertTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        let btn = e.target;
        let position = btn.getAttribute('position');
        let alertType = btn.getAttribute('color') || 'primary';
        let dismissible = btn.hasAttribute('dismissible') && btn.getAttribute('dismissible') !== 'false';

        const alert = new Alert();
        alert.type = alertType;
        if (position) alert.position = position;
        if (dismissible) alert.setAttribute('dismissible', '');
        alert.innerHTML = 'This is an alert message.';

        this.shadowRoot.appendChild(alert);

      });
    });

    // Handle offcanvas open button
    const openOffcanvasBtn = this.shadowRoot.querySelector('#open-offcanvas');
    if (openOffcanvasBtn) {
      openOffcanvasBtn.addEventListener('click', () => {
        const offcanvas = this.shadowRoot.querySelector('off-canvas');
        if (offcanvas) {
          offcanvas.open();
        }
      });
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
    const buttonContainer = this.shadowRoot.querySelector('.button-container');
    if (!buttonContainer) return;
    buttonContainer.innerHTML = this._families.length > 0
      ? this._families.map(family => `
        <badge-elm id="${family.id}" type="light-primary" pill title="${family.text}">
          ${family.text}
        </badge-elm>
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

    const scrollSpyTemplate = [
      {
        id: 'section1',
        title: 'What is Lorem Ipsum?',
        content: `
        <p>
        Lorem Ipsum
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
        "There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain..."
        </p>
        <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
        <p>
        Quisque varius velit sed malesuada mattis. Sed dolor nibh, eleifend eu est quis, auctor sodales ipsum. In luctus id metus vitae varius. Vivamus egestas metus dolor, tincidunt interdum ante semper in. Quisque bibendum felis felis, faucibus blandit elit sodales ac. Proin sit amet euismod tellus. Fusce vel libero varius, lobortis lorem et, ornare lacus. Vivamus rutrum auctor tellus non hendrerit. Vestibulum at leo condimentum, maximus lacus nec, hendrerit magna. Pellentesque dapibus pellentesque ultricies. Vivamus massa quam, fermentum sit amet massa eu, luctus rhoncus ex.
        </p>`,
      },
      {
        id: 'section2',
        title: 'Why do we use it?',
        content: `
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.
        </p>
        <p>
        Vivamus dignissim in nulla vel tincidunt. Pellentesque eu auctor mauris. Nam velit dolor, cursus quis enim vitae, rhoncus feugiat sem. Vivamus eget lobortis odio, sed sagittis tortor. Praesent tristique nunc sapien, ac porta ipsum viverra sed. Nunc a diam pretium felis eleifend ullamcorper id quis nisl. Duis non tortor ut metus mattis elementum.
        </p>`,
      },
      {
        id: 'section3',
        title: 'Where does it come from?',
        content: `
        <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.
        </p>
        <p>
        Vivamus dignissim in nulla vel tincidunt. Pellentesque eu auctor mauris. Nam velit dolor, cursus quis enim vitae, rhoncus feugiat sem. Vivamus eget lobortis odio, sed sagittis tortor. Praesent tristique nunc sapien, ac porta ipsum viverra sed. Nunc a diam pretium felis eleifend ullamcorper id quis nisl. Duis non tortor ut metus mattis elementum.
        </p>`,
      },
      {
        id: 'section4',
        title: 'Where can I get some?',
        content: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`
      },
      {
        id: 'section5',
        title: 'More lorem lore?',
        content: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id finibus enim. Etiam ullamcorper blandit egestas. Vivamus elementum hendrerit mi, at convallis ipsum pharetra eget. Aenean rhoncus felis vel tellus egestas cursus. Pellentesque eu ligula ante. In tempor dui at nibh placerat, sagittis mollis nisl laoreet. Quisque leo metus, interdum vel accumsan vitae, vehicula vitae neque. In ac orci vitae tellus interdum pharetra. Integer ut nisi mi. Sed lacinia lorem est, ut ullamcorper ex ultrices ut. Phasellus bibendum vehicula sollicitudin. Pellentesque ut diam tristique, sodales odio at, sagittis est. Nunc nec leo eu est consequat lobortis. Sed vel metus tempus, iaculis arcu sed, interdum justo.
        </p>
        <p>
        Integer in nisl eros. Maecenas ac libero eget nulla tempus posuere. Cras auctor velit vel bibendum elementum. In condimentum velit at diam pretium tincidunt. Quisque quis felis iaculis, aliquam odio non, lobortis ipsum. Morbi et eros tristique, iaculis libero a, porta ipsum. Phasellus tristique, dolor a vehicula ornare, nibh ligula varius quam, vel egestas justo elit vitae ipsum. Donec iaculis massa mauris, congue accumsan felis tristique id. Aliquam non nisi posuere, tristique nibh id, sodales purus. Etiam ut mi viverra, accumsan purus et, iaculis sapien. Nullam vulputate magna a congue elementum. Maecenas blandit lorem a dui lobortis, a commodo leo fringilla.
        </p>
        <p>
        Mauris pharetra rhoncus tempor. In maximus venenatis orci, quis auctor ante egestas vel. Aliquam porta nulla mi, et imperdiet est maximus eget. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin convallis, mi in lacinia convallis, velit dolor maximus mi, sit amet bibendum sem enim et lectus. Curabitur bibendum ligula eu nisi lobortis vehicula a vel sem. Praesent maximus ante non nisl gravida, feugiat faucibus ante congue. Nam consequat congue semper. Nunc aliquet posuere scelerisque. Nullam dapibus blandit quam a vestibulum. Sed pretium fermentum magna, vestibulum sagittis arcu bibendum ultricies. Sed quis sagittis diam. In aliquet neque eget elementum semper.
        </p>
        <p>
        Vivamus vitae risus at lectus sollicitudin dictum a et mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc sed urna velit. Cras rutrum erat nec elit iaculis rutrum. Suspendisse vitae urna sollicitudin, sagittis urna sed, viverra neque. Praesent auctor fringilla ornare. Morbi varius posuere mollis. Nam iaculis odio elementum leo egestas mollis. Nullam quis finibus lacus. Nunc arcu magna, vulputate et pellentesque eget, mattis sit amet enim.
        </p>
        <p>
        Aenean sodales rutrum vulputate. Pellentesque molestie, tortor at cursus mattis, est tortor facilisis risus, sed pretium nibh erat eu dui. Nullam vitae congue orci. Etiam posuere pharetra luctus. Nunc faucibus ac erat a volutpat. Cras congue, leo eget eleifend tincidunt, tellus est venenatis magna, id congue ante libero ac massa. Proin et sodales lacus. Suspendisse quis blandit orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse eget maximus enim. Proin quam nibh, maximus sit amet posuere nec, fringilla nec ex. Suspendisse nec turpis ligula. Nullam non convallis libero.
        </p>`
      },

    ];

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
              <span class="code">${this._usage('tab')}</span>
              </div>
            </div>
            <div class="tab-panel" label="Dynamic Data fetch">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
              <span class="code">${this._usage('btn')}</span>
              </div>
              <div class="button-container">
              ${this.families.length > 0 ?
                this.families.map(family => `
                  <badge-elm id="${family.id}" type="light-primary" pill  title="${family.text}">
                    ${family.text}
                  </badge-elm>
                `).join('') :
                `<p class="text-muted">No families data available.</p>`
              }
              </div>
            </div>
            <div class="tab-panel" label="Not found">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
              <span class="code">${this._usage('notFound')}</span>
              </div>
              <hr>
              <not-found></not-found>
            </div>
            <div class="tab-panel" label="Tooltip">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
              <span class="code">${this._usage('tooltip')}</span>
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
                <span class="code">${this._usage('carousel')}</span>
              </div>
              <icon-2 name="clock" size="20" fill="#000" class="spin"></icon-2>
              <carousel-elm items-visible="3" autoplay></carousel-elm>
            </div>
            <div class="tab-panel" label="Breadcrumb">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
                <span class="code">${this._usage('breadcrumb')}</span>
              </div>
              <breadcrumb-elm separator=">">
                <span class="breadcrumb-item" link="view-count">Home</span>
                <span class="breadcrumb-item" link="view-components">Components</span>
                <span class="breadcrumb-item" active>View Components</span>
              </breadcrumb-elm>
            </div>
            <div class="tab-panel" label="Alert">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
                <span class="code">${this._usage('alert')}</span>
              </div>
              <button-elm class="alert-trigger" color="primary" border shadow>Show Alert</button-elm>
              <button-elm class="alert-trigger" color="danger" border dismissible="true">Show Dismissible Alert</button-elm>
              <button-elm class="alert-trigger" color="light" border position="bottom-right">Show Bottom Right Alert</button-elm>
              <button-elm class="alert-trigger" color="warning" border position="top-left">Show Top Left Alert</button-elm>
              <button-elm class="alert-trigger" color="success" border position="top-right">Show Top Right Alert</button-elm>
              <button-elm class="alert-trigger" color="dark" border shadow position="bottom-left">Show Bottom Left Alert</button-elm>
            </div>
            <div class="tab-panel" label="Accordion">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
                <span class="code">${this._usage('accordion')}</span>
              </div>
              <accordion-elm>
                <div slot="header">Accordion Header</div>
                <div slot="content">
                  <p>This is the content of the accordion. It can contain any HTML elements.</p>
                </div>
              </accordion-elm>
              <accordion-elm>
                <div slot="header">Another Accordion Header</div>
                <div slot="content">
                  <p>This is another accordion content. You can add more accordions as needed.</p>
                </div>
              </accordion-elm>
              <accordion-elm expanded>
                <div slot="header">Expanded Accordion Header</div>
                <div slot="content">
                  <p>This accordion is expanded by default. You can control the expanded state using the 'expanded' attribute.</p>
                </div>
              </accordion-elm>
            </div>
            <div class="tab-panel" label="Scrollspy">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
                <span class="code">${this._usage('scrollspy')}</span>
              </div>
              <scroll-spy>
                ${scrollSpyTemplate.map(section => `
                  <section id="${section.id}" class="scrollspy-section">
                    <h1>${section.title}</h1>
                    <p>${section.content}</p>
                  </section>
                `).join('')}
              </scroll-spy>
            </div>
            <div class="tab-panel" label="Offcanvas">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
                <span class="code">${this._usage('offcanvas')}</span>
              </div>
              <button-elm id="open-offcanvas" color="primary" border shadow>Open Offcanvas</button-elm>
              <off-canvas position="right">
                <div slot="header">Offcanvas Header</div>
                <div>
                  <h1>Offcanvas Content</h1>
                  <h2>This is the content of the offcanvas. You can add any HTML elements here.</h2>
                  <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque varius velit sed malesuada mattis. Sed dolor nibh, eleifend eu est quis, auctor sodales ipsum. In luctus id metus vitae varius. Vivamus egestas metus dolor, tincidunt interdum ante semper in. Quisque bibendum felis felis, faucibus blandit elit sodales ac. Proin sit amet euismod tellus. Fusce vel libero varius, lobortis lorem et, ornare lacus. Vivamus rutrum auctor tellus non hendrerit. Vestibulum at leo condimentum, maximus lacus nec, hendrerit magna. Pellentesque dapibus pellentesque ultricies. Vivamus massa quam, fermentum sit amet massa eu, luctus rhoncus ex.
                  </p>
                  <img src="src/images/backgrounds/whiteboard-mockup-01.webp" alt="Offcanvas Image" style="width: 100%; height: auto; border-radius: 8px;" loading="lazy" />
                  <h1>More Content</h1>
                  <p>
                  Integer in nisl eros. Maecenas ac libero eget nulla tempus posuere. Cras auctor velit vel bibendum elementum. In condimentum velit at diam pretium tincidunt. Quisque quis felis iaculis, aliquam odio non, lobortis ipsum. Morbi et eros tristique, iaculis libero a, porta ipsum. Phasellus tristique, dolor a vehicula ornare, nibh ligula varius quam, vel egestas justo elit vitae ipsum. Donec iaculis massa mauris, congue accumsan felis tristique id. Aliquam non nisi posuere, tristique nibh id, sodales purus. Etiam ut mi viverra, accumsan purus et, iaculis sapien. Nullam vulputate magna a congue elementum. Maecenas blandit lorem a dui lobortis, a commodo leo fringilla.
                  </p>
                  <p>
                  Mauris pharetra rhoncus tempor. In maximus venenatis orci, quis auctor ante egestas vel. Aliquam porta nulla mi, et imperdiet est maximus eget. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin convallis, mi in lacinia convallis, velit dolor maximus mi, sit amet bibendum sem enim et lectus. Curabitur bibendum ligula eu nisi lobortis vehicula a vel sem. Praesent maximus ante non nisl gravida, feugiat faucibus ante congue. Nam consequat congue semper. Nunc aliquet posuere scelerisque. Nullam dapibus blandit quam a vestibulum. Sed pretium fermentum magna, vestibulum sagittis arcu bibendum ultricies. Sed quis sagittis diam. In aliquet neque eget elementum semper.
                  </p>
                  <img src="src/images/backgrounds/whiteboard-mockup-05.webp" alt="Offcanvas Image" style="width: 100%; height: auto; border-radius: 8px;" loading="lazy" />
                </div>
                <div slot="footer">
                  All rights reserved © ${new Date().getFullYear()}
                </div>
              </off-canvas>
            </div>
            <div class="tab-panel" label="Skeleton Loader">
              <p class="text-muted">Usage:</p>
              <div class="code-wrapper">
                <span class="code">${this._usage('skeleton-loader')}</span>
              </div>
              <skeleton-loader image header body footer></skeleton-loader>
            </div>
          </tab-elm>
        </div>
      </card-elm>
    </section>
    `;
  }

  _fetchFamilies() {
    this.families = [
      {
        "id": "229",
        "text": "ABAT JOUR"
      },
      {
        "id": "234",
        "text": "ACCESSOIR MEUBLES"
      },
      {
        "id": "265",
        "text": "ajoutsimpleCategory"
      },
      {
        "id": "266",
        "text": "ajoutVariantCategory"
      },
      {
        "id": "285",
        "text": "Alimentaire"
      },
      {
        "id": "225",
        "text": "APPLIQUE PLAFONNIERE"
      },
      {
        "id": "260",
        "text": "Bébé"
      },
      {
        "id": "220",
        "text": "BUREAU CHAISE BUREAU"
      },
      {
        "id": "230",
        "text": "CADRES DECORATIF"
      },
      {
        "id": "217",
        "text": "CHAISE TABOURET"
      },
      {
        "id": "211",
        "text": "CHAMBRE A COUCHER"
      },
      {
        "id": "282",
        "text": "Chemise"
      },
      {
        "id": "226",
        "text": "DECORATION MURALE"
      },
      {
        "id": "222",
        "text": "DIVERS ARTICLES"
      },
      {
        "id": "298",
        "text": "Electroménager"
      },
      {
        "id": "278",
        "text": "electronique"
      },
      {
        "id": "296",
        "text": "Electronique"
      },
      {
        "id": "227",
        "text": "LAMPADAIRE LAMPE BUREAUX"
      },
      {
        "id": "215",
        "text": "LIVING PTE CHAUS  CONSOLE MEUBLE D ENTREE"
      },
      {
        "id": "223",
        "text": "LUSTRES"
      },
      {
        "id": "280",
        "text": "Matière primaire"
      },
      {
        "id": "233",
        "text": "MENAGES DECORATION"
      },
      {
        "id": "279",
        "text": "Meuble bureautique"
      },
      {
        "id": "228",
        "text": "MEUBLE DE JARDIN"
      },
      {
        "id": "297",
        "text": "Meuble jardin"
      },
      {
        "id": "270",
        "text": "moteur"
      },
      {
        "id": "277",
        "text": "Perceuse"
      },
      {
        "id": "237",
        "text": "PLATEAU ETAGER"
      },
      {
        "id": "267",
        "text": "poi"
      },
      {
        "id": "273",
        "text": "Polo"
      },
      {
        "id": "221",
        "text": "PORTE MANTEAU PORTE VESTE"
      },
      {
        "id": "214",
        "text": "SALONS SEJOURS TAB BASSE"
      },
      {
        "id": "219",
        "text": "SAM(TAB CHAISES)"
      },
      {
        "id": "252",
        "text": "Services"
      },
      {
        "id": "272",
        "text": "SNACK"
      },
      {
        "id": "284",
        "text": "Software"
      },
      {
        "id": "224",
        "text": "SUSPENSIONS"
      },
      {
        "id": "218",
        "text": "TABLE TV"
      },
      {
        "id": "216",
        "text": "TABLES CUISINES"
      },
      {
        "id": "236",
        "text": "TAPIS PARRURE COUVRE LIT"
      },
      {
        "id": "231",
        "text": "VERRE CADRE MIRROIR MIRROIR"
      }
    ];
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styles}
      ${this.template}
    `;
  }

  _usage(type) {
    const usage = [
      {
        tab: `        &lt;tab-elm justify=&quot;center&quot; type=&quot;primary&quot;&gt;
          &lt;div class=&quot;tab-panel&quot; label=&quot;Tab 1&quot; active&gt;
            This is a tab panel n°1.
            ...
          &lt;/div&gt;
          &lt;div class=&quot;tab-panel&quot; label=&quot;Tab 2&quot;&gt;
            This is a tab panel n°2.
            ...
          &lt;/div&gt;
        &lt;/tab-elm&gt;`
      },
      {
        btn: `        &lt;button-elm id=&quot;btn1&quot; color=&quot;dark&quot; border shadow margin=&quot;0.25rem&quot; title=&quot;Button 1&quot;&gt;Button 1&lt;/button-elm&gt;`
      },
      { notFound: `        &lt;not-found&gt;&lt;/not-found&gt;` },
      {
        tooltip: `        &lt;tooltip-elm position=&quot;top&quot; trigger=&quot;hover&quot;&gt;
          Hover over me
        &lt;/tooltip-elm&gt;`
      },
      {
        carousel: `        &lt;carousel-elm items-visible=&quot;3&quot; autoplay&gt;&lt;/carousel-elm&gt;
        Attributes:
        - items-visible: Number of items visible at once (default: 3)
        - autoplay: Enable automatic scrolling (default: false)

        Properties:
        - data: [{ img: 'image_url', content: 'Description' }, ...]`
      },
      {
        breadcrumb: `        &lt;breadcrumb-elm&gt;
          &lt;span class=&quot;breadcrumb-item&quot; link=&quot;view-count&quot;&gt;Home&lt/span&gt;
          &lt;span class=&quot;breadcrumb-item&quot; link=&quot;view-components&quot;&gt;Components&lt/span&gt;
          &lt;span class=&quot;breadcrumb-item&quot; active&gt;View Components&lt/span&gt;
          ...
        &lt;/breadcrumb-elm&gt;`
      },
      {
        alert: `        &lt;alert type=&quot;primary&quot; position=&quot;top-right&quot;&gt;
          This is a primary alert.
        &lt;/alert&gt;

        Attributes:
        - type: Alert type (primary, danger, light, warning, success, dark)
        - position: Alert position (top-right, bottom-right, top-left, bottom-left, default: bottom-right)
        - dismissible: If true, the alert can be dismissed by the user (default: false, delay: 2000ms)`
      },
      {
        accordion: `        &lt;accordion-elm expanded&gt;
          &lt;div slot=&quot;header&quot;&gt;Accordion Header&lt;/div&gt;
          &lt;div slot=&quot;content&quot;&gt;
            &lt;p&gt;This is the content of the accordion. It can contain any HTML elements.&lt;/p&gt;
          &lt;/div&gt;
        &lt;/accordion-elm&gt;

        Attributes:
        - expanded: If true, the accordion is expanded by default (default: false)`
      },
      {
        scrollspy: `        &lt;scroll-spy&gt;
          &lt;section id=&quot;section1&quot;&gt;
          ...
          &lt;/section&gt;
          &lt;section id=&quot;section2&quot;&gt;
          ...
          &lt;/section&gt;
        &lt;/scroll-spy&gt;`,
      },
      {
        offcanvas: `        &lt;off-canvas position=&quot;left&quot;&gt;
          &lt;div slot=&quot;header&quot;&gt;Offcanvas Header&lt;/div&gt;
          &lt;div&gt;This is the content of the offcanvas&lt&lt;/div&gt;
          &lt;div slot=&quot;footer&quot;&gt;
            This is the footer of the offcanvas.
          &lt;/div&gt;
        &lt;/off-canvas&gt;

        Attributes:
        - position: Position of the offcanvas (left, right, top, bottom, default: left)
        - open: If true, the offcanvas is open by default (default: false)
        - backdrop: If true, a backdrop is shown when the offcanvas is open (default: true)`
      },
      {
        'skeleton-loader': `        &lt;skeleton-loader image header body footer&gt;&lt;/skeleton-loader&gt;

        Attributes:
        - image: If true, a skeleton for an image is shown (default: false)
        - header: If true, a skeleton for a header is shown (default: false)
        - body: If true, a skeleton for the body is shown (default: false)
        - footer: If true, a skeleton for the footer is shown (default: false)`
      }
    ];
    return usage.find(item => item[type])?.[type] || 'No usage found for this type.';
  }
}

customElements.define('view-components', CompView);
export default CompView;