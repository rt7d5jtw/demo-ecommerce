import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { ChangePasswordDto, ChangeEmailDto, CreateUserDto } from './dto/user.dto';
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

  fetch(searchUserDto: SearchUserDto): Promise<User[]> {
    return this.userRepository.fetch(searchUserDto);
  }

  async fetchById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async getRoleByUser(user: User): Promise<UserRole> {
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

  async updateUserRole(id: string, role: UserRole): Promise<UserRole> {
    const user = await this.fetchById(id);
    user.role = role;
    await user.save();
    return user.role;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result) {
      this.logger.verbose(`User with id "${id}" deleted`);
    }

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}
