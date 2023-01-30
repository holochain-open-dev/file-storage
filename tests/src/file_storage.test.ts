//@ts-ignore
import test from "node:test";
//@ts-ignore
import assert from "node:assert";

import { runScenario, pause } from "@holochain/tryorama";
import {
  NewEntryAction,
  ActionHash,
  Record,
  DnaSource,
} from "@holochain/client";
import { decode } from "@msgpack/msgpack";

test(
  "create file in provider, read from consumer",
  { concurrency: 1 },
  async (t) => {
    await runScenario(async (scenario) => {
      // Construct proper paths for your app.
      // This assumes app bundle created by the `hc app pack` command.
      const providerApp =
        process.cwd() +
        "/../dnas/file_storage_provider/workdir/file-storage-test.happ";
      const consumerApp =
        process.cwd() +
        "/../dnas/file_storage_consumer/workdir/file-storage-test.happ";

      const [alice] = await scenario.addPlayersWithApps([
        { appBundleSource: { path: providerApp } },
      ]);
      const [bob] = await scenario.addPlayersWithApps([
        { appBundleSource: { path: consumerApp } },
      ]);
      // conductor of the scenario.
      await scenario.shareAllAgents();

      const ZOME_NAME = "file_storage_gateway";
      const [_, aliceConsumer] = Array.from(alice.namedCells.entries()).find(
        ([role_name, cell]) => role_name.includes("consumer")
      )!;
      const [__, aliceProvider] = Array.from(alice.namedCells.entries()).find(
        ([role_name, cell]) => role_name.includes("provider")
      )!;
      const [___, bobConsumer] = Array.from(bob.namedCells.entries()).find(
        ([role_name, cell]) => role_name.includes("consumer")
      )!;

      await aliceConsumer.callZome({
        zome_name: "file_storage_gateway",
        fn_name: "announce_as_provider",
        payload: null,
      });
      await pause(500000);

      // In memory dummy file to upload to DNA
      const chunkSize = 2 * 1024;
      const chunkNumer = 1;
      const bufStr = Array(chunkSize).fill("h").join("");
      let chunkBytes = Buffer.from(bufStr, "utf8");
      const chunksHashes: any[] = [];

      ////////Upload each chunk as a file_chunk
      for (let i = 0; i < chunkNumer; i++) {
        const start = Date.now();
        const hash = await bobConsumer.callZome({
          zome_name: ZOME_NAME,
          fn_name: "create_file_chunk",
          payload: Buffer.from(Array(chunkSize).fill(i).join("")),
        });
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
        file_type: "text/plain",
        chunks_hashes: chunksHashes,
        size: chunkSize * chunkNumer,
        last_modified: Date.now(),
      };
      let fileHash = await bobConsumer.callZome({
        zome_name: ZOME_NAME,
        fn_name: "create_file_metadata",
        payload: fileMetadata,
      });
      assert.ok(fileHash);

      await pause(1000);

      let fileResult: any = await aliceConsumer.callZome({
        zome_name: ZOME_NAME,
        fn_name: "get_file_metadata",
        payload: fileHash,
      });
      assert.ok(fileResult);

      for (const chunkHash of fileResult.chunks_hashes) {
        let chunk = await aliceConsumer.callZome({
          zome_name: ZOME_NAME,
          fn_name: "get_file_chunk",
          payload: chunkHash,
        });
        assert.ok(chunk);
        console.log(chunk);
      }
      /*
    await alice_player.shutdown();
    await alice_player.startup({});
    await pause(10000);
    */

      await pause(10000);

      fileResult = await bobConsumer.callZome({
        zome_name: ZOME_NAME,
        fn_name: "get_file_metadata",
        payload: fileHash,
      });
      assert.ok(fileResult);

      for (const chunkHash of fileResult.chunks_hashes) {
        let chunk = await bobConsumer.callZome({
          zome_name: ZOME_NAME,
          fn_name: "get_file_chunk",
          payload: chunkHash,
        });
        assert.ok(chunk);
        console.log(chunk);
      }
      await pause(3000);

      const [carol] = await scenario.addPlayersWithApps([
        { appBundleSource: { path: consumerApp } },
      ]);
      const [____, carolConsumer] = Array.from(carol.namedCells.entries()).find(
        ([role_name, cell]) => role_name.includes("consumer")
      )!;
      await scenario.shareAllAgents();
      await pause(3000);
      /* 
    await bob_player.shutdown();
    await pause(10000);
  
    await bob_player.startup({});
    await pause(30000); */

      fileResult = await carolConsumer.callZome({
        zome_name: ZOME_NAME,
        fn_name: "get_file_metadata",
        payload: fileHash,
      });
      assert.ok(fileResult);

      for (const chunkHash of fileResult.chunks_hashes) {
        let chunk = await carolConsumer.callZome({
          zome_name: ZOME_NAME,
          fn_name: "get_file_chunk",
          payload: chunkHash,
        });
        assert.ok(chunk);
        console.log(chunk);
      }
    });
  }
);
