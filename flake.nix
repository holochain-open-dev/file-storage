{
  description = "Template for Holochain app development";

  inputs = {
    nixpkgs.follows = "holonix/nixpkgs";
    holonix.url = "github:holochain/holonix/main-0.3";
    hc-infra.url = "github:holochain-open-dev/infrastructure";
  };

  outputs = inputs@{ ... }:
    inputs.holonix.inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      # Import all `dnas/*/dna.nix` files
      imports = [
        ./dnas/file_storage_provider/zomes/integrity/file_storage/zome.nix
        ./dnas/file_storage_provider/zomes/coordinator/file_storage/zome.nix
      ];

      systems = builtins.attrNames inputs.holonix.devShells;
      perSystem = { inputs', config, pkgs, system, lib, ... }: {
        devShells.default = pkgs.mkShell {
          inputsFrom = [ inputs'.holonix.devShells.default ];
          packages = with pkgs; [ nodejs_20 ];
        };

        packages.scaffold = pkgs.symlinkJoin {
          name = "scaffold-remote-zome";
          paths = [ inputs'.hc-infra.packages.scaffold-remote-zome ];
          buildInputs = [ pkgs.makeWrapper ];
          postBuild = ''
            wrapProgram $out/bin/scaffold-remote-zome \
              --add-flags "file-storage \
                --integrity-zome-name file_storage_integrity \
                --coordinator-zome-name file_storage \
                --remote-zome-git-url github:holochain-open-dev/file-storage \
                --remote-zome-git-branch nixify \
                --remote-npm-package-name @holochain-open-dev/file-storage \
                --remote-npm-package-path ui"
          '';
        };

      };
    };
}
