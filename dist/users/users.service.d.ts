import { User, UserRole } from './user.entity';
import { ChangePasswordDto, ChangeEmailDto, CreateUserDto } from './dto/user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UserRepository } from './user.repository';
export declare class UsersService {
    private userRepository;
    private logger;
    constructor(userRepository: UserRepository);
    fetch(searchUserDto: SearchUserDto): Promise<User[]>;
    fetchById(id: string): Promise<User>;
    getRoleByUser(user: User): Promise<UserRole>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<string>;
    changeEmail(user: User, changeEmailDto: ChangeEmailDto): Promise<string>;
    updateUserRole(id: string, role: UserRole): Promise<UserRole>;
    remove(id: string): Promise<void>;
}
