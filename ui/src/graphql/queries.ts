import { gql } from '@apollo/client/core';

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
    )
  }
`;
