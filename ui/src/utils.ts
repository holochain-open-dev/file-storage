export type Timestamp = [number, number];

export function timestampToDate(timestamp: Timestamp): Date {
  const secs = timestamp[0];
  const nanosecs = timestamp[0];
  return new Date(secs * 1000 + Math.floor(nanosecs / 1000));
}

export function dateToTimestamp(date: Date): Timestamp {
  const secs = Math.floor(date.valueOf() / 1000);
  const nanosecs = (date.valueOf() % 1000) * 1000;
  return [secs, nanosecs];
}
