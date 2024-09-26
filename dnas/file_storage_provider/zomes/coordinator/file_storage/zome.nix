{ inputs, ... }:

{
  perSystem = { inputs', system, ... }: {
    packages.file_storage =
      inputs.hc-infra.outputs.builders.${system}.rustZome {
        workspacePath = inputs.self.outPath;
        crateCargoToml = ./Cargo.toml;
      };
  };
}

