import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findOne(userId: string) {
    try {
      const profile = await this.profileRepository.findOne({
        where: { userId },
        // relations: ['user'],
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      delete profile['id'];
      delete profile['createdAt'];
      delete profile['updatedAt'];
      delete profile['userId'];
      delete profile['user'];
      return profile;
    } catch (error) {
      this.logger.error(error);
      if (error.status !== 500) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred, check logs for more information',
      );
    }
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      // relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const {
      name,
      description,
      banner,
      image,
      favicon,
      bgColor,
      textColor,
      itemColor,
    } = updateProfileDto;

    profile['name'] = name;
    profile['description'] = description;
    profile['banner'] = banner;
    profile['image'] = image;
    profile['favicon'] = favicon;
    profile['bgColor'] = bgColor;
    profile['textColor'] = textColor;
    profile['itemColor'] = itemColor;
    await this.profileRepository.save(profile);

    return profile;
  }
}
