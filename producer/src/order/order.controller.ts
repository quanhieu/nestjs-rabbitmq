import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('place-order')
  placeOrder(@Body() order: CreateOrderDto) {
    return this.ordersService.placeOrder(order);
  }

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }
}
