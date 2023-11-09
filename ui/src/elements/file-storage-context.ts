import { css, html, LitElement } from "lit";
import { provide } from "@lit/context";
import { property, customElement } from "lit/decorators.js";

import { fileStorageClientContext } from "../context.js";
import { FileStorageClient } from "../file-storage-client.js";

@customElement("file-storage-context")
export class FileStorageContext extends LitElement {
  @provide({ context: fileStorageClientContext })
  @property({ type: Object })
  client!: FileStorageClient;

  render() {
    return html`<slot></slot>`;
  }

  static styles = css`
    :host {
      display: contents;
    }
  `;
}
