{ inputs, ... }:

{
  perSystem = { inputs', ... }: {
    packages.file_storage = inputs.hc-infra.outputs.lib.rustZome {
      workspacePath = inputs.self.outPath;
      holochain = inputs'.holochain;
      crateCargoToml = ./Cargo.toml;
    };
  };
}

