use hdk3::prelude::*;

mod calendar_event;
mod utils;

// TODO: Actually code the zome, all this code is just for reference and quick copy-paste

pub fn error<T>(reason: &str) -> ExternResult<T> {
    Err(HdkError::Wasm(WasmError::Zome(String::from(reason))))
}

entry_defs![
    Path::entry_def(),
    calendar_event::CalendarEvent::entry_def()
];

/** Calendar events **/

#[hdk_extern]
pub fn create_calendar_event(
    calendar_event_input: calendar_event::CreateCalendarEventInput,
) -> ExternResult<EntryHash> {
    calendar_event::create_calendar_event(calendar_event_input)
}

#[derive(Clone, Serialize, Deserialize, SerializedBytes)]
pub struct GetAllCalendarEventsOutput(Vec<(EntryHash, calendar_event::CalendarEvent)>);
#[hdk_extern]
pub fn get_all_calendar_events(_: ()) -> ExternResult<GetAllCalendarEventsOutput> {
    let calendar_events = calendar_event::get_all_calendar_events()?;

    Ok(GetAllCalendarEventsOutput(calendar_events))
}
