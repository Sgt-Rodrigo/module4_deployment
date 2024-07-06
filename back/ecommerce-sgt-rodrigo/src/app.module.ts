import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrderModule } from './modules/order/order.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  //w import feature modules
  imports: [UsersModule, ProductsModule, AuthModule, CategoriesModule, OrderModule,
    //w ConfigModule class used by Nest to load the appropiate env vars.
    //w env vars are stored in .env files and used by config files, we ConfigModule loads this files, hence loads the env vars.
    //? .forRoot() > static method loads an .env file by default but we can configure it, it also registers the ConfigService in the ConfigModule
    //w ConfigModule is the main configuration module for Nest and affects custom configuration modules like TyperOrmModule. > 
    //? isGlobal:true  > makes ConfigModule configurations available in all the app, here you load even the database config that can then be accesed by the TypeOrmModule via the ConfigService. All config files are loaded in the ConfigModule to make them global in case they need to be used in other modules.
    //w load: [] > loads the config object globally, note typeOrmConfig is an import namespace > it is not the registerAs namespace (this one is used only in the ConfigService.get() method)

    ConfigModule.forRoot({
      isGlobal: true,
      load:[typeOrmConfig],
    }),

    //w This is a custom module for Typeorm and Nest, therefore also uses forRoot
    //w This module is used to retrieve the database configuration accessesing the loaded config in COnfigModule via the ConfigService via the useFactory().
    //*Once the config object is returned, the ConfigModule and TypeOrm module will automatically handle the connection to the database (you dont see nor do this)
    //w inject:[] > tells Nest the necesary dependencies to inject (meaning Nest need to identify the dependencies to create an instance, in this case of ConfigService, to then be used by the useFactory passed as a parameter).
    //w useFactory: constructs and customize the final object TypeOrmModuleOptions, in this case we just retrieve the config > .
    //? configService.get() >  retrieves the TypeORM configuration options from the global configuration that is then used automatically by the ConfigModule to stablish a connection to the database and hence other interactions like entity management, migrations, and synchronization.
    //? get<TypeOrmModuleOptions>('typeorm')! > specifies the expected type of the retrieved value.
    //?The ! at the end of the line asserts that the retrieved value is not null or undefined.It tells TypeScript to treat the value as non-nullable.    

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return configService.get<TypeOrmModuleOptions>('typeorm')!;
      },
    }),
    JwtModule.register({
      global: true,
      signOptions: {expiresIn:'1h'},
      secret: process.env.JWT_SECRET
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
