import { Controller, Post, Get, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Mission, PaymentStatus } from '../mission/entities/mission.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { PaymentResponse } from './payment.types';
import { handleStripeError } from '../common/helpers/stripe.helper';


// DTOs for request bodies
export class CreateEscrowPaymentDto {
  missionId: number;
  clientId: number;
}

export class ReleaseMilestonePaymentDto {
  missionId: number;
  milestonePercentage: number;
}

export class ReleaseBatchMilestonesDto {
  missionId: number;
  milestones: number[];
}

export class RefundPaymentDto {
  missionId: number;
  reason: string;
}

// Response types
export interface CreateEscrowResponse {
  clientSecret: string | null;
  paymentIntentId: string;
  status?: string;
  readyForCapture?: boolean;
}

export interface ReleaseMilestoneResponse {
  success: boolean;
  amountReleased: number;
  milestone?: number;
}

export interface RefundResponse {
  success: boolean;
  refundId: string;
}

export interface PaymentStatusResponse {
  status: string;
  amount: number;
  currency: string;
  capturable: boolean;
}

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('escrow')
  async createEscrowPayment(@Body() createEscrowDto: CreateEscrowPaymentDto): Promise<CreateEscrowResponse> {
    try {
    return await this.paymentService.createEscrowPayment(
      createEscrowDto.missionId, 
      createEscrowDto.clientId
    );} catch (error) {
      console.error('Error creating escrow payment:', error);
      handleStripeError(error);

    }
  }

  @Post('milestone/release')
  async releaseMilestonePayment(@Body() releaseMilestoneDto: ReleaseMilestonePaymentDto): Promise<ReleaseMilestoneResponse> {
    try {
      const result = await this.paymentService.releaseMilestonePayment(
        releaseMilestoneDto.missionId,
        releaseMilestoneDto.milestonePercentage
      );
      return {
        ...result,
        milestone: releaseMilestoneDto.milestonePercentage
      };
    } catch (error) {
      console.error('Error releasing milestone payment:', error);
      handleStripeError(error);

    }
  }


  @Post('milestone/release-batch')
  async releaseBatchMilestones(@Body() releaseBatchDto: ReleaseBatchMilestonesDto): Promise<ReleaseMilestoneResponse[]> {
    const results: ReleaseMilestoneResponse[] = [];
    try{
      for (const milestone of releaseBatchDto.milestones) {
      const result = await this.paymentService.releaseMilestonePayment(
        releaseBatchDto.missionId, 
        milestone
      );
      results.push({
        ...result,
        milestone
      });
    }
    return results;} catch (error) {
      console.error('Error releasing batch milestones:', error);
      handleStripeError(error);
      
    }
  }

  @Post('refund')
  async refundPayment(@Body() refundDto: RefundPaymentDto): Promise<RefundResponse> {
    return await this.paymentService.refundPayment(
      refundDto.missionId, 
      refundDto.reason
    );
  }

  @Get('missions/status/:status')
  async getMissionsByPaymentStatus(@Param('status') status: PaymentStatus): Promise<Mission[]> {
    return await this.paymentService.getMissionsByPaymentStatus(status);
  }
  @Get('missions/:missionId')
  async getMissionById(@Param('missionId', ParseIntPipe) missionId: number): Promise<Mission> {

    return await this.paymentService.getMissionById(missionId);
  }

  @Get('history/:missionId')
  async getPaymentHistory(@Param('missionId', ParseIntPipe) missionId: number): Promise<Invoice[]> {
    return await this.paymentService.getPaymentHistory(missionId);
  }

  @Get('status/:paymentIntentId')
  async getPaymentStatus(@Param('paymentIntentId') paymentIntentId: string): Promise<PaymentStatusResponse> {
    try {
    return await this.paymentService.getPaymentIntentStatus(paymentIntentId);

  } catch (error) {
    console.error('Error getting payment status:', error);
    handleStripeError(error);
  }
}

  @Get('milestones/available/:missionId')
  async getAvailableMilestones(@Param('missionId', ParseIntPipe) missionId: number) {
   try{

   
    return {
      missionId,
      availableMilestones: [25, 50, 75, 100],
      releasedMilestones: [] // Track which milestones have been released
    };
    } catch (error) {
      console.error('Error getting available milestones:', error);
      handleStripeError(error);
    }
  }

  // In your PaymentController
@Post('confirm')
async confirmPayment(@Body() body: { paymentIntentId: string }): Promise<PaymentResponse> {
  try{
    return await this.paymentService.confirmPaymentIntent(body.paymentIntentId);
  } catch (error) {
    console.error('Error confirming payment:', error);
    handleStripeError(error);
  }
}

@Post('retry-setup')
async retryPaymentSetup(@Body() body: { missionId: number }): Promise<CreateEscrowResponse> {
  try{

  return await this.paymentService.retryPaymentSetup(body.missionId);
} catch (error) {
  console.error('Error retrying payment setup:', error);
  handleStripeError(error);
}
}
@Post('invoice')
async getInvoice(@Body() body): Promise<Invoice> {
  try {
    return await this.paymentService.generateInvoice(body.missionId, body.amount, body.description);
  } catch (error) {
    console.error('Error getting invoice:', error);
    handleStripeError(error);
  }
}}