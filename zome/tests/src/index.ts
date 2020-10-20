import { Orchestrator, Config } from "@holochain/tryorama";

function strToUtf16Bytes(str) {
  const bytes: Array<number> = [];
  for (let ii = 0; ii < str.length; ii++) {
    const code = str.charCodeAt(ii); // x00-xFFFF
    bytes.push(code & 255, code >> 8); // low, high
  }
  return bytes;
}

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

  const chunkSize = 256 * 1024;
  const chunkNumer = 10;

  let chunkBytes = strToUtf16Bytes(
    Array(chunkSize / 2)
      .fill("h")
      .join("")
  );

  let chunks = Array(chunkNumer).fill(chunkBytes);

  async function createChunk(bytes: number[]): Promise<string> {
    const start = Date.now();

    const hash = await conductor.call(
      "alice",
      "file_storage",
      "create_file_chunk",
      bytes
    );
    const end = Date.now();
    console.log((end - start) / 1000);
    return hash;
  }

  const chunksHashesPromises = chunks.map(createChunk);
  const chunksHashes = await Promise.all(chunksHashesPromises);

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
  }
});

orchestrator.run();
