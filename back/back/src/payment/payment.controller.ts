import { Controller, Post, Get, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Mission, PaymentStatus } from '../mission/entities/mission.entity';
import { Invoice } from '../invoice/entities/invoice.entity';

// DTOs for request bodies
export class CreateEscrowPaymentDto {
  missionId: number;
  clientId: number;
}

export class ReleaseMilestonePaymentDto {
  missionId: number;
  milestonePercentage: number;
}

export class RefundPaymentDto {
  missionId: number;
  reason: string;
}

// Response types (replacing GraphQL ObjectTypes)
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
    return await this.paymentService.releaseMilestonePayment(
      releaseMilestoneDto.missionId, 
      releaseMilestoneDto.milestonePercentage
    );
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
}