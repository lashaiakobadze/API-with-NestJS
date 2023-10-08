import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RegisterDto from './dto/register.dto';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { UsersService } from 'src/users/users.service';
import JwtRefreshGuard from './jwt-refresh.guard';
import { LogInWithCredentialsGuard } from './logInWithCredentialsGuard';
import { CookieAuthenticationGuard } from './cookieAuthentication.guard';
import { EmailConfirmationService } from 'src/emailConfirmation/emailConfirmation.service';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    const user = await this.authenticationService.register(registrationData);
    // await this.emailConfirmationService.sendVerificationLink(
    //   registrationData.email,
    // );
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @HttpCode(200)
  // @UseGuards(LocalAuthenticationGuard)
  @UseGuards(LogInWithCredentialsGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    // const { user } = request;
    // const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
    // const {
    //   cookie: refreshTokenCookie,
    //   token: refreshToken
    // } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    // await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    // request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    // if (user.isTwoFactorAuthenticationEnabled) {
    //   return;
    // }

    // return user;
    return request.user;
  }

  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(CookieAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    request.logOut(err => {
      if (err) {
        // Handle the error here, if needed.
        return response.status(500).send('Error logging out');
      }
      request.session.cookie.maxAge = 0;
      return response.send('Logged out successfully');
    });
  }

  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(CookieAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
