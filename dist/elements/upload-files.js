import { __decorate } from "tslib";
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { DropzoneElement } from '@scoped-elements/dropzone';
import { contextProvided } from '@lit-labs/context';
import { sharedStyles } from '../sharedStyles';
import { HolochainDropzone } from '../holochain-dropzone';
import { fileStorageServiceContext } from '../context';
/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
export class UploadFiles extends ScopedElementsMixin(LitElement) {
    constructor() {
        /** Public attributes */
        super(...arguments);
        this.oneFile = false;
        this.acceptedFiles = undefined;
    }
    /** Private properties */
    firstUpdated() {
        const service = this._service;
        this.defineScopedElement('drop-zone', class extends DropzoneElement {
            buildDropzone(dropzoneElement, options) {
                return new HolochainDropzone(dropzoneElement, service, options);
            }
        });
    }
    render() {
        return html `
      <drop-zone
        .oneFile=${this.oneFile}
        .acceptedFiles=${this.acceptedFiles}
        @file-uploaded=${(e) => (e.detail.hash = e.detail.file.hash)}
      ></drop-zone>
    `;
    }
    static get styles() {
        return [
            sharedStyles,
            css `
        :host {
          display: contents;
        }
      `,
        ];
    }
}
__decorate([
    property({ type: Boolean, attribute: 'one-file' })
], UploadFiles.prototype, "oneFile", void 0);
__decorate([
    property({ type: String, attribute: 'accepted-files' })
], UploadFiles.prototype, "acceptedFiles", void 0);
__decorate([
    contextProvided({ context: fileStorageServiceContext })
], UploadFiles.prototype, "_service", void 0);
//# sourceMappingURL=upload-files.js.map