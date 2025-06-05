import { MissionLight } from "../types";
import api from "./axiosConfig";

// Types matching the backend responses
export interface CreateEscrowResponse {
  clientSecret: string | null;
  paymentIntentId: string;
}

export interface ReleaseMilestoneResponse {
  success: boolean;
  amountReleased: number;
}

export interface RefundResponse {
  success: boolean;
  refundId: string;
}

/*
export interface Mission {
  id: number;
  title: string;
  price: number;
  paymentStatus: string;
  paymentIntentId?: string;
  client: {
    id: number;
    firstName: string;
    lastName: string;
  };
  selectedFreelancer?: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
    stripeAccountId?: string;
  };
}
*/
export interface Invoice {
  id: number;
  amount: number;
  description: string;
  date: string;
  client: {
    firstName: string;
    lastName: string;
  };
  freelancer?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

// Payment API Service
export const paymentService = {
  // Create escrow payment
  createEscrowPayment: async (missionId: number, clientId: number): Promise<CreateEscrowResponse> => {
    const response = await api.post('/payment/escrow', {
      missionId,
      clientId
    });
    return response.data;
  },

  // Release milestone payment
  releaseMilestonePayment: async (missionId: number, milestonePercentage: number): Promise<ReleaseMilestoneResponse> => {
    const response = await api.post('/payment/milestone/release', {
      missionId,
      milestonePercentage
    });
    return response.data;
  },

  // Refund payment
  refundPayment: async (missionId: number, reason: string): Promise<RefundResponse> => {
    const response = await api.post('/payment/refund', {
      missionId,
      reason
    });
    return response.data;
  },

  // Get missions by payment status
  getMissionsByPaymentStatus: async (status: string): Promise<MissionLight[]> => {
    const response = await api.get(`/payment/missions/status/${status}`);
    return response.data;
  },

  // Get payment history for a mission
  getPaymentHistory: async (missionId: number): Promise<Invoice[]> => {
    const response = await api.get(`/payment/history/${missionId}`);
    return response.data;
  },
  getClientName: async (): Promise<string | null> => {
    const response = await api.get(`/user/getClientName`);
    return response.data.companyName || 'error';
  }
};