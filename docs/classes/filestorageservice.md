**[@holochain-open-dev/file-storage](../README.md)**

> [Globals](../globals.md) / FileStorageService

# Class: FileStorageService

## Hierarchy

* **FileStorageService**

## Index

### Constructors

* [constructor](filestorageservice.md#constructor)

### Methods

* [downloadFile](filestorageservice.md#downloadfile)
* [fetchChunk](filestorageservice.md#fetchchunk)
* [getFileMetadata](filestorageservice.md#getfilemetadata)
* [uploadFile](filestorageservice.md#uploadfile)

## Constructors

### constructor

\+ **new FileStorageService**(`appWebsocket`: AppWebsocket, `cellId`: CellId, `zomeName?`: string): [FileStorageService](filestorageservice.md)

*Defined in [services/file-storage.service.ts:5](https://github.com/holochain-open-dev/file-storage-module/blob/2366d1f/ui/src/services/file-storage.service.ts#L5)*

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`appWebsocket` | AppWebsocket | - | connection to the holochain backend |
`cellId` | CellId | - | the cell to which to upload the file |
`zomeName` | string | "file\_storage" | the zome name of the file_storage zome in the given cell  |

**Returns:** [FileStorageService](filestorageservice.md)

## Methods

### downloadFile

▸ **downloadFile**(`fileHash`: string): Promise\<File>

*Defined in [services/file-storage.service.ts:59](https://github.com/holochain-open-dev/file-storage-module/blob/2366d1f/ui/src/services/file-storage.service.ts#L59)*

Downloads the whole file with the given hash

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`fileHash` | string |   |

**Returns:** Promise\<File>

___

### fetchChunk

▸ **fetchChunk**(`fileChunkHash`: string): Promise\<Blob>

*Defined in [services/file-storage.service.ts:95](https://github.com/holochain-open-dev/file-storage-module/blob/2366d1f/ui/src/services/file-storage.service.ts#L95)*

Fetch the chunk identified with the given hash
This is useful if used with the chunk hashes received with `getFileMetadata`

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`fileChunkHash` | string |   |

**Returns:** Promise\<Blob>

___

### getFileMetadata

▸ **getFileMetadata**(`fileHash`: string): Promise\<[FileMetadata](../interfaces/filemetadata.md)>

*Defined in [services/file-storage.service.ts:81](https://github.com/holochain-open-dev/file-storage-module/blob/2366d1f/ui/src/services/file-storage.service.ts#L81)*

Gets only the metadata of the file with the given hash
This is specially useful if you want to fetch the chunks one by one

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`fileHash` | string | the hash of the file  |

**Returns:** Promise\<[FileMetadata](../interfaces/filemetadata.md)>

___

### uploadFile

▸ **uploadFile**(`file`: File, `onProgress?`: undefined \| (percentatgeProgress: number, bytesSent: number) => void, `chunkSize?`: number): Promise\<string>

*Defined in [services/file-storage.service.ts:23](https://github.com/holochain-open-dev/file-storage-module/blob/2366d1f/ui/src/services/file-storage.service.ts#L23)*

Upload a file to the file_storage zome, splitting it into chunks

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`file` | File | - | file to split and upload |
`onProgress` | undefined \| (percentatgeProgress: number, bytesSent: number) => void | undefined | - |
`chunkSize` | number | 10 * 1024 * 1024 | chunk size to split the file, default 256 KB  |

**Returns:** Promise\<string>
