import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { ChangePasswordDto, ChangeEmailDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  getUsers(searchUserDto: SearchUserDto): Promise<User[]> {
    return this.userRepository.getUsers(searchUserDto);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async getUser(user: User): Promise<User> {
    const result = await this.userRepository.findOne(user);
    if (!result) {
      throw new NotFoundException(`User with ID "${user}" not found!`);
    }
    return result;
  }

  async getRoleByUser(user: User): Promise<UserRole> {
    return user.role;
  }

  async getRole(id: string): Promise<any> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user.role;
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<string> {
    return this.userRepository.changePassword(user, changePasswordDto);
  }

  async changeEmail(user: User, changeEmailDto: ChangeEmailDto): Promise<string> {
    return this.userRepository.changeEmail(user, changeEmailDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.updateUser(id, updateUserDto);
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const user = await this.getUserById(id);
    user.role = role;
    await user.save();
    return user;
  }

  async deleteUserById(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result) {
      this.logger.verbose(`User with id "${id}" deleted`);
    }

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}
