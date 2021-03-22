use std::fmt::Debug;

use hdk::prelude::*;
use holochain_file_storage_types::{CreateFileMetadataInput, FileChunk};

#[derive(Clone, Serialize, Deserialize, Debug)]
pub enum FileStorageRequest {
    CreateFileChunk(FileChunk),
    GetFileChunk(EntryHash),
    CreateFileMetadata(CreateFileMetadataInput),
    GetFileMetadata(EntryHash),
}
