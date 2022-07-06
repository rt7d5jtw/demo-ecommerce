import { IsString, MinLength, Matches, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z])(?=.{8,}).*$/, {
    message: 'Password is too weak provided'
  })
  password: string;
}
