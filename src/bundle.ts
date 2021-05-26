import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { Constructor, LitElement } from 'lit-element';
//@ts-ignore
import { createUniqueTag } from '@open-wc/scoped-elements/src/createUniqueTag';
import { UploadFiles } from './elements/upload-files';
import { FileStorageService } from './services/file-storage.service';

function renderUnique(
  tag: string,
  baseClass: Constructor<HTMLElement>,
  root: ShadowRoot
) {
  const registry = customElements;
  const uniqueTag = createUniqueTag(tag, registry);
  root.innerHTML = `
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
            <${uniqueTag}></${uniqueTag}>
      `;

  registry.define(
    uniqueTag,
    (class extends baseClass {} as unknown) as Constructor<HTMLElement>
  );
}

export default function lenses(appWebsocket: AppWebsocket, cellId: CellId) {
  return {
    standalone: [
      {
        name: 'Upload files',
        render(root: ShadowRoot) {
          renderUnique(
            'upload-files',
            class extends UploadFiles {
              get _fileStorageService() {
                return new FileStorageService(appWebsocket, cellId);
              }
            },
            root
          );
        },
      },
    ],
    entryLenses: {},
    attachmentsLenses: [],
  };
}
