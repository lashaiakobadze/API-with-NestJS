import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtTwoFactorStrategy } from './jwt-two-factor.strategy';
import { LocalSerializer } from 'src/utils/local.serializer';
import { EmailConfirmationModule } from 'src/emailConfirmation/emailConfirmation.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    EmailConfirmationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    JwtTwoFactorStrategy,
    LocalSerializer
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
