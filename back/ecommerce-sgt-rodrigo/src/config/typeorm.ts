  import { DataSource, DataSourceOptions } from "typeorm";
  import {config as dotenvConfig} from 'dotenv';
  import { registerAs } from "@nestjs/config";
  import { TypeOrmModuleOptions } from "@nestjs/typeorm";


  //w loads env vars from .env file to process.env (notice > when no parameters are passed to dotenv() it automatically searches for a '.env', otherwise you need to specify the path)
  
  //w loads env vars from .env.development file to process.env
  //w the .env.production file for docker takes precedence when running docker, hence, there is no need to comment this out(confirmed by claude too). Also remember that both the app and the database need to have this file specified in the docker compose via the env_file property.
  dotenvConfig({path:'.env.development'});

  //? loads environment-specific .env file (only if I had an .env.production.local which I don't, you should also modify the package.json scripts to add a NODE_ENV variable set to the corresponding environments)
// const env = process.env.NODE_ENV || 'development';
// dotenvConfig({ path: `.env.${env}` });
  


  const config: TypeOrmModuleOptions = {
    type: 'postgres',
    database: process.env.DB_NAME || 'default_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT as number | undefined,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    autoLoadEntities: true,
    //w false for production and migrations
    synchronize: false,
    dropSchema: false,
    logging: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.js,.ts}'],
  };

  //w namespacing
  export default registerAs('typeorm', ()=> config)
  export const connectionSource = new DataSource(config as DataSourceOptions)