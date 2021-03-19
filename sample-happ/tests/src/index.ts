import {
  Orchestrator,
  Config,
  InstallAgentsHapps,
  TransportConfigType,
  ProxyConfigType,
  NetworkType,
  InstallHapp,
} from "@holochain/tryorama";
import { ScenarioApi } from "@holochain/tryorama/lib/api";
import path from "path";
import { InstallAppRequest } from "@holochain/conductor-api";
import { Base64 } from "js-base64";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms));

const network = {
  transport_pool: [
    {
      type: TransportConfigType.Quic,
    },
  ],
  bootstrap_service: "https://bootstrap-staging.holo.host",
  network_type: NetworkType.QuicBootstrap,
};

const conductorConfig = Config.gen({
  network,
});

const consumerNode: InstallAgentsHapps = [
  // agent 0 ...
  [
    // happ 0
    [
      // dna 0
      path.join("../dnas/consumer/workdir/file_storage_gateway-test.dna"),
    ],
  ],
];

const orchestrator = new Orchestrator();

export function deserializeHash(hash) {
    return Base64.toUint8Array(hash.slice(1));
}
export function serializeHash(hash) {
    return `u${Base64.fromUint8Array(hash, true)}`;
}

orchestrator.registerScenario(
  "testing file gossip",
  async (s: ScenarioApi, t) => {
    const [alice_player, bob_player, carol_player] = await s.players(
      [conductorConfig, conductorConfig, conductorConfig],
      false
    );
    await alice_player.startup({});
    await bob_player.startup({});
    const [alice_happ] = await alice_player.installAgentsHapps(consumerNode);

    const gatewayDnaHash = await bob_player.registerDna({
      path: path.join("../dnas/consumer/workdir/file_storage_gateway-test.dna"),
    });
    const providerDnaHash = await bob_player.registerDna({
      path: path.join(
        "../dnas/provider/workdir/file_storage_provider-test.dna"
      ),
    });

    const req: InstallAppRequest = {
      installed_app_id: `my_app:1234`, // my_app with some unique installed id value
      agent_key: await bob_player.adminWs().generateAgentPubKey(),
      dnas: [
        {
          hash: gatewayDnaHash,
          nick: `gateway`,
          properties: undefined,
          membrane_proof: undefined,
        },
        {
          hash: providerDnaHash,
          nick: `provider`,
          properties: {
            provide_file_storage_for_dna: serializeHash(gatewayDnaHash),
          },
          membrane_proof: undefined,
        },
      ],
    };
    const installedHapp = await bob_player._installHapp(req);

    await sleep(10000);

    const ZOME_NAME = "file_storage_gateway";
    const alice = alice_happ[0].cells[0];
    const bob = installedHapp.cells[0];

    // In memory dummy file to upload to DNA
    const chunkSize = 2 * 1024 * 1024;
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
    await sleep(3000);

    await carol_player.startup({});
    const [carol_happ] = await carol_player.installAgentsHapps(consumerNode);
    const carol = carol_happ[0].cells[0];

    await sleep(3000);
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
