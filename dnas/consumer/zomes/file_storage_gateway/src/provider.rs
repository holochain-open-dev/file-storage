use std::fmt::Debug;

use hc_file_storage_types::FILE_STORAGE_PROVIDER_ZOME_NAME;
use hdk::prelude::*;

use crate::{err, provider_dna::get_file_storage_provider_dna, types::FileStorageRequest};

#[hdk_extern]
pub fn announce_as_provider(_: ()) -> ExternResult<()> {
    let path = providers_path();

    path.ensure()?;

    let agent_info = agent_info()?;

    create_link(
        path.path_entry_hash()?.into(),
        agent_info.agent_latest_pubkey.into(),
        HdkLinkType::Any,
        (),
    )?;

    // grant unrestricted access to accept_cap_claim so other agents can send us claims
    let mut functions: GrantedFunctions = BTreeSet::new();
    functions.insert((zome_info()?.name, "handle_file_storage_request".into()));

    create_cap_grant(CapGrantEntry {
        tag: "".into(),
        // empty access converts to unrestricted
        access: ().into(),
        functions,
    })?;

    Ok(())
}

pub fn get_all_providers() -> ExternResult<Vec<AgentPubKey>> {
    let links = get_links(providers_path().path_entry_hash()?.into(), None)?;

    let providers_pub_keys = links
        .into_iter()
        .map(|link| AgentPubKey::from(EntryHash::from(link.target.clone())))
        .collect();
    Ok(providers_pub_keys)
}

#[hdk_extern]
pub fn handle_file_storage_request(request: FileStorageRequest) -> ExternResult<ExternIO> {
    match request {
        FileStorageRequest::CreateFileChunk(file_chunk) => {
            bridged_call("create_file_chunk".into(), file_chunk)
        }
        FileStorageRequest::CreateFileMetadata(input) => {
            bridged_call("create_file_metadata".into(), input)
        }
        FileStorageRequest::GetFileChunk(entry_hash) => {
            bridged_call("get_file_chunk".into(), entry_hash)
        }
        FileStorageRequest::GetFileMetadata(entry_hash) => {
            bridged_call("get_file_metadata".into(), entry_hash)
        }
    }
}

/** Helpers */

fn providers_path() -> Path {
    Path::from("file_storage_providers")
}

fn bridged_call<I: Serialize + Debug>(fn_name: String, payload: I) -> ExternResult<ExternIO> {
    let provider_dna = get_file_storage_provider_dna()?;

    let cell_id = CellId::new(provider_dna, agent_info()?.agent_initial_pubkey);
    let response = call(
        CallTargetCell::Other(cell_id),
        FILE_STORAGE_PROVIDER_ZOME_NAME.into(),
        fn_name.into(),
        None,
        payload,
    )?;

    match response {
        ZomeCallResponse::Ok(bytes) => Ok(bytes),
        _ => Err(err("Failed to handle file storage request")),
    }
}
