use std::fmt::Debug;

use hdk::prelude::*;

use hc_zome_file_storage_gateway_integrity::*;

use crate::types::FileStorageRequest;

#[hdk_extern]
pub fn announce_as_provider(_: ()) -> ExternResult<()> {
    let path = providers_path();

    let agent_info = agent_info()?;

    create_link(
        path.path_entry_hash()?,
        agent_info.agent_latest_pubkey,
        LinkTypes::GatewayProviderAgent,
        (),
    )?;

    // grant unrestricted access to accept_cap_claim so other agents can send us claims
    let functions = GrantedFunctions::Listed(BTreeSet::from([(
        zome_info()?.name,
        FunctionName::from("handle_file_storage_request"),
    )]));

    create_cap_grant(CapGrantEntry {
        tag: "".into(),
        // empty access converts to unrestricted
        access: ().into(),
        functions,
    })?;

    Ok(())
}

pub fn get_all_providers() -> ExternResult<Vec<AgentPubKey>> {
    let links = get_links(GetLinksInputBuilder::new(
        providers_path().path_entry_hash()?,
        LinkTypes::GatewayProviderAgent,).build()
    )?;

    let providers_pub_keys = links
        .into_iter()
        .filter_map(|link| link.target.into_agent_pub_key())
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

pub const FILE_STORAGE_PROVIDER_ZOME_NAME: &'static str = "file_storage";
pub const FILE_STORAGE_PROVIDER_ROLE_ID: &'static str = "file_storage_provider";

fn bridged_call<I: Serialize + Debug>(fn_name: String, payload: I) -> ExternResult<ExternIO> {
    let response = call(
        CallTargetCell::OtherRole(FILE_STORAGE_PROVIDER_ROLE_ID.into()),
        ZomeName::from(String::from(FILE_STORAGE_PROVIDER_ZOME_NAME)),
        fn_name.into(),
        None,
        payload,
    )?;

    match response {
        ZomeCallResponse::Ok(bytes) => Ok(bytes),
        _ => Err(wasm_error!(WasmErrorInner::Guest(
            "Failed to handle file storage request".into()
        ))),
    }
}
