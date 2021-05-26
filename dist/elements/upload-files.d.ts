import { LitElement } from 'lit';
import { Icon } from 'scoped-material-components/mwc-icon';
import { FileStorageService } from '../services/file-storage.service';
declare const UploadFiles_base: typeof LitElement;
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
    _dropzone: HTMLElement;
    _showIcon: boolean;
    firstUpdated(): void;
    setupDropzone(): void;
    render(): import("lit-html").TemplateResult<1>;
    static elementDefinitions: {
        'mwc-icon': typeof Icon;
    };
    static get styles(): import("lit").CSSResultGroup[];
}
export {};
