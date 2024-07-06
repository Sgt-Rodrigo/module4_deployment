import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/logger';
import { ValidationPipe } from '@nestjs/common';
// import { auth } from 'express-openid-connect';
// import {config as auth0Config} from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './modules/auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //* AUTH0 is not required in this proyect
  // app.use(auth(auth0Config));
  //* logger middleware
  app.use(logger);
  //* validation pipe global
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: false, //w enables response error messages from pipes
  }));

  //* swagger 
  //w 1- document config
  const swaggerConfig = new DocumentBuilder()
        .setTitle('Testing Swagger')
        .setDescription('I m testing swagger')
        .setVersion('1.0')
        .addTag('test')
        .addBearerAuth()
        .build();
  //w 2- creates document 
        const document = SwaggerModule.createDocument(app, swaggerConfig);

  //w 3- sets docs endpoint
  SwaggerModule.setup('api', app, document);


  await app.listen(3000);
}
bootstrap(); 
