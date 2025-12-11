import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL as string],
        queue: process.env.TASKS_QUEUE as string,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  console.log([process.env.RABBITMQ_URL, process.env.TASKS_QUEUE]);
  await app.listen();
}
bootstrap();
