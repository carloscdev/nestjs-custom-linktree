import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    // Config environment variables
    ConfigModule.forRoot(),
    // Config DB
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      // Sync automatically only in development
      synchronize: true,
    }),
    // Resources
    UsersModule,
    ProfilesModule,
    ItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
