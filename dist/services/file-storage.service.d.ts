import type { AppWebsocket, CellId } from '@holochain/conductor-api';
import { FileMetadata } from '../types';
export declare class FileStorageService {
    protected appWebsocket: AppWebsocket;
    protected cellId: CellId;
    protected zomeName: string;
    /**
     * @param appWebsocket connection to the holochain backend
     * @param cellId the cell to which to upload the file
     * @param zomeName the zome name of the file_storage zome in the given cell
     */
    constructor(appWebsocket: AppWebsocket, cellId: CellId, zomeName?: string);
    /**
     * Upload a file to the file_storage zome, splitting it into chunks
     *
     * @param file file to split and upload
     * @param chunkSize chunk size to split the file, default 256 KB
     */
    uploadFile(file: File, onProgress?: undefined | ((percentatgeProgress: number, bytesSent: number) => void), chunkSize?: number): Promise<string>;
    /**
     * Downloads the whole file with the given hash
     * @param fileHash
     */
    downloadFile(fileHash: string): Promise<File>;
    /**
     * Gets only the metadata of the file with the given hash
     * This is specially useful if you want to fetch the chunks one by one
     * @param fileHash the hash of the file
     */
    getFileMetadata(fileHash: string): Promise<FileMetadata>;
    /**
     * Fetch the chunk identified with the given hash
     * This is useful if used with the chunk hashes received with `getFileMetadata`
     * @param fileChunkHash
     */
    fetchChunk(fileChunkHash: string): Promise<Blob>;
    /** Private helpers */
    private _splitFile;
    private _createChunk;
    private _callZome;
}
