import { gql } from '@apollo/client/core';
import { expect } from '@open-wc/testing';

import { setupApolloClient } from './mocks/setupApolloClient';
import { CREATE_CALENDAR_EVENT } from '../dist';

// TODO: change mutations and tests to adapt to your graphql queries
describe('Apollo middleware', () => {
  it('create a calendar event and retrieve it', async () => {
    const client = await setupApolloClient();

    const createCalendarEvent = await client.mutate({
      mutation: CREATE_CALENDAR_EVENT,
      variables: {
        title: 'Event 1',
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + 10,
        location: null,
        invitees: [],
      },
    });

    const result = await client.query({
      query: gql`
        {
          allCalendarEvents {
            id
            title
          }
        }
      `,
    });

    expect(result.data.allCalendarEvents.length).to.equal(1);
    expect(result.data.allCalendarEvents[0].id).to.equal(
      createCalendarEvent.data.createCalendarEvent.id
    );
    expect(result.data.allCalendarEvents[0].title).to.equal('Event 1');
  });
});
