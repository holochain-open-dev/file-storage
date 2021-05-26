import { LitElement } from 'lit';
import { ContextTypeMap } from './context-event';
export declare class ContextProviderElement<T extends keyof ContextTypeMap> extends LitElement {
    private localValue?;
    set value(value: ContextTypeMap[T]);
    private context?;
    set name(value: string);
    render(): import("lit").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
