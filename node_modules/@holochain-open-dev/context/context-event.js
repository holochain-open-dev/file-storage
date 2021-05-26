/**
 * An event fired by a context requester to signal it desires a named context.
 *
 * A provider should inspect the `name` property of the event to determine if it has a value that can
 * satisfy the request, calling the `callback` with the requested value if so.
 *
 * A provider can call the callback multiple times if the value is changed, if this is the case the
 * provider should pass a `dispose` method to the callback which requesters can invoke to indicate they
 * no longer wish to receive these updates.
 *
 * If a requester only wishes to ever receive the context once, then they can optionally set the
 * `once` property on the event, providers should respect this property and only execute the
 * callback once.
 */
export class ContextEvent extends CustomEvent {
    constructor(name, callback, once = false) {
        super('context-request', { bubbles: true, composed: true });
        this.name = name;
        this.callback = callback;
        this.once = once;
    }
}
//# sourceMappingURL=context-event.js.map