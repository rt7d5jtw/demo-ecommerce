import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  getUsers(searchUserDto: SearchUserDto): Promise<User[]> {
    return this.userRepository.getUsers(searchUserDto);
  }

  async getUserById(id: string): Promise<User> {
    const result = await this.userRepository.findOne(id);
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return result;
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { password, email } = updateUserDto;
    const user = await this.getUserById(id);

    user.email = email;
    user.password = password;
    await user.save();

    return user;
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
