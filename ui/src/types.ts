import { EntryHash } from "@holochain/client";

export interface FileMetadata {
  name: string;
  last_modifed: number;
  size: number;
  file_type: string;
  chunks_hashes: Array<EntryHash>;
}
