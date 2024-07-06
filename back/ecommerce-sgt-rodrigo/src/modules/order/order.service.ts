import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepo } from './orderDB.service';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepo:OrderRepo) {}

  
  async addOrder(createOrderDto:CreateOrderDto){
    try {
      const response = await this.orderRepo.addOrder(createOrderDto);
      return response
    } catch (error) {
      throw error
    }
  }

  async getOrderByID(id:string) {
    try {
      const response = await this.orderRepo.getOrderByID(id);
      return response
    } catch (error) {
      throw error
    }
   
   
  }

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }


  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
