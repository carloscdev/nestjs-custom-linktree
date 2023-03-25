import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(userId: string, createItemDto: CreateItemDto) {
    const body = createItemDto;
    body['userId'] = userId;
    const item = this.itemRepository.create();
    item['title'] = body['title'];
    item['type'] = body['type'];
    item['url'] = body['url'];
    item['image'] = body['image'];
    item['position'] = +body['position'];
    item['userId'] = body['userId'];
    await this.itemRepository.save(item);
    delete item['user'];
    return item;
  }

  async findAll(userId: string) {
    return await this.itemRepository.find({
      where: { userId },
      select: ['id', 'type', 'title', 'url', 'image', 'position', 'isActive'],
      order: {
        position: 'ASC',
      },
    });
  }

  async update(id: string, userId: string, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepository.findOne({
      where: { id, userId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const { title, type, url, image, position, isActive } = updateItemDto;
    item['title'] = title;
    item['type'] = type;
    item['url'] = url;
    item['image'] = image;
    item['position'] = +position;
    item['isActive'] = isActive;

    await this.itemRepository.save(item);
    return item;
  }

  async remove(id: string, userId: string) {
    const item = await this.itemRepository.findOne({
      where: { id, userId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    await this.itemRepository.remove(item);
    return {
      statusCode: 200,
      message: 'Item was deleted successfully',
    };
  }
}
