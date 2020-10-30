use crate::utils;
use hdk3::prelude::*;

#[hdk_entry(id = "file_chunk", visibility = "public")]
#[derive(Clone)]
pub struct FileChunk(SerializedBytes);

pub fn create_file_chunk(file_chunk: FileChunk) -> ExternResult<EntryHash> {
    let file_chunk_hash = hash_entry!(file_chunk.clone())?;

    if let None = get!(file_chunk_hash.clone())? {
        create_entry!(file_chunk.clone())?;
    }

    Ok(file_chunk_hash)
}

pub fn get_file_chunk(file_chunk_hash: EntryHash) -> ExternResult<FileChunk> {
    let file_chunk = utils::try_get_and_convert::<FileChunk>(file_chunk_hash)?;

    Ok(file_chunk.1)
}
