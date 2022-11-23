use hc_zome_file_storage_integrity::*;
use hdk::prelude::*;

#[hdk_extern]
pub fn create_file_chunk(file_chunk: FileChunk) -> ExternResult<EntryHash> {
    let file_chunk_hash = hash_entry(&file_chunk)?;

    if let None = get(file_chunk_hash.clone(), GetOptions::default())? {
        create_entry(&EntryTypes::FileChunk(file_chunk))?;
    }

    Ok(file_chunk_hash)
}

#[hdk_extern]
pub fn create_file_metadata(file_metadata: FileMetadata) -> ExternResult<EntryHash> {
    let hash = hash_entry(&file_metadata)?;
    create_entry(&EntryTypes::FileMetadata(file_metadata))?;

    Ok(hash)
}

#[hdk_extern]
pub fn get_file_metadata(file_metadata_hash: EntryHash) -> ExternResult<FileMetadata> {
    let record = get(file_metadata_hash, GetOptions::default())?
        .ok_or(wasm_error!(WasmErrorInner::Guest("File not found".into())))?;

    let file_metadata: FileMetadata = record
        .entry()
        .to_app_option()
        .map_err(|e| wasm_error!(e))?
        .ok_or(wasm_error!(WasmErrorInner::Guest(
            "Malformed file chunk".into()
        )))?;

    Ok(file_metadata)
}

#[hdk_extern]
pub fn get_file_chunk(file_chunk_hash: EntryHash) -> ExternResult<FileChunk> {
    let record = get(file_chunk_hash, GetOptions::default())?
        .ok_or(wasm_error!(WasmErrorInner::Guest("File not found".into())))?;

    let file_chunk: FileChunk = record
        .entry()
        .to_app_option()
        .map_err(|e| wasm_error!(e))?
        .ok_or(wasm_error!(WasmErrorInner::Guest(
            "Malformed file chunk".into()
        )))?;

    Ok(file_chunk)
}
