import {
  Matches,
  IsEmail,
  IsString,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(50)
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z])(?=.{8,}).*$/, {
    message: 'Password is too weak or proper password isnt being provided'
  })
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z])(?=.{8,}).*$/, {
    message: 'Password is too weak or proper password isnt being provided'
  })
  currentPassword: string;

  @IsString()
  @MaxLength(50)
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
