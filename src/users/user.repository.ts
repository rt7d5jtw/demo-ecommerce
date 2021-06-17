import { EntityRepository, getRepository, Repository } from "typeorm";
import { User, UserRole } from "./user.entity";
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, ChangeEmailDto } from './dto/user.dto';
import { SearchUserDto } from "./dto/search-user.dto";
import { InternalServerErrorException, ConflictException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dto/auth.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async getUsers(searchUserDto: SearchUserDto): Promise<User[]> {
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
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;

    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;
    user.role = UserRole.USER

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') { // duplicate username
        throw new ConflictException('Username already exists');
      } else if (error.code === '23505') {
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  async updatePassword(user: User, password: string): Promise<User> {
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password['password'], user.salt);
    await user.save();

    return user;
  }

  async updateEmail(user: User, email: string): Promise<User> {
    user.email = email['email'];
    await user.save();

    return user;
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<User> {
    const { currentPassword, newPassword } = changePasswordDto;
    console.log(currentPassword);
    if (user && (await user.validatePassword(currentPassword))) {
      /* user succesfully validated */
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(newPassword, user.salt);
      await user.save();
    } else {
      throw new ConflictException('Validation failed');
    }
    return user;
  }

  async changeEmail(user: User, changeEmailDto: ChangeEmailDto): Promise<User> {
    const { currentEmail, newEmail } = changeEmailDto;
    if (user.email == currentEmail) {
      user.email = newEmail;
      user.save();
    } else {
      throw new ConflictException('Emails conflict');
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await getRepository(User).findOne(id);
    const { password, email } = updateUserDto;

    user.email = email;
    user.salt = await bcrypt.genSalt();
    console.log(password);
    user.password = await this.hashPassword(password, user.salt);
    await user.save();

    return user;
  }

  async validateUserPassword(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.findOne({ email });

    if (user && (await user.validatePassword(password))) {
      return user.email;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
