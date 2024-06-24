import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
  constructor(@Inject('ORDERS_SERVICE') private rabbitClient: ClientProxy) {}

  async onModuleInit() {
    // setInterval(() => {
    //   this.rabbitClient.emit('order-placed', {
    //     email: 'aaa' + randomUUID() + '@gmail.com',
    //     productName: 'product ' + randomUUID(),
    //     quantity: 2 + Math.floor(Math.random() * 10),
    //   } as CreateOrderDto);
    // }, 1000);
  }

  placeOrder(order: CreateOrderDto) {
    this.rabbitClient.emit('order-placed', order);

    return { message: 'Order Placed!' };
  }

  getOrders() {
    return this.rabbitClient
      .send({ cmd: 'fetch-orders' }, {})
      .pipe(timeout(1000));
  }
}
