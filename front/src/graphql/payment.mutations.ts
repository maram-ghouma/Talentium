import { gql } from '@apollo/client';

export const CREATE_ESCROW_PAYMENT = gql`
  mutation CreateEscrowPayment($missionId: Int!, $clientId: Int!) {
    createEscrowPayment(missionId: $missionId, clientId: $clientId) {
      clientSecret
      paymentIntentId
    }
  }
`;

export const RELEASE_MILESTONE_PAYMENT = gql`
  mutation ReleaseMilestonePayment($missionId: Int!, $milestonePercentage: Int!) {
    releaseMilestonePayment(missionId: $missionId, milestonePercentage: $milestonePercentage) {
      success
      amountReleased
    }
  }
`;

export const REFUND_PAYMENT = gql`
  mutation RefundPayment($missionId: Int!, $reason: String!) {
    refundPayment(missionId: $missionId, reason: $reason) {
      success
      refundId
    }
  }
`;

export const GET_MISSIONS_BY_PAYMENT_STATUS = gql`
  query GetMissionsByPaymentStatus($status: PaymentStatus!) {
    getMissionsByPaymentStatus(status: $status) {
      id
      title
      price
      paymentStatus
      paymentIntentId
      client {
        id
        firstName
        lastName
      }
      selectedFreelancer {
        id
        user {
          firstName
          lastName
        }
        stripeAccountId
      }
    }
  }
`;

export const GET_PAYMENT_HISTORY = gql`
  query GetPaymentHistory($missionId: Int!) {
    getPaymentHistory(missionId: $missionId) {
      id
      amount
      description
      date
      client {
        firstName
        lastName
      }
      freelancer {
        user {
          firstName
          lastName
        }
      }
    }
  }
`;