import { Resolvers } from '@apollo/client/core';
import { AppWebsocket, CellId } from '@holochain/conductor-api';

function secondsToTimestamp(secs: number) {
  return [secs, 0];
}

function hashToString(hash: { hash: Buffer; hash_type: Buffer }) {
  return hash.hash_type.toString('hex') + hash.hash.toString('hex');
}

export const calendarEventsResolvers = (
  appWebsocket: AppWebsocket,
  cellId: CellId,
  zomeName = 'calendar_events'
): Resolvers => ({
  Query: {
    async allCalendarEvents() {
      const events = await appWebsocket.callZome({
        cap: null as any,
        cell_id: cellId,
        zome_name: zomeName,
        fn_name: 'get_all_calendar_events',
        payload: null,
        provenance: cellId[1],
      });

      return events.map((event: any) => ({
        id: hashToString(event[0]),
        ...event[1],
      }));
    },
  },
  Mutation: {
    async createCalendarEvent(
      _,
      { title, startTime, endTime, location, invitees }
    ) {
      const eventId = await appWebsocket.callZome({
        cap: null as any,
        cell_id: cellId,
        zome_name: zomeName,
        fn_name: 'create_calendar_event',
        payload: {
          title,
          start_time: secondsToTimestamp(startTime),
          end_time: secondsToTimestamp(endTime),
          location,
          invitees,
        },
        provenance: cellId[1],
      });

      return {
        id: hashToString(eventId),
        createdBy: hashToString(cellId[1]),
        title,
        startTime,
        endTime,
        invitees,
        location,
      };
    },
  },
});
