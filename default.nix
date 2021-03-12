let 
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/cdf1d199d5489ebc943b88e552507f1063e3e571.tar.gz";
    sha256 = "1b5pdlxj91syg1qqf42f49sxlq9qd3qnz7ccgdncjvhdfyricagh";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";
    
    holochainVersion = { 
    rev = "97bfc6c65a301f7abfa5f4efea5fc1a812b2a73e";
    sha256 = "1ajq5fhnwyxsplq1jcdshrikn56gm9nxm3zy2g4ka7v1h4qhk95y";
    cargoSha256 = "0qpz633chsi1x2nlmgqf9ar2w0dwg61gq9i0ycpx5m31jy535y5i";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
    };
  };
in holonix.main
