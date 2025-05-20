{ inputs, ... }:

{
  perSystem = { inputs', config, pkgs, system, lib, options, ... }: {
    packages.file_storage_integrity = inputs.hc-infra.outputs.lib.rustZome {
      workspacePath = inputs.self.outPath;
      holochain = inputs'.holochain;
      crateCargoToml = ./Cargo.toml;
    };
  };
}

