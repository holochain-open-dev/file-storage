import { TextAreaBase } from '@material/mwc-textarea/mwc-textarea-base';
import { Constructor } from 'lit-element';
import { NotchedOutline } from './mwc-notched-outline';
import { ScopedElementsHost } from '@open-wc/scoped-elements/types/src/types';
declare const TextArea_base: Constructor<TextAreaBase & ScopedElementsHost>;
export declare class TextArea extends TextArea_base {
    static styles: import("lit-element").CSSResult;
    static get scopedElements(): {
        'mwc-notched-outline': typeof NotchedOutline;
    };
    protected outlineElement: NotchedOutline | null;
}
export {};
