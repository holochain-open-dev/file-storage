import { gql, ApolloClient, InMemoryCache } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { AppWebsocket } from '@holochain/conductor-api';

import { calendarEventsTypeDefs, calendarEventsResolvers } from '../../dist';
import { AppWebsocketMock } from './AppWebsocket.mock';
import { CalendarEventsMock } from './calendar-events.mock';

const rootTypeDef = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

// TODO: add your own typeDefs to rootTypeDef
const allTypeDefs = [rootTypeDef, calendarEventsTypeDefs];

async function getAppWebsocket() {
  if (process.env.CONDUCTOR_URL) return AppWebsocket.connect(process.env.CONDUCTOR_URL);
  else {
    const dnaMock = new CalendarEventsMock();
    return new AppWebsocketMock(dnaMock);
  }
}

/**
 * If process.env.CONDUCTOR_URL is undefined, it will mock the backend
 * If process.env.CONDUCTOR_URL is defined, it will try to connect to holochain at that URL
 */
export async function setupApolloClient() {
  const appWebsocket = await getAppWebsocket();

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
