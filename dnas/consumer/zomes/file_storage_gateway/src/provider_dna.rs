use hdk::prelude::*;
use holo_hash::{DnaHash, DnaHashB64};

#[derive(Clone, Serialize, Deserialize, Debug, SerializedBytes)]
pub struct FileStorageProviderDnaProperties {
    file_storage_provider_dna: DnaHashB64,
}

pub fn get_file_storage_provider_dna() -> ExternResult<DnaHash> {
    let props: FileStorageProviderDnaProperties = dna_info()?.properties.try_into()?;

    Ok(props.file_storage_provider_dna.into())
}
