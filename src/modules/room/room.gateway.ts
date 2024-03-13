import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Socket, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
// import { WsJwtGuard } from '../auth/strategy/socketio/websocket.Guard';
import { User } from 'src/common/decorators/user.decorator';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})
export class RoomGateway {
  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('connection', { id: client.id });
  }

  // @UseGuards(WsJwtGuard)
  @SubscribeMessage('enterLobby')
  enterLobby(@ConnectedSocket() client: Socket) {
    console.log('enterLobby: ', client.data.nickname);
    client.data.roomname = 'lobby';
    client.join('lobby');
  }

  @SubscribeMessage('sendMessage')
  sendMessage(@ConnectedSocket() client: Socket, @MessageBody() data): void {
    const { roomname, message } = data;
    console.log(roomname, message);
    client.to(roomname).emit('receiveMessage', { id: client.id, message });
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomname } = data;
    console.log('createRoom: ', roomname);
    client.data.roomId = roomname;
    client.join(roomname);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomname, message } = data;
    client.data.roomId = roomname;
    console.log('joinRoom: ', roomname, message);
    client.join(roomname);
    client.to(roomname).emit('joinRoom', { message });
  }

  @SubscribeMessage('playerWin')
  playerWin(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomname } = data;
    console.log('playerWin: ', roomname);
    client.to(roomname).emit('playerLose', { result: true });
  }
}
