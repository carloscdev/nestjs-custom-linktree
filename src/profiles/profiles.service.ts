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

  async findById(id: string) {
    try {
      const profile = await this.profileRepository.findOne({
        where: { id },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      delete profile['id'];
      delete profile['createdAt'];
      delete profile['updatedAt'];
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

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    await this.profileRepository.update(id, updateProfileDto);
    return await this.findById(id);
  }
}
