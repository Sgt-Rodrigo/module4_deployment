import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepositoryService } from './auth.repository';
import { UsersRepo } from '../users/usersDB.service';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

//w remember here you are using a shared usersService by importing the UsersModule just to try it out
@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepositoryService, UsersRepo],
})
export class AuthModule {}
