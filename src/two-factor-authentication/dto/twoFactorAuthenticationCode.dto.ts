
import { IsEmail } from 'class-validator';
 
export class TwoFactorAuthenticationCodeDto {
  twoFactorAuthenticationCode: string;
}
 
export default TwoFactorAuthenticationCodeDto;