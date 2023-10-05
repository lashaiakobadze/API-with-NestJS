
import { IsNumber } from 'class-validator';
 
export class TwoFactorAuthenticationCodeDto {
  @IsNumber()
  twoFactorAuthenticationCode: number;
}
 
export default TwoFactorAuthenticationCodeDto;