import { Module } from '@nestjs/common';
import { FacebookAuthService } from './facebook.auth.service';

@Module({
  providers: [FacebookAuthService],
  exports: [FacebookAuthService],
})
export class FacebookAuthModule {}
