# File Storage Module

Small zome to create and retrieve files, in holochain RSM.

This module is designed to be included in other DNAs, assuming as little as possible from those. It is packaged as a holochain zome, and an npm package that offers native Web Components that can be used across browsers and frameworks.

> Please note that this module is in its early development

## Documentation

- [`Storybook`](https://holochain-open-dev.github.io/file-storage-module?path=/docs/hoduploadfiles--default) for elements documentation.
- [Here](/ui/docs/classes/filestorageservice.md) for documentation about the `FileStorageService`.

## Assumptions

- You have only one DNA in which you want to store the files in your happ (this will be changed in the future).

## Installation and usage

### Including the zome in your DNA

1. Create a new folder in the `zomes` of the consuming DNA, with the name `file_storage`.
2. Add a new `Cargo.toml` in that folder. In its content, paste the `Cargo.toml` content from any zome.
3. Change the `name` properties of the `Cargo.toml` file to `file_storage`.
4. Add this zome as a dependency in the `Cargo.toml` file:

```toml
[dependencies]
holochain_file_storage_zome = {git = "https://github.com/holochain-open-dev/file-storage", package = "holochain_file_storage_zome"}
```

1. Create a `src` folder besides the `Cargo.toml` with this content:

```rust
extern crate holochain_file_storage_zome;
```

1. Add the zome into your `dna.yaml` file, with the name `file_storage`.
- If you want to give the zome a different name you should also initialize the `FileStorageService` with it.
2. Compile the DNA with the usual `CARGO_TARGET=target cargo build --release --target wasm32-unknown-unknown`.

### Installing the UI module

1. Install the module with `npm install https://github.com/holochain-open-dev/file-storage#ui-build`.

2. Import and define the the elements you want to include:

```js
import ConductorApi from "@holochain/conductor-api";
import {
  UploadFiles,
  FileStorageService,
} from "@holochain-open-dev/file-storage";

async function setupFileStorage() {
  const appWebsocket = await ConductorApi.AppWebsocket.connect(
    "ws://localhost:8888"
  );

  const appInfo = await appWebsocket.appInfo({
    installed_app_id: "test-app",
  });
  const cellId = appInfo.cell_data[0].cell_id;

  const service = new FileStorageService(appWebsocket, cellId);

  customElements.define(
    "upload-files",
    class extends HodMyCalendar {
      get _fileStorageService() {
        return service;
      }
    }
  );
}
```

3. Include the elements in your html:

```html
<body>
  <upload-files> </upload-files>
</body>
```

Take into account that at this point the elements already expect a holochain conductor running at `ws://localhost:8888`.

You can see a full working example [here](/ui/demo/index.html).

## Developer setup

Visit the [developer setup](/dev-setup.md).