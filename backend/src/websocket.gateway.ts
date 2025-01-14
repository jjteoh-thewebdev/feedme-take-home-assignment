import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  emitOrderUpdate(order) {
    this.server.emit('orderUpdated', order);
  }

  emitBotUpdate(bots) {
    this.server.emit('botUpdated', bots);
  }
}
