import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { ChangePasswordDto, ChangeEmailDto, CreateUserDto } from './dto/user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  /**
   * Searches for User's by the given parameters, if there is no parameters, all User's will be returned.
   * @returns Promise<User[]>
   */
  async fetch(searchUserDto: SearchUserDto): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');
    if (searchUserDto.role)
      query.andWhere('user.role = :role', { role: `%${searchUserDto['role']}%` });

    if (searchUserDto.search)
      query.andWhere('(user.email LIKE :search)', { search: `%${searchUserDto['search']}%` });

    return await query.getMany();
  }

  /**
   * Searches for the User by the specified Id and returns the User.
   * @returns Promise<User>
   */
  async fetchById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException(`User with ID "${id}" not found`);

    return user;
  }

  async getRoleByUser(user: User): Promise<UserRole> {
    return user.role;
  }

  /**
   * Creates the User, generates the salt and hashes the password using separate method, finally returns the User
   * @param {CreateUserDto} createUserDto - User DTO, the inputs to create the user
   * @returns {Promise<User>}
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;

    const user = this.userRepository.create();
    user.salt = await bcrypt.genSalt(); // Salt
    user.password = await this.hashPassword(password, user.salt); // Hash
    user.email = email;
    user.role = UserRole.USER;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists'); // Duplicate email.
      } else if (error) {
        this.logger.error(error);
        throw new TypeORMError(`Something went wrong while trying to persist the User`);
      }
    }

    return user;
  }

  /**
   * Uses Blowfish algorithm to hash and salt the input password
   * with the input salt, returns the hashed and salted password.
   * @param {string} password - User's password
   * @param {string} salt - Salt to be used for the hashing.
   * @returns {Promise<string>}
   */
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  /**
   * Changes the {@link User} password and returns the current password.
   * @param {User} user
   * @param {ChangePasswordDto} changePasswordDto
   * @returns {Promise<string>} current user password after the operations.
   */
  async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<string> {
    const { currentPassword, newPassword } = changePasswordDto;

    if (user && (await user.validatePassword(currentPassword))) {
      if (newPassword === currentPassword)
        throw new ConflictException("You're already using this password");

      /* user succesfully validated */
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(newPassword, user.salt);
      await this.userRepository.save(user);
    }

    return user.password;
  }

  /**
   * Changes the user email to the provided new email in the changeEmailDto
   * and returns the current email of the user after transaction and validations.
   * @param {User} user
   * @param {ChangeEmailDto} changeEmailDto
   * @returns {Promise<string>}
   */
  async changeEmail(user: User, changeEmailDto: ChangeEmailDto): Promise<string> {
    if (user.email === changeEmailDto.newEmail)
      throw new ConflictException(`Email is already in use`);

    // Check that email is not already in use
    //this.userRepository.find({ where: { email: changeEmailDto['newEmail'] } });

    if (user.email === changeEmailDto.currentEmail) {
      user.email = changeEmailDto.newEmail;
      this.userRepository.save(user);
    }

    return user.email;
  }

  /**
   * Persists the new user email and returns it.
s  * @param {User} user
   * @param {string} email - The email which will be assigned to User.email
   * @returns {Promise<string>} user.email
   */
  async updateEmail(user: User, email: string): Promise<string> {
    user.email = email['email'];
    await this.userRepository.save(user);
    return user.email;
  }

  /**
   * Persists the input user role and returns it.
   * @param {string} id - ID of the User that's role will be updated.
   * @param {UserRole} role - The role to update for the user.
   * @returns {Promise<UserRole>}
   */
  async updateUserRole(id: string, role: UserRole): Promise<UserRole> {
    const user = await this.fetchById(id);
    user.role = role;
    await this.userRepository.save(user);
    return user.role;
  }

  /**
   * Calls {@link user.validatePassword} to validate the password hash and returns the user.email if true.
   * @param {LoginDto} loginDto - The email and password of the {@link User}
   * @returns {Promise<string>} user.email - User's email
   */
  async validateUserPassword(loginDto: LoginDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email: loginDto['email'] } });

    if (user && (await user.validatePassword(loginDto['password']))) return user.email;
  }

  /**
   * Removes the User from persistence by calling {@link UserRepository.delete}
   * @param {string} id - ID of the User to be removed from the persistence.
   * @returns {Promise<void>}
   */
  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result) this.logger.verbose(`User with id "${id}" deleted`);
    if (result.affected === 0) throw new NotFoundException(`User with ID "${id}" not found`);
  }
}
