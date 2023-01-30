import type {
  AppAgentCallZomeRequest,
  AppAgentClient,
} from "@holochain/client";
import { EntryHash } from "@holochain/client";
import { FileMetadata } from "./types";

export class FileStorageClient {
  /**
   * @param client connection to the holochain backend
   * @param roleName
   * @param zomeName the zome name of the file_storage zome in the given cell
   */
  constructor(
    public client: AppAgentClient,
    public roleName: string,
    public zomeName: string = "file_storage"
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
  ): Promise<EntryHash> {
    const blobs = this._splitFile(file, chunkSize);
    const numberOfChunks = blobs.length;
    const bytesPerChunk = blobs[0].size;

    const chunksHashes: Array<EntryHash> = [];
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
      file_type: file.type,
      last_modified: file.lastModified,
      chunks_hashes: chunksHashes,
    };
    const hash = await this._callZome("create_file_metadata", fileToCreate);

    return hash;
  }

  /**
   * Downloads the whole file with the given hash
   * @param fileHash
   */
  async downloadFile(fileHash: EntryHash): Promise<File> {
    const metadata = await this.getFileMetadata(fileHash);

    const fetchChunksPromises = metadata.chunks_hashes.map((hash) =>
      this.fetchChunk(hash)
    );

    const chunks = await Promise.all(fetchChunksPromises);

    const file = new File(chunks, metadata.name, {
      lastModified: metadata.last_modifed,
      type: metadata.file_type,
    });

    return file;
  }

  /**
   * Gets only the metadata of the file with the given hash
   * This is specially useful if you want to fetch the chunks one by one
   * @param fileHash the hash of the file
   */
  async getFileMetadata(fileHash: EntryHash): Promise<FileMetadata> {
    return await this._callZome("get_file_metadata", fileHash);
  }

  /**
   * Fetch the chunk identified with the given hash
   * This is useful if used with the chunk hashes received with `getFileMetadata`
   * @param fileChunkHash
   */
  async fetchChunk(fileChunkHash: EntryHash): Promise<Blob> {
    const bytes = await this._callZome("get_file_chunk", fileChunkHash);

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

  private async _createChunk(chunk: Blob): Promise<EntryHash> {
    const bytes = await chunk.arrayBuffer();

    return this._callZome("create_file_chunk", new Uint8Array(bytes));
  }

  private _callZome(fn_name: string, payload: any) {
    const req: AppAgentCallZomeRequest = {
      role_name: this.roleName,
      zome_name: this.zomeName,
      fn_name,
      payload,
    };
    return this.client.callZome(req);
  }
}
