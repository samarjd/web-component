'use strict';

import './src/library/navbar/nav-bar.js';
import './outlet.js';

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(() => {})
        .catch(err => console.error('❌ Service Worker failed', err));
    });
  }
};

const app = {
  render() {
    document.body.innerHTML = `
      <nav-bar type="light" direction="" justify="center">
        <div class="nav-item" navigate="view-count">Counter</div>
        <div class="nav-item" navigate="view-layout">Layout</div>
        <div class="nav-item" navigate="view-drag">Drag & Drop</div>
        <div class="nav-item" navigate="view-inputs" active>Inputs</div>
        <div class="nav-item" navigate="view-components>Components</div>
        <div class="nav-item" navigate="view-timeline">Timeline</div>
        <div class="nav-item" navigate="view">etc....</div>
      </nav-bar>

      <app>
        <outlet-content class="content"></outlet-content>
      </app>
    `;

    this.initNavigation();
  },

  initNavigation() {
    const outlet = document.querySelector('outlet-content');
    const navItems = document.querySelectorAll('.nav-item');
    const getActiveNavigate = () =>
      document.querySelector('.nav-item[active]')?.getAttribute('navigate') || '';

    // Load initial view
    const initialView = getActiveNavigate();
    if (outlet && initialView) {
      outlet.loadView(initialView, false, './src/views/');
    }

    // Handle navigation change
    document.addEventListener('navigate', ({ detail }) => {
      const { navigate } = detail;

      if (outlet) {
        outlet.loadView(navigate, true, './src/views/');
      }

      navItems.forEach(item =>
        item.toggleAttribute('active', item.getAttribute('navigate') === navigate)
      );
    });
  }
};

registerServiceWorker();
app.render();