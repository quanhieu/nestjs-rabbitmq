import { Injectable, OnModuleInit } from '@nestjs/common';
import RabbitMQ from 'utils/rabbitmq';
import { OrderService } from './order/order.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private orderService: OrderService) {}

  async onModuleInit() {
    const connection = `amqp://rabbitmq:rabbitmq@localhost:5672`;
    const queue = 'orders-queue';
    const connectRabbitMQ = await RabbitMQ.init(connection);
    try {
      await RabbitMQ.assertQueue(queue, null);
      // await RabbitMQ.prefetch(1);
      await RabbitMQ.consume(
        queue,
        async (msg) => {
          console.log(
            '\n-----------------------msg--------------------',
            JSON.stringify(msg).toString(),
          );
          if (msg?.content) {
            try {
              const parseData = JSON.parse(msg.content);
              if (parseData?.pattern === 'order-placed') {
                RabbitMQ.sendBackAck(msg);

                await this.orderService.handleOrderPlacedEvent(parseData?.data);
              }
              console.log(
                '\n-----------------------parseData--------------------',
                parseData,
              );

              if (
                parseData?.pattern &&
                parseData?.pattern?.cmd === 'fetch-orders'
              ) {
                const data = this.orderService.getOrders();
                RabbitMQ.sendBackAck(msg);
                return data;
              }
            } catch (error) {
              throw new Error(
                `[Consumer Service] handle receive error: ${error}`,
              );
            }
          }
        },
        false,
      );

      // connectRabbitMQ.on('error', async () => {
      //   console.log('Connection error');
      //   setTimeout(await RabbitMQ.reconnect(connection), 5000);
      // });
      // connectRabbitMQ.on('close', async () => {
      //   console.log('Connection closed');
      //   setTimeout(await RabbitMQ.reconnect(connection), 5000);
      // });
    } catch (error) {
      console.error('-----------------------Error--------------------', error);
      connectRabbitMQ.on('error', async () => {
        console.log('Connection error');
        setTimeout(await RabbitMQ.reconnect(connection), 5000);
      });

      throw error;
    }
  }
  catch(error) {
    console.error('-----------------------Error--------------------', error);
    throw error;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
