use hdi::prelude::*;

#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
    Ok(ValidateCallbackResult::Valid)
}

#[hdk_link_types]
pub enum LinkTypes {
    GatewayProviderAgent,
}
