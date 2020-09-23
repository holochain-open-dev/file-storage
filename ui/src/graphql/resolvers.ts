import { Resolvers } from '@apollo/client/core';
import { AppWebsocket, CellId } from '@holochain/conductor-api';

export const calendarEventsResolvers = (
  appWebsocket: AppWebsocket,
  cellId: CellId
): Resolvers => ({
  Query: {
    async allCalendarEvents() {
      return appWebsocket.callZome({
        cap: null as any,
        cell_id: cellId,
        zome_name: 'calendar_events',
        fn_name: 'get_all_calendar_events',
        payload: null,
        provenance: cellId[1],
      });
    },
  },
});
