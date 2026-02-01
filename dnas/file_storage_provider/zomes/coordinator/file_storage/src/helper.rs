use hdk::prelude::*;

/// Helper type to wrap zome function inputs with an optional `local` parameter.
/// When `local` is None or true, uses local get strategy.
/// When `local` is false, uses network get strategy.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ZomeFnInput<T> {
    pub input: T,
    pub local: Option<bool>,
}

impl<T> ZomeFnInput<T> {
    pub fn new(input: T, local: Option<bool>) -> Self {
        Self { input, local }
    }

    pub fn into_inner(self) -> T {
        self.input
    }

    pub fn get_strategy(&self) -> GetStrategy {
        let local = self.local.unwrap_or(true);
        match local {
            true => GetStrategy::Local,
            false => GetStrategy::Network,
        }
    }

    pub fn get_options(&self) -> GetOptions {
        let local = self.local.unwrap_or(true);
        match local {
            true => GetOptions::local(),
            false => GetOptions::network(),
        }
    }
}

impl<T> Into<GetStrategy> for ZomeFnInput<T> {
    fn into(self) -> GetStrategy {
        let local = self.local.unwrap_or(true);
        match local {
            true => GetStrategy::Local,
            false => GetStrategy::Network,
        }
    }
}

impl<T> Into<GetOptions> for ZomeFnInput<T> {
    fn into(self) -> GetOptions {
        let local = self.local.unwrap_or(true);
        match local {
            true => GetOptions::local(),
            false => GetOptions::network(),
        }
    }
}
