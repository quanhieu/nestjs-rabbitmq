import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { OrderDto } from './order.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('order-placed')
  handleOrderPlaced(@Payload() order: OrderDto) {
    return this.appService.handleOrderPlaced(order);
  }

  @MessagePattern({ cmd: 'fetch-orders' })
  getOrders(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log(originalMsg);
    channel.ack(originalMsg);

    return this.appService.getOrders();
  }
}
