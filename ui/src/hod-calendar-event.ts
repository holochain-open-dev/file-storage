import { html, css, LitElement, property, customElement } from 'lit-element';

export class HodCalendarEvent extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--hod-calendar-event-text-color, #000);
    }
  `;

  /**
   * This is a description of a property with an attribute with exactly the same name: "color".
   * @type {"red"|"green"|"blue"}
   * @attr
   */
  @property({ type: String }) title = 'Hey there';

  @property({ type: Number }) counter = 5;

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}
