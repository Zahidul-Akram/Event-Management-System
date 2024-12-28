import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway()
@Injectable()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  private connectedClients = new Set<Socket>();

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    this.connectedClients.add(client);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.connectedClients.delete(client);
  }

  sendEventNotification(eventData: any) {
    this.server.emit('new_event', eventData);
  }
}
