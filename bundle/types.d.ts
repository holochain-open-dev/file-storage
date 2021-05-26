export interface FileMetadata {
    name: string;
    lastModifed: number;
    size: number;
    fileType: string;
    creatorPubKey: string;
    chunksHashes: Array<string>;
}
