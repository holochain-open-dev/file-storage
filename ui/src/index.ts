import { HodFullCalendar } from './elements/hod-full-calendar';

export { calendarEventsTypeDefs } from './graphql/schema';
export { calendarEventsResolvers } from './graphql/resolvers';
export { CREATE_CALENDAR_EVENT } from './graphql/queries';

export function install() {
  customElements.define('hod-full-calendar', HodFullCalendar);
}
