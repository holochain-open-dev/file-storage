import { gql, ApolloClient, InMemoryCache } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';
import { expect } from '@open-wc/testing';
import { AppWebsocket } from '@holochain/conductor-api';
import { makeExecutableSchema } from '@graphql-tools/schema';

import {
  CREATE_CALENDAR_EVENT,
  calendarEventsTypeDefs,
  calendarEventsResolvers,
} from '../dist';
import { AppWebsocketMock } from './mocks/AppWebsocket.mock';
import { CalendarEventsMock } from './mocks/calendar-events.mock';

const rootTypeDef = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

const allTypeDefs = [rootTypeDef, calendarEventsTypeDefs];

export async function setupClient(url) {
  const dnaMock = new CalendarEventsMock();
  const appWebsocket = new AppWebsocketMock(dnaMock);

  const appInfo = await appWebsocket.appInfo({ app_id: 'test-app' });

  const cellId = appInfo.cell_data[0][0];

  const executableSchema = makeExecutableSchema({
    typeDefs: allTypeDefs,
    resolvers: [calendarEventsResolvers(appWebsocket, cellId)],
  });

  const schemaLink = new SchemaLink({ schema: executableSchema });

  return new ApolloClient({
    typeDefs: allTypeDefs,

    cache: new InMemoryCache(),
    link: schemaLink,
  });
}

describe('Apollo middleware', () => {
  it('create a calendar event and retrieve it works', async () => {
    const client = await setupClient('ws://localhost:8888');

    const calendarHash = await client.mutate({
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

    expect(result.length).to.equal(1);
    expect(result[0].id).to.equal(calendarHash);
    expect(result[0].title).to.equal('Event 1');
  });
});
