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
pub struct CreateChunkInput(pub Vec<u8>);
#[hdk_extern]
pub fn create_file_chunk(create_chunk_input: CreateChunkInput) -> ExternResult<EntryHash> {
    file_chunk::create_file_chunk(create_chunk_input.0)
}

#[derive(Clone, Serialize, Deserialize, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct CreateFileMetadataInput {
    pub name: String,
    pub last_modified: timestamp::Timestamp,
    pub size: usize,
    pub file_type: String,
    pub chunks_hashes: Vec<EntryHash>,
}
#[hdk_extern]
pub fn create_file_metadata(create_file_metadata_input: CreateFileMetadataInput) -> ExternResult<EntryHash> {
    file_metadata::create_file_metadata(create_file_metadata_input)
}

#[hdk_extern]
pub fn get_file_metadata(file_hash: EntryHash) -> ExternResult<FileMetadata> {
    file_metadata::get_file_metadata(file_hash)
}

#[hdk_extern]
pub fn get_file_chunk(file_chunk_hash: EntryHash) -> ExternResult<FileChunk> {
    file_chunk::get_file_chunk(file_chunk_hash)
}
