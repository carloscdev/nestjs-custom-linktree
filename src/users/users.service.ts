import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { email, username, password, passwordConfirm } = createUserDto;
      if (password !== passwordConfirm) {
        throw new BadRequestException(
          'password is not equal to passwordConfirm',
        );
      }
      const user = this.userRepository.create({ username, email, password });
      await this.userRepository.save(user);
      delete user['password'];
      return user;
    } catch (error) {
      this.logger.error(error);
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
      }
      if (error.status === 400) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred, check logs for more information',
      );
    }
  }

  async findAll() {
    return await this.userRepository.find({
      where: { isActive: true, isDeleted: false },
    });
  }

  async findOne(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username, isActive: true, isDeleted: false },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
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

  async findById(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id, isDeleted: false },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
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

  async updateIsActive(id: string, updateUserDto: UpdateUserDto) {
    this.logger.debug(updateUserDto, 'OK');
    const user = await this.findById(id);
    user['isActive'] = updateUserDto.isActive;
    await this.userRepository.save(user);
    return user;
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const today = new Date();
    user['email'] = user['email'] + '- deleted - ' + today;
    user['username'] = user['username'] + '- deleted - ' + today;
    user['isActive'] = false;
    user['isDeleted'] = true;

    await this.userRepository.save(user);
    return {
      statusCode: '200',
      message: 'User deleted successfully',
    };
  }
}
