use hc_file_storage_types::*;
use hdk::prelude::*;

pub fn create_file_chunk(file_chunk: FileChunk) -> ExternResult<EntryHash> {
    let file_chunk_hash = hash_entry(&file_chunk.clone())?;

    if let None = get(file_chunk_hash.clone(), GetOptions::default())? {
        create_entry(&file_chunk.clone())?;
    }

    Ok(file_chunk_hash)
}

pub fn get_file_chunk(file_chunk_hash: EntryHash) -> FileStorageResult<FileChunk> {
    let element =
        get(file_chunk_hash, GetOptions::default())?.ok_or(FileStorageError::EntryNotFound)?;

    let file_chunk: FileChunk = element
        .entry()
        .to_app_option()?
        .ok_or(FileStorageError::DeserializationError)?;

    Ok(file_chunk)
}
