import { gql } from '@apollo/client/core';

// TODO: define your own schema

export const calendarEventsTypeDefs = gql`
  scalar Date

  type CalendarEvent {
    id: ID!
    title: String!
    startTime: Date!
    endTime: Date!
    createdBy: ID!
    location: String
    invitees: [ID!]!
  }

  extend type Query {
    allCalendarEvents: [CalendarEvent!]!
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
