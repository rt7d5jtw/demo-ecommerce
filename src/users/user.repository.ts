import { User, UserRole } from './user.entity';
import { CreateUserDto, ChangePasswordDto, ChangeEmailDto } from './dto/user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import {
  InternalServerErrorException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dto/auth.dto';
import { AppDataSource } from '../config/typeorm.config';

interface UserRepositoryExtended {
  fetch: (arg0: SearchUserDto) => Promise<User[]>;
  createUser: (arg0: CreateUserDto) => Promise<User>;
  updateEmail: (arg0: User, email: string) => Promise<string>;
  changePassword: (arg0: User, arg1: ChangePasswordDto) => Promise<string>;
  hashPassword: (password: string, salt: string) => Promise<string>;
  validateUserPassword: (arg0: LoginDto) => Promise<string>;
  changeEmail: (arg0: User, arg1: ChangeEmailDto) => Promise<string>;
}

const UserRepository = AppDataSource.getRepository(User).extend({
  async fetch(searchUserDto: SearchUserDto): Promise<User[]> {
    const { role, search } = searchUserDto;
    const query = this.createQueryBuilder('user');

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (search) {
      query.andWhere('(user.email LIKE :search)', { search: `%${search}%` });
    }

    const users = await query.getMany();
    return users;
  },

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;

    const user = this.create();
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;
    user.role = UserRole.USER;
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        // duplicate email
        throw new ConflictException('Email already exists');
      } else if (error.code === '23505') {
        throw new InternalServerErrorException();
      }
    }

    return user;
  },

  async updateEmail(user: User, email: string): Promise<string> {
    user.email = email['email'];
    await user.save();

    return user.email;
  },

  async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<string> {
    const { currentPassword, newPassword } = changePasswordDto;
    if (user && (await user.validatePassword(currentPassword))) {
      if (newPassword === currentPassword)
        throw new ConflictException("You're already using this password");
      /* user succesfully validated */
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(newPassword, user.salt);
      await user.save();
    } else {
      throw new UnauthorizedException(`Invalid credentials`);
    }
    return user.password;
  },

  async changeEmail(user: User, changeEmailDto: ChangeEmailDto): Promise<string> {
    const { currentEmail, newEmail } = changeEmailDto;
    if (user.email === newEmail) throw new ConflictException(`Email is already in use`);
    if (user.email === currentEmail) {
      user.email = newEmail;
      user.save();
    } else {
      throw new ConflictException('Wrong email provided');
    }
    return user.email;
  },

  async validateUserPassword(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.findOne({ where: { email: email } });

    if (user && (await user.validatePassword(password))) {
      return user.email;
    } else {
      return null;
    }
  },

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  },
});

export { UserRepository, UserRepositoryExtended };
