import { css, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";
import { hashProperty, sharedStyles } from "@holochain-open-dev/elements";
import { consume } from "@lit/context";

import "@shoelace-style/shoelace/dist/components/skeleton/skeleton.js";
import "@holochain-open-dev/elements/dist/elements/display-error.js";

import { EntryHash } from "@holochain/client";
import { Task } from "@lit-labs/task";
import { fromUint8Array } from "js-base64";
import { localized, msg } from "@lit/localize";

import { FileStorageClient } from "../file-storage-client";
import { fileStorageClientContext } from "../context";
import { getImage, storeImage } from "../local-storage";

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
      const image = await getImage(fileHash);
      if (image) {
        return image;
      }

      const file = await this.client.downloadFile(fileHash);
      const data = await file.arrayBuffer();

      const imageB64 = `data:${file.type};base64,${fromUint8Array(
        new Uint8Array(data)
      )}`;

      storeImage(fileHash, imageB64);

      return imageB64;
    },
    () => [this.imageHash]
  );

  renderImage(data: string) {
    return html`<div style="flex:1"><img src="${data}" part="image" style="object-fit: cover; overflow: hidden; width: 100%; height: 100%"></img></div>`;
  }

  render() {
    return this._renderImage.render({
      complete: (d) => this.renderImage(d),
      pending: () =>
        html`<sl-skeleton
          style="flex: 1; --border-radius: 0"
          effect="pulse"
        ></sl-skeleton> `,
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
