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
file_storage = {git = "https://github.com/holochain-open-dev/file-storage-module", package = "file_storage"}
```

- If you want to give the zome a different name you should also initialize the `FileStorageService` with it.

5. Create a `src` folder besides the `Cargo.toml` with this content:

```rust
extern crate file_storage;
```

6. Add the zome into your `*.dna.workdir/dna.json` file.
7. Compile the DNA with the usual `CARGO_TARGET=target cargo build --release --target wasm32-unknown-unknown`.

### Installing the UI module

```bash
npm install git://github.com/holochain-open-dev/file-storage-module.git#ui-build
```

Done! You can already use all the elements of this library. See our [`storybook`](https://holochain-open-dev.github.io/file-storage-module) for documentation on those.

## Developer setup

Visit the [developer setup](/dev-setup.md).