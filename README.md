# calendar-events-zome

Small zome to create and see calendar events, in holochain RSM.

This module is designed to be included in other DNAs, assuming as little as possible from those. It is packaged as a holochain zome, and an npm package that offers native Web Components that can be used across browsers and frameworks.

## Documentation

See our [`storybook`](https://holochain-open-dev.github.io/calendar-events-zome).

## Assumptions

These are the things you need to know to decide if you can use this module in your happ:

- Zome:
  - Optional dependency with the [resource-bookings-zome](https://github/holochain-open-dev/resource-bookings-zome).
- UI module:
  - `ApolloClient` as the state-management and data-fetching engine.
  - The resolvers are declared in the frontend using [`makeExecutableSchema`](https://www.npmjs.com/package/@graphql-tools/schema).
  - No framework or library assumed.

## Installation and usage

### Including the zome in your DNA

You need to include this repository as a git submodule inside the `zomes/` folder of your application.

From the root folder of your DNA:

1. `git submodule add https://github.com/holochain-open-dev/calendar-events-zome zomes/calendar_events`.
2.
3. Modify the `Cargo.toml` and add `zomes/calendar_events` in the `[members]` array.
4. Add the `calendar_events` zome in the `dna.json` of your `<DNA_NAME>.dna.workdir`.
5. Compile the DNA with the usual `CARGO_TARGET=target cargo build --release --target wasm32-unknown-unknown `.

Now the submodule is added and linked with the code from this repository. In the future, whenever this repository is cloned, run `git submodule init` and `git submodule update`.

You can read more documentation on git submodules [here](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

### Using the UI module

1. Install the module with `npm install @holochain-open-dev/calendar-events`.
2. Add the GraphQl schema and resolvers to your `ApolloClient` setup:

```js
import { AppWebsocket } from "@holochain/conductor-api";
import {
  calendarEventsTypeDefs,
  calendarEventsResolvers,
} from "@holochain-open-dev/calendar-events";

export async function setupClient(url) {
  const appWebsocket = await AppWebsocket.connect(String(url));

  const appInfo = await appWebsocket.appInfo({ app_id: "test-app" });

  const cellId = appInfo.cell_data[0][0];

  const executableSchema = makeExecutableSchema({
    typeDefs: [rootTypeDef, calendarEventsTypeDefs],
    resolvers: [calendarEventsResolvers(appWebsocket, cellId)],
  });

  const schemaLink = new SchemaLink({ schema: executableSchema });

  return new ApolloClient({
    typeDefs: allTypeDefs,
    cache: new InMemoryCache(),
    link: schemaLink,
  });
}
```

3. In the root file of your application, install the module:

```js
import { CalendarEventsModule } from "@holochain-open-dev/calendar-events";
async function initApp() {
  const client = await setupClient(`ws://localhost:8888`);

  const calendarEventsModule = new CalendarEventsModule(client);

  await calendarEventsModule.install();
}
```

4. Once you have installed the module, all the elements you see in our storybook will become available for you to use in your HTML, like this:

```html
...
<body>
  <hod-cal-full-calendar></hod-cal-full-calendar>
</body>
```

Take into account that at this point the elements already expect a holochain conductor running at `ws://localhost:8888`.

## Developer setup

This respository is structured in the following way:

- Top level `src/` and `Cargo.toml` contains the code for the zome itself. This is to allow direct usage of the zome through git submodule.
- `ui/`: UI library.
- `example-dna/`: an example of a DNA that uses the zome. It contains a link to the zome code and its tryorama tests.

Read the [UI developer setup](/ui/README.md) and the [Zome developer setup](/example-dna/README.md).
