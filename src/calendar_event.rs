use crate::utils;
use hdk3::prelude::timestamp::Timestamp;
use hdk3::prelude::*;

#[derive(Clone, SerializedBytes, Serialize, Deserialize)]
pub enum EventLocation {
    Resource(EntryHash),
    Custom(String),
}

#[hdk_entry(id = "calendar_event", visibility = "public")]
#[derive(Clone)]
pub struct CalendarEvent {
    pub created_by: AgentPubKey,
    pub title: String,
    pub start_time: Timestamp,
    pub end_time: Timestamp,
    pub location: Option<EventLocation>,
    pub invitees: Vec<AgentPubKey>,
}

#[derive(Clone, Serialize, Deserialize, SerializedBytes)]
pub struct CreateCalendarEventInput {
    pub title: String,
    pub start_time: Timestamp,
    pub end_time: Timestamp,
    pub location: Option<EventLocation>,
    pub invitees: Vec<AgentPubKey>,
}
pub fn create_calendar_event(
    calendar_event_input: CreateCalendarEventInput,
) -> ExternResult<EntryHash> {
    let agent_info = agent_info!()?;

    let calendar_event = CalendarEvent {
        created_by: agent_info.agent_latest_pubkey,
        title: calendar_event_input.title,
        start_time: calendar_event_input.start_time,
        end_time: calendar_event_input.end_time,
        location: calendar_event_input.location,
        invitees: calendar_event_input.invitees,
    };

    create_entry!(calendar_event.clone())?;

    let calendar_event_hash = hash_entry!(calendar_event)?;

    let path = Path::from("calendar_events");

    path.ensure()?;

    create_link!(path.hash()?, calendar_event_hash.clone())?;

    Ok(calendar_event_hash)
}

pub fn get_all_calendar_events() -> ExternResult<Vec<(EntryHash, CalendarEvent)>> {
    let path = Path::from("calendar_events");

    let links = get_links!(path.hash()?)?;

    links
        .into_inner()
        .iter()
        .map(|link| utils::try_get_and_convert::<CalendarEvent>(link.target.clone()))
        .collect()
}
