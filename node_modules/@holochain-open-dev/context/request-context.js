import { property } from 'lit/decorators.js';
import { ContextController } from './context-controller';
export const requestContext = (contextName) => {
    return function (proto, propertyKey) {
        property()(proto, propertyKey);
        const callback = proto.connectedCallback;
        proto.connectedCallback = function () {
            callback.call(this);
            const controller = new ContextController(this, value => (this[propertyKey] = value), contextName);
        };
    };
};
//# sourceMappingURL=request-context.js.map