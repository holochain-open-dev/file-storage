import { expect } from '@open-wc/testing';

import { AppWebsocketMock, DnaMock } from 'holochain-ui-test-utils';

// TODO: change mutations and tests to adapt to your graphql queries
describe('FileStorageService', () => {
  it('upload a file and retrieve it', async () => {
    const dnaMock = new DnaMock({
      file_storage: new 
    })
    const appWebsocket = new AppWebsocketMock();

    expect(result.data.allCalendarEvents.length).to.equal(1);
    expect(result.data.allCalendarEvents[0].id).to.equal(
      createCalendarEvent.data.createCalendarEvent.id
    );
    expect(result.data.allCalendarEvents[0].title).to.equal('Event 1');
  });
});
