import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { AUTH_SERVICE, TASKS_SERVICE, USERS_SERVICE } from '@constants';
import { UserController } from './user/user.controller';
import { ConfigModule } from '@nestjs/config';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: process.env.AUTH_QUEUE as string,
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: USERS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: process.env.USERS_QUEUE as string,
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: TASKS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: process.env.TASKS_QUEUE as string,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController, AuthController, UserController, TasksController],
  providers: [AppService, TasksService],
})
export class AppModule {}
