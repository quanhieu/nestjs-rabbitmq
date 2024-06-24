import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
          'amqp://rabbitmq:rabbitmq@localhost:5672',
        ],
        queue: 'orders-queue',
        noAck: false,
        // prefetchCount: 1,
        // queueOptions: {
        //   durable: false,
        // },
      },
    },
  );
  app.listen();
}
bootstrap();
