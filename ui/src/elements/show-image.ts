import { css, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";
import { hashProperty, sharedStyles } from "@holochain-open-dev/elements";
import { consume } from "@lit-labs/context";

import "@shoelace-style/shoelace/dist/components/spinner/spinner.js";
import "@holochain-open-dev/elements/dist/elements/display-error.js";

import { EntryHash } from "@holochain/client";
import { Task } from "@lit-labs/task";
import { fromUint8Array } from "js-base64";
import { localized, msg } from "@lit/localize";

import { FileStorageClient } from "../file-storage-client";
import { fileStorageClientContext } from "../context";

/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
@localized()
@customElement("show-image")
export class ShowImage extends LitElement {
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
    return html`<div style="flex:1"><img src="data:${
      file.type
    };base64,${fromUint8Array(
      data
    )}" style="object-fit: cover; overflow: hidden; width: 100%; height: 100%"></img></div>`;
  }

  render() {
    return this._renderImage.render({
      complete: ([f, d]) => this.renderImage(f, d),
      pending: () =>
        html`<div class="row center-content" style="flex: 1">
          <sl-spinner style="font-size: 2rem"></sl-spinner>
        </div>`,
      error: (e: any) =>
        html`<display-error
          .headline=${msg("Error fetching the image")}
          .error=${e}
        ></display-error>`,
    });
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
      `,
    ];
  }
}
