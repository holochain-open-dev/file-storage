import { ReactiveController, ReactiveElement } from 'lit';
import { ContextTypeMap } from './context-event';
/**
 * ContextController is a ReactiveController which binds a custom-element's
 * lifecycle to the Context API. When an element is connected to the DOM it
 * will emit the context-request event, invoking the callback set on the
 * controller when the context request is satisfied. It will also call
 * the dispose method provided by the Context API when the element is
 * disconnected.
 */
export declare class ContextController<T extends keyof ContextTypeMap, HostElement extends ReactiveElement> implements ReactiveController {
    protected host: HostElement;
    private callback;
    private name;
    constructor(host: HostElement, callback: (value: ContextTypeMap[T], dispose?: () => void) => void, name: T);
    private dispose?;
    hostConnected(): void;
    hostDisconnected(): void;
}
