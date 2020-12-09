import { LitElement } from 'lit-element';
import '@material/mwc-icon';
import { FileStorageService } from '../services/file-storage.service';
/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
export declare abstract class HodUploadFiles extends LitElement {
    /** Public attributes */
    /** Dependencies */
    abstract get _fileStorageService(): FileStorageService;
    /** Private properties */
    _dropzone: HTMLElement;
    _showIcon: boolean;
    static get styles(): import("lit-element").CSSResult[];
    firstUpdated(): void;
    render(): import("lit-element").TemplateResult;
}
export declare function defineHodUploadFile(fileStorageService: FileStorageService): void;
