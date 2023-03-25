import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Auth } from 'src/users/decorators/auth.decorator';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('/create')
  @Auth()
  create(@GetUser() user: User, @Body() createItemDto: CreateItemDto) {
    const userId = user['id'];
    return this.itemsService.create(userId, createItemDto);
  }

  @Get()
  @Auth()
  findAll(@GetUser() user: User) {
    const userId = user['id'];
    return this.itemsService.findAll(userId);
  }

  @Put(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const userId = user['userId'];
    return this.itemsService.update(id, userId, updateItemDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @GetUser() user: User) {
    const userId = user['userId'];
    return this.itemsService.remove(id, userId);
  }
}
