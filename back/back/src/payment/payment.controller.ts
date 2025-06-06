import { Controller, Post, Get, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Mission, PaymentStatus } from '../mission/entities/mission.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { PaymentResponse } from './payment.types';

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
    return await this.paymentService.createEscrowPayment(
      createEscrowDto.missionId, 
      createEscrowDto.clientId
    );
  }

  @Post('milestone/release')
  async releaseMilestonePayment(@Body() releaseMilestoneDto: ReleaseMilestonePaymentDto): Promise<ReleaseMilestoneResponse> {
    const result = await this.paymentService.releaseMilestonePayment(
      releaseMilestoneDto.missionId, 
      releaseMilestoneDto.milestonePercentage
    );
    return {
      ...result,
      milestone: releaseMilestoneDto.milestonePercentage
    };
  }

  @Post('milestone/release-batch')
  async releaseBatchMilestones(@Body() releaseBatchDto: ReleaseBatchMilestonesDto): Promise<ReleaseMilestoneResponse[]> {
    const results: ReleaseMilestoneResponse[] = [];
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
    return results;
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

  @Get('history/:missionId')
  async getPaymentHistory(@Param('missionId', ParseIntPipe) missionId: number): Promise<Invoice[]> {
    return await this.paymentService.getPaymentHistory(missionId);
  }

  @Get('status/:paymentIntentId')
  async getPaymentStatus(@Param('paymentIntentId') paymentIntentId: string): Promise<PaymentStatusResponse> {
    return await this.paymentService.getPaymentIntentStatus(paymentIntentId);
  }

  @Get('milestones/available/:missionId')
  async getAvailableMilestones(@Param('missionId', ParseIntPipe) missionId: number) {
    // This should return available milestone percentages for a mission
    // You'll need to implement this logic based on your business rules
    return {
      missionId,
      availableMilestones: [25, 50, 75, 100],
      releasedMilestones: [] // Track which milestones have been released
    };
  }

  // In your PaymentController
@Post('confirm')
async confirmPayment(@Body() body: { paymentIntentId: string }): Promise<PaymentResponse> {
  return await this.paymentService.confirmPaymentIntent(body.paymentIntentId);
}

@Post('retry-setup')
async retryPaymentSetup(@Body() body: { missionId: number }): Promise<CreateEscrowResponse> {
  return await this.paymentService.retryPaymentSetup(body.missionId);
}
}