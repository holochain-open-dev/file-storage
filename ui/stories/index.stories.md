```js script
import { html } from '@open-wc/demoing-storybook';
import { withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';
import { CalendarEventsModule } from '../dist';
import { setupApolloClient } from '../test/mocks/setupApolloClient';

// TODO: change the name of the module and add any other dependencies needed
setupApolloClient().then(client =>
  new CalendarEventsModule({ apolloClient: client }).install()
);

// TODO: change the name of the story and element
export default {
  title: 'HodCalendarEvent',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    component: 'hod-calendar-event',
    options: { selectedPanel: 'storybookjs/knobs/panel' },
  },
};
```

# `<hod-calendar-event>`

> TODO: add brief explanation of what the element does

## Features

> TODO: add a list of features

## API

> TODO: change the name of the element
> <sb-props of="hod-create-calendar-event"></sb-props>

### Installation & Usage

> TODO: change instructions to fit your module

Please note that this custom element needs to be installed together with all the other elements of the `CalendarEventsModule`. Go to [https://github.com/holochain-open-dev/calendar-events-module](https://github.com/holochain-open-dev/calendar-events-module) for installation instructions.

After having installed the `CalendarEventsModule`, just add the element to your html:

```html
<body>
  <hod-calendar-event></hod-calendar-event>
</body>
```

### Variants

```js preview-story
// TODO: change name of the element
export const Default = () =>
  html`
    <div style="height: 200px; width: 300px; padding: 16px;">
      <hod-calendar-event></hod-calendar-event>
    </div>
  `;
```

> TODO: Add new variants of the element
