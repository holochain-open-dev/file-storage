use crate::{file_chunk, utils, File};
use hdk3::prelude::timestamp::Timestamp;
use hdk3::prelude::*;

#[hdk_entry(id = "file_metadata", visibility = "public")]
#[derive(Clone)]
pub struct FileMetadata {
    pub name: String,
    pub last_modified: Timestamp,
    pub creator_pub_key: AgentPubKey,
    pub size: usize, // Size in bytes
    pub file_type: String,
    pub chunks: Vec<EntryHash>,
}

pub fn upload_file(create_file_input: File) -> ExternResult<EntryHash> {
    let agent_info = agent_info!()?;

    let chunks_hashes = file_chunk::create_chunks_from_bytes(create_file_input.bytes)?;

    let file_metadata = FileMetadata {
        creator_pub_key: agent_info.agent_latest_pubkey.clone(),
        name: create_file_input.name,
        last_modified: Timestamp(create_file_input.last_modified, 0),
        size: create_file_input.size,
        file_type: create_file_input.file_type,
        chunks: chunks_hashes,
    };

    create_entry!(file_metadata.clone())?;

    let file_metadata_hash = hash_entry!(file_metadata)?;

    Ok(file_metadata_hash)
}

pub fn get_file_metadata(file_hash: EntryHash) -> ExternResult<FileMetadata> {
    utils::try_get_and_convert::<FileMetadata>(file_hash).map(|file_metadata| file_metadata.1)
}

pub fn download_file(file_hash: EntryHash) -> ExternResult<File> {
    let file_medatada = get_file_metadata(file_hash)?;

    let bytes = file_chunk::get_bytes_from_chunks(file_medatada.chunks)?;

    let file = File {
        name: file_medatada.name,
        last_modified: file_medatada.last_modified.0,
        size: file_medatada.size,
        file_type: file_medatada.file_type,
        bytes,
    };

    Ok(file)
}
