import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFileModule } from 'src/files/public-file.module';
import User from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PublicFileModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
