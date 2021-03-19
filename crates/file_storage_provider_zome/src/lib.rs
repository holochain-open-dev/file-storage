extern crate holochain_file_storage_zome;
use hdk::prelude::*;
use holo_hash::DnaHashB64;

#[derive(Clone, Serialize, Deserialize, Debug, SerializedBytes)]
pub struct FileStorageProviderDnaProperties {
    provide_file_storage_for_dna: DnaHashB64,
}

#[hdk_extern]
fn init(_: ()) -> ExternResult<InitCallbackResult> {
    let zome_info = zome_info()?;

    let props: FileStorageProviderDnaProperties = zome_info.properties.try_into()?;

    let agent_info = agent_info()?;

    let to_cell = Some(CellId::new(
        props.provide_file_storage_for_dna.into(),
        agent_info.agent_initial_pubkey,
    ));

    let response = call(
        to_cell,
        "file_storage_gateway".into(),
        "announce_as_provider".into(),
        None,
        (),
    )?;

    match response {
        ZomeCallResponse::Ok(_) => Ok(InitCallbackResult::Pass),
        _ => Err(WasmError::Guest(
            "Failed to init the file_storage_provider".into(),
        )),
    }
}
