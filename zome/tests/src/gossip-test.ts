import {
  Orchestrator,
  Config,
  InstallAgentsHapps,
  TransportConfigType,
  ProxyConfigType,
} from "@holochain/tryorama";
import { ScenarioApi } from "@holochain/tryorama/lib/api";
import path from "path";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms));

const network = {
  transport_pool: [
    {
      type: TransportConfigType.Proxy,
      sub_transport: { type: TransportConfigType.Quic },
      proxy_config: {
        type: ProxyConfigType.RemoteProxyClient,
        proxy_url:
          "kitsune-proxy://CIW6PxKxsPPlcuvUCbMcKwUpaMSmB7kLD8xyyj4mqcw/kitsune-quic/h/proxy.holochain.org/p/5778/--",
      },
    },
  ],
  bootstrap_service: "https://bootstrap.holo.host",
};

const conductorConfig = Config.gen({
  network,
});

const conductorHapps: InstallAgentsHapps = [
  // agent 0 ...
  [
    // happ 0
    [
      // dna 0
      path.join("../file_storage.dna.gz"),
    ],
  ],
];

const orchestrator = new Orchestrator();

orchestrator.registerScenario(
  "testing file gossip",
  async (s: ScenarioApi, t) => {
    const [alice_player, bob_player, carol_player] = await s.players(
      [conductorConfig, conductorConfig, conductorConfig],
      false
    );
    await alice_player.startup({});
    await bob_player.startup({});
    const [alice_happ] = await alice_player.installAgentsHapps(conductorHapps);
    const [bob_happ] = await bob_player.installAgentsHapps(conductorHapps);

    const ZOME_NAME = "file_storage";
    const alice = alice_happ[0].cells[0];
    const bob = bob_happ[0].cells[0];

    // In memory dummy file to upload to DNA
    const chunkSize = 8 * 1024;
    const chunkNumer = 1;
    const bufStr = Array(chunkSize).fill("h").join("");
    let chunkBytes = Buffer.from(bufStr, "utf8");
    const chunksHashes: any[] = [];

    ////////Upload each chunk as a file_chunk
    for (let i = 0; i < chunkNumer; i++) {
      const start = Date.now();
      const hash = await alice.call(
        ZOME_NAME,
        "create_file_chunk",
        Buffer.from(Array(chunkSize).fill(i).join(""))
      );
      const end = Date.now();
      console.log(chunkBytes.length);
      console.log((end - start) / 1000);
      chunksHashes.push(hash);
    }
    console.log("File Hashes:**********");
    console.log(chunksHashes);
    console.log("*********************");

    /////// Upload file Metadata to DNA
    let fileMetadata = {
      name: "example.txt",
      fileType: "text/plain",
      chunksHashes,
      size: chunkSize * chunkNumer,
      lastModified: [Math.floor(Date.now() / 1000), 0],
    };
    let fileHash = await alice.call(
      ZOME_NAME,
      "create_file_metadata",
      fileMetadata
    );
    t.ok(fileHash);

    await sleep(60000);

    let fileResult = await bob.call(ZOME_NAME, "get_file_metadata", fileHash);
    t.ok(fileResult);

    for (const chunkHash of fileResult.chunksHashes) {
      let chunk = await bob.call(ZOME_NAME, "get_file_chunk", chunkHash);
      t.ok(chunk);
      console.log(chunk);
    }
    /*
    await alice_player.shutdown();
    await alice_player.startup({});
    await sleep(10000);
    */

    await alice_player.shutdown();
    await sleep(10000);

    fileResult = await bob.call(ZOME_NAME, "get_file_metadata", fileHash);
    t.ok(fileResult);

    for (const chunkHash of fileResult.chunksHashes) {
      let chunk = await bob.call(ZOME_NAME, "get_file_chunk", chunkHash);
      t.ok(chunk);
      console.log(chunk);
    }
    await sleep(10000);

    await carol_player.startup({});
    const [carol_happ] = await carol_player.installAgentsHapps(conductorHapps);
    const carol = carol_happ[0].cells[0];

    await sleep(10000);
    /* 
    await bob_player.shutdown();
    await sleep(10000);
  
    await bob_player.startup({});
    await sleep(30000); */

    fileResult = await carol.call(ZOME_NAME, "get_file_metadata", fileHash);
    t.ok(fileResult);

    for (const chunkHash of fileResult.chunksHashes) {
      let chunk = await carol.call(ZOME_NAME, "get_file_chunk", chunkHash);
      t.ok(chunk);
      console.log(chunk);
    }
  }
);

orchestrator.run();
