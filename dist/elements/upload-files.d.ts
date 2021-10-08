import { LitElement } from 'lit';
import { FileStorageService } from '../services/file-storage.service';
declare const UploadFiles_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
export declare class UploadFiles extends UploadFiles_base {
    /** Public attributes */
    oneFile: boolean;
    acceptedFiles: string | undefined;
    /** Dependencies */
    _service: FileStorageService;
    /** Private properties */
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResult[];
}
export {};
