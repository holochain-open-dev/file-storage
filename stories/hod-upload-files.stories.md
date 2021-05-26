```js script
import { html } from '@open-wc/demoing-storybook';
import { withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';
import { FileStorageService, defineHodUploadFile } from '../dist';
import { FileStorageMock } from '../test/mocks/file-storage.mock';
import { AppWebsocketMock, DnaMock } from 'holochain-ui-test-utils';

async function setup() {
  const dnaMock = new DnaMock({
    file_storage: new FileStorageMock(),
  });
  const appWebsocket = new AppWebsocketMock([dnaMock]);
  const appInfo = await appWebsocket.appInfo({ app_id: 'test-app' });

  const cellId = appInfo.cell_data[0][0];

  const fileStorageService = new FileStorageService(appWebsocket, cellId);
  defineHodUploadFile(fileStorageService);
}

setup();

export default {
  title: 'HodUploadFiles',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    component: 'hod-upload-files',
    options: { selectedPanel: 'docs' },
  },
};
```

# `<hod-upload-files>`

Custom Element that handles uploading files to a holochain DHT.

## Features

- Automatic handling of the upload
- Uses [dropzone.js](https://www.dropzonejs.com/) for the element behaviour

## API

> <sb-props of="hod-upload-files"></sb-props>

### Installation & Usage

1. Install this package and add the zome to your DNA - see the [instructions](https://github.com/holochain-open-dev/file-storage-module).
2. Setup the element:

```js
import {
  FileStorageService,
  defineHodUploadFile,
} from '@holochain-open-dev/file-storage';
import { AppWebsocket } from '@holochain/conductor-api';

// Do this wherever you initialize the connection to holochain
const appWebsocket = await AppWebsocket.connect('ws://localhost:8888');
const appInfo = await appWebsocket.appInfo({ app_id: 'test-app' });

const cellId = appInfo.cell_data[0][0];

const fileStorageService = new FileStorageService(appWebsocket, cellId);
defineHodUploadFile(fileStorageService);
```

3. Add the Material Icons font in the `head`:

```html
<head>
  ...
  <link
    href="https://fonts.googleapis.com/css?family=Material+Icons&display=block"
    rel="stylesheet"
  />
</head>
```

4. Add the element in any location in your html:

```html
<body>
  <hod-upload-files></hod-upload-files>
</body>
```

Take into account that at this point the elements already expect a holochain conductor running at `ws://localhost:8888`.

### Variants

```js preview-story
export const Default = () =>
  html`
    <div style="height: 200px; width: 500px; padding: 16px;">
      <hod-upload-files></hod-upload-files>
    </div>
  `;
```
