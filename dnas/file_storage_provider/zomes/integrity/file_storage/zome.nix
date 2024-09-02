{ inputs, ... }:

{
  perSystem = { inputs', config, pkgs, system, lib, options, ... }: {
    packages.file_storage_integrity = inputs.hc-infra.outputs.lib.rustZome {
      inherit system;
      workspacePath = inputs.self.outPath;
      crateCargoToml = ./Cargo.toml;
    };
  };
}

