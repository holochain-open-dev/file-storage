import {
  EntryHashMap,
  ZomeMock,
  hash,
  HashType,
} from "@holochain-open-dev/utils";
import { HoloHash } from "@holochain/client";
import { FileMetadata } from "./types";

export class FileStorageZomeMock extends ZomeMock {
  metadata = new EntryHashMap();
  chunks = new EntryHashMap();

  create_file_metadata(fileMetadata: FileMetadata) {
    const newId = hash(fileMetadata, HashType.ENTRY);

    this.metadata.set(newId, fileMetadata);

    return newId;
  }

  get_file_metadata(fileHash: HoloHash) {
    return this.metadata.get(fileHash);
  }

  create_file_chunk(fileChunk: Uint8Array) {
    const newId = hash(fileChunk, HashType.ENTRY);

    this.chunks.set(newId, fileChunk);

    return newId;
  }

  get_file_chunk(fileChunkHash: HoloHash) {
    return this.chunks.get(fileChunkHash);
  }
}
