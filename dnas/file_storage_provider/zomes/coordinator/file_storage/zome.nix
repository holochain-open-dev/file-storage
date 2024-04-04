{ inputs, rootPath, ... }:

{
  perSystem =
    { inputs'
    , ...
    }: {
      packages.file_storage_integrity = inputs.hcUtils.outputs.lib.rustZome {
        workspacePath = rootPath;
        holochain = inputs'.holochain;
        crateCargoToml = ./Cargo.toml;
      };
  	};
}


