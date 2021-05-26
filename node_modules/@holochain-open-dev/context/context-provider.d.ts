import { ContextTypeMap } from './context-event';
import { ContextContainer } from './context-container';
import { ReactiveController, ReactiveElement } from 'lit';
/**
 * A ReactiveController which can add context provider behavior to a
 * custom-element.
 *
 * This controller simply listens to the `context-request` event when
 * the host is connected to the DOM and registers the received callbacks
 * against its observable Context implementation.
 */
export declare class ContextProvider<T extends keyof ContextTypeMap> extends ContextContainer<ContextTypeMap[T]> implements ReactiveController {
    protected host: ReactiveElement;
    private name;
    constructor(host: ReactiveElement, name: T, defaultValue?: ContextTypeMap[T]);
    private onContextRequest;
    hostConnected(): void;
    hostDisconnected(): void;
}
