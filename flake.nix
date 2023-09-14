{
  description = "Template for Holochain app development";
  
  inputs = {
    nixpkgs.follows = "holochain/nixpkgs";

    versions.url = "github:holochain/holochain?dir=versions/0_2";

    versions.inputs.holochain.url = "github:holochain/holochain/holochain-0.2.2";
    versions.inputs.lair.url = "github:holochain/lair/lair_keystore-v0.3.0";

    holochain = {
      url = "github:holochain/holochain";
      inputs.versions.follows = "versions";
    };
  };

  outputs = inputs @ { ... }:
    inputs.holochain.inputs.flake-parts.lib.mkFlake
      {
        inherit inputs;
      }
      {
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
              packages = [
                pkgs.nodejs-18_x
                # more packages go here
                pkgs.cargo-nextest
              ];

              shellHook = ''
                unset CARGO_TARGET_DIR
                unset CARGO_HOME
              '';
            };
          };
      };
}
