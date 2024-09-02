{ inputs, ... }:

{
  perSystem = { inputs', system, ... }: {
    packages.file_storage = inputs.hc-infra.outputs.lib.rustZome {
      inherit system;
      workspacePath = inputs.self.outPath;
      crateCargoToml = ./Cargo.toml;
    };
  };
}

