import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { DropzoneElement } from '@scoped-elements/dropzone';
import { contextProvided } from '@lit-labs/context';
import { DropzoneOptions } from 'dropzone';

import { FileStorageService } from '../services/file-storage.service';
import { sharedStyles } from '../sharedStyles';
import { HolochainDropzone } from '../holochain-dropzone';
import { fileStorageServiceContext } from '../context';

/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
export class UploadFiles extends ScopedElementsMixin(LitElement) {
  /** Public attributes */

  @property({ type: Boolean, attribute: 'one-file' }) oneFile = false;
  @property({ type: String, attribute: 'accepted-files' }) acceptedFiles:
    | string
    | undefined = undefined;

  /** Dependencies */

  @contextProvided({ context: fileStorageServiceContext })
  _service!: FileStorageService;

  /** Private properties */

  firstUpdated() {
    const service = this._service;

    this.defineScopedElement(
      'drop-zone',
      class extends DropzoneElement {
        buildDropzone(dropzoneElement: HTMLElement, options: DropzoneOptions) {
          return new HolochainDropzone(dropzoneElement, service, options);
        }
      }
    );

  }

  render() {
    return html`
      <drop-zone
        .oneFile=${this.oneFile}
        .acceptedFiles=${this.acceptedFiles}
        @file-uploaded=${(e: CustomEvent) =>
          (e.detail.hash = e.detail.file.hash)}
      ></drop-zone>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: contents;
        }
      `,
    ];
  }
}
