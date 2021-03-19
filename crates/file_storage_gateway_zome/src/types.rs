use hdk::prelude::*;

#[derive(Clone, Serialize, Deserialize, Debug, SerializedBytes)]
pub struct FileStorageRequest {
    pub fn_name: String,
    pub payload: SerializedBytes,
}
