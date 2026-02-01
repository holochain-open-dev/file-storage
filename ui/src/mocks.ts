import {
  ZomeMock,
  hash,
  HashType,
} from "@holochain-open-dev/utils";
import { HoloHash, EntryHashMap } from "@holochain/client";
import { FileMetadata } from "./types";

export class FileStorageZomeMock extends ZomeMock {
  metadata = new EntryHashMap<FileMetadata>();
  chunks = new EntryHashMap<Uint8Array>();

  create_file_metadata(fileMetadata: FileMetadata) {
    const newId = hash(fileMetadata, HashType.ENTRY);

    this.metadata.set(newId, fileMetadata);

    return newId;
  }

  get_file_metadata(input: { input: HoloHash; local?: boolean }) {
    return this.metadata.get(input.input);
  }

  create_file_chunk(fileChunk: Uint8Array) {
    const newId = hash(fileChunk, HashType.ENTRY);

    this.chunks.set(newId, fileChunk);

    return newId;
  }

  get_file_chunk(input: { input: HoloHash; local?: boolean }) {
    return this.chunks.get(input.input);
  }
}
