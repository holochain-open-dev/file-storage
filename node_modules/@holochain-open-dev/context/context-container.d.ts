import { ContextCallback, ContextTypeMap } from './context-event';
/**
 * A simple class which stores a value, and triggers registered callbacks when the
 * value is changed via its setter.
 *
 * An implementor might use other observable patterns such as MobX or Redux to get
 * behavior like this. But this is a pretty minimal approach that will likely work
 * for a number of use cases.
 */
export declare class ContextContainer<T extends ContextTypeMap[keyof ContextTypeMap]> {
    private callbacks;
    private _value;
    get value(): T;
    set value(v: T);
    setValue(v: T, force?: boolean): void;
    constructor(defaultValue?: T);
    updateContext: () => void;
    addCallback(callback: ContextCallback<T>, once?: boolean): void;
    clearCallbacks(): void;
}
