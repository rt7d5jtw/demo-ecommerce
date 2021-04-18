import { Matches, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(50)
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z])(?=.{8,}).*$/, { message: 'Password is too weak or proper password isnt being provided' })
  password: string;
}

export type UpdateUserDto = Partial<CreateUserDto>
