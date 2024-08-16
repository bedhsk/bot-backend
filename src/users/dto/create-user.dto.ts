import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  name: string;

  @MinLength(3)
  @MaxLength(255)
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
