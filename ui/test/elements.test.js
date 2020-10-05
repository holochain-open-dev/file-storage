import { html, fixture, expect } from '@open-wc/testing';

import { CalendarEventsModule } from '../dist';
import { setupApolloClient } from './mocks/setupApolloClient.js';

// TODO: actually write useful tests for your element
describe('HodCalendarEvent', () => {
  before(async () => {
    const client = await setupApolloClient();
    new CalendarEventsModule({ apolloClient: client }).install();
  });

  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture(html` <hod-calendar-event></hod-calendar-event> `);

    expect(el.title).to.equal('Hey there');
    expect(el._counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture(html` <hod-calendar-event></hod-calendar-event> `);
    el.shadowRoot.querySelector('button').click();

    expect(el._counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html`
      <hod-calendar-event title="attribute title"></hod-calendar-event>
    `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html` <hod-calendar-event></hod-calendar-event> `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
