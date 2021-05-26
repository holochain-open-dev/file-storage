import { LitElement } from 'lit-element';
import { Icon } from 'scoped-material-components/mwc-icon';
import { FileStorageService } from '../services/file-storage.service';
declare const UploadFiles_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost> & typeof import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost;
/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
export declare abstract class UploadFiles extends UploadFiles_base {
    /** Public attributes */
    oneFile: boolean;
    acceptedFiles: string | undefined;
    /** Dependencies */
    abstract get _fileStorageService(): FileStorageService;
    static get scopedElements(): {
        'mwc-icon': typeof Icon;
    };
    /** Private properties */
    _dropzone: HTMLElement;
    _showIcon: boolean;
    static get styles(): import("lit-element").CSSResult[];
    firstUpdated(): void;
    setupDropzone(): void;
    render(): import("lit-element").TemplateResult;
}
export {};
