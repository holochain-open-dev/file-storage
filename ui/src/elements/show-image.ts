import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import {
  DisplayError,
  hashProperty,
  sharedStyles,
} from "@holochain-open-dev/elements";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { consume } from "@lit-labs/context";

import { EntryHash } from "@holochain/client";
import { Task } from "@lit-labs/task";
import { CircularProgress } from "@scoped-elements/material-web";
import { fromUint8Array } from "js-base64";
import { localized, msg } from "@lit/localize";

import { FileStorageClient } from "../file-storage-client";
import { fileStorageClientContext } from "../context";

/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
@localized()
export class ShowImage extends ScopedElementsMixin(LitElement) {
  /** Public attributes */

  /**
   * REQUIRED. The hash of the image to be rendered
   */
  @property(hashProperty("image-hash")) imageHash!: EntryHash;

  /**
   * @internal
   */
  @consume({ context: fileStorageClientContext })
  client!: FileStorageClient;

  /**
   * @internal
   */
  _renderImage = new Task(
    this,
    async ([fileHash]) => {
      const file = await this.client.downloadFile(fileHash);
      const data = await file.arrayBuffer();

      return [file, new Uint8Array(data)] as [File, Uint8Array];
    },
    () => [this.imageHash]
  );

  renderImage(file: File, data: Uint8Array) {
    return html`<img src="data:${file.type};base64,${fromUint8Array(
      data
    )}" style="flex: 1; object-fit: cover"></img>`;
  }

  render() {
    return this._renderImage.render({
      complete: ([f, d]) => this.renderImage(f, d),
      pending: () =>
        html`<div class="row center-content" style="flex: 1">
          <mwc-circular-progress></mwc-circular-progress>
        </div>`,
      error: (e: any) =>
        html`<display-error
          .headline=${msg("Error fetching the image")}
        ></display-error>`,
    });
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
          flex: 1;
        }
      `,
    ];
  }

  /**
   * @internal
   */
  static get scopedElements() {
    return {
      "mwc-circular-progress": CircularProgress,
      "display-error": DisplayError,
    };
  }
}
