import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepositoryService } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities_db/product.entity';
import { ProductsDBService } from './productsDB.service';
import { Category } from 'src/entities_db/category.entity';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { CloudinaryService } from 'src/cloudinary.service';
import { requiresAuth } from 'express-openid-connect';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepositoryService, ProductsDBService, CloudinaryConfig, CloudinaryService]
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(requiresAuth()).forRoutes('products/:id');
  }
}
