use hdk::prelude::*;
use holo_hash::DnaHashB64;
use holochain_file_storage_types::FILE_STORAGE_PROVIDER_ZOME_NAME;

use crate::{err, types::FileStorageRequest};

#[hdk_extern]
pub fn announce_as_provider(file_storage_dna_provider_cell_id: CellId) -> ExternResult<()> {
    let path = providers_path();

    path.ensure()?;

    let agent_info = agent_info()?;

    create_link(path.hash()?, agent_info.agent_latest_pubkey.into(), ())?;

    // grant unrestricted access to accept_cap_claim so other agents can send us claims
    let mut functions: GrantedFunctions = HashSet::new();
    functions.insert((zome_info()?.zome_name, "handle_file_storage_request".into()));

    let tag = format!(
        "{}",
        DnaHashB64::from(file_storage_dna_provider_cell_id.dna_hash().clone())
    );

    create_cap_grant(CapGrantEntry {
        tag,
        // empty access converts to unrestricted
        access: ().into(),
        functions,
    })?;

    Ok(())
}

pub fn get_all_providers() -> ExternResult<Vec<AgentPubKey>> {
    let links = get_links(providers_path().hash()?, None)?;

    let providers_pub_keys = links
        .into_inner()
        .into_iter()
        .map(|link| AgentPubKey::from(link.target.clone()))
        .collect();
    Ok(providers_pub_keys)
}

#[hdk_extern]
pub fn handle_file_storage_request(request: FileStorageRequest) -> ExternResult<SerializedBytes> {
    let cell_id = get_file_storage_provider_cell_id()?;

    let response = call(
        Some(cell_id),
        FILE_STORAGE_PROVIDER_ZOME_NAME.into(),
        request.fn_name.into(),
        None,
        request.payload,
    )?;

    match response {
        ZomeCallResponse::Ok(bytes) => Ok(UnsafeBytes::from(bytes.0).into()),
        _ => Err(err("Failed to handle file storage request")),
    }
}

/** Helpers */

fn providers_path() -> Path {
    Path::from("file_storage_providers")
}

fn get_file_storage_provider_cell_id() -> ExternResult<CellId> {
    let filter = ChainQueryFilter::new()
        .entry_type(EntryType::CapGrant)
        .include_entries(true);
    let elements = query(filter)?;

    let element = elements
        .first()
        .ok_or(err("This agent is not a file storage provider"))?;

    let cap_grant = element
        .entry()
        .to_grant_option()
        .ok_or(err("This agent is not a file storage provider"))?;

    let dna_hash = DnaHashB64::from_b64_str(cap_grant.tag.as_str())
        .or(Err(err("Could not convert CapGrantTag")))?;

    let agent_info = agent_info()?;

    Ok(CellId::new(
        dna_hash.into(),
        agent_info.agent_initial_pubkey,
    ))
}
