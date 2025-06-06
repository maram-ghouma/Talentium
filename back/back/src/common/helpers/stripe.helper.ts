import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export function handleStripeError(error: any): never {
  if (error.type === 'StripeCardError') {
    throw new BadRequestException(error.message || 'Card was declined.');
  } else if (error.type === 'StripeInvalidRequestError') {
    throw new BadRequestException('Invalid request to Stripe: ' + error.message);
  } else if (error.message?.includes('Mission non trouvée')) {
    throw new BadRequestException('Mission not found.');
  } else {
    throw new InternalServerErrorException('Unexpected Stripe error.');
  }
}
