import { Controller, Body, Param, Get, Post, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UserRoleValidationPipe } from './pipes/user-role-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(@Query(ValidationPipe) searchUserDto: SearchUserDto): Promise<User[]> {
    return this.usersService.getUsers(searchUserDto);
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
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

  @Delete(':id',)
  deleteUserById(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUserById(id);
  }
}
