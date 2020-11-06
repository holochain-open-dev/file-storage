import { randomEntryHash } from 'holochain-ui-test-utils';

export class FileStorageMock {
  constructor() {
    this.metadata = {};
    this.chunks = {};
  }

  create_file_metadata(fileMetadata) {
    const newId = randomEntryHash();

    this.metadata[newId] = fileMetadata;

    return newId;
  }

  get_file_metadata(fileHash) {
    return this.metadata[fileHash];
  }

  create_file_chunk(fileChunk) {
    const newId = randomEntryHash();

    this.chunks[newId] = fileChunk;

    return newId;
  }

  get_file_chunk(fileChunkHash) {
    return this.chunks[fileChunkHash];
  }
}
