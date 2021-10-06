use hdk::prelude::*;

mod provider_dna;
mod provider;
mod requestor;
mod types;

pub fn err(reason: &str) -> WasmError {
    WasmError::Guest(String::from(reason))
}

entry_defs![Path::entry_def()];
