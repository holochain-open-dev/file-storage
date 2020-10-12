import { randomHash } from 'holochain-ui-test-utils';

// TODO: change the functions of this class to match the functions that your zome has
export class FileStorageMock {
  constructor() {
    this.uploadedFiles = {};
  }

  create_calendar_event(calendarInput) {
    const newId = randomHash();
    this.calendarEvents.push([
      newId,
      {
        ...calendarInput,
        created_by: randomHash(),
      },
    ]);

    return newId;
  }

  get_all_calendar_events() {
    return this.calendarEvents;
  }
}
