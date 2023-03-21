import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { DropzoneElement, DropzoneOptions } from "@scoped-elements/dropzone";
import { consume } from "@lit-labs/context";
import {
  FormField,
  FormFieldController,
  sharedStyles,
} from "@holochain-open-dev/elements";
import { localized } from "@lit/localize";

import { FileStorageClient } from "../file-storage-client.js";
import { fileStorageClientContext } from "../context.js";
import { HolochainDropzone } from "../holochain-dropzone.js";
import { EntryHash } from "@holochain/client";

/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
@localized()
@customElement("upload-files")
export class UploadFiles extends DropzoneElement implements FormField {
  /**
   * The name of the field if this element is used inside a form
   * Required only if the element is used inside a form
   */
  @property()
  name!: string;

  /**
   * Whether this field is required if this element is used inside a form
   */
  @property()
  required = false;

  /**
   * Whether this field is disabled if this element is used inside a form
   */
  @property()
  disabled = false;

  /**
   * The default value that this element will take if it is resetted in a form
   */
  @property()
  defaultValue!: EntryHash | Array<EntryHash>;

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

  /**
   * @internal
   */
  _controller = new FormFieldController(this);

  async firstUpdated() {
    super.firstUpdated();
    if (this.defaultValue !== undefined) {
      if (Array.isArray(this.defaultValue)) {
        for (const fileHash of this.defaultValue) {
          const image = await this._client.downloadFile(fileHash);
          this.dropzone.addFile(image as any);
        }
      } else {
        const image = await this._client.downloadFile(this.defaultValue);
        this.dropzone.addFile(image as any);
      }
    }
  }

  reset() {
    this.clear();
  }

  /**
   * @internal
   */
  get value() {
    if (this.oneFile)
      return this.dropzone.files[0]
        ? (this.dropzone.files[0] as any).hash
        : undefined;
    return this.dropzone.files.map((file) => (file as any).hash);
  }

  /**
   * @internal
   */
  @query("#hidden-input")
  private _input!: HTMLInputElement;

  reportValidity() {
    const invalid = this.required !== false && this.value === undefined;
    if (invalid) {
      this._input.setCustomValidity(`Uploading a file is required`);
      this._input.reportValidity();
    }

    return invalid;
  }

  buildDropzone(dropzoneElement: HTMLElement, options: DropzoneOptions) {
    return new HolochainDropzone(
      dropzoneElement,
      this._client,
      options
    ) as any as Dropzone;
  }

  render() {
    return html`
      <div style="position:relative">
        <input
          id="hidden-input"
          style="width:0; height: 0; position: absolute; z-index: -1; left: 50%; top: 20%"
        />
        ${super.render()}
      </div>
    `;
  }
}
