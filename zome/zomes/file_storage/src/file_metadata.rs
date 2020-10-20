use crate::{utils, CreateFileMetadataInput};
use hdk3::prelude::timestamp::Timestamp;
use hdk3::prelude::*;

#[hdk_entry(id = "file_metadata", visibility = "public")]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct FileMetadata {
    pub name: String,
    pub last_modified: Timestamp,
    pub creator_pub_key: AgentPubKey,
    pub size: usize, // Size in bytes
    pub file_type: String,
    pub chunks_hashes: Vec<EntryHash>,
}

pub fn create_file_metadata(
    file_metadata_input: CreateFileMetadataInput,
) -> ExternResult<EntryHash> {
    let agent_info = agent_info!()?;

    let file_metadata = FileMetadata {
        name: file_metadata_input.name,
        last_modified: file_metadata_input.last_modified,
        creator_pub_key: agent_info.agent_latest_pubkey,
        size: file_metadata_input.size,
        file_type: file_metadata_input.file_type,
        chunks_hashes: file_metadata_input.chunks_hashes,
    };

    create_entry!(file_metadata.clone())?;

    let hash = hash_entry!(file_metadata)?;

    Ok(hash)
}

pub fn get_file_metadata(file_hash: EntryHash) -> ExternResult<FileMetadata> {
    let file_metadata = utils::try_get_and_convert::<FileMetadata>(file_hash)?;

    Ok(file_metadata.1)
}
