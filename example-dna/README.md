# Zome Developer Setup

This folder has an example DNA for the `calendar_events` zome. It has symbolic links to the source code of the zome, which sits on the root folder of the repository to be able to include it in other DNAs with `git submodules`.

To change the code, you can work either opening VSCode inside the root folder of the repo or in this folder, you should have rust intellisense either way.

## Requirements

- Have [`holochain-run-dna`](https://www.npmjs.com/package/@holochain-open-dev/holochain-run-dna) installed globally.
- Have the DNA built.
- Run all the steps described in this README.md inside the `nix-shell` of the `holochain` core repository, after having run `cargo install --path crates/holochain` in that `nix-shell`.

## Building

```bash
CARGO_TARGET=target cargo build --release --target wasm32-unknown-unknown
dna-util -c example-dna.dna.workdir/
```

## Testing

After having built the DNA:

```bash
cd test
npm install
npm test
```

## Running

After having built the DNA:

```bash
holochain-run-dna example-dna.dna.gz
```

Now `holochain` will be listening at port `8888`;

Restart the command if it fails (flaky holochain start).
