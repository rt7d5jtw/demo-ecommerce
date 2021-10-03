import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, ChangePasswordDto, ChangeEmailDto } from './dto/user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { LoginDto } from '../auth/dto/auth.dto';
export declare class UserRepository extends Repository<User> {
    fetch(searchUserDto: SearchUserDto): Promise<User[]>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    updateEmail(user: User, email: string): Promise<string>;
    changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<string>;
    changeEmail(user: User, changeEmailDto: ChangeEmailDto): Promise<string>;
    validateUserPassword(loginDto: LoginDto): Promise<string>;
    private hashPassword;
}
