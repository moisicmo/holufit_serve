import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@/guard/strategy/jwt.strategy';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@/config';
import { GmailModule } from '@/common/gmail/gmail.module';
import { GoogleAuthModule } from '@/common/google/auth/google.auth.module';
import { FacebookAuthModule } from '@/common/facebook/auth/facebook.auth.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [
    PrismaModule,
    PassportModule,
    GmailModule,
    GoogleAuthModule,
    FacebookAuthModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
})
export class AuthModule {}
