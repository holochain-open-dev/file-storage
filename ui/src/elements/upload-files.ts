import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { DropzoneElement } from "@scoped-elements/dropzone";
import { consume } from "@lit-labs/context";
import { DropzoneOptions } from "dropzone";
import { sharedStyles } from "@holochain-open-dev/elements";

import { FileStorageClient } from "../file-storage-client";
import { HolochainDropzone } from "../holochain-dropzone";
import { fileStorageClientContext } from "../context";

/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
export class UploadFiles extends ScopedElementsMixin(LitElement) {
  /** Public attributes */

  /**
   * Whether this element should allow only file to be uploaded
   */
  @property({ type: Boolean, attribute: "one-file" }) oneFile = false;

  /**
   * The type of files accepted by this element
   * Learn how to use this here: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
   */
  @property({ type: String, attribute: "accepted-files" }) acceptedFiles:
    | string
    | undefined = undefined;

  /**
   * @internal
   */
  @consume({ context: fileStorageClientContext })
  _client!: FileStorageClient;

  /** Private properties */

  firstUpdated() {
    const client = this._client;

    this.defineScopedElement(
      "drop-zone",
      class extends DropzoneElement {
        buildDropzone(dropzoneElement: HTMLElement, options: DropzoneOptions) {
          return new HolochainDropzone(
            dropzoneElement,
            client,
            options
          ) as any as Dropzone;
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
