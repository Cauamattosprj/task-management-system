import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationGateway } from '../notification.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [NotificationGateway],
})
export class NotificationModule {}
