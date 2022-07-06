import { Matches, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z])(?=.{8,}).*$/, {
    message: 'Password is too weak or proper password isnt being provided'
  })
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z])(?=.{8,}).*$/, {
    message: 'Password is too weak or proper password isnt being provided'
  })
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z])(?=.{8,}).*$/, {
    message: 'Password is too weak or proper password isnt being provided'
  })
  newPassword: string;
}

export class ChangeEmailDto {
  @IsEmail()
  currentEmail: string;

  @IsEmail()
  newEmail: string;
}
