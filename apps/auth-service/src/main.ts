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
        urls: [process.env.RABBITMQ_URL as string],
        queue: process.env.AUTH_QUEUE as string,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  console.log([process.env.RABBITMQ_URL, process.env.AUTH_QUEUE])
  await app.listen();
}

Logger.log('Auth Service is running');

bootstrap();
