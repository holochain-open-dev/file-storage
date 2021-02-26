# This is an example of what downstream consumers of holonix should do
# This is also used to dogfood as many commands as possible for holonix
# For example the release process for holonix uses this file
let

 # point this to your local config.nix file for this project
 # example.config.nix shows and documents a lot of the options
 config = import ./config.nix;

 # START HOLONIX IMPORT BOILERPLATE
 holonix = import (
  if ! config.holonix.use-github
  then config.holonix.local.path
  else fetchTarball {
   url = "https://github.com/${config.holonix.github.owner}/${config.holonix.github.repo}/tarball/${config.holonix.github.ref}";
   sha256 = config.holonix.github.sha256;
  }
 ) { 
   config = config;

   holochainVersionId = "custom";
   
   holochainVersion = { 
    rev = "4e1de9c2209a44c67839b9682ad4c9179a96f6c8";  
    sha256 = "1yqndz2mdmncy5a2j9h3xcabxf62yhr1hdhjdwyghpd42asl8hmr";  
    cargoSha256 = "1ja1h1717jvvgmxghy4al9qbn5kk007914cislp7gzbn1x2kzbz7";
   };
 };
 # END HOLONIX IMPORT BOILERPLATE

in
with holonix.pkgs;
{
 dev-shell = stdenv.mkDerivation (holonix.shell // {
  name = "dev-shell";

  buildInputs = [ ]
   ++ holonix.shell.buildInputs
   ++ config.buildInputs
  ;
 });
}
