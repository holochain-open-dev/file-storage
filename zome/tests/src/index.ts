import {
  Orchestrator,
  Config,
  InstallAgentsHapps,
  TransportConfigType,
  ProxyConfigType,
} from "@holochain/tryorama";
import { ScenarioApi } from "@holochain/tryorama/lib/api";
import path from "path";

const conductorConfig = Config.gen();

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
  "get_agent_pubkey test scenario",
  async (s: ScenarioApi, t) => {
    const [alice, bob] = await s.players([conductorConfig, conductorConfig]);
    const [alice_test_happ] = await alice.installAgentsHapps(conductorHapps);
    const ZOME_NAME = "file_storage";

    const res = await alice_test_happ[0].cells[0].call(
      ZOME_NAME,
      "get_agent_pubkey",
      null
    );
    t.ok(res);
  }
);

orchestrator.registerScenario(
  "create file test scenario",
  async (s: ScenarioApi, t) => {
    const [alice, bob] = await s.players([conductorConfig, conductorConfig]);
    const [alice_test_happ] = await alice.installAgentsHapps(conductorHapps);
    const ZOME_NAME = "file_storage";
    const conductor = alice_test_happ[0].cells[0];

    // In memory dummy file to upload to DNA
    const chunkSize = 8 * 1024;
    const chunkNumer = 6;
    const bufStr = Array(chunkSize).fill("h").join("");
    let chunkBytes = Buffer.from(bufStr, "utf8");
    const chunksHashes: any[] = [];

    ////////Upload each chunk as a file_chunk
    for (let i = 0; i < chunkNumer; i++) {
      const start = Date.now();
      const hash = await conductor.call(
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
    let fileHash = await conductor.call(
      ZOME_NAME,
      "create_file_metadata",
      fileMetadata
    );
    t.ok(fileHash);

    console.log("MetaData file Hashe:**********");
    console.log(fileMetadata);
    console.log("*********************");

    let fileResult = await conductor.call(
      ZOME_NAME,
      "get_file_metadata",
      fileHash
    );
    t.ok(fileResult);

    for (const chunkHash of fileResult.chunksHashes) {
      let chunk = await conductor.call(ZOME_NAME, "get_file_chunk", chunkHash);
      t.ok(chunk);
      console.log(chunk);
    }
  }
);

orchestrator.run();
