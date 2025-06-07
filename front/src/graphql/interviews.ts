import { gql } from "@apollo/client";

export const GET_INTERVIEWS = gql`
  query GetInterviews($type: String!) {
    interviews(type: $type) {
      id
      topic
      scheduledDateTime
      remindMeF
      remindMeC
      freelancer {
      id
        user {
          username
        }
      }
        client {
        id
        user {
          username
        }
      }
    }
  }
`;

export const CREATE_INTERVIEW = gql`
  mutation CreateInterview($input: CreateInterviewInput!) {
    createInterview(input: $input) {
      id
      topic
      scheduledDateTime
      remindMeF
      remindMeC
      freelancer {
      id
      }
        client {
        id
      }
    }
  }
`;


export const REMIND_ME_MUTATION = gql`
  mutation RemindMe($interviewId: String!) {
    remindMe(interviewId: $interviewId) {
      id
      remindMeC
      remindMeF
    }
  }
`;

