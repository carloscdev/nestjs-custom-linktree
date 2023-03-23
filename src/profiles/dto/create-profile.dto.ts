import { IsHexColor, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MinLength(8)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  @IsUrl()
  banner: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsString()
  @IsUrl()
  favicon: string;

  @IsString()
  @IsHexColor()
  bgColor: string;

  @IsString()
  @IsHexColor()
  textColor: string;

  @IsString()
  @IsHexColor()
  itemColor: string;
}
