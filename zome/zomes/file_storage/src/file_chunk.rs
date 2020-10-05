use crate::utils;
use hdk3::prelude::*;

const CHUNK_SIZE: usize = 256 * 1024;

#[hdk_entry(id = "file_chunk", visibility = "public")]
#[derive(Clone)]
pub struct FileChunk(Vec<u8>);

pub fn create_file_chunk(bytes: Vec<u8>) -> ExternResult<EntryHash> {
    let file_chunk = FileChunk(bytes);

    let file_chunk_hash = hash_entry!(file_chunk.clone())?;

    create_entry!(file_chunk.clone())?;

    Ok(file_chunk_hash)
}

pub fn create_chunks_from_bytes(bytes: Vec<u8>) -> ExternResult<Vec<EntryHash>> {
    let chunks: Vec<Vec<u8>> = bytes
        .chunks(CHUNK_SIZE)
        .map(|bytes| Vec::from(bytes))
        .collect();

    chunks
        .into_iter()
        .map(|chunk_bytes| create_file_chunk(chunk_bytes))
        .collect()
}

pub fn get_bytes_from_chunks(chunks_hashes: Vec<EntryHash>) -> ExternResult<Vec<u8>> {
    let byte_chunks = chunks_hashes
        .into_iter()
        .map(|chunk_hash| {
            utils::try_get_and_convert::<FileChunk>(chunk_hash)
                .map(|file_chunk_with_address| (file_chunk_with_address.1).0)
        })
        .collect::<ExternResult<Vec<Vec<u8>>>>()?;

    Ok(byte_chunks.into_iter().fold(vec![], |mut acc, mut byte_chunk| {
        acc.append(&mut byte_chunk);
        acc
    }))
}
