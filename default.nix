let 
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/3e94163765975f35f7d8ec509b33c3da52661bd1.tar.gz";
    sha256 = "07sl281r29ygh54dxys1qpjvlvmnh7iv1ppf79fbki96dj9ip7d2";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";
    
    holochainVersion = { 
     rev = "db248066989484297c15626684afd9c5c66d0071";
     sha256 = "1xpxk7w16q20053bsgpwjh3vaqpxjaj2ys9r9mpkbiwvvxqadjfr";
     cargoSha256 = "19faydkxid1d2s0k4jks6y6plgchdhsscckacrcs841my6dvy131";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
    };
  };
in holonix.main
