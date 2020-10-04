import { ApolloClient } from '@apollo/client/core';
import { HodCalendarEvent } from './elements/hod-calendar-event';

export { calendarEventsTypeDefs } from './graphql/schema';
export { calendarEventsResolvers } from './graphql/resolvers';
export { CREATE_CALENDAR_EVENT } from './graphql/queries';

export class CalendarEventsModule {
  constructor(protected dependencies: { apolloClient: ApolloClient<any> }) {}

  install() {
    customElements.define('hod-full-calendar', HodCalendarEvent);
  }

  static isInstalled(): boolean {
    return customElements.get('hod-full-calendar');
  }
}
