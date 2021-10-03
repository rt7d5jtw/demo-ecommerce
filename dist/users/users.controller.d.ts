import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import { ChangePasswordDto, ChangeEmailDto, CreateUserDto } from './dto/user.dto';
import { SearchUserDto } from './dto/search-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    fetch(searchUserDto: SearchUserDto): Promise<User[]>;
    getRoleByUser(user: User): Promise<UserRole>;
    fetchById(id: string): Promise<User>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<string>;
    changeEmail(user: User, changeEmailDto: ChangeEmailDto): Promise<string>;
    updateUserRole(id: string, role: UserRole): Promise<UserRole>;
    remove(id: string): Promise<void>;
}
