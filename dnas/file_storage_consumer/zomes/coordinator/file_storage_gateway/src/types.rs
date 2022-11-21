use std::fmt::Debug;

use hc_zome_file_storage_integrity::*;
use hdk::prelude::*;

#[derive(Serialize, Deserialize, Debug)]
pub enum FileStorageRequest {
    CreateFileChunk(FileChunk),
    GetFileChunk(EntryHash),
    CreateFileMetadata(FileMetadata),
    GetFileMetadata(EntryHash),
}
