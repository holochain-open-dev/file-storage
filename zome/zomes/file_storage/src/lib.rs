use hdk3::prelude::*;

mod file_chunk;
mod file_metadata;
mod utils;

use file_chunk::FileChunk;
use file_metadata::FileMetadata;

pub fn error<T>(reason: &str) -> ExternResult<T> {
    Err(HdkError::Wasm(WasmError::Zome(String::from(reason))))
}

entry_defs![FileChunk::entry_def(), FileMetadata::entry_def()];

/** Files **/
#[derive(Clone, Serialize, Deserialize, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct File {
    pub name: String,
    pub last_modified: i64,
    pub size: usize,
    #[serde(rename(deserialize = "type"))]
    pub file_type: String,
    pub bytes: Vec<u8>,
}

#[hdk_extern]
pub fn upload_file(create_file_input: File) -> ExternResult<EntryHash> {
    file_metadata::upload_file(create_file_input)
}

#[hdk_extern]
pub fn download_file(file_hash: EntryHash) -> ExternResult<File> {
    file_metadata::download_file(file_hash)
}

#[hdk_extern]
pub fn get_file_metadata(file_hash: EntryHash) -> ExternResult<FileMetadata> {
    file_metadata::get_file_metadata(file_hash)
}

#[hdk_extern]
pub fn get_file_chunk(file_chunk_hash: EntryHash) -> ExternResult<FileChunk> {
    file_chunk::get_file_chunk(file_chunk_hash)
}
