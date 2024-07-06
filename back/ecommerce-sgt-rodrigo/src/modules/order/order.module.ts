import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepo } from './orderDB.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities_db/order.entity';
import { User } from '../users/user.entity';
import { Product } from 'src/entities_db/product.entity';
import { OrderDetail } from 'src/entities_db/order_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Product, OrderDetail]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepo],
})
export class OrderModule {}
