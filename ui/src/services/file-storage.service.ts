import type { AppWebsocket, CellId, Hash } from '@holochain/conductor-api';
import { FileMetadata } from '../types';

export class FileStorageService {
  constructor(
    protected appWebsocket: AppWebsocket,
    protected cellId: CellId,
    protected zomeName: string = 'file_storage'
  ) {}

  async uploadFile(file: File): Promise<Hash> {
    const bytes = await file.arrayBuffer();

    const fileToUpload = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      bytes,
    };
    return this._callZome('upload_file', fileToUpload);
  }

  downloadFile(fileHash: Hash): Promise<File> {
    return this._callZome('download_file', fileHash);
  }

  async getFileMetadata(fileHash: Hash): Promise<FileMetadata> {
    return this._callZome('get_file_metadata', fileHash);
  }

  async fetchChunk(fileChunkHash: Hash): Promise<Blob> {
    return this._callZome('get_file_chunk', fileChunkHash);
  }

  /** Private helpers */

  _callZome(fnName: string, payload: any): Promise<any> {
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
