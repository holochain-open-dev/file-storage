import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { hashProperty } from '@holochain-open-dev/elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { contextProvided } from '@lit-labs/context';

import { FileStorageClient } from '../file-storage-client';
import { sharedStyles } from '../shared-styles';
import { fileStorageClientContext } from '../context';
import { EntryHash } from '@holochain/client';
import { Task } from '@lit-labs/task';
import { SlSkeleton } from '@scoped-elements/shoelace'
import { fromUint8Array } from 'js-base64'

/**
 * @fires file-uploaded - Fired after having uploaded the file
 * @csspart dropzone - Style the dropzone itself
 */
export class ShowImage extends ScopedElementsMixin(LitElement) {
  /** Public attributes */

  @property(hashProperty('image-hash')) imageHash!: EntryHash;

  /** Dependencies */

  @contextProvided({ context: fileStorageClientContext })
  _client!: FileStorageClient;

  _renderImage = new Task(this, async ([fileHash]) => {
    const file = await this._client.downloadFile(fileHash);
    const data = await file.arrayBuffer();

    return [file, new Uint8Array(data)] as [File, Uint8Array];
  }, () => [this.imageHash]);

  renderImage(file: File, data: Uint8Array) {
    return html`<img src="data:${file.type};base64,${fromUint8Array(data)}" style="flex: 1"></img>`;
  }

  render() {
    return this._renderImage.render({
      complete: ([f, d]) => this.renderImage(f, d),
      pending: () => html`<sl-skeleton effect="pulse" style="flex: 1"></sl-skeleton>`
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

  static get scopedElements() {
    return { 'sl-skeleton': SlSkeleton }
  }
}