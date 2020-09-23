import { randomHash } from './utils';

export class CalendarEventsMock {
  constructor() {
    this.calendarEvents = {};
  }

  create_calendar_event(calendarInput) {
    const newId = randomHash();
    this.calendarEvents[newId] = {
      ...calendarInput,
      created_by: randomHash(),
    };

    return newId;
  }

  get_all_calendar_events() {
    return Object.keys(this.calendarEvents).map(id => [
      id,
      this.calendarEvents[id],
    ]);
  }
}
