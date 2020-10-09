import { html, LitElement, query } from 'lit-element';
import { FileStorageService } from '../services/file-storage.service';
import { sharedStyles } from '../sharedStyles';
import { HolochainDropzone } from '../holochain-dropzone';

export abstract class HodUploadFile extends LitElement {
  /** Public attributes */

  /** Dependencies */
  abstract get _fileStorageService(): FileStorageService;

  /** Private properties */

  @query('#dropzone') _dropzone!: HTMLElement;

  static styles = sharedStyles;

  firstUpdated() {
    new HolochainDropzone(this._dropzone, this._fileStorageService, {});
  }

  render() {
    return html` <div id="dropzone"></div> `;
  }
}

export function defineHodUploadFile(fileStorageService: FileStorageService) {
  customElements.define(
    'hod-upload-file',
    class extends HodUploadFile {
      get _fileStorageService() {
        return fileStorageService;
      }
    }
  );
}
