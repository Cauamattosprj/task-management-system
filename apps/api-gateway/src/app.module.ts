import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { AUTH_SERVICE } from './constants';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:3002'],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
