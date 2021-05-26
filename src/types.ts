export interface FileMetadata {
  name: string;
  lastModifed: number;
  size: number;
  fileType: string;
  creatorPubKey: string;
  chunksHashes: Array<string>;
}

export const FILE_STORAGE_SERVICE_CONTEXT = 'hc_zome_file_storage/service';
