import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AccessTokenPayload } from '@interfaces/token-payloads';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3030, {
  cors: true,
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly jwtService: JwtService) {}
  @WebSocketServer() server: Server;

  handleDisconnect(client: Socket) {
    console.log('new user disconnected: ', client.id);
  }

  async handleConnection(client: Socket) {
    const token =
      (client.handshake.auth?.token as string) ??
      (client.handshake.headers.access_token as string); // this is because on postman is not possible to send auth token;
    console.log('ws client token:', token);

    if (!token) {
      Logger.log('WS Client tried to connect with invalid accessToken', token);
      client.disconnect();
      return;
    }

    const payload = this.jwtService.verify<AccessTokenPayload>(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
    console.log('ws token payload:', payload);

    await client.join(`user:${payload.sub}`);
  }

  emitToUser(
    userId: string,
    event: string,
    payload: {
      taskId: string;
      title: string;
      body?: string;
      createdAt: Date;
    },
  ) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  emitToAll(
    event: string,
    payload: { taskId: string; title: string; createdAt: Date },
  ) {
    this.server.emit(event, payload);
  }

  @SubscribeMessage('task.created')
  handleCreatedTaskNotification(client: Socket, message: any) {
    console.log(message);

    client.emit('reply', 'This is a reply');

    this.server.emit('reply', 'broadcasting');
  }
}
