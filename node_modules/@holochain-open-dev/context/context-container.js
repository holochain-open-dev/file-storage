/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
/**
 * A simple class which stores a value, and triggers registered callbacks when the
 * value is changed via its setter.
 *
 * An implementor might use other observable patterns such as MobX or Redux to get
 * behavior like this. But this is a pretty minimal approach that will likely work
 * for a number of use cases.
 */
export class ContextContainer {
    constructor(defaultValue) {
        this.callbacks = new Set();
        this.updateContext = () => {
            this.callbacks.forEach(([callback, disposer]) => callback(this._value, disposer));
        };
        if (defaultValue !== undefined) {
            this.value = defaultValue;
        }
    }
    get value() {
        return this._value;
    }
    set value(v) {
        this.setValue(v);
    }
    setValue(v, force = false) {
        let changed = false;
        if (v !== this._value) {
            changed = true;
        }
        this._value = v;
        if (changed || force) {
            this.updateContext();
        }
    }
    addCallback(callback, once) {
        if (!once) {
            const record = [
                callback,
                () => {
                    this.callbacks.delete(record);
                },
            ];
            this.callbacks.add(record);
        }
        callback(this.value);
    }
    clearCallbacks() {
        this.callbacks.clear();
    }
}
//# sourceMappingURL=context-container.js.map