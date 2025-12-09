import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL as string],
        queue: process.env.USERS_QUEUE as string,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  console.log([process.env.RABBITMQ_URL, process.env.USERS_QUEUE]);
  await app.listen();
}

Logger.log('User Service is running');

bootstrap();
