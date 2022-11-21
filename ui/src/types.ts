import { EntryHash } from "@holochain/client";

export interface FileMetadata {
  name: string;
  lastModifed: number;
  size: number;
  fileType: string;
  chunksHashes: Array<EntryHash>;
}
