let 
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/3baaa5f0f52d7bf0a9273c0b1570f9ec2b46d45b.tar.gz";
    sha256 = "08ixa0d5sja6q14qrv77ld6ihp6gklpl6sdxjkfl1b1dynixwgda";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";
    
    holochainVersion = { 
     rev = "785061ba232ff98ceb13fc245f7f2a62d3ecb582";
     sha256 = "12xx6s964pll7kgylp0wjlrxlbwqljx1lxr6ghv1x2qk3xh7v6bm";
     cargoSha256 = "19faydkxid1d2s0k4jks6y6plgchdhidcckacrcs841my6dvy131";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
    };
  };
in holonix.main
