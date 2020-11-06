import { Orchestrator, Config } from "@holochain/tryorama";

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

const orchestrator = new Orchestrator();

export const simpleConfig = {
  alice: Config.dna("../file_storage.dna.gz", null),
  bobbo: Config.dna("../file_storage.dna.gz", null),
};

orchestrator.registerScenario("create a file", async (s, t) => {
  const { conductor } = await s.players({
    conductor: Config.gen(simpleConfig),
  });
  await conductor.spawn();

  const chunkSize = 8 * 1024;
  const chunkNumer = 6;

  const bufStr = Array(chunkSize).fill("h").join("");
  let chunkBytes = Buffer.from(bufStr, "utf8");

  const chunksHashes: any[] = [];

  for (let i = 0; i < chunkNumer; i++) {
    const start = Date.now();

    const hash = await conductor.call(
      "alice",
      "file_storage",
      "create_file_chunk",
      Buffer.from(Array(chunkSize).fill(i).join(""))
    );
    const end = Date.now();
    console.log(chunkBytes.length);
    console.log((end - start) / 1000);

    chunksHashes.push(hash);
  }

  await sleep(3000);

  let fileMetadata = {
    name: "example.txt",
    fileType: "text/plain",
    chunksHashes,
    size: chunkSize * chunkNumer,
    lastModified: [Math.floor(Date.now() / 1000), 0],
  };
  let fileHash = await conductor.call(
    "alice",
    "file_storage",
    "create_file_metadata",
    fileMetadata
  );
  t.ok(fileHash);

  await sleep(100);

  let fileResult = await conductor.call(
    "bobbo",
    "file_storage",
    "get_file_metadata",
    fileHash
  );

  t.ok(fileResult);

  for (const chunkHash of fileResult.chunksHashes) {
    let chunk = await conductor.call(
      "alice",
      "file_storage",
      "get_file_chunk",
      chunkHash
    );
    t.ok(chunk);
    console.log(chunk);
  }
});

orchestrator.run();
