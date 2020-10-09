import { Orchestrator, Config } from "@holochain/tryorama";

function ab2str(buf) {
  return String.fromCharCode.apply(null, Array.from(new Uint16Array(buf)));
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
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

  let arrayBuffer = str2ab("hiiii");
  let file = {
    name: "example.txt",
    type: "text/plain",
    bytes: arrayBuffer,
    size: arrayBuffer.byteLength,
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

  let fileResult: File = await conductor.call(
    "bobbo",
    "file_storage",
    "download_file",
    fileHash
  );
  let text = await fileResult.text();
  t.equal(text, "hiiii");
});

orchestrator.run();
