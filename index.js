import "./src/components/navbar/nav-bar.js";
import './src/views/outlet.js';

'use_strict';

const app = {
  render() {
    document.body.innerHTML = `
      <nav-bar type="light" direction="" justify="center">
        <div class="nav-item" navigate="view-count">Counter</div>
        <div class="nav-item" navigate="view-layout">Layout</div>
        <div class="nav-item" navigate="view-drag">Drag & Drop</div>
        <div class="nav-item" navigate="view-inputs">Inputs</div>
        <div class="nav-item" navigate="view-components" active>Components</div>
        <div class="nav-item" navigate="view-timeline">Timeline</div>
        <div class="nav-item" navigate="view">etc....</div>
      </nav-bar>
      <app>
        <outlet-content class="content"></outlet-content>
      </app>
    `;

    const outlet = document.querySelector('outlet-content');
    const navItems = document.querySelectorAll('.nav-item');
    const getActiveNavigate = () => document.querySelector('.nav-item[active]')?.getAttribute('navigate') || '';

    // Load initial view
    const initialView = getActiveNavigate();
    if (outlet && initialView) {
      outlet.loadView(initialView, false);
    }

    document.addEventListener('navigate', ({ detail }) => {
      const { navigate } = detail;
      if (outlet) {
        outlet.loadView(navigate);
      }
      navItems.forEach(item =>
        item.toggleAttribute('active', item.getAttribute('navigate') === navigate)
      );
    });
  }
};

app.render();