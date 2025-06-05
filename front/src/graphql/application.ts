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
        user{
          username
          imageUrl
        }
      }
    }
  }
`;

export const GET_MY_APPLICATIONS_BY_MISSION = gql`
  query GetMyApplicationsByMission($missionId: String!) {
    myApplicationsByMission(missionId: $missionId) {
      id
      message
      status
      createdAt
      resumePath
    }
  }
`;


export const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($applicationId: ID!, $newStatus: ApplicationStatus!) {
    updateApplicationStatus(applicationId: $applicationId, newStatus: $newStatus) {
      id
      status
      mission {
        id
        selectedFreelancer {
          id
          user{
            username}
          }
          preselectedFreelancers {
            id
            user{
            username}
          }
      }
    }
  }
`;

export const GET_ALL_FREELANCERS = gql`
  query {
    getFreelancersWhoAppliedToMyMissions {
      id
      user {
        username
      }
    }
  }
`;