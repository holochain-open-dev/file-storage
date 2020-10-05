import { __decorate } from "tslib";
import { html, LitElement, property } from 'lit-element';
import { sharedStyles } from '../sharedStyles';
// TODO: create your own elements
export class HodCalendarEvent extends LitElement {
    constructor() {
        /** Public attributes */
        super(...arguments);
        /**
         * This is a description of a property with an attribute with exactly the same name: "color".
         */
        this.title = 'Hey there';
        /** Private properties */
        this._counter = 5;
    }
    __increment() {
        this._counter += 1;
    }
    render() {
        return html `
      <h2>${this.title} Nr. ${this._counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
    }
}
HodCalendarEvent.styles = sharedStyles;
__decorate([
    property({ type: String })
], HodCalendarEvent.prototype, "title", void 0);
__decorate([
    property({ type: Number })
], HodCalendarEvent.prototype, "_counter", void 0);
//# sourceMappingURL=hod-calendar-event.js.map