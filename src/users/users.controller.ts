import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import {
  ChangePasswordDto,
  ChangeEmailDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto/user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UserRoleValidationPipe } from './pipes/user-role-validation.pipe';
import { GetUser } from './get_user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(
    @Query(ValidationPipe) searchUserDto: SearchUserDto,
  ): Promise<User[]> {
    return this.usersService.getUsers(searchUserDto);
  }

  @Get('/me')
  getUser(@GetUser() user: User): Promise<User> {
    return this.usersService.getUser(user);
  }

  @Get('/role')
  @UseGuards(AuthGuard())
  getRoleByUser(@GetUser() user: User): Promise<UserRole> {
    return this.usersService.getRoleByUser(user);
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Get(':id/role')
  getRole(@Param('id') id: string): Promise<User> {
    return this.usersService.getRole(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('changepw')
  @UseGuards(AuthGuard())
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    return this.usersService.changePassword(user, changePasswordDto);
  }

  @Patch('email')
  @UseGuards(AuthGuard())
  changeEmail(
    @GetUser() user: User,
    @Body() changeEmailDto: ChangeEmailDto,
  ): Promise<User> {
    return this.usersService.changeEmail(user, changeEmailDto);
  }

  @Patch('pass')
  @UseGuards(AuthGuard())
  updatePassword(
    @GetUser() user: User,
    @Body() password: string,
  ): Promise<User> {
    return this.usersService.updatePassword(user, password);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch(':id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body('role', UserRoleValidationPipe) role: UserRole,
  ): Promise<User> {
    return this.usersService.updateUserRole(id, role);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUserById(id);
  }
}
