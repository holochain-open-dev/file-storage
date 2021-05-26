import { css, html, LitElement } from 'lit';
import { query, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { Icon } from 'scoped-material-components/mwc-icon';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';

import { FileStorageService } from '../services/file-storage.service';
import { sharedStyles } from '../sharedStyles';
import { HolochainDropzone } from '../holochain-dropzone';
// @ts-ignore
import basicStyles from 'dropzone/dist/min/basic.min.css';
// @ts-ignore
import dropzoneStyles from 'dropzone/dist/min/dropzone.min.css';
import { DropzoneOptions } from 'dropzone';
import { FILE_STORAGE_SERVICE_CONTEXT } from '../types';
import { requestContext } from '@holochain-open-dev/context';

/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
export class UploadFiles extends ScopedRegistryHost(LitElement) {
  /** Public attributes */

  @property({ type: Boolean, attribute: 'one-file' }) oneFile = false;
  @property({ type: String, attribute: 'accepted-files' }) acceptedFiles:
    | string
    | undefined = undefined;

  /** Dependencies */

  @requestContext(FILE_STORAGE_SERVICE_CONTEXT)
  _service!: FileStorageService;

  /** Private properties */

  @query('.dropzone') _dropzone!: HTMLElement;

  @property({ type: Boolean }) _showIcon = true;

  firstUpdated() {
    this.setupDropzone();
  }

  setupDropzone() {
    const element = this;
    const oneFile = this.oneFile;
    const options: DropzoneOptions = {
      addRemoveLinks: true,
      previewTemplate: `
    <DIV class="dz-preview dz-file-preview">
    <DIV class="dz-image"><IMG data-dz-thumbnail=""></DIV>
    <DIV class="dz-details">
    <DIV class="dz-size"><SPAN data-dz-size=""></SPAN></DIV>
    <DIV class="dz-filename"><SPAN data-dz-name=""></SPAN></DIV></DIV>
    <DIV class="dz-progress"><SPAN class="dz-upload" data-dz-uploadprogress=""></SPAN></DIV>
    <DIV class="dz-error-message"><SPAN data-dz-errormessage=""></SPAN></DIV>
    <div class="dz-success-mark">
      <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
        <title>Check</title>
        <desc>Created with Sketch.</desc>
        <defs></defs>
        <g id="Page-1" stroke="none" stroke-width="1" fill="green" fill-rule="evenodd" sketch:type="MSPage">
            <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>
        </g>
      </svg>
    </div>
  `,
      init: function () {
        if (oneFile) {
          // @ts-ignore
          this.hiddenFileInput.removeAttribute('multiple');
          // @ts-ignore
          this.on('success', function (file) {
            // @ts-ignore
            if (this.files.length > 1) {
              // @ts-ignore
              this.removeFile(this.files[0]);
            }
          });
          this.on('removedfile', function () {
            // @ts-ignore
            if (this.files.length === 0) {
              element._showIcon = true;
            }
          });
        }
      },
    };
    if (this.acceptedFiles) {
      options.acceptedFiles = this.acceptedFiles;
    }
    const dropzone = new HolochainDropzone(
      this._dropzone,
      this._service,
      options
    );

    dropzone.on('addedfile', () => (this._showIcon = false));
    dropzone.on('complete', file => {
      this.dispatchEvent(
        new CustomEvent('file-uploaded', {
          detail: {
            file,
            hash: (file as any).hash,
          },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  render() {
    return html`
      <style>
        ${basicStyles}
          ${dropzoneStyles}
          .dropzone
          .dz-preview.dz-file-preview
          .dz-image {
          background: #fff;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
            0 3px 6px rgba(0, 0, 0, 0.23);
          border-radius: 4px;
        }
      </style>
      <div
        style="flex: 1; display: flex;"
        class=${classMap({
          dropzone: true,
          'center-content': true,
          column: this._showIcon,
          row: !this._showIcon,
        })}
        part="dropzone"
      >
        ${this._showIcon
          ? html`
              <mwc-icon style="font-size: 100px; pointer-events: none;"
                >backup</mwc-icon
              >
            `
          : html``}
      </div>
    `;
  }

  static elementDefinitions = {
    'mwc-icon': Icon,
  };

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: contents;
        }

        .dropzone {
          background: #f5f5f5;
          border-radius: 5px;
          border: 2px dashed rgb(0, 135, 247);
          border-image: none;
          color: rgba(0, 0, 0, 0.54);
          min-height: 228px;
        }

        .dropzone .dz-message .dz-button {
          font-weight: 500;
          font-size: initial;
          text-transform: uppercase;
        }

        .dropzone .dz-message {
          margin-top: 1em;
        }

        .dropzone .dz-remove {
          margin-top: 16px;
        }
      `,
    ];
  }
}
