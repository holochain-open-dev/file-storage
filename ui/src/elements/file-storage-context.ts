import { css, html, LitElement } from "lit";
import { provide } from "@lit-labs/context";
import { property } from "lit/decorators.js";

import { fileStorageClientContext } from "../context";
import { FileStorageClient } from "../file-storage-client";

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
