function secondsToTimestamp(secs) {
    return [secs, 0];
}
function hashToString(hash) {
    return hash.hash_type.toString('hex') + hash.hash.toString('hex');
}
// TODO: define your own resolvers
export const calendarEventsResolvers = (appWebsocket, cellId, zomeName = 'calendar_events') => ({
    Query: {
        async allCalendarEvents() {
            const events = await appWebsocket.callZome({
                cap: null,
                cell_id: cellId,
                zome_name: zomeName,
                fn_name: 'get_all_calendar_events',
                payload: null,
                provenance: cellId[1],
            });
            return events.map((event) => ({
                id: hashToString(event[0]),
                ...event[1],
            }));
        },
    },
    Mutation: {
        async createCalendarEvent(_, { title, startTime, endTime, location, invitees }) {
            const eventId = await appWebsocket.callZome({
                cap: null,
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
//# sourceMappingURL=resolvers.js.map