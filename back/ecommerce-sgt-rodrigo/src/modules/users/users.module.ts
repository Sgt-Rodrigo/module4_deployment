import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepo } from './usersDB.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { requiresAuth } from 'express-openid-connect';

//w remember here you are exporting the UsersService to make the class and/or instance of it available to AuthModule.
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepo],
  exports:[UsersService]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //w auth0 is not required by the homework so this method and the NestModule interface can be removed from here and products.module. I ll leave it for now since its commented out.
    // consumer.apply(requiresAuth()).forRoutes('users');
  }
}
