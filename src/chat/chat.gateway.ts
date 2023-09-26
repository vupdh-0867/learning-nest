import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({cors: {
  origin: '*',
},})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, message: string): void {
    this.server.emit('message', message); // Broadcast the message to all connected clients
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('asdasd');

  }
}
