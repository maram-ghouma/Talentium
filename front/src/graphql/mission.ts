import { gql } from '@apollo/client';

export const CREATE_MISSION = gql`
  mutation CreateMission($createMissionInput: CreateMissionInput!) {
    createMission(createMissionInput: $createMissionInput) {
      id
      title
      description
      status
      price
      date
      requiredSkills
      deadline
      budget
      createdAt
      clientName
      progress
      tasks {
        total
        completed
      }
    }
  }
`;

export const GET_MISSIONS = gql`
  query GetMissions {
    missions {
      id
      title
      description
      status
      price
      date
      requiredSkills
      deadline
      budget
      createdAt
      clientName
      progress
      tasks {
        total
        completed
      }
    
    }
  }
`;

export const GET_MISSION = gql`
  query GetMission($id: Int!) {
    mission(id: $id) {
      id
      title
      description
      status
      price
      date
      requiredSkills
      deadline
      budget
      createdAt
      clientName
      progress
      tasks {
        total
        completed
      }
    }
  }
`;

export const UPDATE_MISSION = gql`
  mutation UpdateMission($updateMissionInput: UpdateMissionInput!) {
    updateMission(updateMissionInput: $updateMissionInput) {
      id
      title
      status
      progress
    }
  }
`;

export const REMOVE_MISSION = gql`
  mutation RemoveMission($id: Int!) {
    removeMission(id: $id)
  }
`;

