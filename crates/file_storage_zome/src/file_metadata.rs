use hc_file_storage_types::*;
use hdk::prelude::*;

pub fn create_file_metadata(
    file_metadata_input: CreateFileMetadataInput,
) -> ExternResult<EntryHash> {
    let agent_info = agent_info()?;

    let file_metadata = FileMetadata {
        name: file_metadata_input.name,
        last_modified: file_metadata_input.last_modified,
        creator_pub_key: agent_info.agent_latest_pubkey,
        size: file_metadata_input.size,
        file_type: file_metadata_input.file_type,
        chunks_hashes: file_metadata_input.chunks_hashes,
    };

    create_entry(&file_metadata.clone())?;

    let hash = hash_entry(&file_metadata)?;

    Ok(hash)
}

pub fn get_file_metadata(file_hash: EntryHash) -> FileStorageResult<FileMetadata> {
    let element =
        get(file_hash, GetOptions::default())?.ok_or(FileStorageError::EntryNotFound)?;

    let file_metadata: FileMetadata = element
        .entry()
        .to_app_option()?
        .ok_or(FileStorageError::DeserializationError)?;

    Ok(file_metadata)
}
