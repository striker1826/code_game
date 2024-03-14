import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Socket, Server } from 'socket.io';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/strategy/socketio/websocket.Guard';
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

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('enterLobby')
  enterLobby(@ConnectedSocket() client: Socket) {
    client.data.roomname = 'lobby';
    client.join('lobby');
  }

  @SubscribeMessage('createRoom')
  async createRoom(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomname } = data;
    client.data.roomname = roomname;
    await this.roomService.createRoom(roomname, client);
    console.log(client.data);
    return;
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomname, roomId } = data;
    client.data.roomname = roomname;
    client.data.roomId = roomId;
    client.join(roomId);
    await this.roomService.joinRoom(roomId);
    console.log(client.data);
    client.to(roomId).emit('tsetJoinRoom', 'bbb');
  }

  @SubscribeMessage('playerWin')
  playerWin(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    console.log('send: ', roomId);
    client.to(roomId).emit('playerLose', 'aaa');
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    await this.roomService.deleteRoom(roomId);
    client.leave(client.data.roomname);
  }
}

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('/list')
  async getRoomList() {
    const roomList = await this.roomService.getRoomList();
    return roomList;
  }
}
