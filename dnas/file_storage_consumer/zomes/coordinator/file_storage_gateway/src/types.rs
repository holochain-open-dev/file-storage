use std::fmt::Debug;

use hc_zome_file_storage_integrity::*;
use hdk::prelude::*;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ZomeFnInput<T> {
    pub input: T,
    pub local: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum FileStorageRequest {
    CreateFileChunk(FileChunk),
    GetFileChunk(ZomeFnInput<EntryHash>),
    CreateFileMetadata(FileMetadata),
    GetFileMetadata(ZomeFnInput<EntryHash>),
}
