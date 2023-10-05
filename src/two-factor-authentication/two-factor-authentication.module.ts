import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [UsersModule, ConfigModule, AuthenticationModule],
  providers: [TwoFactorAuthenticationService],
  controllers: [TwoFactorAuthenticationController],
  exports: [TwoFactorAuthenticationService]
})
export class TwoFactorAuthenticationModule {}
