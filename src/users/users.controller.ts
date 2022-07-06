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
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import {
  ChangePasswordDto,
  ChangeEmailDto,
  CreateUserDto
} from './dto/user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UserRoleValidationPipe } from './pipes/user-role-validation.pipe';
import { GetUser } from './get_user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  fetch(@Query(ValidationPipe) searchUserDto: SearchUserDto): Promise<User[]> {
    return this.usersService.fetch(searchUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/role')
  getRoleByUser(@GetUser() user: User): Promise<UserRole> {
    return this.usersService.getRoleByUser(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  fetchById(@Param('id') id: string): Promise<User> {
    return this.usersService.fetchById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('changepw')
  @UsePipes(ValidationPipe)
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<string> {
    return this.usersService.changePassword(user, changePasswordDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('email')
  @UsePipes(ValidationPipe)
  changeEmail(
    @GetUser() user: User,
    @Body() changeEmailDto: ChangeEmailDto
  ): Promise<string> {
    return this.usersService.changeEmail(user, changeEmailDto);
  }

  // NOTE: Response type is text!
  // Role is returned as text so inspect for (Depending whether using Fetch API or XHR)
  // [responseText](https://xhr.spec.whatwg.org/#the-responsetext-attribute)
  // [text](https://fetch.spec.whatwg.org/#ref-for-dom-body-text%E2%91%A0)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body('role', UserRoleValidationPipe) role: UserRole
  ): Promise<UserRole> {
    return this.usersService.updateUserRole(id, role);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
