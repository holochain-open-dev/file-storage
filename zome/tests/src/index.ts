import { Orchestrator, Config } from "@holochain/tryorama";
import fs from 'fs';

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

  const file = fs.readFileSync("./src/example.txt");
  console.log(file)

  let fileHash = await conductor.call("alice", "file_storage", "create_file", {
    file,
  });
  t.ok(fileHash);

  await sleep(10);

  let fileResult: File = await conductor.call(
    "bobbo",
    "file_storage",
    "get_file",
    fileHash
  );
  let text = await fileResult.text();
  t.equal(text, "Hi!!!");
});

orchestrator.run();
