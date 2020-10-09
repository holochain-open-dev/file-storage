import { Hash } from '@holochain/conductor-api';

export interface FileMetadata extends File {
  creator_pub_key: string;
  chunks: Array<Hash>;
}