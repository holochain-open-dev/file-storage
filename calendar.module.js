import { HodCalendarEvent } from './elements/hod-calendar-event';
import { calendarEventsTypeDefs } from './graphql/schema';
import { setupApolloClientElement } from './utils';
// TODO: add all your elements and dependencies
export class CalendarEventsModule {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.checkApolloClientTypeDefs(dependencies.apolloClient);
    }
    /** Public methods */
    install() {
        customElements.define('hod-calendar-event', setupApolloClientElement(HodCalendarEvent, this.dependencies.apolloClient));
    }
    static isInstalled() {
        return customElements.get('hod-calendar-event');
    }
    /** Private helpers */
    checkApolloClientTypeDefs(apolloClient) {
        if (!Array.isArray(apolloClient.typeDefs) ||
            !apolloClient.typeDefs.includes(calendarEventsTypeDefs))
            throw new Error('Error initializing Module: ApolloClient must be initialized using an array of typeDefs containing the calendarEventsTypeDefs');
    }
}
//# sourceMappingURL=calendar.module.js.map