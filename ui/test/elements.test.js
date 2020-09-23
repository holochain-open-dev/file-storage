import { html, fixture, expect } from '@open-wc/testing';

import { HodCalendarEvent } from '../dist/hod-calendar-event.js';

window.customElements.define('hod-calendar-event', HodCalendarEvent);

describe('HodCalendarEvent', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture(html` <hod-calendar-event></hod-calendar-event> `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture(html` <hod-calendar-event></hod-calendar-event> `);
    el.shadowRoot.querySelector('button').click();

    expect(el.counter).to.equal(6);
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
