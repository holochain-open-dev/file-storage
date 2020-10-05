import { gql } from '@apollo/client/core';

// TODO: create your own queries

export const CREATE_CALENDAR_EVENT = gql`
  mutation CreateCalendarEvent(
    $title: String!
    $startTime: Date!
    $endTime: Date!
    $location: String
    $invitees: [ID!]!
  ) {
    createCalendarEvent(
      title: $title
      startTime: $startTime
      endTime: $endTime
      location: $location
      invitees: $invitees
    ) {
      id
      title
      createdBy
      startTime
      endTime
      location
      invitees
    }
  }
`;
