use hdk3::prelude::*;
use hdk3::prelude::timestamp::Timestamp;

mod file_metadata;
mod file_chunk;
mod utils;

pub fn error<T>(reason: &str) -> ExternResult<T> {
    Err(HdkError::Wasm(WasmError::Zome(String::from(reason))))
}

entry_defs![
    Path::entry_def(),
    file_chunk::FileChunk::entry_def(),
    file_metadata::FileMetadata::entry_def()
];

/** Files **/
#[derive(Clone, Serialize, Deserialize, SerializedBytes)]
pub struct File {
    pub file_name: String,
    pub last_modified: Timestamp,
    pub size: usize,
    pub document_type: String,
    pub bytes: Vec<u8>
}

#[hdk_extern]
pub fn create_file(
    create_file_input: File,
) -> ExternResult<EntryHash> {
    file_metadata::create_file(create_file_input)
}

#[hdk_extern]
pub fn get_file(file_hash: EntryHash) -> ExternResult<File> {
    file_metadata::get_file(file_hash)
}
