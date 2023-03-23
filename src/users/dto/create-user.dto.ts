import { IsString, MinLength, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(8)
  name: string;

  @IsString()
  @MinLength(8)
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  //   @Matches(
  //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'The password must have a Uppercase, lowercase letter and a number'
  //   })
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  passwordConfirm: string;
}
