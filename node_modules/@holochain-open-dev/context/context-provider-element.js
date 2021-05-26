import { __decorate } from "tslib";
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ContextProvider } from './context-provider';
export class ContextProviderElement extends LitElement {
    set value(value) {
        this.localValue = value;
        if (this.context) {
            this.context.value = value;
        }
    }
    set name(value) {
        if (!this.context) {
            this.context = new ContextProvider(this, value);
            if (this.localValue) {
                this.context.value = this.localValue;
            }
        }
        else {
            throw new Error('Can only set context provider element name once!');
        }
    }
    render() {
        return html `<slot></slot>`;
    }
}
// Don't interfere with the html of the element tree
ContextProviderElement.styles = css `
    :host {
      display: contents;
    }
  `;
__decorate([
    property({ attribute: false })
], ContextProviderElement.prototype, "value", null);
__decorate([
    property()
], ContextProviderElement.prototype, "name", null);
//# sourceMappingURL=context-provider-element.js.map