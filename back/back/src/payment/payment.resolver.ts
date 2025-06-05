
import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { ObjectType, Field } from '@nestjs/graphql';
import { Mission, PaymentStatus } from '../mission/entities/mission.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { CreateEscrowResponse,ReleaseMilestoneResponse,RefundResponse } from './payment.types';



@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Mutation(() => CreateEscrowResponse)
  async createEscrowPayment(
    @Args('missionId', { type: () => Int }) missionId: number,
    @Args('clientId', { type: () => Int }) clientId: number,
  ): Promise<CreateEscrowResponse> {
    return await this.paymentService.createEscrowPayment(missionId, clientId);
  }

  @Mutation(() => ReleaseMilestoneResponse)
  async releaseMilestonePayment(
    @Args('missionId', { type: () => Int }) missionId: number,
    @Args('milestonePercentage', { type: () => Int }) milestonePercentage: number,
  ): Promise<ReleaseMilestoneResponse> {
    return await this.paymentService.releaseMilestonePayment(missionId, milestonePercentage);
  }

  @Mutation(() => RefundResponse)
  async refundPayment(
    @Args('missionId', { type: () => Int }) missionId: number,
    @Args('reason') reason: string,
  ): Promise<RefundResponse> {
    return await this.paymentService.refundPayment(missionId, reason);
  }

  @Query(() => [Mission])
  async getMissionsByPaymentStatus(
    @Args('status', { type: () => PaymentStatus }) status: PaymentStatus,
  ): Promise<Mission[]> {
    return await this.paymentService.getMissionsByPaymentStatus(status);
  }

  @Query(() => [Invoice])
  async getPaymentHistory(
    @Args('missionId', { type: () => Int }) missionId: number,
  ): Promise<Invoice[]> {
    return await this.paymentService.getPaymentHistory(missionId);
  }
}