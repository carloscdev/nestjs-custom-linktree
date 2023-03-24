import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserRole } from './interfaces/user.interface';
import { Auth } from './decorators/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/test')
  @Auth(UserRole.ADMIN)
  testUser(@GetUser() user: User) {
    return user;
  }

  @Get('/public/:username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Get('/account')
  @Auth()
  findById(@GetUser() user: User) {
    const id = user['id'];
    return this.usersService.findById(id);
  }

  @Patch('/is-active')
  @Auth()
  updateIsActive(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const id = user['id'];
    return this.usersService.updateIsActive(id, updateUserDto);
  }

  @Delete(':id')
  @Auth()
  remove(@GetUser() user: User) {
    const id = user['id'];
    return this.usersService.delete(id);
  }
}
