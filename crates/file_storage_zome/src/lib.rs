use hdk::prelude::*;
use holo_hash::EntryHashB64;
use holochain_file_storage_types::*;

mod file_chunk;
mod file_metadata;

entry_defs![FileChunk::entry_def(), FileMetadata::entry_def()];

/** Files **/

#[hdk_extern]
pub fn create_file_chunk(create_chunk: FileChunk) -> ExternResult<EntryHashB64> {
    let file_chunk_hash = file_chunk::create_file_chunk(create_chunk)?;

    Ok(EntryHashB64::from(file_chunk_hash))
}

#[hdk_extern]
pub fn create_file_metadata(
    create_file_metadata_input: CreateFileMetadataInput,
) -> ExternResult<EntryHashB64> {
    let file_metadata_hash = file_metadata::create_file_metadata(create_file_metadata_input)?;

    Ok(EntryHashB64::from(file_metadata_hash))
}

#[hdk_extern]
pub fn get_file_metadata(file_hash: EntryHashB64) -> ExternResult<FileMetadata> {
    Ok(file_metadata::get_file_metadata(file_hash.into())?)
}

#[hdk_extern]
pub fn get_file_chunk(file_chunk_hash: EntryHashB64) -> ExternResult<FileChunk> {
    Ok(file_chunk::get_file_chunk(file_chunk_hash.into())?)
}

#[hdk_extern]
pub fn get_agent_pubkey(_: ()) -> ExternResult<AgentPubKey> {
    let agent_info = agent_info()?;
    Ok(agent_info.agent_latest_pubkey)
}
