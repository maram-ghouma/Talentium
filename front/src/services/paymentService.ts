import { MissionLight } from "../types";
import api from "./axiosConfig";

// Types matching the backend responses
export interface CreateEscrowResponse {
  clientSecret: string | null;
  paymentIntentId: string;
  status?: string;
  readyForCapture?: boolean;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  paymentIntentId?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId: string;
}

export interface CheckoutResponse {
  sessionId: string;
  checkoutUrl: string;
}

export interface MilestoneResponse {
  success: boolean;
  amountReleased: number;
  milestone?: number;
}

export interface PaymentStatusResponse {
  status: string;
  amount: number;
  currency: string;
  capturable: boolean;
}

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

  // Check payment status before operations
  getPaymentStatus: async (paymentIntentId: string): Promise<PaymentStatusResponse> => {
    const response = await api.get(`/payment/status/${paymentIntentId}`);
    return response.data;
  },

  // Enhanced milestone release with status checking
  releaseMilestonePayment: async (missionId: number, milestonePercentage: number): Promise<MilestoneResponse> => {
    try {
      // First, get the mission to check payment status
      const mission = await paymentService.getMissionById(missionId);
      
      if (mission.paymentIntentId) {
        const paymentStatus = await paymentService.getPaymentStatus(mission.paymentIntentId);
        
        // Check if payment is in the right state
        if (!paymentStatus.capturable && paymentStatus.status !== 'requires_capture') {
          throw new Error(`Payment not ready for release. Current status: ${paymentStatus.status}. Please complete the payment first.`);
        }
      }

      const response = await api.post('/payment/milestone/release', {
        missionId,
        milestonePercentage
      });
      return response.data;
    } catch (error: any) {
      // Enhanced error handling
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Payment cannot be released';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Get mission details (you'll need to implement this endpoint)
  getMissionById: async (missionId: number): Promise<MissionLight> => {
    const response = await api.get(`/missions/${missionId}`);
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

  // Checkout methods
  async createEscrowCheckout(
    missionId: number, 
    clientId: number
  ): Promise<CheckoutResponse> {
    const response = await api.post(`/checkout/escrow/${missionId}/${clientId}`);
    return response.data;
  },
  
  async handleCheckoutSuccess(sessionId: string): Promise<PaymentResponse> {
    const response = await api.post('/checkout/success', {
      sessionId,
    });
    return response.data;
  },

  // Force payment confirmation (for stuck payments)
  async confirmPayment(paymentIntentId: string): Promise<PaymentResponse> {
    const response = await api.post('/payment/confirm', {
      paymentIntentId,
    });
    return response.data;
  },

  // Retry payment setup (for failed payments)
  async retryPaymentSetup(missionId: number): Promise<CreateEscrowResponse> {
    const response = await api.post('/payment/retry-setup', {
      missionId,
    });
    return response.data;
  },

  // Milestone methods
  async getAvailableMilestones(missionId: number) {
    const response = await api.get(`/payment/milestones/available/${missionId}`);
    return response.data;
  },

  async releaseBatchMilestones(
    missionId: number,
    milestones: number[]
  ): Promise<any> {
    const response = await api.post('/payment/milestone/release-batch', {
      missionId,
      milestones,
    });
    return response.data;
  },

  // Quick milestone release methods with enhanced error handling
  async release25Percent(missionId: number): Promise<MilestoneResponse> {
    return this.releaseMilestonePayment(missionId, 25);
  },

  async release50Percent(missionId: number): Promise<MilestoneResponse> {
    return this.releaseMilestonePayment(missionId, 50);
  },

  async release75Percent(missionId: number): Promise<MilestoneResponse> {
    return this.releaseMilestonePayment(missionId, 75);
  },

  async release100Percent(missionId: number): Promise<MilestoneResponse> {
    return this.releaseMilestonePayment(missionId, 100);
  },

  // Utility methods
  redirectToCheckout(checkoutUrl: string) {
    window.location.href = checkoutUrl;
  },

  // Helper to check if payment is ready for milestone release
  isPaymentReadyForRelease(paymentStatus: PaymentStatusResponse): boolean {
    return paymentStatus.capturable || paymentStatus.status === 'requires_capture';
  },

  // Helper to get user-friendly status messages
  getStatusMessage(status: string): string {
    const statusMessages: Record<string, string> = {
      'requires_payment_method': 'Payment method required - please complete checkout',
      'requires_confirmation': 'Payment confirmation required',
      'requires_capture': 'Payment ready for release',
      'succeeded': 'Payment completed',
      'canceled': 'Payment canceled',
      'requires_action': 'Additional action required'
    };
    return statusMessages[status] || `Payment status: ${status}`;
  }
};