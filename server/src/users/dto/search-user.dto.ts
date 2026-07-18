import { UserRole } from '../user.entity';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  @IsIn([UserRole.ADMIN, UserRole.USER])
  role: UserRole;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
