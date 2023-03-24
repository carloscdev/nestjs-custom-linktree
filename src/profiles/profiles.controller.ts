import { Controller, Get, Body, Put } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Auth } from '../users/decorators/auth.decorator';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('/detail')
  @Auth()
  findOne(@GetUser() user: User) {
    const userId = user['id'];
    return this.profilesService.findOne(userId);
  }

  @Put('/detail')
  @Auth()
  update(@GetUser() user: User, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = user['id'];
    return this.profilesService.update(userId, updateProfileDto);
  }
}
