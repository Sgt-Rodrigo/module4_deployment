    import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
    import { CreateOrderDto } from './dto/create-order.dto';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Order } from 'src/entities_db/order.entity';
    import { User } from '../users/user.entity';
    import { MoreThan, Repository } from 'typeorm';
    import { Product } from 'src/entities_db/product.entity';
    import { OrderDetail } from 'src/entities_db/order_detail.entity';
    import { plainToClass } from 'class-transformer';

    @Injectable()
    export class OrderRepo {

        constructor(
            @InjectRepository(Order)
            private readonly orderRepository: Repository<Order>,
            @InjectRepository(User)
            private readonly userRepository: Repository<User>,
            @InjectRepository(Product)
            private readonly productRepository: Repository<Product>,
            @InjectRepository(OrderDetail)
            private readonly orderDetailRepository: Repository<OrderDetail>,
          ) {}
        
          //w uses relation navigation to get the orderDetail.products array >
          //w orderDetail and user (direct relation); orderDetail.products (nested relation = Products entity has no relation with Order entity, however, you can get it)
          async getOrderByID(orderId: string) {
            //w finds the order by ID
            const order = await this.orderRepository.findOne({
              where: { id: orderId },
              relations: ['orderDetail', 'user', 'orderDetail.products'],
            });
         
          
            //w If order is not found, throw a exception
            if (!order) {
              throw new NotFoundException('Order not found');
            }

            //w destructures order
            const {user, ...customerOrder} = order;
          
            //w customizes returned object to exclude credentials
          return {
            customerOrder,
            user: {
              name:user.name,
              id:user.id,
              email: user.email,
              address: user.address,
              city: user.city,
              phone: user.phone
            }
          }
          }


        async addOrder(orderData: CreateOrderDto) {           
           try {
            //w destructures user id and products array
             const { user_id, products } = orderData;
         
             //W  fetches user
             const user = await this.userRepository.findOne({ where: { id: user_id } });
             if (!user) {
               throw new NotFoundException('User not found');
             }
         
             //w creates order (with the class, could also do it with .create())
             const order = new Order();
             order.user = user;
             order.date = new Date();
             order.total = 0;
             const newOrder = await this.orderRepository.save(order);
         
             //w fetches products and creates detail
             const orderDetail = new OrderDetail();
             orderDetail.order = order;
             orderDetail.products = [];
             
             for (const { id } of products) {
              //* fetches each product by id and stock > 0 
               const product = await this.productRepository.findOne({ where: { id, stock: MoreThan(0) } });

             
               if (!product) {
                 throw new NotFoundException(`Product with id ${id} not found or out of stock`);
               }
         
               product.stock -= 1;
               await this.productRepository.save(product);
         
               //w adds product price to order.total and orderdetail.price
               //? ts enforces the parseFloat argument to be a string, even if in vanilla Js you can pass both string or number
               //? You can also do this > parseFloat(String(product.price));
               //? Less recommended > product.price as unknown as number (if you are sure price is always a number but type assertion is a workaround, kind of cheat)
              const productPrice = parseFloat(product.price.toString());
              orderDetail.price += productPrice;
              orderDetail.products.push(product);
             }

             //w after end of for loop
             order.total = orderDetail.price;
        
             //w adds order to orderDetail relation and saves
            //w this order already has id from postgres
             orderDetail.order = order;
             await this.orderDetailRepository.save(orderDetail);
             
             //w adds orderDetail relation to order and save
             order.orderDetail = orderDetail;
             await this.orderRepository.save(order);

             return {
              message: 'order created succesfully',
              order_id: newOrder.id,
              price: newOrder.total
             }

             // Transform the order object to a plain object before returning
    // const plainOrder = plainToClass(Order, order, { excludeExtraneousValues: true });

    // return plainOrder;
           } catch (error) {
            if(error instanceof NotFoundException) {
              throw error
            } else {
              throw new HttpException('Error adding order', HttpStatus.INTERNAL_SERVER_ERROR)
            }
           }
          } 
    }