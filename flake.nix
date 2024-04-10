{
  description = "Template for Holochain app development";
  
  inputs = {
    nixpkgs.follows = "holochain/nixpkgs";

    versions.url = "github:holochain/holochain/holochain-0.3.0-beta-dev.42?dir=versions/weekly";

    holochain = {
      url = "github:holochain/holochain";
      inputs.versions.follows = "versions";
    };
		hcUtils.url = "github:holochain-open-dev/common";
  };

  outputs = inputs @ { ... }:
    inputs.holochain.inputs.flake-parts.lib.mkFlake
      {
        inherit inputs;
        specialArgs.rootPath = ./.;
      }
      {
        # Import all `dnas/*/dna.nix` files
        imports = [
          ./dnas/file_storage_provider/zomes/integrity/file_storage/zome.nix
          ./dnas/file_storage_provider/zomes/coordinator/file_storage/zome.nix
        ];

        systems = builtins.attrNames inputs.holochain.devShells;
        perSystem =
          { inputs'
          , config
          , pkgs
          , system
          , lib
          , ...
          }: {
            devShells.default = pkgs.mkShell {
              inputsFrom = [ inputs'.holochain.devShells.holonix ];
              packages = with pkgs; [
                nodejs_20
              ];
            };
          };
      };
}
