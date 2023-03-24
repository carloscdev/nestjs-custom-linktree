import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profile } from './entities/profile.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [TypeOrmModule.forFeature([Profile]), forwardRef(() => UsersModule)],
  exports: [ProfilesService],
})
export class ProfilesModule {}
