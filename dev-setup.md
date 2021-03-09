# Developer Setup

This respository is structured in the following way:

- `ui/`: UI library.
- `zome/`: example DNA with the `file_storage` code.
- Top level `Cargo.toml` is a virtual package necessary for other DNAs to include this zome by pointing to this git repository.

## Requirements

- Having the [nix-shell installed](https://developer.holochain.org/docs/install/#install-the-nix-package-manager).
  - Note that you don't have to execute `nix-shell https://holochain.love` as we are going to be building on a custom version of holochain.
- Enter the nix-shell on this folder with:

```bash
nix-shell .
```

This will take a long time the first time you do it. To verify you have `holochain` and `hc` correctly installed: 

```bash
holochain --version
```

Should give something like:

```bash
holochain 0.0.100
```

Read the [UI developer setup](/ui/README.md) and the [Zome developer setup](/zome/README.md). Run all the instructions there always from inside this nix-shell.
