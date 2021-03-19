use hdk::prelude::{SerializedBytesError, WasmError};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum FileStorageError {
    #[error("Entry not found")]
    EntryNotFound,
    #[error("Failed to deserialize content")]
    DeserializationError,
    #[error(transparent)]
    Wasm(#[from] WasmError),
    #[error(transparent)]
    Serialization(#[from] SerializedBytesError),
}

pub type FileStorageResult<T> = Result<T, FileStorageError>;

impl From<FileStorageError> for WasmError  {
    fn from(error: FileStorageError) -> Self {
        WasmError::Guest(format!("{}", error))
    }
} 