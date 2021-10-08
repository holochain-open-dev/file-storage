export class FileStorageService {
    /**
     * @param appWebsocket connection to the holochain backend
     * @param cellId the cell to which to upload the file
     * @param zomeName the zome name of the file_storage zome in the given cell
     */
    constructor(appWebsocket, cellId, zomeName = 'file_storage') {
        this.appWebsocket = appWebsocket;
        this.cellId = cellId;
        this.zomeName = zomeName;
    }
    /**
     * Upload a file to the file_storage zome, splitting it into chunks
     *
     * @param file file to split and upload
     * @param chunkSize chunk size to split the file, default 256 KB
     */
    async uploadFile(file, onProgress = undefined, chunkSize = 256 * 1024) {
        const blobs = this._splitFile(file, chunkSize);
        const numberOfChunks = blobs.length;
        const bytesPerChunk = blobs[0].size;
        const chunksHashes = [];
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
    async downloadFile(fileHash) {
        const metadata = await this.getFileMetadata(fileHash);
        const fetchChunksPromises = metadata.chunksHashes.map(hash => this.fetchChunk(hash));
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
    async getFileMetadata(fileHash) {
        return await this._callZome('get_file_metadata', fileHash);
    }
    /**
     * Fetch the chunk identified with the given hash
     * This is useful if used with the chunk hashes received with `getFileMetadata`
     * @param fileChunkHash
     */
    async fetchChunk(fileChunkHash) {
        const bytes = await this._callZome('get_file_chunk', fileChunkHash);
        return new Blob([new Uint8Array(bytes)]);
    }
    /** Private helpers */
    _splitFile(file, chunkSize) {
        let offset = 0;
        const chunks = [];
        while (file.size > offset) {
            const chunk = file.slice(offset, offset + chunkSize);
            offset += chunkSize;
            chunks.push(chunk);
        }
        return chunks;
    }
    async _createChunk(chunk) {
        const bytes = await chunk.arrayBuffer();
        return this._callZome('create_file_chunk', new Uint8Array(bytes));
    }
    _callZome(fnName, payload) {
        return this.appWebsocket.callZome({
            cap: null,
            cell_id: this.cellId,
            zome_name: this.zomeName,
            fn_name: fnName,
            payload: payload,
            provenance: this.cellId[1],
        });
    }
}
//# sourceMappingURL=file-storage.service.js.map