use hdk::prelude::*;
use holo_hash::EntryHashB64;
use holochain_file_storage_types::*;

use crate::{err, provider, types::FileStorageRequest};

#[hdk_extern]
pub fn create_file_chunk(create_chunk: FileChunk) -> ExternResult<EntryHashB64> {
    let result = make_file_storage_request("create_file_chunk".into(), create_chunk.try_into()?)?;

    Ok(decode(result.bytes())?)
}

#[hdk_extern]
pub fn create_file_metadata(
    create_file_metadata_input: CreateFileMetadataInput,
) -> ExternResult<EntryHashB64> {
    let result = make_file_storage_request(
        "create_file_chunk".into(),
        create_file_metadata_input.try_into()?,
    )?;

    Ok(decode(result.bytes())?)
}

#[hdk_extern]
pub fn get_file_metadata(file_hash: EntryHashB64) -> ExternResult<FileMetadata> {
    let result = make_file_storage_request(
        "get_file_metadata".into(),
        UnsafeBytes::from(encode(&file_hash)?).into(),
    )?;

    Ok(decode(result.bytes())?)
}

#[hdk_extern]
pub fn get_file_chunk(file_chunk_hash: EntryHashB64) -> ExternResult<FileChunk> {
    let result = make_file_storage_request(
        "get_file_chunk".into(),
        UnsafeBytes::from(encode(&file_chunk_hash)?).into(),
    )?;

    Ok(decode(result.bytes())?)
}

/** Functions */

fn make_file_storage_request(
    fn_name: String,
    payload: SerializedBytes,
) -> ExternResult<SerializedBytes> {
    let providers = provider::get_all_providers()?;
    let request = FileStorageRequest { fn_name, payload };

    for provider in providers {
        if let Ok(ZomeCallResponse::Ok(result)) = call_remote(
            provider,
            FILE_STORAGE_GATEWAY_ZOME_NAME.into(),
            "handle_file_storage_request".into(),
            None,
            request.clone(),
        ) {
            return Ok(UnsafeBytes::from(result.0).into());
        }
    }

    Err(err(
        "There are no file storage provider nodes able to handle the request",
    ))
}
