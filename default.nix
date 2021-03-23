let 
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/3baaa5f0f52d7bf0a9273c0b1570f9ec2b46d45b.tar.gz";
    sha256 = "08ixa0d5sja6q14qrv77ld6ihp6gklpl6sdxjkfl1b1dynixwgda";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";
    
    holochainVersion = { 
     rev = "9a7219edf355a2028d38f1c1303dd5c9a76bd886";
     sha256 = "17ij6i4jw4lqqlrrfcsf33g8a12bmhfhyqy5yzz7y2i61y8sllx4";
     cargoSha256 = "19faydkxid1d2s0k4jks6y6plgchdhidcckacrcs841my6dvy131";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
    };
  };
in holonix.main
