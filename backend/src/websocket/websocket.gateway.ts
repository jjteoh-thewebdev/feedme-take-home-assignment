import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// ws run at port 3001
@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitOrderUpdate(order) {
    this.server.emit('orderUpdated', order);
  }

  emitBotUpdate(bots) {
    this.server.emit('botUpdated', bots);
  }
}
