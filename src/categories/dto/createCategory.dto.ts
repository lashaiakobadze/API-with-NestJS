
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';
 
export class CreateCategoryDto {
  @IsNumber()
  @IsOptional()
  id: number;
 
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
 
export default CreateCategoryDto;