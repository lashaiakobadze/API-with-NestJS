
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';
 
export class UpdateCategoryDto {
  @IsNumber()
  @IsOptional()
  id: number;
 
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;
}
 
export default UpdateCategoryDto;