import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

export class CustomThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    throw new ThrottlerException(
      'Too many login attempts. Please try again after 1 minute.',
    );
  }
}
