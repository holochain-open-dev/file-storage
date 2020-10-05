import { html, fixture, expect, waitUntil } from '@open-wc/testing';

import { CalendarEventsModule } from '../dist';
import { setupApolloClient } from '../test/mocks/setupApolloClient';

describe('top-level workflows', () => {
  it('create calendar event and retrieve it', async () => {
    const client = await setupApolloClient();

    if (!CalendarEventsModule.isInstalled()) {
      new CalendarEventsModule({ apolloClient: client }).install();
    }

    const el = await fixture(
      html` <hod-calendar-event></hod-calendar-event>> `
    );

    /**
     * TODO: add appropriate checks
     */
  });
});
