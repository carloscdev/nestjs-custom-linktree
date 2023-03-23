import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { name, email, username, password, passwordConfirm } =
        createUserDto;
      if (password !== passwordConfirm) {
        throw new BadRequestException(
          'password is not equal to passwordConfirm',
        );
      }
      const user = this.userRepository.create({ username, email, password });
      await this.userRepository.save(user);
      const profile = this.profileRepository.create();
      profile.name = name;
      profile.user = user;
      await this.profileRepository.save(profile);

      delete user['password'];
      return {
        message: 'Register successfully',
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.logger.error(error);
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
      }
      if (error.status !== 500) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred, check logs for more information',
      );
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { id: true, email: true, password: true },
      });

      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credentials are not valid');
      }

      delete user['password'];

      return {
        message: 'Login successful',
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      if (error.status !== 500) {
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
      const user = await this.userRepository.findOneBy({
        id,
        isDeleted: false,
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
    user['email'] = `${user['email']}-${today}-[deleted]`;
    user['username'] = `${user['username']}-${today}-[deleted]`;
    user['isActive'] = false;
    user['isDeleted'] = true;

    await this.userRepository.save(user);
    return {
      statusCode: '200',
      message: 'User deleted successfully',
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
