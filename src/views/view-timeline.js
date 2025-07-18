import "../library/layout/card.js";
import "../library/timeline/timeline.js";

class TimelineV extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    // Load initial events if any
    const timeline = this.shadowRoot.querySelector('.timeline-object');
    timeline.events = [
        {
            avatar: '/src/images/pf_1.jpg',
            title: 'Event 1',
            description: 'This is the first event in the timeline.',
            time: '2025-06-21T10:00:00Z'
        },
        {
            avatar: '/src/images/pf_2.png',
            title: 'Event 2',
            description: 'This is the second event in the timeline.',
            time: '2025-07-02T11:00:00Z'
        },
        {
            avatar: '/src/images/pf_4.png',
            title: 'Event 3',
            description: 'This is the third event in the timeline.',
            time: '2025-07-13T12:00:00Z'
        }
    ];
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
    let timelineUsageWithSlot = `    &lt;timeline-elm align=&quot;center&quot;&gt;
        &lt;div class=&quot;timeline-item&quot; avatar=&quot;/src/images/pf_1.jpg&quot; title=&quot;Event 1&quot; data-time=&quot;2025-06-21T10:00:00Z&quot;&gt;
            This is the first event in the timeline.
        &lt;/div&gt;
        ...
    &lt;/timeline-elm&gt;

    Attributes:
    - align: 'left' | 'right' | 'center' (default: 'left')`;

    let timelineUsageWithProperties = `    &lt;timeline-elm class=&quot;timeline-object&quot; align=&quot;center&quot;&gt;
    &lt;/timeline-elm&gt;

    const timeline = this.shadowRoot.querySelector(&#39;.timeline-object&#39;);
    timeline.events = [
        {
            avatar: &#39;/src/images/pf_1.jpg&#39;,
            title: &#39;Event 1&#39;,
            description: &#39;This is the first event in the timeline.&#39;,
            time: &#39;2025-06-21T10:00:00Z&#39;
        },
        ...
    ];`;

    return `
    <section class="timeline-view">
        <timeline-elm class="timeline-object" align="center">
        </timeline-elm>
        <card-elm type="card-primary">
            <div slot="card-header">Timeline Usage</div>
            <div slot="card-body">
                <p class="text-muted">Timeline usage with slot:</p>
                <div class="code-wrapper">
                    <span class="code">${timelineUsageWithSlot}</span>
                </div>
                <p class="text-muted">Timeline usage with properties:</p>
                <div class="code-wrapper">
                    <span class="code">${timelineUsageWithProperties}</span>
                </div>
            </div>
        </card-elm>
    </section>
    `;
  }
}

customElements.define('view-timeline', TimelineV);
export default TimelineV;
