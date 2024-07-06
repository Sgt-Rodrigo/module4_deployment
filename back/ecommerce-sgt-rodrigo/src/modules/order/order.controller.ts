import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}


  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
 async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const response = await this.orderService.addOrder(createOrderDto);
      return response
    } catch (error) {
      throw error
    }
  }


  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  async findOrderByID(@Param('id', ParseUUIDPipe) orderId: string) {
    try {
      const response = await this.orderService.getOrderByID(orderId);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id', )
  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.remove(id);
  }
}
