use hdi::prelude::*;

#[hdk_entry_helper]
pub struct FileChunk(SerializedBytes);

#[hdk_entry_helper]
pub struct FileMetadata {
    pub name: String,
    pub last_modified: Timestamp,
    pub size: usize, // Size in bytes
    pub file_type: String,
    pub chunks_hashes: Vec<EntryHash>,
}

#[cfg(feature = "externs")]
#[hdk_entry_types]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
    FileMetadata(FileMetadata),
    FileChunk(FileChunk),
}
