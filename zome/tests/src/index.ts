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

  let buffer = strToUtf16Bytes("hiiii");
  let file = {
    name: "example.txt",
    type: "text/plain",
    bytes: buffer,
    size: buffer.length,
    lastModified: Math.floor(Date.now() / 1000),
  };

  let fileHash = await conductor.call(
    "alice",
    "file_storage",
    "upload_file",
    file
  );
  t.ok(fileHash);

  await sleep(10);

  let fileResult = await conductor.call(
    "bobbo",
    "file_storage",
    "download_file",
    fileHash
  );

  console.log(fileResult)
});

orchestrator.run();
