import { __decorate } from "tslib";
import { html, LitElement } from 'lit';
import { requestContext } from './request-context';
export class SampleElement extends LitElement {
    render() {
        return html `<span>${this.count}</span>`;
    }
}
__decorate([
    requestContext('count')
], SampleElement.prototype, "count", void 0);
//# sourceMappingURL=sample-element.js.map