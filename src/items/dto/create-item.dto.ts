import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ItemType } from '../interfaces/item.interface';

export class CreateItemDto {
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  title: string;

  @IsEnum(ItemType)
  type: ItemType;

  @IsUrl()
  @IsOptional()
  url: string | null;

  @IsUrl()
  @IsOptional()
  image: string | null;

  @IsNumber()
  position: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
