import { randomHash } from './utils';

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
