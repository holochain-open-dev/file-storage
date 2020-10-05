use crate::{file_chunk, utils, File};
use hdk3::prelude::timestamp::Timestamp;
use hdk3::prelude::*;

#[hdk_entry(id = "file_metadata", visibility = "public")]
#[derive(Clone)]
pub struct FileMetadata {
    pub file_name: String,
    pub last_modified: Timestamp,
    pub owner_pub_key: AgentPubKey,
    pub size: usize, // Size in bytes
    pub document_type: String,
    pub chunks: Vec<EntryHash>,
}

pub fn create_file(create_file_input: File) -> ExternResult<EntryHash> {
    let agent_info = agent_info!()?;

    let chunks_hashes = file_chunk::create_chunks_from_bytes(create_file_input.bytes)?;

    let file_metadata = FileMetadata {
        owner_pub_key: agent_info.agent_latest_pubkey.clone(),
        file_name: create_file_input.file_name,
        last_modified: create_file_input.last_modified,
        size: create_file_input.size,
        document_type: create_file_input.document_type,
        chunks: chunks_hashes,
    };

    create_entry!(file_metadata.clone())?;

    let file_metadata_hash = hash_entry!(file_metadata)?;

    let path = Path::from(format!("{}.files", agent_info.agent_latest_pubkey));

    path.ensure()?;

    create_link!(path.hash()?, file_metadata_hash.clone())?;

    Ok(file_metadata_hash)
}

pub fn get_file(file_hash: EntryHash) -> ExternResult<File> {
    let (_, file_medatada) = utils::try_get_and_convert::<FileMetadata>(file_hash)?;

    let bytes = file_chunk::get_bytes_from_chunks(file_medatada.chunks)?;

    let file = File {
        file_name: file_medatada.file_name,
        last_modified: file_medatada.last_modified,
        size: file_medatada.size,
        document_type: file_medatada.document_type,
        bytes,
    };

    Ok(file)
}

/*
pub fn get_my_files() -> ExternResult<Vec<(EntryHash, CalendarEvent)>> {
    let path = Path::from("calendar_events");

    let links = get_links!(path.hash()?)?;

    links
        .into_inner()
        .iter()
        .map(|link| utils::try_get_and_convert::<CalendarEvent>(link.target.clone()))
        .collect()
}
 */
