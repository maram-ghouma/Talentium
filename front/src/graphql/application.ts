import { gql } from "@apollo/client";



export const CREATE_APPLICATION = gql`
  mutation CreateApplication($createApplicationInput: CreateApplicationInput!) {
    createApplication(createApplicationInput: $createApplicationInput) {
      id
      message
      status
      createdAt
    }
  }
`;

export const GET_APPLICATIONS_BY_MISSION = gql`
  query GetApplicationsByMission($missionId: String!) {
    applicationsByMission(missionId: $missionId) {
      id
      message
      status
      createdAt
      resumePath
      freelancer {
        id
        name
        rating
        profilePictureUrl
      }
    }
  }
`;

export const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($id: String!, $updateApplicationInput: UpdateApplicationInput!) {
    updateApplication(id: $id, updateApplicationInput: $updateApplicationInput) {
      id
      status
    }
  }
`;