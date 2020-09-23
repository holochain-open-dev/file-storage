import { gql } from '@apollo/client/core';

export const calendarEventsTypeDefs = gql`
  scalar Date

  extend type Query {
    allCalendarEvents: [CalendarEvent!]!
  }

  type CalendarEvent {
    id: ID!
    title: String!
    startTime: Date!
    endTime: Date!
    createdBy: ID!
    location: String
    invitiees: [ID!]!
  }

  extend type Mutation {
    createCalendarEvent(
      title: String!
      startTime: Date!
      endTime: Date!
      location: String
      invitees: [ID!]!
    ): CalendarEvent!
  }
`;
