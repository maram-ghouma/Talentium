import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateEscrowResponse {
  @Field(() => String, { nullable: true })
  clientSecret: string | null;

  @Field(() => String)
  paymentIntentId: string;
}

@ObjectType()
export class ReleaseMilestoneResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Number)
  amountReleased: number;
}
// In your types file or at the top of your service
export interface PaymentResponse {
  success: boolean;
  message?: string;
  paymentIntentId?: string;
  status?: string; // Add this line
}
@ObjectType()
export class RefundResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  refundId: string;
}
