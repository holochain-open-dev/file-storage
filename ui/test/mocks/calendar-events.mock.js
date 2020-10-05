import { randomHash } from './utils';

// TODO: change the functions of this class to match the functions that your zome has
export class CalendarEventsMock {
  constructor() {
    this.calendarEvents = [];
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
