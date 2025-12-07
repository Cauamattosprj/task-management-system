import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:3002'],
        queue: 'auth_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  await app.listen();
}

Logger.log('Auth Service is running');

bootstrap();
