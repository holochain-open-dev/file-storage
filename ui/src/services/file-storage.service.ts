import type { AppWebsocket, CellId } from '@holochain/conductor-api';
import { FileMetadata } from '../types';

export class FileStorageService {
  /**
   * @param appWebsocket connection to the holochain backend
   * @param cellId the cell to which to upload the file
   * @param zomeName the zome name of the file_storage zome in the given cell
   */
  constructor(
    protected appWebsocket: AppWebsocket,
    protected cellId: CellId,
    protected zomeName: string = 'file_storage'
  ) {}

  /**
   * Upload a file to the file_storage zome, splitting it into chunks
   *
   * @param file file to split and upload
   * @param chunkSize chunk size to split the file, default 256 KB
   */
  async uploadFile(
    file: File,
    onProgress:
      | undefined
      | ((percentatgeProgress: number, bytesSent: number) => void) = undefined,
    chunkSize: number = 256 * 1024
  ): Promise<string> {
    const blobs = this._splitFile(file, chunkSize);
    const numberOfChunks = blobs.length;
    const bytesPerChunk = blobs[0].size;

    const chunksHashes: Array<string> = [];
    for (let i = 0; i < blobs.length; i++) {
      const chunkHash = await this._createChunk(blobs[i]);
      chunksHashes.push(chunkHash);
      if (onProgress) {
        onProgress(((i + 1) * 1.0) / numberOfChunks, bytesPerChunk * (i + 1));
      }
    }

    const fileToCreate = {
      name: file.name,
      size: file.size,
      fileType: file.type,
      lastModified: file.lastModified,
      chunksHashes,
    };
    const hash = await this._callZome('create_file_metadata', fileToCreate);

    return hash;
  }

  /**
   * Downloads the whole file with the given hash
   * @param fileHash
   */
  async downloadFile(fileHash: string): Promise<File> {
    const metadata = await this.getFileMetadata(fileHash);

    const fetchChunksPromises = metadata.chunksHashes.map(hash =>
      this.fetchChunk(hash)
    );

    const chunks = await Promise.all(fetchChunksPromises);

    const file = new File(chunks, metadata.name, {
      lastModified: metadata.lastModifed,
      type: metadata.fileType,
    });

    return file;
  }

  /**
   * Gets only the metadata of the file with the given hash
   * This is specially useful if you want to fetch the chunks one by one
   * @param fileHash the hash of the file
   */
  async getFileMetadata(fileHash: string): Promise<FileMetadata> {
    return await this._callZome('get_file_metadata', fileHash);
  }

  /**
   * Fetch the chunk identified with the given hash
   * This is useful if used with the chunk hashes received with `getFileMetadata`
   * @param fileChunkHash
   */
  async fetchChunk(fileChunkHash: string): Promise<Blob> {
    const bytes = await this._callZome('get_file_chunk', fileChunkHash);

    return new Blob([new Uint8Array(bytes)]);
  }

  /** Private helpers */

  private _splitFile(file: File, chunkSize: number): Blob[] {
    let offset = 0;
    const chunks: Blob[] = [];

    while (file.size > offset) {
      const chunk = file.slice(offset, offset + chunkSize);
      offset += chunkSize;
      chunks.push(chunk);
    }

    return chunks;
  }

  private async _createChunk(chunk: Blob): Promise<string> {
    const bytes = await chunk.arrayBuffer();

    return this._callZome('create_file_chunk', new Uint8Array(bytes));
  }

  private _callZome(fnName: string, payload: any): Promise<any> {
    return this.appWebsocket.callZome({
      cap: null as any,
      cell_id: this.cellId,
      zome_name: this.zomeName,
      fn_name: fnName,
      payload: payload,
      provenance: this.cellId[1],
    });
  }
}
