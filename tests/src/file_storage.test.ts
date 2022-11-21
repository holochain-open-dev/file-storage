import test from 'node:test';
import assert from 'node:assert';

import { runScenario, pause } from '@holochain/tryorama';
import { NewEntryAction, ActionHash, Record, DnaSource } from '@holochain/client';
import { decode } from '@msgpack/msgpack';

test('create file in provider, read from consumer', { concurrency: 1 }, async t => {
  await runScenario(async scenario => {

    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const providerDnaPath = process.cwd() + '/' + "../dnas/provider/workdir/provider.dna";
    const consumerDnaPath = process.cwd() + '/' + "../dnas/consumer/workdir/consumer.dna";

    const [bob, carol] = await scenario.addPlayersWithHapps([[{ path: consumerDnaPath }], [{ path: consumerDnaPath }]]);

    const [alice] = await scenario.addPlayersWithHapps([[{ path: consumerDnaPath }, { path: providerDnaPath }]]);
    // conductor of the scenario.
    await scenario.shareAllAgents();

    const ZOME_NAME = "file_storage_gateway";
    const aliceConsumer = alice.cells.find((c) =>
      c.role_id.includes("consumer")
    )!;
    const aliceProvider = alice.cells.find((c) =>
      c.role_id.includes("provider")
    )!;
    const bobConsumer = bob.cells.find((c) =>
      c.role_id.includes("consumer")
    )!;
    const carolConsumer = carol.cells.find((c) =>
      c.role_id.includes("consumer")
    )!;

    await carol.conductor.shutDown();

    await aliceConsumer.callZome({
      zome_name: "file_storage_gateway",
      fn_name: "announce_as_provider", payload: null
    });
    await pause(10000);

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
        payload: Buffer.from(Array(chunkSize).fill(i).join(""))
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
      fileType: "text/plain",
      chunksHashes,
      size: chunkSize * chunkNumer,
      lastModified: Date.now(),
    };
    let fileHash = await bobConsumer.callZome({
      zome_name: ZOME_NAME,
      fn_name: "create_file_metadata",
      payload: fileMetadata
    });
    assert.ok(fileHash);

    await pause(1000);

    let fileResult: any = await aliceConsumer.callZome({
      zome_name: ZOME_NAME,
      fn_name: "get_file_metadata",
      payload: fileHash
    });
    assert.ok(fileResult);

    for (const chunkHash of fileResult.chunksHashes) {
      let chunk = await aliceConsumer.callZome({
        zome_name: ZOME_NAME, fn_name: "get_file_chunk", payload: chunkHash
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
      zome_name: ZOME_NAME, fn_name: "get_file_metadata", payload: fileHash
    });
    assert.ok(fileResult);

    for (const chunkHash of fileResult.chunksHashes) {
      let chunk = await bobConsumer.callZome({
        zome_name: ZOME_NAME, fn_name: "get_file_chunk", payload: chunkHash
      });
      assert.ok(chunk);
      console.log(chunk);
    }
    await pause(3000);

    await carol.conductor.startUp();

    await pause(3000);
    /* 
    await bob_player.shutdown();
    await pause(10000);
  
    await bob_player.startup({});
    await pause(30000); */

    fileResult = await carolConsumer.callZome({
      zome_name: ZOME_NAME, fn_name: "get_file_metadata", payload: fileHash
    });
    assert.ok(fileResult);

    for (const chunkHash of fileResult.chunksHashes) {
      let chunk = await carolConsumer.callZome({ zome_name: ZOME_NAME, fn_name: "get_file_chunk", payload: chunkHash });
      assert.ok(chunk);
      console.log(chunk);
    }
  })
});

