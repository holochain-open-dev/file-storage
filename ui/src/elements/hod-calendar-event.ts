import { ApolloClient } from '@apollo/client/core';
import { html, LitElement, property } from 'lit-element';
import { sharedStyles } from '../sharedStyles';

// TODO: create your own elements
export abstract class HodCalendarEvent extends LitElement {
  /** Public attributes */

  /**
   * This is a description of a property with an attribute with exactly the same name: "color".
   */
  @property({ type: String }) title = 'Hey there';

  /** Dependencies */
  abstract get _apolloClient(): ApolloClient<any>;

  /** Private properties */

  @property({ type: Number }) _counter = 5;

  static styles = sharedStyles;

  __increment() {
    this._counter += 1;
  }

  render() {
    return html`
      <h2>${this.title} Nr. ${this._counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}
