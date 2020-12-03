use hc_utils::WrappedEntryHash;
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

#[hdk_extern]
pub fn create_file_chunk(create_chunk: FileChunk) -> ExternResult<WrappedEntryHash> {
    let file_chunk_hash = file_chunk::create_file_chunk(create_chunk)?;

    Ok(WrappedEntryHash(file_chunk_hash))
}

#[derive(Clone, Serialize, Deserialize, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct CreateFileMetadataInput {
    pub name: String,
    pub last_modified: timestamp::Timestamp,
    pub size: usize,
    pub file_type: String,
    pub chunks_hashes: Vec<WrappedEntryHash>,
}
#[hdk_extern]
pub fn create_file_metadata(
    create_file_metadata_input: CreateFileMetadataInput,
) -> ExternResult<WrappedEntryHash> {
    let file_metadata_hash = file_metadata::create_file_metadata(create_file_metadata_input)?;

    Ok(WrappedEntryHash(file_metadata_hash))
}

#[hdk_extern]
pub fn get_file_metadata(file_hash: WrappedEntryHash) -> ExternResult<FileMetadata> {
    file_metadata::get_file_metadata(file_hash.0)
}

#[hdk_extern]
pub fn get_file_chunk(file_chunk_hash: WrappedEntryHash) -> ExternResult<FileChunk> {
    file_chunk::get_file_chunk(file_chunk_hash.0)
}

#[hdk_extern]
pub fn get_agent_pubkey(_: ()) -> ExternResult<AgentPubKey> {
    let agent_info = agent_info()?;
    Ok(agent_info.agent_latest_pubkey)
}
