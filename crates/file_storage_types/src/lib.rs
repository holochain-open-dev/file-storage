use chrono::{serde::ts_milliseconds, DateTime, Utc};
use hdk::prelude::*;
use holo_hash::EntryHashB64;

mod error;
pub use error::*;

/** Entries **/

#[hdk_entry(id = "file_chunk", visibility = "public")]
#[derive(Clone)]
pub struct FileChunk(SerializedBytes);

#[hdk_entry(id = "file_metadata", visibility = "public")]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct FileMetadata {
    pub name: String,
    #[serde(with = "ts_milliseconds")]
    pub last_modified: DateTime<Utc>,
    pub creator_pub_key: AgentPubKey,
    pub size: usize, // Size in bytes
    pub file_type: String,
    pub chunks_hashes: Vec<EntryHashB64>,
}

/** I/O types **/

#[derive(Clone, Serialize, Deserialize, Debug, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct CreateFileMetadataInput {
    pub name: String,
    #[serde(with = "ts_milliseconds")]
    pub last_modified: DateTime<Utc>,
    pub size: usize,
    pub file_type: String,
    pub chunks_hashes: Vec<EntryHashB64>,
}

/** Zome names */
pub const FILE_STORAGE_PROVIDER_ZOME_NAME: &str = "file_storage_provider";
pub const FILE_STORAGE_GATEWAY_ZOME_NAME: &str = "file_storage_gateway";
